/**
 * API Type Definitions
 * TypeScript-style JSDoc types for API responses
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Request success status
 * @property {*} data - Response data
 * @property {string} [message] - Response message
 * @property {string} [error] - Error message
 * @property {string} timestamp - Response timestamp
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success
 * @property {Array} data - Array of items
 * @property {PaginationMeta} meta - Pagination metadata
 * @property {string} timestamp
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} total - Total items
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {number} totalPages - Total pages
 * @property {boolean} hasMore - Has more items
 * @property {string|null} nextCursor - Cursor for next page
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success
 * @property {AuthData} data
 * @property {string} message
 * @property {string} timestamp
 */

/**
 * @typedef {Object} AuthData
 * @property {import('./user.types').User} user - User object
 * @property {string} token - JWT access token
 * @property {string} refreshToken - JWT refresh token
 * @property {boolean} isFirstTime - First time login flag
 */

/**
 * @typedef {Object} SearchResult
 * @property {boolean} found - Vehicle found status
 * @property {VehicleSearchData|null} vehicle - Vehicle data if found
 * @property {string} message - Result message
 */

/**
 * @typedef {Object} VehicleSearchData
 * @property {string} vehicleId - Vehicle ID
 * @property {string} plateNumber - Plate number
 * @property {string} vehicleType - Vehicle type
 * @property {Date|string} registeredAt - Registration date
 * @property {OwnerInfo} owner - Owner information
 */

/**
 * @typedef {Object} OwnerInfo
 * @property {string} userId - Owner user ID
 * @property {string} name - Masked name (e.g., R**** M****)
 * @property {string} photo - Profile photo URL
 * @property {Date|string} memberSince - Member since date
 * @property {boolean} verified - Verification status
 * @property {ContactMethods} contactMethods - Allowed contact methods
 */

/**
 * @typedef {Object} ActivityItem
 * @property {string} _id - Activity ID
 * @property {string} userId - User ID
 * @property {('vehicle_added'|'vehicle_edited'|'vehicle_deleted'|'vehicle_searched'|'owner_contacted'|'referral_redeemed')} type - Activity type
 * @property {Object} metadata - Activity metadata
 * @property {Date|string} createdAt - Activity timestamp
 */

/**
 * @typedef {Object} ContactLogData
 * @property {string} vehicleId - Vehicle ID
 * @property {string} ownerId - Owner user ID
 * @property {string} searcherId - Searcher user ID
 * @property {('call'|'whatsapp'|'sms'|'email')} contactMethod - Contact method used
 * @property {Date|string} timestamp - Contact timestamp
 */

/**
 * @typedef {Object} ReferralStats
 * @property {string} referralCode - User's referral code
 * @property {number} totalReferrals - Total successful referrals
 * @property {number} totalEarned - Total calls earned
 * @property {Array<ReferralRedemption>} recentRedemptions - Recent redemptions
 */

/**
 * @typedef {Object} ReferralRedemption
 * @property {string} _id - Redemption ID
 * @property {string} referredUserId - Referred user ID
 * @property {string} referredUserName - Referred user name
 * @property {number} reward - Reward amount
 * @property {Date|string} redeemedAt - Redemption date
 */

export default {};
