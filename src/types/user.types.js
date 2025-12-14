/**
 * User Type Definitions
 * TypeScript-style JSDoc types for users
 */

/**
 * @typedef {Object} User
 * @property {string} _id - Unique user ID
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} fullName - Full name
 * @property {string} email - Email address
 * @property {string} phoneNumber - Phone number
 * @property {string} photo - Profile photo URL
 * @property {('ANDROID'|'IOS')} deviceType - Device platform
 * @property {string[]} fcmToken - Firebase Cloud Messaging tokens
 * @property {UserVerification} verification - Verification status
 * @property {UserPreferences} preferences - User preferences
 * @property {number} callBalance - Available call balance
 * @property {string} referralCode - User's unique referral code
 * @property {string|null} referredBy - Referrer user ID
 * @property {boolean} isFirstTime - First time user flag
 * @property {Date|string} createdAt - Account creation date
 * @property {Date|string} updatedAt - Last update date
 */

/**
 * @typedef {Object} UserVerification
 * @property {boolean} email - Email verified
 * @property {boolean} phone - Phone verified
 */

/**
 * @typedef {Object} UserPreferences
 * @property {('en'|'hi'|'mr')} language - Preferred language
 * @property {boolean} notifications - Push notifications enabled
 * @property {boolean} emailAlerts - Email alerts enabled
 * @property {boolean} smsAlerts - SMS alerts enabled
 * @property {('public'|'private')} profileVisibility - Profile visibility
 */

/**
 * @typedef {Object} UserStats
 * @property {number} vehiclesRegistered - Total vehicles
 * @property {number} vehicleSearches - Total searches performed
 * @property {number} timesContacted - Times user's vehicles were contacted
 * @property {number} referralsCount - Successful referrals
 * @property {number} referralEarnings - Calls earned from referrals
 */

/**
 * @typedef {Object} SocialLoginData
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fullName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} deviceType
 * @property {string} fcmToken
 * @property {string} [password] - Optional password
 */

/**
 * @typedef {Object} ReferralData
 * @property {string} code - Referral code
 * @property {string} referrerId - Referrer user ID
 * @property {string} referrerName - Referrer name
 * @property {number} reward - Reward amount
 * @property {Date|string} validUntil - Expiration date
 */

export default {};
