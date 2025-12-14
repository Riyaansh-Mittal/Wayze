/**
 * Mock Service Controller
 * Central hub for all mock services
 */

import authMock from './auth.mock';
import vehiclesMock from './vehicles.mock';
import searchMock from './search.mock';
import usersMock from './users.mock';
import { delay, generateId } from '../../utils/helpers';
import { formatResponse } from '../../utils/error.handler';

/**
 * Mock Vehicles Service
 */
export const MockVehiclesService = {
  /**
   * Get user's vehicles
   */
  list: async (userId) => {
    await delay(1000);
    const vehicles = vehiclesMock.getVehiclesByUserId(userId);
    return formatResponse(vehicles, true, 'Vehicles retrieved');
  },

  /**
   * Create new vehicle
   */
  create: async (userId, vehicleData) => {
    await delay(1500);
    const newVehicle = vehiclesMock.createMockVehicle(userId, vehicleData);
    vehiclesMock.MOCK_VEHICLES.push(newVehicle);
    return formatResponse(newVehicle, true, 'Vehicle added successfully');
  },

  /**
   * Get vehicle details
   */
  details: async (vehicleId) => {
    await delay(800);
    const vehicle = vehiclesMock.getVehicleById(vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return formatResponse(vehicle, true, 'Vehicle details retrieved');
  },

  /**
   * Update vehicle
   */
  update: async (vehicleId, updates) => {
    await delay(1200);
    const vehicle = vehiclesMock.getVehicleById(vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Apply updates
    Object.assign(vehicle, updates, { updatedAt: new Date().toISOString() });

    return formatResponse(vehicle, true, 'Vehicle updated successfully');
  },

  /**
   * Delete vehicle
   */
  delete: async (vehicleId) => {
    await delay(1000);
    const index = vehiclesMock.MOCK_VEHICLES.findIndex(v => v._id === vehicleId);

    if (index === -1) {
      throw new Error('Vehicle not found');
    }

    vehiclesMock.MOCK_VEHICLES.splice(index, 1);
    return formatResponse(null, true, 'Vehicle deleted successfully');
  },

  /**
   * Check if plate number exists
   */
  checkPlate: async (plateNumber) => {
    await delay(800);
    const vehicle = vehiclesMock.getVehicleByPlate(plateNumber);

    return formatResponse(
      { exists: !!vehicle, vehicle: vehicle || null },
      true,
      vehicle ? 'Plate number already exists' : 'Plate number available'
    );
  },
};

/**
 * Mock Auth Service
 */
export const MockAuthService = {
  socialLogin: authMock.mockSocialLogin,
  refreshToken: authMock.mockRefreshToken,
  logout: authMock.mockLogout,
  verifyPhone: authMock.mockVerifyPhone,
};

/**
 * Mock Search Service
 */
export const MockSearchService = {
  searchVehicle: searchMock.mockSearchVehicle,
  getHistory: searchMock.mockSearchHistory,
  logContact: searchMock.mockLogContact,
};

/**
 * Mock User Service
 */
export const MockUserService = {
  /**
   * Get user profile
   */
  getProfile: async (userId) => {
    await delay(800);
    const user = usersMock.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return formatResponse(user, true, 'Profile retrieved');
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId, updates) => {
    await delay(1000);
    const user = usersMock.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates, { updatedAt: new Date().toISOString() });

    return formatResponse(user, true, 'Profile updated successfully');
  },

  /**
   * Update preferences
   */
  updatePreferences: async (userId, preferences) => {
    await delay(800);
    const user = usersMock.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.preferences = { ...user.preferences, ...preferences };
    user.updatedAt = new Date().toISOString();

    return formatResponse(user.preferences, true, 'Preferences updated');
  },

  /**
   * Delete account
   */
  deleteAccount: async (userId) => {
    await delay(1500);
    // In mock, we just simulate success
    return formatResponse(null, true, 'Account deleted successfully');
  },
};

/**
 * Mock Referral Service
 */
export const MockReferralService = {
  /**
   * Validate referral code
   */
  validate: async (code) => {
    await delay(800);
    const referrer = usersMock.getUserByReferralCode(code);

    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    return formatResponse(
      {
        valid: true,
        referrerId: referrer._id,
        referrerName: referrer.fullName,
        reward: 10, // 10 calls
      },
      true,
      'Valid referral code'
    );
  },

  /**
   * Apply referral code
   */
  apply: async (userId, code) => {
    await delay(1000);
    const referrer = usersMock.getUserByReferralCode(code);

    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    const user = usersMock.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if using own code
    if (referrer._id === userId) {
      throw new Error("You can't use your own referral code");
    }

    // Apply reward
    user.callBalance += 10;
    user.referredBy = referrer._id;

    return formatResponse(
      {
        applied: true,
        reward: 10,
        newBalance: user.callBalance,
      },
      true,
      'Referral code applied successfully'
    );
  },

  /**
   * Get referral stats
   */
  getStats: async (userId) => {
    await delay(800);
    const user = usersMock.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Mock stats
    const stats = {
      referralCode: user.referralCode,
      totalReferrals: 3,
      totalEarned: 30,
      recentRedemptions: [
        {
          _id: 'ref_001',
          referredUserId: 'user_002',
          referredUserName: 'Priya Sharma',
          reward: 10,
          redeemedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: 'ref_002',
          referredUserId: 'user_004',
          referredUserName: 'Amit Kumar',
          reward: 10,
          redeemedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };

    return formatResponse(stats, true, 'Referral stats retrieved');
  },

  /**
   * Generate referral code
   */
  generateCode: async (userId) => {
    await delay(600);
    const user = usersMock.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return formatResponse(
      { referralCode: user.referralCode },
      true,
      'Referral code generated'
    );
  },
};

/**
 * Mock Activity Service
 */
export const MockActivityService = {
  /**
   * Get activity list
   */
  list: async (userId, limit = 20) => {
    await delay(1000);

    // Mock activity data
    const activities = [
      {
        _id: 'activity_001',
        userId,
        type: 'vehicle_added',
        metadata: {
          vehicleId: 'vehicle_001',
          plateNumber: 'MH01AB1234',
          vehicleType: '2-wheeler',
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'activity_002',
        userId,
        type: 'vehicle_searched',
        metadata: {
          searchedPlate: 'MH12XY9876',
          found: false,
        },
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'activity_003',
        userId,
        type: 'owner_contacted',
        metadata: {
          vehicleId: 'vehicle_001',
          plateNumber: 'MH01AB1234',
          contactMethod: 'call',
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return formatResponse(
      activities.slice(0, limit),
      true,
      'Activity retrieved'
    );
  },

  /**
   * Get activity stats
   */
  stats: async (userId) => {
    await delay(800);

    const stats = {
      totalVehicles: 2,
      totalSearches: 15,
      totalContactRequests: 4,
      recentActivity: 3,
    };

    return formatResponse(stats, true, 'Activity stats retrieved');
  },
};

/**
 * Mock Ownership Claim Service
 */
export const MockOwnershipService = {
  /**
   * Create ownership claim
   */
  create: async (claimData) => {
    await delay(2000); // Longer delay for file upload simulation

    const claim = {
      _id: generateId(),
      userId: claimData.userId,
      plateNumber: claimData.plateNumber,
      vehicleType: claimData.vehicleType,
      contactPhone: claimData.contactPhone,
      rcPhotoUrl: claimData.rcPhotoUrl || 'https://example.com/rc/claim.jpg',
      status: 'pending',
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
    };

    return formatResponse(claim, true, 'Ownership claim submitted');
  },

  /**
   * Get claim status
   */
  getStatus: async (claimId) => {
    await delay(800);

    // Mock claim status
    const claim = {
      _id: claimId,
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      estimatedReviewTime: '24 hours',
    };

    return formatResponse(claim, true, 'Claim status retrieved');
  },
};

/**
 * Mock Balance Service
 */
export const MockBalanceService = {
  /**
   * Get call balance
   */
  get: async (userId) => {
    await delay(600);
    const user = usersMock.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return formatResponse(
      { balance: user.callBalance },
      true,
      'Balance retrieved'
    );
  },

  /**
   * Get balance history
   */
  history: async (userId, limit = 20) => {
    await delay(800);

    const history = [
      {
        _id: 'bal_001',
        type: 'earned',
        amount: 10,
        description: 'Referral reward from Priya Sharma',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'bal_002',
        type: 'spent',
        amount: -1,
        description: 'Called vehicle owner',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return formatResponse(history.slice(0, limit), true, 'Balance history retrieved');
  },
};

export default {
  MockVehiclesService,
  MockAuthService,
  MockSearchService,
  MockUserService,
  MockReferralService,
  MockActivityService,
  MockOwnershipService,
  MockBalanceService,
};
