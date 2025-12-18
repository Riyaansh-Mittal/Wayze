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
    return 'https://api.qrparking.com/';
  }
};

export const BASE_URL = getBaseURL();

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  auth: {
    socialLogin: 'api/auth/socialLogin', // ✅ CHANGED: Matches your old system
    refreshToken: 'auth/token-refresh/', // ✅ CHANGED: Matches your old system
    logout: 'auth/logout/',
    verifyPhone: 'auth/verify-otp/', // ✅ CHANGED: Matches your old system
  },

  // User
  user: {
    profile: 'api/users/profile',
    update: 'api/users/update',
    delete: 'api/users/delete',
    exportData: 'api/users/export-data',
    preferences: 'api/users/preferences',
  },

  // Vehicles
  vehicles: {
    list: 'api/vehicles',
    create: 'api/vehicles',
    details: (id) => `api/vehicles/${id}`,
    update: (id) => `api/vehicles/${id}`,
    delete: (id) => `api/vehicles/${id}`,
    checkPlate: (plate) => `api/vehicles/check-plate/${plate}`,
  },

  // Search
  search: {
    vehicle: 'api/search/vehicle',
    history: 'api/search/history',
  },

  // Contact
  contact: {
    log: 'api/contacts/log',
    history: 'api/contacts/history',
  },

  // Ownership Claims
  ownership: {
    create: 'api/ownership-claims',
    status: (id) => `api/ownership-claims/${id}`,
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
  'Accept': 'application/json',
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
