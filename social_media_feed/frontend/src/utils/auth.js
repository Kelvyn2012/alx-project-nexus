// Authentication utility functions

/**
 * Store authentication tokens in localStorage
 * @param {string} token - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const setTokens = (token, refreshToken) => {
  localStorage.setItem('token', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

/**
 * Get the current access token
 * @returns {string|null} The access token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get the current refresh token
 * @returns {string|null} The refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * Remove all authentication tokens
 */
export const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Store user data in localStorage
 * @param {object} user - User object
 */
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get stored user data
 * @returns {object|null} User object or null
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Logout user by clearing all stored data
 */
export const logout = () => {
  clearTokens();
};
