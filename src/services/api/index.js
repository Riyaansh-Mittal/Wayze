/**
 * API Service Layer
 * Handles all API calls with mock/real switching
 */

import axios from 'axios';
import {
  BASE_URL,
  ENDPOINTS,
  HTTP_METHODS,
  DEFAULT_HEADERS,
} from '../../config/api.config';
import {FEATURE_FLAGS} from '../../config/constants';
import {handleAPIError, APIError} from '../../utils/error.handler';
import SecureStorage from '../storage/SecureStorage';
import { Platform } from 'react-native';

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
 * Create axios instance with React Native specific config
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    ...DEFAULT_HEADERS,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // ✅ FIX: Remove custom transformRequest (axios handles this)
  validateStatus: (status) => {
    return status >= 200 && status < 500; // Don't throw on 4xx/5xx
  },
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  async config => {
    // ✅ FIX: Ensure full URL is logged
    const fullURL = `${config.baseURL}${config.url}`;
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: fullURL,
      platform: Platform.OS,
      headers: config.headers,
      data: config.data,
    });

    const token = await SecureStorage.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ FIX: Set headers correctly for React Native
    if (config.data && typeof config.data === 'object') {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  error => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
  response => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });

    return response.data; // Return data directly
  },
  async error => {
    console.error('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      responseData: error.response?.data,
      // ✅ IMPORTANT: Network error diagnostics
      isNetworkError: error.message === 'Network Error',
      hasRequest: !!error.request,
      hasResponse: !!error.response,
      platform: Platform.OS,
    });

    // ✅ FIX: Handle network errors specifically
    if (error.message === 'Network Error' && !error.response) {
      throw new APIError(
        'Network connection failed. Please check your internet connection and try again.',
        0,
        { originalError: error.message }
      );
    }

    // Handle token expiration
    if (error.response?.status === 401) {
      const refreshToken = await SecureStorage.getRefreshToken();
      if (refreshToken) {
        try {
          // ✅ FIX: Use proper endpoint
          const response = await apiClient.post(ENDPOINTS.REFRESH_TOKEN, {
            refresh: refreshToken
          });
          
          await SecureStorage.saveTokens(
            response.data.access || response.data.token,
            response.data.refresh || response.data.refreshToken,
          );
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.data.access || response.data.token}`;
          return apiClient.request(error.config);
        } catch (refreshError) {
          await SecureStorage.clearAuth();
          throw new APIError('Session expired. Please login again.', 401);
        }
      }
    }

    const errorInfo = handleAPIError(error);
    throw new APIError(errorInfo.message, errorInfo.statusCode, errorInfo.data);
  },
);

/**
 * Generic API request handler
 */
const request = async (method, endpoint, data = null, config = {}) => {
  try {
    const requestConfig = {
      method,
      url: endpoint,
      ...config,
    };

    if (data) {
      if (method === HTTP_METHODS.GET) {
        requestConfig.params = data;
      } else {
        requestConfig.data = data;
      }
    }

    const response = await apiClient.request(requestConfig);
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

    // Map to backend expected format
    const requestBody = {
      firstName: loginData.firstName || '',
      lastName: loginData.lastName || '',
      fullName: loginData.fullName || `${loginData.firstName} ${loginData.lastName}`,
      phoneNumber: loginData.phoneNumber || '',
      deviceType: Platform.OS.toUpperCase(), // 'IOS' or 'ANDROID'
      email: loginData.email,
      password: loginData.password || '', // Empty for social login
      fcmToken: loginData.fcmToken || 'Sample-FCM',
    };

    console.log('🔐 Social Login Request:', {
      endpoint: ENDPOINTS.auth.socialLogin,
      fullURL: `${BASE_URL}${ENDPOINTS.auth.socialLogin}`,
      body: requestBody,
    });

    return request(HTTP_METHODS.POST, ENDPOINTS.auth.socialLogin, requestBody);
  },

  refreshToken: async refreshToken => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockAuthService.refreshToken(refreshToken);
    }

    console.log('🔄 Refresh Token Request:', {
      endpoint: ENDPOINTS.auth.refreshToken,
      fullURL: `${BASE_URL}${ENDPOINTS.auth.refreshToken}`,
    });

    return request(HTTP_METHODS.POST, ENDPOINTS.auth.refreshToken, {
      refresh: refreshToken, // ✅ CHANGED: Backend expects 'refresh', not 'refreshToken'
    });
  },

  logout: async () => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockAuthService.logout();
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.auth.logout);
  },

  verifyPhone: async (phoneNumber, otp) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockAuthService.verifyPhone(phoneNumber, otp);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.auth.verifyPhone, {
      phoneNumber,
      otp,
    });
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
  /**
   * Search for vehicle by plate number
   */
  searchVehicle: async plateNumber => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // ✅ Use the proper mock service
      return MockSearchService.searchVehicle(plateNumber);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.search.search, {plateNumber});
  },

  /**
   * Get search history
   */
  getHistory: async (limit = 20) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // Get current user ID from storage or use mock user
      return MockSearchService.getHistory('user_001', limit);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.search.history, {limit});
  },

  /**
   * Log contact action
   */
  logContact: async contactData => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockSearchService.logContact(contactData);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.contact.log, contactData);
  },
};

// ═══════════════════════════════════════════════════════════════
// USER SERVICE
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// REFERRAL SERVICE
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// ACTIVITY SERVICE
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// OWNERSHIP SERVICE
// ═══════════════════════════════════════════════════════════════

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
      // Mock user claims
      return {
        success: true,
        data: [
          {
            _id: 'claim_001',
            userId,
            plateNumber: 'MH01AB1234',
            vehicleType: '2-wheeler',
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
      return {
        success: true,
        message: 'Claim cancelled successfully',
      };
    }
    return request(HTTP_METHODS.DELETE, ENDPOINTS.ownership.cancel(claimId));
  },
};

// ═══════════════════════════════════════════════════════════════
// BALANCE SERVICE
// ═══════════════════════════════════════════════════════════════

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
      // Mock deduct balance
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          newBalance: 14, // Mock new balance
          deducted: amount,
          reason,
        },
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
      // Mock add balance
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          newBalance: 25, // Mock new balance
          added: amount,
          reason,
        },
        message: 'Balance added successfully',
      };
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.balance.add, {
      amount,
      reason,
    });
  },
};

// ═══════════════════════════════════════════════════════════════
// CONTACT SERVICE
// ═══════════════════════════════════════════════════════════════

export const ContactService = {
  create: async contactData => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // Mock contact log
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
      // Mock user contacts history
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
            contactedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: 'contact_002',
            userId,
            vehicleId: 'vehicle_003',
            plateNumber: 'MH03EF9012',
            contactType: 'whatsapp',
            contactedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        message: 'Contact history retrieved',
      };
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.contacts.userHistory(userId));
  },

  getVehicleContacts: async vehicleId => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // Mock vehicle contacts (for owner to see who contacted their vehicle)
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: [
          {
            _id: 'contact_v001',
            vehicleId,
            contactedBy: 'user_002',
            contactType: 'phone',
            contactedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
        ],
        message: 'Vehicle contact history retrieved',
      };
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.contacts.vehicleHistory(vehicleId));
  },

  revealContact: async (vehicleId, plateNumber) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // Mock reveal contact details (after payment)
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        data: {
          vehicleId,
          plateNumber,
          contactPhone: '+919876543210', // ✅ Full number revealed
          owner: {
            name: 'Riyaansh Mittal', // Full name revealed
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
