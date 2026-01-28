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
  MockNotificationService,
} from '../mock';

/**
 * Fetch-based API client with error handling
 */
class FetchAPIClient {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = 60000;
    this.maxRetries = 3;
    this.retryDelayBase = 1000; // in ms
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
  /**
   * Social Login (Google/Apple)
   * POST /api/auth/socialLogin
   */
  socialLogin: async loginData => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   console.log('🎭 Using MOCK social login');
    //   return MockAuthService.socialLogin(loginData);
    // }

    // Build request body according to API spec
    const deviceType = Platform.OS.toUpperCase(); // 'ANDROID' or 'IOS'

    const requestBody = {
      email: loginData.email,
      fcmToken: loginData.fcmToken || 'sample-fcm-token',
      deviceType: deviceType,
    };

    // Add fields based on device type
    if (deviceType === 'ANDROID') {
      // Android requires firstName, lastName
      requestBody.firstName = loginData.firstName || '';
      requestBody.lastName = loginData.lastName || '';
      requestBody.fullName =
        loginData.fullName ||
        `${loginData.firstName || ''} ${loginData.lastName || ''}`.trim();
      requestBody.phoneNumber = loginData.phoneNumber || '';
    } else {
      // iOS/WEB - firstName, lastName, fullName auto-set by backend
      // Only send optional phoneNumber if available
      if (loginData.phoneNumber) {
        requestBody.phoneNumber = loginData.phoneNumber;
      }
    }

    console.log('🔐 Social Login Request:', {
      endpoint: ENDPOINTS.auth.socialLogin,
      body: requestBody,
    });

    try {
      const response = await request(
        HTTP_METHODS.POST,
        ENDPOINTS.auth.socialLogin,
        requestBody,
      );

      // Backend returns: { success: true, message: "Success", data: {...} }
      return response;
    } catch (error) {
      logError(error, {
        service: 'AuthService',
        method: 'socialLogin',
        email: loginData.email,
      });
      throw error;
    }
  },

  /**
   * ✅ UPDATED: Logout with FCM token removal
   * POST /logout
   */
  logout: async fcmToken => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockAuthService.logout();
    // }

    if (!fcmToken) {
      console.warn('⚠️ No FCM token provided for logout');
      // Still allow logout even without token
      return {success: true, message: 'Logged out successfully'};
    }

    try {
      console.log('🚪 Logging out with FCM token:', fcmToken);

      const response = await request(HTTP_METHODS.POST, ENDPOINTS.auth.logout, {
        fcmToken,
      });

      return response;
    } catch (error) {
      // Don't block logout if API fails
      console.error('⚠️ Logout API failed (continuing anyway):', error);
      logError(error, {
        service: 'AuthService',
        method: 'logout',
      });

      // Return success anyway - local logout still works
      return {success: true, message: 'Logged out locally'};
    }
  },
};

// ═══════════════════════════════════════════════════════════════
// VEHICLES SERVICE
// ═══════════════════════════════════════════════════════════════

export const VehiclesService = {
  /**
   * Get User Vehicle Information
   * GET /api/user/userInfo
   */
  list: async () => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockVehiclesService.list();
    // }

    try {
      return await request(HTTP_METHODS.GET, ENDPOINTS.vehicles.list);
    } catch (error) {
      logError(error, {
        service: 'VehiclesService',
        method: 'list',
      });
      throw error;
    }
  },

  /**
   * Add or Update Vehicle Information (With Referral)
   * POST /api/user/userInfo
   */
  create: async vehicleData => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockVehiclesService.create(vehicleData);
    // }

    // Map to API format
    const requestBody = {
      wheelType: vehicleData.vehicleType || vehicleData.wheelType,
      vehicleRegistration:
        vehicleData.plateNumber || vehicleData.vehicleRegistration,
      emergencyContact: vehicleData.emergencyContact,
      referralCode: vehicleData.referralCode,
    };

    try {
      return await request(
        HTTP_METHODS.POST,
        ENDPOINTS.vehicles.create,
        requestBody,
      );
    } catch (error) {
      logError(error, {
        service: 'VehiclesService',
        method: 'create',
        data: requestBody,
      });
      throw error;
    }
  },

  /**
   * Get Vehicle Details by ID
   * GET /api/user/vehicleById?vehicleId=<vehicle_id>
   */
  details: async vehicleId => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockVehiclesService.details(vehicleId);
    // }

    try {
      return await request(
        HTTP_METHODS.GET,
        ENDPOINTS.vehicles.details(vehicleId),
      );
    } catch (error) {
      logError(error, {
        service: 'VehiclesService',
        method: 'details',
        vehicleId,
      });
      throw error;
    }
  },

  /**
   * Delete Vehicle
   * DELETE /api/user/delete-vehicle?id=<vehicle_id>
   */
  delete: async vehicleId => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockVehiclesService.delete(vehicleId);
    // }

    try {
      return await request(
        HTTP_METHODS.DELETE,
        ENDPOINTS.vehicles.delete(vehicleId),
      );
    } catch (error) {
      logError(error, {
        service: 'VehiclesService',
        method: 'delete',
        vehicleId,
      });
      throw error;
    }
  },
};

// ═══════════════════════════════════════════════════════════════
// SEARCH SERVICE
// ═══════════════════════════════════════════════════════════════

export const SearchService = {
  /**
   * Search Vehicle by Registration
   * POST /api/user/search-vehicle
   */
  searchVehicle: async plateNumber => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockSearchService.searchVehicle(plateNumber);
    // }

    try {
      const response = await request(
        HTTP_METHODS.POST,
        ENDPOINTS.search.vehicle,
        {vehicleRegistration: plateNumber},
      );

      return response;
    } catch (error) {
      // ✅ Don't log error for "not found" - it's expected
      if (error.message === 'Vehicle not found') {
        console.log('ℹ️ Vehicle not found (expected):', plateNumber);
        return {
          success: false,
          data: {found: false},
          message: 'Vehicle not found',
        };
      }

      // ✅ Log only real errors
      logError(error, {
        service: 'SearchService',
        method: 'searchVehicle',
        plateNumber,
      });
      throw error;
    }
  },

  /**
   * Get Search History
   * NOTE: This endpoint doesn't exist yet in the API
   * Keeping for future implementation
   */
  getHistory: async (limit = 20) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockSearchService.getHistory('user_001', limit);
    }

    // TODO: Implement when API endpoint is available
    // For now, return empty history
    return {
      success: true,
      message: 'Success',
      data: [],
    };
  },
};

// ... (Keep all other services as they were)

// ═══════════════════════════════════════════════════════════════
// USER SERVICE
// ═══════════════════════════════════════════════════════════════

export const UserService = {
  /**
   * Get User Home Dashboard
   * GET /api/user/home
   */
  getHome: async () => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockUserService.getHome();
    // }

    try {
      return await request(HTTP_METHODS.GET, ENDPOINTS.user.home);
    } catch (error) {
      logError(error, {
        service: 'UserService',
        method: 'getHome',
      });
      throw error;
    }
  },

  /**
   * Get User Activity History
   * GET /api/user/activity?type=<type>&page=<page>&limit=<limit>
   */
  getActivities: async (filters = {}) => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockUserService.getActivities(filters);
    // }

    const queryParams = {
      type: filters.type || 'ALL',
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    try {
      return await request(
        HTTP_METHODS.GET,
        ENDPOINTS.user.activities,
        queryParams,
      );
    } catch (error) {
      logError(error, {
        service: 'UserService',
        method: 'getActivities',
        filters,
      });
      throw error;
    }
  },

  /**
   * Get User Settings
   * GET /api/user/settings
   */
  getSettings: async () => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockUserService.getSettings();
    // }

    try {
      return await request(HTTP_METHODS.GET, ENDPOINTS.user.settings);
    } catch (error) {
      logError(error, {
        service: 'UserService',
        method: 'getSettings',
      });
      throw error;
    }
  },

  /**
   * Update User Settings
   * POST /api/user/settings
   */
  updateSettings: async settings => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockUserService.updateSettings(settings);
    // }

    try {
      return await request(
        HTTP_METHODS.POST,
        ENDPOINTS.user.settings,
        settings,
      );
    } catch (error) {
      logError(error, {
        service: 'UserService',
        method: 'updateSettings',
        settings,
      });
      throw error;
    }
  },
};

export const ReferralService = {
  /**
   * Validate referral code
   * POST /api/referral/validate
   */
  validate: async code => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockReferralService.validate(code);
    }

    try {
      return await request(HTTP_METHODS.POST, ENDPOINTS.referral.validate, {
        code,
      });
    } catch (error) {
      logError(error, {
        service: 'ReferralService',
        method: 'validate',
        code,
      });
      throw error;
    }
  },

  /**
   * Apply referral code
   * POST /api/referral/apply
   */
  apply: async code => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // ✅ Mock service handles userId internally
      return MockReferralService.apply(code);
    }

    try {
      // ✅ No userId needed - comes from Bearer token
      return await request(HTTP_METHODS.POST, ENDPOINTS.referral.apply, {code});
    } catch (error) {
      logError(error, {
        service: 'ReferralService',
        method: 'apply',
        code,
      });
      throw error;
    }
  },

  /**
   * Get referral stats
   * GET /api/referral/stats
   */
  getStats: async () => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // ✅ Mock service handles userId internally
      return MockReferralService.getStats();
    }

    try {
      // ✅ No userId needed - comes from Bearer token
      return await request(HTTP_METHODS.GET, ENDPOINTS.referral.stats);
    } catch (error) {
      logError(error, {
        service: 'ReferralService',
        method: 'getStats',
      });
      throw error;
    }
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
  get: async () => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockBalanceService.get();
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.balance.get);
  },

  history: async (limit = 20) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockBalanceService.history(limit);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.balance.history, {limit});
  },

  deduct: async (amount, reason) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockBalanceService.deduct(amount, reason);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.balance.deduct, {
      amount,
      reason,
    });
  },

  add: async (amount, reason) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockBalanceService.add(amount, reason);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.balance.add, {amount, reason});
  },
};

export const ContactService = {
  /**
   * Fetch Zego token
   * GET /initiate-call
   */
  fetchToken: async () => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   await new Promise(resolve => setTimeout(resolve, 600));
    //   return {
    //     success: true,
    //     data: {
    //       nonce: 'mock_nonce_' + Date.now(),
    //       timestamp: Math.floor(Date.now() / 1000),
    //       token: 'mock_zego_token_' + Date.now(),
    //     },
    //     message: 'Success',
    //   };
    // }
    return request(HTTP_METHODS.GET, ENDPOINTS.contacts.initiateCall);
  },

  /**
   * ✅ Initiate call - Create call session and get callId
   * GET /update-call-status?receiverId=<receiver_id>&status=INITIATED
   * @param {string} receiverId - User ID of the person being called
   * @returns {Promise} { success: true, data: { callId: "uuid" } }
   */
  initiateCall: async receiverId => {
    return request(
      HTTP_METHODS.PATCH,
      `${ENDPOINTS.contacts.initiateCall}?receiverId=${receiverId}&status=INITIATED`,
    );
  },

  /**
   * ✅ Update call status
   * GET /update-call-status?callId=<call_id>&status=<status>
   * @param {string} callId - UUID from initiateCall response
   * @param {string} status - One of: "ANSWERED", "ENDED", "FAILED"
   * @returns {Promise} { success: true, data: {} }
   */
  updateCallStatus: async (callId, status) => {
    return request(
      HTTP_METHODS.PATCH,
      `${ENDPOINTS.contacts.initiateCall}?callId=${callId}&status=${status}`,
    );
  },

  initiateAlert: async data => {
    return request(HTTP_METHODS.POST, ENDPOINTS.contacts.initiateAlert, data);
  },
};

export const NotificationService = {
  /**
   * Get all notifications (paginated)
   * GET /notifications?page=1&limit=20
   */
  getAll: async (page = 1, limit = 20) => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockNotificationService.getAll(page, limit);
    // }

    try {
      const response = await request(
        HTTP_METHODS.GET,
        `${ENDPOINTS.notifications.list}?page=${page}&limit=${limit}`,
      );
      return response;
    } catch (error) {
      logError(error, {
        service: 'NotificationService',
        method: 'getAll',
        page,
        limit,
      });
      throw error;
    }
  },

  /**
   * Mark notification as read (and acknowledge if alert)
   * POST /notifications
   */
  markAsRead: async notificationId => {
    // if (FEATURE_FLAGS.USE_MOCK_DATA) {
    //   return MockNotificationService.markAsRead(notificationId);
    // }

    try {
      const response = await request(
        HTTP_METHODS.POST,
        ENDPOINTS.notifications.markRead,
        {notificationId},
      );
      return response;
    } catch (error) {
      logError(error, {
        service: 'NotificationService',
        method: 'markAsRead',
        notificationId,
      });
      throw error;
    }
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
};
