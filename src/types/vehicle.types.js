/**
 * Vehicle Type Definitions
 * TypeScript-style JSDoc types for vehicles
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} _id - Unique vehicle ID
 * @property {string} userId - Owner user ID
 * @property {string} plateNumber - Vehicle registration number (e.g., MH01AB1234)
 * @property {string} rcNumber - RC document number
 * @property {('2-wheeler'|'3-wheeler'|'4-wheeler'|'Other')} vehicleType - Type of vehicle
 * @property {string} contactPhone - Contact phone number
 * @property {ContactMethods} contactMethods - Allowed contact methods
 * @property {string} rcPhotoUrl - URL to RC document photo
 * @property {VehicleStats} stats - Vehicle statistics
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} ContactMethods
 * @property {boolean} phone - Allow phone calls
 * @property {boolean} sms - Allow SMS
 * @property {boolean} whatsapp - Allow WhatsApp
 * @property {boolean} email - Allow email
 */

/**
 * @typedef {Object} VehicleStats
 * @property {number} totalSearches - Total times vehicle was searched
 * @property {number} contactRequests - Total contact requests
 * @property {Date|string|null} lastSearched - Last search timestamp
 */

/**
 * @typedef {Object} VehicleFormData
 * @property {string} vehicleType
 * @property {string} plateNumber
 * @property {string} rcNumber
 * @property {string} contactPhone
 * @property {ContactMethods} contactMethods
 * @property {Object} rcPhoto - File object
 */

/**
 * @typedef {Object} OwnershipClaim
 * @property {string} _id - Claim ID
 * @property {string} userId - Claiming user ID
 * @property {string} plateNumber - Vehicle plate number
 * @property {string} vehicleType - Vehicle type
 * @property {string} contactPhone - Contact phone
 * @property {string} rcPhotoUrl - RC photo URL
 * @property {('pending'|'approved'|'rejected')} status - Claim status
 * @property {Date|string} createdAt - Submission date
 * @property {Date|string|null} reviewedAt - Review date
 * @property {string|null} reviewedBy - Reviewer ID
 * @property {string|null} rejectionReason - Reason for rejection
 */

export default {};
