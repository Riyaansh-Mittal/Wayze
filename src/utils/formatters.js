/**
 * Formatting Utilities
 * All data formatting logic centralized here
 */

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'relative')
 */
export const formatDate = (dateString, format = 'relative') => {
  if (!dateString) {
    return 'N/A';
  }

  const date = new Date(dateString);
  const now = new Date();

  if (format === 'relative') {
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    return date.toLocaleDateString();
  }

  if (format === 'full') {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString();
};

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export const formatRelativeTime = date => {
  if (!date) {
    return '';
  }

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
export const formatPhoneNumber = phone => {
  if (!phone) {
    return '';
  }

  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Format as: +91 98765 43210
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return phone;
};

/**
 * Mask phone number for privacy
 * @param {string} phoneNumber - Phone number to mask
 * @returns {string} - Masked phone number (e.g., "+91 *****3210")
 */
export const maskPhoneNumber = phoneNumber => {
  if (!phoneNumber) {
    return '';
  }

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
export const formatPlateNumber = plateNumber => {
  if (!plateNumber) {
    return '';
  }
  return plateNumber.trim().toUpperCase();
};

/**
 * Format name to mask for privacy
 * @param {string} name - Full name
 * @returns {string} - Masked name (e.g., "Riyaansh Mittal" -> "R**** M****")
 */
/**
 * Mask name for privacy (show first name + first letter of last name)
 */
export const maskName = fullName => {
  if (!fullName) {
    return 'Unknown';
  }

  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return parts[0];
  }

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0];

  return `${firstName} ${lastInitial}.`;
};

/**
 * Format currency (Indian Rupees)
 */
export const formatCurrency = amount => {
  if (amount === null || amount === undefined) {
    return '₹0';
  }

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
export const formatNumber = number => {
  if (number === null || number === undefined) {
    return '0';
  }

  return new Intl.NumberFormat('en-IN').format(number);
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = bytes => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = str => {
  if (!str) {
    return '';
  }

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
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
export const formatCallBalance = balance => {
  return `${balance} ${balance === 1 ? 'call' : 'calls'}`;
};

/**
 * Format timeline date groups (Today, Yesterday, Last Week, etc.)
 */
export const formatTimelineGroup = date => {
  if (!date) {return '';}

  const dateObj = new Date(date);

  // ✅ Validate date
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatTimelineGroup:', date);
    return '';
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const dateCopy = new Date(dateObj);
  dateCopy.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor((now - dateCopy) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {return 'Today';}
  if (diffInDays === 1) {return 'Yesterday';}
  if (diffInDays < 7) {return 'Last Week';}

  return formatDate(dateObj, 'short');
};

/**
 * Format vehicle type display
 */
export const formatVehicleType = type => {
  const typeMap = {
    '2-wheeler': '2-wheeler',
    '3-wheeler': '3-wheeler',
    '4-wheeler': '4-wheeler',
    Other: 'Other',
  };

  return typeMap[type] || type;
};

/**
 * Format contact methods to readable string
 */
export const formatContactMethods = methods => {
  if (!methods) {
    return '';
  }

  const enabledMethods = [];
  if (methods.phone) {
    enabledMethods.push('Call');
  }
  if (methods.sms) {
    enabledMethods.push('SMS');
  }
  if (methods.whatsapp) {
    enabledMethods.push('WhatsApp');
  }
  if (methods.email) {
    enabledMethods.push('Email');
  }

  return enabledMethods.join(', ');
};

/**
 * Parse and format API error messages
 */
export const formatErrorMessage = error => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

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
