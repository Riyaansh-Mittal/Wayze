/**
 * User Type Definitions
 * Updated to match API v1.1.0
 */

/**
 * @typedef {Object} User
 * @property {string} _id - Unique user ID
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} fullName - Full name
 * @property {string} email - Email address
 * @property {string} phoneNumber - Phone number (optional)
 * @property {string} photo - Profile photo URL
 * @property {('ANDROID'|'IOS'|'WEB')} deviceType - Device platform
 * @property {string[]} fcmToken - Firebase Cloud Messaging tokens (array)
 * @property {number} callBalance - Available call balance
 * @property {number} alertBalance - Available alert balance
 * @property {string} referralCode - User's unique 8-character referral code
 * @property {number} vehicleSearched - Total vehicle searches performed
 * @property {number} timesContacted - Times user was contacted
 * @property {number} vehicleRegistered - Total vehicles registered
 * @property {string} memberSince - Account creation date (ISO string)
 */

/**
 * @typedef {Object} UserStats
 * @property {number} vehicleSearched - Total vehicle searches
 * @property {number} timesContacted - Times contacted by others
 * @property {number} vehicleRegistered - Total vehicles registered
 * @property {string} memberSince - Member since date
 */

/**
 * @typedef {Object} UserActivity
 * @property {string} _id - Activity ID
 * @property {string} userId - User ID
 * @property {('LOGIN'|'LOGOUT'|'VEHICLE_ADDED'|'VEHICLE_REMOVED'|'VEHICLE_SEARCHED'|'CALL'|'ALERT'|'DELETE_ACCOUNT')} type - Activity type
 * @property {string|null} title - Human-readable description
 * @property {string|null} registrationNumber - Vehicle registration (only for VEHICLE_SEARCHED)
 * @property {string} createdAt - Activity timestamp (ISO string)
 * @property {string} updatedAt - Last update timestamp (ISO string)
 */

/**
 * @typedef {Object} ActivityPagination
 * @property {UserActivity[]} activity - Array of activities
 * @property {number} totalData - Total number of records
 * @property {number} page - Current page number
 * @property {number} limit - Results per page
 * @property {boolean} hasNext - More pages available
 * @property {boolean} hasPrevious - Previous page exists
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} _id - Settings ID
 * @property {string} userId - User ID
 * @property {boolean} notifications - Push notifications enabled
 * @property {boolean} emailAlerts - Email notifications enabled
 * @property {boolean} smsAlerts - SMS notifications enabled
 * @property {boolean} profileVisibility - Profile visible to others
 * @property {string} createdAt - Settings creation date
 * @property {string} updatedAt - Last update date
 */

/**
 * @typedef {Object} SocialLoginData
 * @property {string} email - Required for all platforms
 * @property {string} fcmToken - Required for all platforms
 * @property {string} firstName - Required for ANDROID only
 * @property {string} lastName - Required for ANDROID only
 * @property {string} [fullName] - Optional (auto-generated for ANDROID)
 * @property {string} [phoneNumber] - Optional for all platforms
 * @property {string} [photo] - User's profile photo URL
 */

export default {};
