/**
 * Validation Utilities
 * All validation logic centralized here
 */

import { VALIDATION } from '../config/constants';

/**
 * Validate Indian vehicle plate number
 * Supports all 2026 formats:
 * 1. Standard: MH12AB1234, MH 12 AB 1234
 * 2. Bharat Series: 26BH1234AA, 26 BH 1234 AA
 * 3. Delhi Special: DL01CAA1234, DL 01 C AA 1234
 */
export const validatePlateNumber = (plateNumber) => {
  if (!plateNumber) {
    return { valid: false, message: 'Plate number is required' };
  }

  const trimmed = plateNumber.trim().toUpperCase();

  // Remove spaces and hyphens for validation
  const normalized = trimmed.replace(/[\s-]/g, '');

  // Check length
  if (
    normalized.length < VALIDATION.PLATE_NUMBER_MIN_LENGTH ||
    normalized.length > VALIDATION.PLATE_NUMBER_MAX_LENGTH
  ) {
    return {
      valid: false,
      message: `Plate number must be ${VALIDATION.PLATE_NUMBER_MIN_LENGTH}-${VALIDATION.PLATE_NUMBER_MAX_LENGTH} characters`,
    };
  }

  // Test against supported formats
  let isValid = false;
  let detectedFormat = '';

  // Test Standard format: MH12AB1234
  if (VALIDATION.PLATE_NUMBER_STANDARD_REGEX.test(normalized)) {
    isValid = true;
    detectedFormat = 'Standard';
  }
  // Test Bharat Series format: 26BH1234AA
  else if (VALIDATION.PLATE_NUMBER_BH_REGEX.test(normalized)) {
    isValid = true;
    detectedFormat = 'Bharat Series';
  }
  // Test Delhi Special format: DL01CAA1234
  else if (VALIDATION.PLATE_NUMBER_DELHI_REGEX.test(normalized)) {
    isValid = true;
    detectedFormat = 'Delhi Special';
  }

  if (!isValid) {
    return {
      valid: false,
      message: `Invalid format. Examples: ${VALIDATION.PLATE_NUMBER_EXAMPLES.join(', ')}`,
    };
  }

  return {
    valid: true,
    value: normalized,
    format: detectedFormat,
  };
};

/**
 * Format plate number for display (adds spaces)
 * MH12AB1234 → MH 12 AB 1234
 * 26BH1234AA → 26 BH 1234 AA
 */
export const formatPlateNumber = (plateNumber) => {
  if (!plateNumber) return '';

  const normalized = plateNumber.trim().toUpperCase().replace(/[\s-]/g, '');

  // Standard format: MH 12 AB 1234
  if (/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(normalized)) {
    return normalized.replace(
      /^([A-Z]{2})([0-9]{2})([A-Z]{1,2})([0-9]{4})$/,
      '$1 $2 $3 $4'
    );
  }

  // BH series: 26 BH 1234 AA
  if (/^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/.test(normalized)) {
    return normalized.replace(
      /^([0-9]{2})(BH)([0-9]{4})([A-Z]{1,2})$/,
      '$1 $2 $3 $4'
    );
  }

  // Delhi special: DL 01 C AA 1234
  if (/^DL[0-9]{1,2}[A-Z][A-Z]{1,2}[0-9]{4}$/.test(normalized)) {
    return normalized.replace(
      /^(DL)([0-9]{1,2})([A-Z])([A-Z]{1,2})([0-9]{4})$/,
      '$1 $2 $3 $4 $5'
    );
  }

  // Return as-is if no format matches
  return normalized;
};


/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();

  if (!VALIDATION.EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Invalid email format' };
  }

  return { valid: true, value: trimmed };
};

/**
 * Validate phone number (Indian format)
 * Format: 10 digits starting with 6-9
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return { valid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Check if starts with country code +91 or 91
  let normalizedDigits = digits;
  if (digits.startsWith('91') && digits.length === 12) {
    normalizedDigits = digits.substring(2);
  }

  if (normalizedDigits.length !== VALIDATION.PHONE_MIN_LENGTH) {
    return {
      valid: false,
      message: `Phone number must be ${VALIDATION.PHONE_MIN_LENGTH} digits`,
    };
  }

  if (!VALIDATION.PHONE_REGEX.test(normalizedDigits)) {
    return {
      valid: false,
      message: 'Phone number must start with 6, 7, 8, or 9',
    };
  }

  return {
    valid: true,
    value: normalizedDigits,
    formatted: `+91 ${normalizedDigits}`,
  };
};

/**
 * Validate referral code
 * Format: 8 alphanumeric characters (uppercase)
 */
export const validateReferralCode = (code) => {
  if (!code) {
    return { valid: true, value: null }; // Optional field
  }

  const trimmed = code.trim().toUpperCase();

  if (trimmed.length !== VALIDATION.REFERRAL_CODE_LENGTH) {
    return {
      valid: false,
      message: `Referral code must be ${VALIDATION.REFERRAL_CODE_LENGTH} characters`,
    };
  }

  if (!/^[A-Z0-9]+$/.test(trimmed)) {
    return {
      valid: false,
      message: 'Referral code must contain only letters and numbers',
    };
  }

  return { valid: true, value: trimmed };
};

/**
 * Validate file size and type for RC upload
 */
export const validateRCFile = (file) => {
  if (!file) {
    return { valid: false, message: 'File is required' };
  }

  const { size, type, uri } = file;

  // Check file size
  if (size > VALIDATION.RC_MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `File size must be less than ${
        VALIDATION.RC_MAX_FILE_SIZE / (1024 * 1024)
      }MB`,
    };
  }

  // Check file type
  const extension = uri?.split('.').pop()?.toLowerCase();
  if (!VALIDATION.RC_ALLOWED_FORMATS.includes(extension)) {
    return {
      valid: false,
      message: `Invalid file type. Use ${VALIDATION.RC_ALLOWED_FORMATS.join(
        ', '
      ).toUpperCase()}`,
    };
  }

  return { valid: true, file };
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` };
  }

  return { valid: true, value };
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value || value.length < minLength) {
    return {
      valid: false,
      message: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { valid: true, value };
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return {
      valid: false,
      message: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }

  return { valid: true, value };
};

/**
 * Validate contact methods selection
 */
export const validateContactMethods = (methods) => {
  if (!methods || Object.keys(methods).length === 0) {
    return {
      valid: false,
      message: 'Please select at least one contact method',
    };
  }

  const hasAtLeastOne = Object.values(methods).some((value) => value === true);

  if (!hasAtLeastOne) {
    return {
      valid: false,
      message: 'Please select at least one contact method',
    };
  }

  return { valid: true, value: methods };
};

/**
 * Validate DELETE confirmation text
 */
export const validateDeleteConfirmation = (text) => {
  const required = 'DELETE';

  if (text !== required) {
    return {
      valid: false,
      message: `Please type ${required} exactly to confirm`,
    };
  }

  return { valid: true, value: text };
};

/**
 * Batch validate multiple fields
 * Returns first error found or success
 */
export const validateMultiple = (validations) => {
  for (const validation of validations) {
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true };
};

export default {
  validatePlateNumber,
  formatPlateNumber,
  validateEmail,
  validatePhoneNumber,
  validateReferralCode,
  validateRCFile,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateContactMethods,
  validateDeleteConfirmation,
  validateMultiple,
};
