/**
 * API Service Layer
 * Using native fetch for better Android compatibility with centralized error handling
 */

import {Platform} from 'react-native';
import {BASE_URL, ENDPOINTS, HTTP_METHODS} from '../../config/api.config';
import {FEATURE_FLAGS} from '../../config/constants';
import {
  APIError,
  ERROR_TYPES,
  handleAPIError,
  logError,
  isRecoverableError,
  getRetryDelay,
} from '../../utils/error.handler';
import SecureStorage from '../storage/SecureStorage';

// Import mock services
import {
  MockAuthService,
  MockVehiclesService,
  MockSearchService,
  MockUserService,
  MockReferralService,
  MockActivityService,
  MockOwnershipService,
  MockBalanceService,
} from '../mock';

/**
 * Fetch-based API client with error handling
 */
class FetchAPIClient {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = 30000;
    this.maxRetries = 3;
  }

  /**
   * Make HTTP request using native fetch with retry logic
   */
  async request(method, endpoint, data = null, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;

    console.log('🚀 API Request:', {
      method,
      url: endpoint,
      baseURL: this.baseURL,
      fullURL: url,
      platform: Platform.OS,
      data,
      attempt: retryCount + 1,
    });

    try {
      // Get auth token
      const token = await SecureStorage.getAuthToken();

      // Build headers
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Build request config
      const requestConfig = {
        method,
        headers,
      };

      // Add body for POST/PUT/PATCH
      if (data && method !== 'GET' && method !== 'HEAD') {
        requestConfig.body = JSON.stringify(data);
      }

      // Add query params for GET
      if (data && method === 'GET') {
        const queryString = new URLSearchParams(data).toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;
        return await this._makeRequest(
          finalUrl,
          requestConfig,
          method,
          endpoint,
          data,
          options,
          retryCount,
        );
      }

      return await this._makeRequest(
        url,
        requestConfig,
        method,
        endpoint,
        data,
        options,
        retryCount,
      );
    } catch (error) {
      // Log error
      logError(error, {
        url: endpoint,
        method,
        platform: Platform.OS,
        retryCount,
      });

      // Check if error is recoverable and we haven't exceeded max retries
      if (error instanceof APIError) {
        const errorType = this._getErrorTypeFromStatus(error.statusCode);

        if (isRecoverableError(errorType) && retryCount < this.maxRetries) {
          const delay = getRetryDelay(retryCount);
          console.log(
            `⏳ Retrying in ${delay}ms... (Attempt ${retryCount + 2}/${
              this.maxRetries + 1
            })`,
          );

          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request(method, endpoint, data, options, retryCount + 1);
        }

        throw error;
      }

      // Convert unknown errors to APIError
      throw new APIError(
        'Network connection failed. Please check your internet and try again.',
        0,
        {originalError: error.message},
      );
    }
  }

  /**
   * Internal method to make request with timeout
   */
  async _makeRequest(url, config, method, endpoint, data, options, retryCount) {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const responseText = await response.text();
      let responseData;

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        responseData = {message: responseText};
      }

      console.log('✅ API Response:', {
        status: response.status,
        ok: response.ok,
        url,
        data: responseData,
      });

      // Handle non-2xx responses
      if (!response.ok) {
        // Handle 401 separately for token refresh
        if (response.status === 401) {
          return await this._handleTokenRefresh(url, config, responseData);
        }

        // Create structured error object similar to axios
        const error = {
          response: {
            status: response.status,
            data: responseData,
          },
          message:
            responseData?.message ||
            responseData?.error ||
            `HTTP ${response.status}`,
        };

        // Use centralized error handler
        const errorInfo = handleAPIError(error);

        throw new APIError(
          errorInfo.message,
          errorInfo.statusCode,
          errorInfo.data,
        );
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        // Timeout error
        const timeoutError = {
          response: {
            status: 408,
            data: {message: 'Request timeout'},
          },
          message: 'Request timeout',
        };

        const errorInfo = handleAPIError(timeoutError);
        throw new APIError(errorInfo.message, 408);
      }

      // If it's already an APIError, just throw it
      if (error instanceof APIError) {
        throw error;
      }

      // Network error - create error object for handler
      const networkError = {
        message: error.message || 'Network Error',
      };

      const errorInfo = handleAPIError(networkError);
      throw new APIError(errorInfo.message, 0, {originalError: error.message});
    }
  }

  /**
   * Handle token refresh and retry
   */
  async _handleTokenRefresh(originalUrl, originalConfig, responseData) {
    const refreshToken = await SecureStorage.getRefreshToken();

    if (!refreshToken) {
      throw new APIError('Session expired. Please login again.', 401);
    }

    try {
      console.log('🔄 Attempting token refresh...');

      const refreshResponse = await fetch(
        `${this.baseURL}${ENDPOINTS.auth.refreshToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({refresh: refreshToken}),
        },
      );

      if (!refreshResponse.ok) {
        await SecureStorage.clearAuth();
        throw new APIError('Session expired. Please login again.', 401);
      }

      const refreshData = await refreshResponse.json();

      // Save new tokens
      await SecureStorage.saveTokens(
        refreshData.access || refreshData.token,
        refreshData.refresh || refreshData.refreshToken,
      );

      // Retry original request with new token
      originalConfig.headers['Authorization'] = `Bearer ${
        refreshData.access || refreshData.token
      }`;

      const retryResponse = await fetch(originalUrl, originalConfig);
      const retryText = await retryResponse.text();
      const retryData = retryText ? JSON.parse(retryText) : {};

      if (!retryResponse.ok) {
        const error = {
          response: {
            status: retryResponse.status,
            data: retryData,
          },
          message: retryData?.message || `HTTP ${retryResponse.status}`,
        };

        const errorInfo = handleAPIError(error);
        throw new APIError(
          errorInfo.message,
          errorInfo.statusCode,
          errorInfo.data,
        );
      }

      return retryData;
    } catch (refreshError) {
      await SecureStorage.clearAuth();

      if (refreshError instanceof APIError) {
        throw refreshError;
      }

      throw new APIError('Session expired. Please login again.', 401);
    }
  }

  /**
   * Get error type from status code
   */
  _getErrorTypeFromStatus(statusCode) {
    if (!statusCode) return ERROR_TYPES.NETWORK;
    if (statusCode === 401) return ERROR_TYPES.UNAUTHORIZED;
    if (statusCode === 403) return ERROR_TYPES.FORBIDDEN;
    if (statusCode === 404) return ERROR_TYPES.NOT_FOUND;
    if (statusCode === 408 || statusCode === 504) return ERROR_TYPES.TIMEOUT;
    if (statusCode >= 400 && statusCode < 500) return ERROR_TYPES.VALIDATION;
    if (statusCode >= 500) return ERROR_TYPES.SERVER;
    return ERROR_TYPES.UNKNOWN;
  }
}

// Create singleton instance
const apiClient = new FetchAPIClient();

/**
 * Generic API request handler
 */
const request = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await apiClient.request(method, endpoint, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═══════════════════════════════════════════════════════════════

export const AuthService = {
  socialLogin: async loginData => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      console.log('🎭 Using MOCK social login');
      return MockAuthService.socialLogin(loginData);
    }

    const requestBody = {
      firstName: loginData.firstName || '',
      lastName: loginData.lastName || '',
      fullName:
        loginData.fullName || `${loginData.firstName} ${loginData.lastName}`,
      phoneNumber: loginData.phoneNumber || '',
      deviceType: Platform.OS.toUpperCase(),
      email: loginData.email,
      password: loginData.password || '',
      fcmToken: loginData.fcmToken || 'Sample-FCM',
    };

    console.log('🔐 Social Login Request:', {
      endpoint: ENDPOINTS.auth.socialLogin,
      body: requestBody,
    });

    try {
      return await request(
        HTTP_METHODS.POST,
        ENDPOINTS.auth.socialLogin,
        requestBody,
      );
    } catch (error) {
      // Log to analytics/crashlytics
      logError(error, {
        service: 'AuthService',
        method: 'socialLogin',
        email: loginData.email,
      });
      throw error;
    }
  },

  refreshToken: async refreshToken => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockAuthService.refreshToken(refreshToken);
    }

    console.log('🔄 Refresh Token Request:', {
      endpoint: ENDPOINTS.auth.refreshToken,
    });

    try {
      return await request(HTTP_METHODS.POST, ENDPOINTS.auth.refreshToken, {
        refresh: refreshToken,
      });
    } catch (error) {
      logError(error, {
        service: 'AuthService',
        method: 'refreshToken',
      });
      throw error;
    }
  },

  logout: async () => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockAuthService.logout();
    }

    try {
      return await request(HTTP_METHODS.POST, ENDPOINTS.auth.logout);
    } catch (error) {
      logError(error, {
        service: 'AuthService',
        method: 'logout',
      });
      throw error;
    }
  },

  verifyPhone: async (phoneNumber, otp) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockAuthService.verifyPhone(phoneNumber, otp);
    }

    try {
      return await request(HTTP_METHODS.POST, ENDPOINTS.auth.verifyPhone, {
        phoneNumber,
        otp,
      });
    } catch (error) {
      logError(error, {
        service: 'AuthService',
        method: 'verifyPhone',
        phoneNumber,
      });
      throw error;
    }
  },
};

// ═══════════════════════════════════════════════════════════════
// VEHICLES SERVICE
// ═══════════════════════════════════════════════════════════════

export const VehiclesService = {
  list: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockVehiclesService.list(userId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.vehicles.list);
  },

  create: async (userId, vehicleData) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockVehiclesService.create(userId, vehicleData);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.vehicles.create, vehicleData);
  },

  details: async vehicleId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockVehiclesService.details(vehicleId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.vehicles.details(vehicleId));
  },

  update: async (vehicleId, updates) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockVehiclesService.update(vehicleId, updates);
    }
    return request(
      HTTP_METHODS.PUT,
      ENDPOINTS.vehicles.update(vehicleId),
      updates,
    );
  },

  delete: async vehicleId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockVehiclesService.delete(vehicleId);
    }
    return request(HTTP_METHODS.DELETE, ENDPOINTS.vehicles.delete(vehicleId));
  },

  checkPlate: async plateNumber => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockVehiclesService.checkPlate(plateNumber);
    }
    return request(
      HTTP_METHODS.GET,
      ENDPOINTS.vehicles.checkPlate(plateNumber),
    );
  },
};

// ═══════════════════════════════════════════════════════════════
// SEARCH SERVICE
// ═══════════════════════════════════════════════════════════════

export const SearchService = {
  searchVehicle: async plateNumber => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockSearchService.searchVehicle(plateNumber);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.search.search, {plateNumber});
  },

  getHistory: async (limit = 20) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockSearchService.getHistory('user_001', limit);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.search.history, {limit});
  },

  logContact: async contactData => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockSearchService.logContact(contactData);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.contact.log, contactData);
  },
};

// ... (Keep all other services as they were)

export const UserService = {
  getProfile: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockUserService.getProfile(userId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.user.profile);
  },

  updateProfile: async (userId, updates) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockUserService.updateProfile(userId, updates);
    }
    return request(HTTP_METHODS.PUT, ENDPOINTS.user.update, updates);
  },

  updatePreferences: async (userId, preferences) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockUserService.updatePreferences(userId, preferences);
    }
    return request(HTTP_METHODS.PUT, ENDPOINTS.user.preferences, preferences);
  },

  deleteAccount: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockUserService.deleteAccount(userId);
    }
    return request(HTTP_METHODS.DELETE, ENDPOINTS.user.delete);
  },
};

export const ReferralService = {
  validate: async code => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockReferralService.validate(code);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.referral.validate, {code});
  },

  apply: async (userId, code) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockReferralService.apply(userId, code);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.referral.apply, {code});
  },

  getStats: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockReferralService.getStats(userId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.referral.stats);
  },

  generateCode: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockReferralService.generateCode(userId);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.referral.generate);
  },
};

export const ActivityService = {
  list: async (userId, limit = 20) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockActivityService.list(userId, limit);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.activity.list, {limit});
  },

  stats: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockActivityService.stats(userId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.activity.stats);
  },
};

export const OwnershipService = {
  create: async claimData => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockOwnershipService.create(claimData);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.ownership.create, claimData);
  },

  getStatus: async claimId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockOwnershipService.getStatus(claimId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.ownership.status(claimId));
  },

  getUserClaims: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return {
        success: true,
        data: [
          {
            _id: 'claim_001',
            userId,
            plateNumber: 'MH01AB1234',
            vehicleType: '2-wheeler',
            status: 'pending',
            createdAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            estimatedReviewTime: '24 hours',
          },
        ],
        message: 'Claims retrieved',
      };
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.ownership.userClaims(userId));
  },

  cancel: async claimId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return {success: true, message: 'Claim cancelled successfully'};
    }
    return request(HTTP_METHODS.DELETE, ENDPOINTS.ownership.cancel(claimId));
  },
};

export const BalanceService = {
  get: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockBalanceService.get(userId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.balance.get);
  },

  history: async (userId, limit = 20) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockBalanceService.history(userId, limit);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.balance.history, {limit});
  },

  deduct: async (userId, amount, reason) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {newBalance: 14, deducted: amount, reason},
        message: 'Balance deducted successfully',
      };
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.balance.deduct, {
      amount,
      reason,
    });
  },

  add: async (userId, amount, reason) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {newBalance: 25, added: amount, reason},
        message: 'Balance added successfully',
      };
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.balance.add, {amount, reason});
  },
};

export const ContactService = {
  create: async contactData => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        success: true,
        data: {
          _id: `contact_${Date.now()}`,
          ...contactData,
          createdAt: new Date().toISOString(),
        },
        message: 'Contact logged successfully',
      };
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.contacts.create, contactData);
  },

  getUserContacts: async userId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: [
          {
            _id: 'contact_001',
            userId,
            vehicleId: 'vehicle_001',
            plateNumber: 'MH01AB1234',
            contactType: 'phone',
            contactedAt: new Date(
              Date.now() - 2 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ],
        message: 'Contact history retrieved',
      };
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.contacts.userHistory(userId));
  },

  getVehicleContacts: async vehicleId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: [
          {
            _id: 'contact_v001',
            vehicleId,
            contactedBy: 'user_002',
            contactType: 'phone',
            contactedAt: new Date(
              Date.now() - 3 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ],
        message: 'Vehicle contact history retrieved',
      };
    }
    return request(
      HTTP_METHODS.GET,
      ENDPOINTS.contacts.vehicleHistory(vehicleId),
    );
  },

  revealContact: async (vehicleId, plateNumber) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        data: {
          vehicleId,
          plateNumber,
          contactPhone: '+919876543210',
          owner: {
            name: 'Riyaansh Mittal',
            photo: 'https://i.pravatar.cc/150?img=1',
          },
        },
        message: 'Contact details revealed',
      };
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.contacts.reveal, {
      vehicleId,
      plateNumber,
    });
  },
};

// ═══════════════════════════════════════════════════════════════
// EXPORT ALL SERVICES
// ═══════════════════════════════════════════════════════════════

export default {
  AuthService,
  VehiclesService,
  SearchService,
  UserService,
  ReferralService,
  ActivityService,
  OwnershipService,
  ContactService,
  BalanceService,
};
