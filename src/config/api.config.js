/**
 * API Configuration
 * All API endpoints and configuration
 */

// Determine base URL based on environment
const getBaseURL = () => {
  if (__DEV__) {
    // Development
    return 'http://localhost:3000/api/'; // Your local backend
  } else {
    // Production
    return 'https://api.qrparking.com/api/';
  }
};

export const BASE_URL = getBaseURL();

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  auth: {
    socialLogin: 'auth/social-login',
    refreshToken: 'auth/refresh-token',
    logout: 'auth/logout',
    verifyPhone: 'auth/verify-phone',
  },

  // User
  user: {
    profile: 'users/profile',
    update: 'users/update',
    delete: 'users/delete',
    exportData: 'users/export-data',
    preferences: 'users/preferences',
  },

  // Vehicles
  vehicles: {
    list: 'vehicles',
    create: 'vehicles',
    details: (id) => `vehicles/${id}`,
    update: (id) => `vehicles/${id}`,
    delete: (id) => `vehicles/${id}`,
    checkPlate: (plate) => `vehicles/check-plate/${plate}`,
  },

  // Search
  search: {
    vehicle: 'search/vehicle',
    history: 'search/history',
  },

  // Contact
  contact: {
    log: 'contacts/log',
    history: 'contacts/history',
  },

  // Ownership Claims
  ownership: {
    create: 'ownership-claims',
    status: (id) => `ownership-claims/${id}`,
    list: 'ownership-claims',
  },

  // Referrals
  referral: {
    validate: 'referrals/validate',
    apply: 'referrals/apply',
    stats: 'referrals/stats',
    generate: 'referrals/generate',
  },

  // Balance
  balance: {
    get: 'balance',
    history: 'balance/history',
  },

  // Activity
  activity: {
    list: 'activity',
    stats: 'activity/stats',
  },

  // Support
  support: {
    bugReport: 'support/bug-report',
    contact: 'support/contact',
  },

  // Upload
  upload: {
    rcDocument: 'upload/rc-document',
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
