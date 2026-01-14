/**
 * Application-wide constants
 * Single source of truth for all constant values
 */

// Feature Flags
// export const FEATURE_FLAGS = {
//   USE_MOCK_DATA: __DEV__ && true, // Toggle mock data in development
//   ENABLE_ANALYTICS: !__DEV__,
//   ENABLE_CRASHLYTICS: !__DEV__,
//   ENABLE_PUSH_NOTIFICATIONS: true,
//   ENABLE_DEEP_LINKING: true,
// };

export const FEATURE_FLAGS = {
  USE_MOCK_DATA: true, // Toggle mock data in development
  ENABLE_ANALYTICS: false,
  ENABLE_CRASHLYTICS: false,
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
  SEARCH_HISTORY: '@qr_parking:search_history', // ✅ ADD THIS
  ONBOARDING_COMPLETED: '@qr_parking:onboarding_completed',
};

// Vehicle Types
export const VEHICLE_TYPES = {
  TWO_WHEELER: '2-wheeler',
  THREE_WHEELER: '3-wheeler',
  FOUR_WHEELER: '4-wheeler',
  HEAVY_VEHICLE: 'heavy-vehicle', // ✅ ADD THIS (used in batch 6)
  OTHER: 'other',
};

export const VEHICLE_TYPE_OPTIONS = [
  {
    label: '2-Wheeler (Bike/Scooter)',
    value: VEHICLE_TYPES.TWO_WHEELER,
    icon: '🏍️',
  },
  {label: '3-Wheeler (Auto)', value: VEHICLE_TYPES.THREE_WHEELER, icon: '🛺'},
  {label: '4-Wheeler (Car)', value: VEHICLE_TYPES.FOUR_WHEELER, icon: '🚗'},
  {
    label: 'Heavy Vehicle (Truck/Bus)',
    value: VEHICLE_TYPES.HEAVY_VEHICLE,
    icon: '🚚',
  }, // ✅ ADD THIS
  {label: 'Other', value: VEHICLE_TYPES.OTHER, icon: '🚙'},
];

// Contact Methods
export const CONTACT_METHODS = {
  PHONE: 'phone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
};

// ✅ ADD THIS: Contact Types (for logging)
export const CONTACT_TYPES = {
  REVEAL: 'reveal',
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
  CONTACT_REVEALED: 'contact_revealed', // ✅ ADD THIS
  REFERRAL_REDEEMED: 'referral_redeemed',
};

// Ownership Claim Status
export const CLAIM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// ✅ ADD THIS: Verification Status
export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
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

// ✅ ADD THIS SECTION (after LANGUAGES)
// Theme Modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const LANGUAGE_OPTIONS = [
  {label: 'English', value: LANGUAGES.EN, flag: '🇬🇧'},
  {label: 'हिन्दी', value: LANGUAGES.HI, flag: '🇮🇳'},
  {label: 'मराठी', value: LANGUAGES.MR, flag: '🇮🇳'},
];

// Validation Rules
export const VALIDATION = {
  // ========================================
  // PLATE NUMBER VALIDATION (2026 Standards)
  // ========================================

  /**
   * Standard State Registration Format
   * Examples: MH12AB1234, KA08J9192, DL01AA1234
   * Format: 2 letters (state) + 2 digits (RTO) + 1-2 letters (series) + 4 digits (number)
   */
  PLATE_NUMBER_STANDARD_REGEX: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,

  /**
   * Bharat (BH) Series Format (Pan-India)
   * Examples: 26BH1234AA, 25BH5678AB
   * Format: 2 digits (year) + BH + 4 digits + 1-2 letters
   */
  PLATE_NUMBER_BH_REGEX: /^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/,

  /**
   * Delhi Special Classification Format
   * Examples: DL01CAA1234, DL8SBB9999
   * Format: DL + 1-2 digits (RTO) + 1 letter (category) + 1-2 letters (series) + 4 digits
   */
  PLATE_NUMBER_DELHI_REGEX: /^DL[0-9]{1,2}[A-Z][A-Z]{1,2}[0-9]{4}$/,

  // Length constraints
  PLATE_NUMBER_MIN_LENGTH: 8, // Minimum: DL8CAA99 (8 chars without spaces)
  PLATE_NUMBER_MAX_LENGTH: 12, // Maximum: DL01CAA1234 (11 chars) or 26BH1234AA (10 chars)

  // Example formats for user guidance
  PLATE_NUMBER_EXAMPLES: ['MH12AB1234', '26BH1234AA', 'DL01CAA1234'],
  PLATE_NUMBER_FORMAT: 'MH12AB1234 or 26BH1234AA',

  // ========================================
  // OTHER VALIDATIONS (unchanged)
  // ========================================

  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  PHONE_REGEX: /^[6-9]\d{9}$/,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 10,

  RC_NUMBER_REGEX: /^[A-Z]{2}\d{2}[A-Z]{2}\d{9}$/,

  REFERRAL_CODE_LENGTH: 8,
  REFERRAL_CODE_REGEX: /^[A-Z0-9]{8}$/,

  RC_MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  RC_ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'heic'],
};

/**
 * Indian State Codes (2026)
 * For additional validation if needed
 */
export const INDIAN_STATE_CODES = [
  'AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CG', 'DD', 'DL', 'GA',
  'GJ', 'HP', 'HR', 'JH', 'JK', 'KA', 'KL', 'LA', 'LD', 'MH',
  'ML', 'MN', 'MP', 'MZ', 'NL', 'OD', 'PB', 'PY', 'RJ', 'SK',
  'TN', 'TR', 'TS', 'UK', 'UP', 'WB',
];

// Referral System
export const REFERRAL = {
  REWARD_AMOUNT: 10, // calls
  INITIAL_BALANCE: 0, // calls
  LOW_BALANCE_THRESHOLD: 5, // show warning below this
};

// ✅ ADD THIS: Balance System
export const BALANCE = {
  INITIAL_CREDITS: 5, // Free credits on signup
  CONTACT_COST: 1, // Credits per contact
  LOW_BALANCE_THRESHOLD: 3, // Show warning below this
  REFERRAL_REWARD: 5, // Credits for successful referral
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
  SEARCH_DEBOUNCE_DELAY: 500, // ✅ ADD THIS (used in search)
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
  VEHICLE_FOUND: 'vehicle_found', // ✅ ADD THIS
  VEHICLE_NOT_FOUND: 'vehicle_not_found', // ✅ ADD THIS
  CONTACT_REVEALED: 'contact_revealed', // ✅ ADD THIS
  OWNER_CONTACTED: 'owner_contacted',
  REFERRAL_APPLIED: 'referral_applied',
  REFERRAL_SHARED: 'referral_shared',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  OWNERSHIP_CLAIM_APPROVED: 'ownership_claim_approved',
  OWNERSHIP_CLAIM_REJECTED: 'ownership_claim_rejected',
  VEHICLE_CONTACTED: 'vehicle_contacted',
  CONTACT_REQUEST: 'contact_request', // ✅ ADD THIS
  REFERRAL_SUCCESS: 'referral_success',
  LOW_BALANCE: 'low_balance', // ✅ ADD THIS
};

// ✅ Export everything including new additions
export default {
  FEATURE_FLAGS,
  STORAGE_KEYS,
  VEHICLE_TYPES,
  VEHICLE_TYPE_OPTIONS,
  CONTACT_METHODS,
  CONTACT_TYPES, // ✅ NEW
  ACTIVITY_TYPES,
  CLAIM_STATUS,
  VERIFICATION_STATUS, // ✅ NEW
  PROFILE_VISIBILITY,
  LANGUAGES,
  LANGUAGE_OPTIONS,
  VALIDATION,
  REFERRAL,
  BALANCE, // ✅ NEW
  PAGINATION,
  TIME,
  IMAGE_COMPRESSION,
  DEEP_LINK_PREFIXES,
  EXTERNAL_URLS,
  DEVICE_TYPES,
  ANALYTICS_EVENTS,
  NOTIFICATION_TYPES,
};
