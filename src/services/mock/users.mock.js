/**
 * Mock User Data
 * Sample user profiles for testing
 */

import { generateId, generateReferralCode } from '../../utils/helpers';

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
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      profileVisibility: 'public',
    },
    callBalance: 15,
    referralCode: 'RIYA2024',
    referredBy: null,
    isFirstTime: false,
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
      notifications: true,
      emailAlerts: false,
      smsAlerts: false,
      profileVisibility: 'public',
    },
    callBalance: 20,
    referralCode: 'PRIYA123',
    referredBy: 'user_001',
    isFirstTime: false,
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
      notifications: true,
      emailAlerts: true,
      smsAlerts: true,
      profileVisibility: 'public',
    },
    callBalance: 8,
    referralCode: 'ARJUN456',
    referredBy: null,
    isFirstTime: false,
    createdAt: new Date('2024-08-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get user by ID
 */
export const getUserById = (userId) => {
  return MOCK_USERS.find((user) => user._id === userId);
};

/**
 * Get user by email
 */
export const getUserByEmail = (email) => {
  return MOCK_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Get user by referral code
 */
export const getUserByReferralCode = (code) => {
  return MOCK_USERS.find((user) => user.referralCode === code.toUpperCase());
};

/**
 * Create new user (mock)
 */
export const createMockUser = (userData) => {
  return {
    _id: generateId(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    fullName: userData.fullName,
    email: userData.email,
    phoneNumber: userData.phoneNumber || '',
    photo: userData.photo || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    deviceType: userData.deviceType,
    fcmToken: [userData.fcmToken],
    verification: {
      email: true, // Assume verified through Google
      phone: false,
    },
    preferences: {
      language: 'en',
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      profileVisibility: 'public',
    },
    callBalance: 0,
    referralCode: generateReferralCode(),
    referredBy: null,
    isFirstTime: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export default {
  MOCK_USERS,
  getUserById,
  getUserByEmail,
  getUserByReferralCode,
  createMockUser,
};
