/**
 * Application-wide constants
 * Single source of truth for all constant values
 */

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Feature Flags
export const FEATURE_FLAGS = {
  USE_MOCK_DATA: __DEV__ && true, // Toggle mock data in development
  ENABLE_ANALYTICS: !__DEV__,
  ENABLE_CRASHLYTICS: !__DEV__,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_DEEP_LINKING: true,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@qr_parking:auth_token',
  REFRESH_TOKEN: '@qr_parking:refresh_token',
  USER_DATA: '@qr_parking:user_data',
  LANGUAGE: '@qr_parking:language',
  THEME: '@qr_parking:theme',
  RECENT_SEARCHES: '@qr_parking:recent_searches',
  ONBOARDING_COMPLETED: '@qr_parking:onboarding_completed',
};

// Vehicle Types
export const VEHICLE_TYPES = {
  TWO_WHEELER: '2-wheeler',
  THREE_WHEELER: '3-wheeler',
  FOUR_WHEELER: '4-wheeler',
  OTHER: 'Other',
};

export const VEHICLE_TYPE_OPTIONS = [
  { label: '2-wheeler (Bike/Scooter)', value: VEHICLE_TYPES.TWO_WHEELER, icon: '🏍️' },
  { label: '3-wheeler (Auto)', value: VEHICLE_TYPES.THREE_WHEELER, icon: '🛺' },
  { label: '4-wheeler (Car)', value: VEHICLE_TYPES.FOUR_WHEELER, icon: '🚗' },
  { label: 'Other', value: VEHICLE_TYPES.OTHER, icon: '🚙' },
];

// Contact Methods
export const CONTACT_METHODS = {
  PHONE: 'phone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
};

// Activity Types
export const ACTIVITY_TYPES = {
  VEHICLE_ADDED: 'vehicle_added',
  VEHICLE_EDITED: 'vehicle_edited',
  VEHICLE_DELETED: 'vehicle_deleted',
  VEHICLE_SEARCHED: 'vehicle_searched',
  OWNER_CONTACTED: 'owner_contacted',
  REFERRAL_REDEEMED: 'referral_redeemed',
};

// Ownership Claim Status
export const CLAIM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Profile Visibility
export const PROFILE_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

// Languages
export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
  MR: 'mr',
};

export const LANGUAGE_OPTIONS = [
  { label: 'English', value: LANGUAGES.EN, flag: '🇬🇧' },
  { label: 'हिन्दी', value: LANGUAGES.HI, flag: '🇮🇳' },
  { label: 'मराठी', value: LANGUAGES.MR, flag: '🇮🇳' },
];

// Validation Rules
export const VALIDATION = {
  PLATE_NUMBER_REGEX: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/,
  PLATE_NUMBER_FORMAT: 'MH01AB1234',
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 10,
  REFERRAL_CODE_LENGTH: 8,
  RC_MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  RC_ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'heic'],
};

// Referral System
export const REFERRAL = {
  REWARD_AMOUNT: 10, // calls
  INITIAL_BALANCE: 0, // calls
  LOW_BALANCE_THRESHOLD: 5, // show warning below this
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
};

// Time Constants
export const TIME = {
  SPLASH_MIN_DURATION: 500, // ms
  SPLASH_MAX_DURATION: 3000, // ms
  TOAST_DURATION: 3000, // ms
  DEBOUNCE_DELAY: 300, // ms
  ANIMATION_DURATION: 200, // ms
};

// Image Compression
export const IMAGE_COMPRESSION = {
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1920,
  QUALITY: 0.8,
};

// Deep Linking
export const DEEP_LINK_PREFIXES = {
  SCHEME: 'qrparking://',
  UNIVERSAL_LINK: 'https://qrparking.com',
};

// External URLs
export const EXTERNAL_URLS = {
  WEBSITE: 'https://qrparking.com',
  TERMS: 'https://qrparking.com/terms',
  PRIVACY: 'https://qrparking.com/privacy',
  SUPPORT_EMAIL: 'support@qrparking.com',
  HELLO_EMAIL: 'hello@qrparking.com',
  TWITTER: 'https://twitter.com/qrparking',
  PLAY_STORE: 'market://details?id=com.qrparking.app',
  APP_STORE: 'itms-apps://itunes.apple.com/app/id',
};

// Device Types
export const DEVICE_TYPES = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  SCREEN_VIEW: 'screen_view',
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  VEHICLE_ADDED: 'vehicle_added',
  VEHICLE_SEARCHED: 'vehicle_searched',
  OWNER_CONTACTED: 'owner_contacted',
  REFERRAL_APPLIED: 'referral_applied',
  REFERRAL_SHARED: 'referral_shared',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  OWNERSHIP_CLAIM_APPROVED: 'ownership_claim_approved',
  OWNERSHIP_CLAIM_REJECTED: 'ownership_claim_rejected',
  VEHICLE_CONTACTED: 'vehicle_contacted',
  REFERRAL_SUCCESS: 'referral_success',
};

export default {
  API_CONFIG,
  FEATURE_FLAGS,
  STORAGE_KEYS,
  VEHICLE_TYPES,
  VEHICLE_TYPE_OPTIONS,
  CONTACT_METHODS,
  ACTIVITY_TYPES,
  CLAIM_STATUS,
  PROFILE_VISIBILITY,
  LANGUAGES,
  LANGUAGE_OPTIONS,
  VALIDATION,
  REFERRAL,
  PAGINATION,
  TIME,
  IMAGE_COMPRESSION,
  DEEP_LINK_PREFIXES,
  EXTERNAL_URLS,
  DEVICE_TYPES,
  ANALYTICS_EVENTS,
  NOTIFICATION_TYPES,
};
