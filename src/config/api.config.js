/**
 * API Configuration
 * All API endpoints and configuration
 */

// Determine base URL based on environment
const getBaseURL = () => {
  if (__DEV__) {
    // Development - Your actual backend
    return 'https://parking-backbone.onrender.com/'; // ✅ REMOVE /api/ from base
  } else {
    // Production
    return 'https://parking-backbone.onrender.com/';
  }
};

export const BASE_URL = getBaseURL();

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  auth: {
    socialLogin: 'api/auth/socialLogin', // ✅ CHANGED: Matches your old system
    logout: 'api/user/logout',
  },

  // User
  user: {
    home: 'api/user/home',
    activities: 'api/user/activity',
    settings: 'api/user/settings',
  },

  // Vehicles
  vehicles: {
    list: 'api/user/userInfo',
    create: 'api/user/userInfo',
    details: id => `api/user/vehicleById?vehicleId=${id}`,
    delete: id => `api/user/delete-vehicle?id=${id}`,
  },

  // Search
  search: {
    vehicle: 'api/user/search-vehicle',
    // history endpoint doesn't exist yet
  },

  // Contact
  contacts: {
    initiateCall: 'api/user/initiate-call',
    initiateAlert: 'api/user/initiate-alert',
  },

  // Notifications
  notifications: {
    list: 'api/user/notifications',
    markRead: 'api/user/notifications',
  },

  // Ownership Claims
  ownership: {
    create: 'api/ownership-claims',
    status: id => `api/ownership-claims/${id}`,
    list: 'api/ownership-claims',
  },

  // Referrals
  referral: {
    validate: 'api/referrals/validate',
    apply: 'api/referrals/apply',
    stats: 'api/referrals/stats',
    generate: 'api/referrals/generate',
  },

  // Balance
  balance: {
    get: 'api/balance',
    history: 'api/balance/history',
  },

  // Activity
  activity: {
    list: 'api/activity',
    stats: 'api/activity/stats',
  },

  // Support
  support: {
    bugReport: 'api/support/bug-report',
    contact: 'api/support/contact',
  },

  // Upload
  upload: {
    rcDocument: 'api/upload/rc-document',
  },
};

// Build full URL helper
export const buildURL = (endpoint, params = {}) => {
  let url = `${BASE_URL}${endpoint}`;
  // Add query parameters if present
  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  if (queryString) {
    url += `?${queryString}`;
  }
  return url;
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
};

export default {
  BASE_URL,
  ENDPOINTS,
  buildURL,
  HTTP_METHODS,
  DEFAULT_HEADERS,
  API_STATUS,
};
