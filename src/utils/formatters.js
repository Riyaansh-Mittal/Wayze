/**
 * Formatting Utilities
 * All data formatting logic centralized here
 */

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'relative')
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  switch (format) {
    case 'short':
      // Jun 15, 2024
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    case 'long':
      // June 15, 2024
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

    case 'relative':
      // 2 hours ago, Yesterday, etc.
      return formatRelativeTime(dateObj);

    case 'time':
      // 11:05 AM
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'datetime':
      // Jun 15, 2024, 11:05 AM
      return `${formatDate(dateObj, 'short')}, ${formatDate(dateObj, 'time')}`;

    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Format phone number to display format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number (e.g., "+91 98765 43210")
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // If starts with 91, assume it's Indian number with country code
  if (digits.startsWith('91') && digits.length === 12) {
    const number = digits.substring(2);
    return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
  }

  // If 10 digits, format as Indian number
  if (digits.length === 10) {
    return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
  }

  // Return as-is if format doesn't match
  return phoneNumber;
};

/**
 * Mask phone number for privacy
 * @param {string} phoneNumber - Phone number to mask
 * @returns {string} - Masked phone number (e.g., "+91 *****3210")
 */
export const maskPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  const formatted = formatPhoneNumber(phoneNumber);
  const parts = formatted.split(' ');

  if (parts.length === 3) {
    // +91 98765 43210 -> +91 ***** 3210
    return `${parts[0]} ***** ${parts[2]}`;
  }

  return phoneNumber;
};

/**
 * Format plate number to uppercase
 */
export const formatPlateNumber = (plateNumber) => {
  if (!plateNumber) return '';
  return plateNumber.trim().toUpperCase();
};

/**
 * Format name to mask for privacy
 * @param {string} name - Full name
 * @returns {string} - Masked name (e.g., "Riyaansh Mittal" -> "R**** M****")
 */
export const maskName = (name) => {
  if (!name) return '';

  const parts = name.split(' ');
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return `${part[0]}${'*'.repeat(part.length - 1)}`;
    })
    .join(' ');
};

/**
 * Format currency (Indian Rupees)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';

  return new Intl.NumberFormat('en-IN').format(number);
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;

  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format greeting based on time of day
 */
export const getGreeting = (name = '') => {
  const hour = new Date().getHours();

  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17) {
    greeting = 'Good evening';
  }

  return name ? `${greeting}, ${name}` : greeting;
};

/**
 * Format call balance display
 */
export const formatCallBalance = (balance) => {
  if (balance === null || balance === undefined) return '0 calls';

  return `${balance} ${balance === 1 ? 'call' : 'calls'}`;
};

/**
 * Format timeline date groups (Today, Yesterday, Last Week, etc.)
 */
export const formatTimelineGroup = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return 'Last Week';

  return formatDate(dateObj, 'short');
};

/**
 * Format vehicle type display
 */
export const formatVehicleType = (type) => {
  const typeMap = {
    '2-wheeler': '2-wheeler',
    '3-wheeler': '3-wheeler',
    '4-wheeler': '4-wheeler',
    'Other': 'Other',
  };

  return typeMap[type] || type;
};

/**
 * Format contact methods to readable string
 */
export const formatContactMethods = (methods) => {
  if (!methods) return '';

  const enabledMethods = [];
  if (methods.phone) enabledMethods.push('Call');
  if (methods.sms) enabledMethods.push('SMS');
  if (methods.whatsapp) enabledMethods.push('WhatsApp');
  if (methods.email) enabledMethods.push('Email');

  return enabledMethods.join(', ');
};

/**
 * Parse and format API error messages
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;

  if (error?.message) return error.message;

  if (error?.response?.data?.message) return error.response.data.message;

  return 'Something went wrong. Please try again.';
};

export default {
  formatDate,
  formatRelativeTime,
  formatPhoneNumber,
  maskPhoneNumber,
  formatPlateNumber,
  maskName,
  formatCurrency,
  formatNumber,
  formatFileSize,
  capitalizeWords,
  truncateText,
  getGreeting,
  formatCallBalance,
  formatTimelineGroup,
  formatVehicleType,
  formatContactMethods,
  formatErrorMessage,
};
