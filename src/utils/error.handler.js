/**
 * Global Error Handler
 * Centralized error handling and formatting
 */

import { STORAGE_KEYS } from '../config/constants';

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, data = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Error types
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Map HTTP status codes to error types
 */
const getErrorType = (statusCode) => {
  if (!statusCode) return ERROR_TYPES.NETWORK;

  if (statusCode === 401) return ERROR_TYPES.UNAUTHORIZED;
  if (statusCode === 403) return ERROR_TYPES.FORBIDDEN;
  if (statusCode === 404) return ERROR_TYPES.NOT_FOUND;
  if (statusCode === 408 || statusCode === 504) return ERROR_TYPES.TIMEOUT;
  if (statusCode >= 400 && statusCode < 500) return ERROR_TYPES.VALIDATION;
  if (statusCode >= 500) return ERROR_TYPES.SERVER;

  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get user-friendly error message based on error type
 */
const getUserFriendlyMessage = (errorType, originalMessage) => {
  const messages = {
    [ERROR_TYPES.NETWORK]: 'Network error. Please check your connection.',
    [ERROR_TYPES.TIMEOUT]: 'Request timeout. Please try again.',
    [ERROR_TYPES.UNAUTHORIZED]: 'Session expired. Please login again.',
    [ERROR_TYPES.FORBIDDEN]: "You don't have permission to perform this action.",
    [ERROR_TYPES.NOT_FOUND]: 'Resource not found.',
    [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
    [ERROR_TYPES.SERVER]: 'Server error. Please try again later.',
    [ERROR_TYPES.UNKNOWN]: 'Something went wrong. Please try again.',
  };

  // Return original message if it's more specific, otherwise use generic message
  return originalMessage && originalMessage !== 'Network request failed'
    ? originalMessage
    : messages[errorType];
};

/**
 * Handle API errors
 */
export const handleAPIError = (error) => {
  console.error('API Error:', error);

  // Network error (no response from server)
  if (!error.response) {
    return {
      type: ERROR_TYPES.NETWORK,
      message: getUserFriendlyMessage(ERROR_TYPES.NETWORK),
      statusCode: null,
      originalError: error,
    };
  }

  // HTTP error response
  const { status, data } = error.response;
  const errorType = getErrorType(status);
  const message = data?.message || data?.error || error.message;

  return {
    type: errorType,
    message: getUserFriendlyMessage(errorType, message),
    statusCode: status,
    data: data,
    originalError: error,
  };
};

/**
 * Handle authentication errors
 * Clears tokens and redirects to login
 */
export const handleAuthError = async (error, navigation) => {
  const errorInfo = handleAPIError(error);

  if (errorInfo.type === ERROR_TYPES.UNAUTHORIZED) {
    // Clear authentication data
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (storageError) {
      console.error('Failed to clear storage:', storageError);
    }

    // Redirect to login if navigation is provided
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    }
  }

  return errorInfo;
};

/**
 * Format API response for consistency
 */
export const formatResponse = (data, success = true, message = '') => {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Handle validation errors
 */
export const handleValidationError = (validationResult) => {
  if (validationResult.valid) return null;

  return {
    type: ERROR_TYPES.VALIDATION,
    message: validationResult.message,
    field: validationResult.field,
  };
};

/**
 * Log error to analytics/crash reporting service
 */
export const logError = (error, context = {}) => {
  if (__DEV__) {
    console.error('Error logged:', {
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In production, send to crash reporting service (Firebase Crashlytics, Sentry, etc.)
    try {
      // Example: Firebase Crashlytics
      // crashlytics().recordError(error, context);

      // Example: Sentry
      // Sentry.captureException(error, { extra: context });

      console.error('Production error:', error, context);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }
};

/**
 * Check if error is recoverable
 */
export const isRecoverableError = (errorType) => {
  return [
    ERROR_TYPES.NETWORK,
    ERROR_TYPES.TIMEOUT,
    ERROR_TYPES.SERVER,
  ].includes(errorType);
};

/**
 * Get retry delay based on attempt number (exponential backoff)
 */
export const getRetryDelay = (attemptNumber) => {
  return Math.min(1000 * Math.pow(2, attemptNumber), 10000); // Max 10 seconds
};

/**
 * Error boundary helper
 */
export const createErrorBoundaryHandler = (componentName) => {
  return (error, errorInfo) => {
    logError(error, {
      component: componentName,
      errorInfo,
    });
  };
};

export default {
  APIError,
  ERROR_TYPES,
  handleAPIError,
  handleAuthError,
  formatResponse,
  handleValidationError,
  logError,
  isRecoverableError,
  getRetryDelay,
  createErrorBoundaryHandler,
};
