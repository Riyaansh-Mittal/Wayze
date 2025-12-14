/**
 * Mock Authentication Service
 * Simulates authentication API responses
 */

import { delay } from '../../utils/helpers';
import { getUserByEmail, createMockUser } from './users.mock';
import { formatResponse } from '../../utils/error.handler';

/**
 * Mock social login (Google/Apple)
 */
export const mockSocialLogin = async (loginData) => {
  // Simulate API delay
  await delay(1500);

  // Check if user exists
  let user = getUserByEmail(loginData.email);
  // If user doesn't exist, create new one
  if (!user) {
    user = createMockUser(loginData);
  }

  // Generate mock tokens
  const authToken = `mock_token_${user._id}_${Date.now()}`;
  const refreshToken = `mock_refresh_${user._id}_${Date.now()}`;

  // Return auth response
  return formatResponse(
    {
      user,
      token: authToken,
      refreshToken: refreshToken,
      isFirstTime: user.isFirstTime,
    },
    true,
    user.isFirstTime ? 'Account created successfully' : 'Login successful'
  );
};

/**
 * Mock refresh token
 */
export const mockRefreshToken = async (refreshToken) => {
  await delay(800);

  // Extract user ID from refresh token (in mock)
  const userId = refreshToken.split('_')[2];

  const newAuthToken = `mock_token_${userId}_${Date.now()}`;
  const newRefreshToken = `mock_refresh_${userId}_${Date.now()}`;

  return formatResponse(
    {
      token: newAuthToken,
      refreshToken: newRefreshToken,
    },
    true,
    'Token refreshed successfully'
  );
};

/**
 * Mock logout
 */
export const mockLogout = async () => {
  await delay(500);

  return formatResponse(
    null,
    true,
    'Logged out successfully'
  );
};

/**
 * Mock phone verification
 */
export const mockVerifyPhone = async (phoneNumber, otp) => {
  await delay(1000);

  // Simple mock validation
  if (otp === '123456') {
    return formatResponse(
      { verified: true },
      true,
      'Phone number verified successfully'
    );
  }

  throw new Error('Invalid OTP');
};

export default {
  mockSocialLogin,
  mockRefreshToken,
  mockLogout,
  mockVerifyPhone,
};
