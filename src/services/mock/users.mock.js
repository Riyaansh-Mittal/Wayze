/**
 * Mock User Data
 * FIXED: Support both mock and real user IDs
 */

import {generateId, generateReferralCode} from '../../utils/helpers';
import SecureStorage from '../storage/SecureStorage';

export const MOCK_USERS = [
  {
    _id: 'user_001',
    firstName: 'Riyaansh',
    lastName: 'Mittal',
    fullName: 'Riyaansh Mittal',
    email: 'riyaansh@example.com',
    phoneNumber: '9876543210',
    photo: 'https://i.pravatar.cc/150?img=1',
    deviceType: 'ANDROID',
    fcmToken: ['sample-fcm-token-001'],
    verification: {
      email: true,
      phone: true,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      profileVisibility: true,
    },
    callBalance: 15,
    alertBalance: 0,
    referralCode: 'RIYA2024',
    referredBy: null,
    isFirstTime: false,
    vehicleSearched: 5,
    timesContacted: 2,
    vehicleRegistered: 3,
    memberSince: new Date('2024-06-15').toISOString(),
    createdAt: new Date('2024-06-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'user_002',
    firstName: 'Priya',
    lastName: 'Sharma',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phoneNumber: '9123456789',
    photo: 'https://i.pravatar.cc/150?img=5',
    deviceType: 'IOS',
    fcmToken: ['sample-fcm-token-002'],
    verification: {
      email: true,
      phone: true,
    },
    preferences: {
      language: 'hi',
      theme: 'dark',
      notifications: true,
      emailAlerts: false,
      smsAlerts: false,
      profileVisibility: true,
    },
    callBalance: 20,
    alertBalance: 0,
    referralCode: 'PRIYA123',
    referredBy: 'user_001',
    isFirstTime: false,
    vehicleSearched: 8,
    timesContacted: 1,
    vehicleRegistered: 2,
    memberSince: new Date('2024-07-20').toISOString(),
    createdAt: new Date('2024-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'user_003',
    firstName: 'Arjun',
    lastName: 'Patel',
    fullName: 'Arjun Patel',
    email: 'arjun.patel@example.com',
    phoneNumber: '9988776655',
    photo: 'https://i.pravatar.cc/150?img=12',
    deviceType: 'ANDROID',
    fcmToken: ['sample-fcm-token-003'],
    verification: {
      email: true,
      phone: false,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: true,
      emailAlerts: true,
      smsAlerts: true,
      profileVisibility: true,
    },
    callBalance: 8,
    alertBalance: 0,
    referralCode: 'ARJUN456',
    referredBy: null,
    isFirstTime: false,
    vehicleSearched: 12,
    timesContacted: 0,
    vehicleRegistered: 1,
    memberSince: new Date('2024-08-10').toISOString(),
    createdAt: new Date('2024-08-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get user by ID
 * ✅ FIXED: If not found in mock, return current user from storage
 */
export const getUserById = async userId => {
  console.log('🔍 Looking up user by ID:', userId);

  // First try to find in mock users
  const mockUser = MOCK_USERS.find(user => user._id === userId);

  if (mockUser) {
    console.log('✅ Found user in mock data:', mockUser.fullName);
    return mockUser;
  }

  // ✅ If not found, get from SecureStorage and use that data
  console.log('⚠️ User not in mock data, fetching from storage...');
  const currentUser = await SecureStorage.getUserData();

  if (currentUser && currentUser._id === userId) {
    console.log('✅ Using current user from storage:', currentUser.fullName);

    // Ensure all required fields exist
    return {
      ...currentUser,
      callBalance: currentUser.callBalance || 0,
      alertBalance: currentUser.alertBalance || 0,
      referralCode: currentUser.referralCode || generateReferralCode(),
      vehicleSearched: currentUser.vehicleSearched || 0,
      timesContacted: currentUser.timesContacted || 0,
      vehicleRegistered: currentUser.vehicleRegistered || 0,
      memberSince: currentUser.createdAt || new Date().toISOString(),
      verification: currentUser.verification || {
        email: true,
        phone: false,
      },
      preferences: currentUser.preferences || {
        language: 'en',
        theme: 'light',
        notifications: true,
        emailAlerts: true,
        smsAlerts: false,
        profileVisibility: true,
      },
    };
  }

  console.error('❌ User not found anywhere:', userId);
  return null;
};

/**
 * Get user by email
 */
export const getUserByEmail = email => {
  return MOCK_USERS.find(
    user => user.email.toLowerCase() === email.toLowerCase(),
  );
};

/**
 * Get user by referral code
 */
export const getUserByReferralCode = code => {
  return MOCK_USERS.find(user => user.referralCode === code.toUpperCase());
};

/**
 * Create new user (mock)
 * Matches API response format
 */
export const createMockUser = userData => {
  const newUser = {
    _id: generateId(),
    firstName: userData.firstName || userData.given_name || '',
    lastName: userData.lastName || userData.family_name || '',
    fullName:
      userData.fullName ||
      `${userData.given_name || ''} ${userData.family_name || ''}`.trim() ||
      userData.name ||
      '',
    email: userData.email,
    phoneNumber: userData.phoneNumber || '',
    photo:
      userData.photo ||
      userData.picture ||
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    deviceType: userData.deviceType || 'ANDROID',
    fcmToken: [userData.fcmToken || 'sample-fcm-token'],
    verification: {
      email: true,
      phone: false,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      profileVisibility: true,
    },
    callBalance: 0,
    alertBalance: 0,
    referralCode: generateReferralCode(),
    referredBy: null,
    isFirstTime: true,
    vehicleSearched: 0,
    timesContacted: 0,
    vehicleRegistered: 0,
    memberSince: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to mock users array
  MOCK_USERS.push(newUser);

  return newUser;
};

/**
 * Update user data
 */
export const updateMockUser = (userId, updates) => {
  const userIndex = MOCK_USERS.findIndex(user => user._id === userId);

  if (userIndex === -1) {
    return null;
  }

  MOCK_USERS[userIndex] = {
    ...MOCK_USERS[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return MOCK_USERS[userIndex];
};

/**
 * Update user preferences
 */
export const updateMockUserPreferences = (userId, preferences) => {
  const userIndex = MOCK_USERS.findIndex(user => user._id === userId);

  if (userIndex === -1) {
    return null;
  }

  MOCK_USERS[userIndex].preferences = {
    ...MOCK_USERS[userIndex].preferences,
    ...preferences,
  };
  MOCK_USERS[userIndex].updatedAt = new Date().toISOString();

  return MOCK_USERS[userIndex];
};

export default {
  MOCK_USERS,
  getUserById,
  getUserByEmail,
  getUserByReferralCode,
  createMockUser,
  updateMockUser,
  updateMockUserPreferences,
};
