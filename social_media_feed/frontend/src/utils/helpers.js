import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format large numbers (e.g., 1000 -> 1K)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Extract error message from GraphQL error
 * Sanitizes technical errors to show user-friendly messages
 * @param {object} error - GraphQL error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const errorMsg = error.graphQLErrors[0].message;

    // Hide SQL/database errors from users
    if (errorMsg.includes('relation') ||
        errorMsg.includes('SQL') ||
        errorMsg.includes('database') ||
        errorMsg.includes('does not exist') ||
        errorMsg.includes('syntax error') ||
        errorMsg.includes('constraint')) {
      return 'A server error occurred. Please try again later or contact support.';
    }

    // Hide authentication backend errors
    if (errorMsg.includes('JWT') ||
        errorMsg.includes('token') ||
        errorMsg.includes('authentication')) {
      return 'Authentication failed. Please login again.';
    }

    // Return safe error messages
    return errorMsg;
  }

  if (error.networkError) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  return 'Something went wrong. Please try again.';
};

/**
 * Get initials from username for avatar
 * @param {string} username - Username
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (username) => {
  if (!username) return '?';
  const parts = username.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
};

/**
 * Generate a color based on username for avatar background
 * @param {string} username - Username
 * @returns {string} Hex color code
 */
export const getAvatarColor = (username) => {
  if (!username) return '#1DA1F2';

  const colors = [
    '#1DA1F2', // Blue
    '#17BF63', // Green
    '#E0245E', // Pink
    '#794BC4', // Purple
    '#F45D22', // Orange
    '#1C9CEA', // Light Blue
    '#8B5CF6', // Violet
    '#10B981', // Emerald
  ];

  const hash = username.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};
