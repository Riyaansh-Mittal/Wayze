/**
 * Mock Authentication Service
 * Simulates authentication API responses
 * UPDATED: API v1.1.0 compatibility
 */

import {delay} from '../../utils/helpers';
import {getUserByEmail, createMockUser} from './users.mock';
import {formatResponse} from '../../utils/error.handler';

/**
 * Mock social login (Google/Apple)
 * Matches API response format
 */
export const mockSocialLogin = async loginData => {
  console.log('🎭 Using MOCK social login');

  // Simulate API delay
  await delay(1500);

  try {
    // Check if user exists by email
    let user = getUserByEmail(loginData.email);
    let isFirstTime = false;

    // If user doesn't exist, create new one
    if (!user) {
      console.log('👤 Creating new user:', loginData.email);
      user = createMockUser({
        firstName: loginData.given_name || loginData.firstName || '',
        lastName: loginData.family_name || loginData.lastName || '',
        fullName: loginData.name || loginData.fullName || '',
        email: loginData.email,
        photo: loginData.picture || loginData.photo || null,
        phoneNumber: loginData.phoneNumber || '',
        deviceType: loginData.deviceType || 'ANDROID',
        fcmToken: loginData.fcmToken || 'Sample-FCM',
      });
      isFirstTime = true;
    } else {
      console.log('👤 User exists:', loginData.email);
      // Update isFirstTime to false for existing users
      user.isFirstTime = false;
    }

    // Generate mock tokens
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const authToken = `mock_token_${timestamp}_${randomId}_${timestamp}`;
    const refreshToken = `mock_refresh_${timestamp}_${randomId}_${timestamp}`;

    const response = {
      user: {
        ...user,
        isFirstTime, // Override with current state
      },
      token: authToken,
      refreshToken: refreshToken,
      isFirstTime,
    };

    console.log('✅ Google login successful:', response);

    return formatResponse(
      response,
      true,
      isFirstTime ? 'Account created successfully' : 'Login successful',
    );
  } catch (error) {
    console.error('❌ Mock login error:', error);
    return formatResponse(
      null,
      false,
      'Login failed: ' + error.message,
    );
  }
};

/**
 * Mock token refresh
 */
export const mockRefreshToken = async refreshToken => {
  console.log('🔄 Refreshing mock token');

  // Simulate API delay
  await delay(500);

  // Extract user ID from refresh token (mock)
  const userId = refreshToken.split('_')[2];

  // Generate new tokens
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const newAuthToken = `mock_token_${timestamp}_${randomId}_${timestamp}`;
  const newRefreshToken = `mock_refresh_${timestamp}_${randomId}_${timestamp}`;

  return formatResponse(
    {
      token: newAuthToken,
      refreshToken: newRefreshToken,
    },
    true,
    'Token refreshed successfully',
  );
};

/**
 * Mock logout
 */
export const mockLogout = async () => {
  console.log('👋 Mock logout');

  // Simulate API delay
  await delay(500);

  return formatResponse(null, true, 'Logged out successfully');
};

/**
 * Mock verify token
 */
export const mockVerifyToken = async token => {
  console.log('🔍 Verifying mock token');

  // Simulate API delay
  await delay(300);

  // Simple mock validation
  if (token && token.startsWith('mock_token_')) {
    return formatResponse(
      {valid: true},
      true,
      'Token is valid',
    );
  }

  return formatResponse(
    {valid: false},
    false,
    'Invalid token',
  );
};

export default {
  mockSocialLogin,
  mockRefreshToken,
  mockLogout,
  mockVerifyToken,
};
