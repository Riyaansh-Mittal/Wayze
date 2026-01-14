/**
 * Mock Service Controller
 * Central hub for all mock services
 */

import authMock from './auth.mock';
import vehiclesMock from './vehicles.mock';
import searchMock from './search.mock';
import usersMock from './users.mock';
import {delay, generateId} from '../../utils/helpers';
import {formatResponse} from '../../utils/error.handler';
import SecureStorage from '../storage/SecureStorage'; // ✅ Import SecureStorage

/**
 * Mock Vehicles Service
 */
export const MockVehiclesService = {
  /**
   * Get user's vehicle information (userInfo)
   * GET /api/user/userInfo
   */
  list: async () => {
    console.log('🚗 Loading vehicles from mock');
    await delay(1000);

    try {
      // Get from storage or context (in real app)
      // For mock, we'll use the first user
      const userId = 'user_001'; // This should come from auth context

      const userInfo = vehiclesMock.getUserInfoByUserId(userId);

      console.log('✅ Vehicles loaded:', userInfo);

      return formatResponse(userInfo || null, true, 'OK');
    } catch (error) {
      console.error('❌ Failed to load vehicles:', error);
      return formatResponse(null, false, error.message);
    }
  },

  /**
   * Create new vehicle
   * POST /api/user/userInfo
   */
  create: async vehicleData => {
    console.log('➕ Adding vehicle:', vehicleData);
    await delay(1500);

    try {
      const userId = 'user_001'; // This should come from auth context

      // Check if vehicle already exists (globally)
      const existingVehicle = vehiclesMock.getVehicleByPlate(
        vehicleData.vehicleRegistration,
      );

      if (existingVehicle) {
        // Check if it's the same user
        if (existingVehicle.userInfo.userId === userId) {
          return formatResponse(null, false, 'vehicle_already_added');
        } else {
          return formatResponse(null, false, 'vehicle_already_registered');
        }
      }

      // Add vehicle to userInfo
      const updatedUserInfo = vehiclesMock.addVehicleToUserInfo(
        userId,
        vehicleData,
      );

      console.log('✅ Vehicle added successfully');

      return formatResponse(updatedUserInfo, true, 'OK');
    } catch (error) {
      console.error('❌ Failed to add vehicle:', error);
      return formatResponse(null, false, error.message);
    }
  },

  /**
   * Get vehicle details
   * GET /api/user/vehicleById?vehicleId=<vehicle_id>
   */
  details: async vehicleId => {
    console.log('🔍 Getting vehicle details:', vehicleId);
    await delay(800);

    try {
      const vehicle = vehiclesMock.getVehicleById(vehicleId);

      if (!vehicle) {
        return formatResponse(null, false, 'Vehicle not found');
      }

      console.log('✅ Vehicle details retrieved');
      return formatResponse(vehicle, true, 'OK');
    } catch (error) {
      console.error('❌ Failed to get vehicle details:', error);
      return formatResponse(null, false, error.message);
    }
  },

  /**
   * Delete vehicle
   * DELETE /api/user/delete-vehicle?id=<vehicle_id>
   */
  delete: async vehicleId => {
    console.log('🗑️ Deleting vehicle:', vehicleId);
    await delay(1000);

    try {
      const userId = 'user_001'; // This should come from auth context

      const result = vehiclesMock.deleteVehicleFromUserInfo(userId, vehicleId);

      if (!result) {
        return formatResponse(null, false, 'vehicle_not_found');
      }

      console.log('✅ Vehicle deleted successfully');
      return formatResponse({}, true, 'Deleted Successfully');
    } catch (error) {
      console.error('❌ Failed to delete vehicle:', error);
      return formatResponse(null, false, error.message);
    }
  },
};

/**
 * Mock Auth Service
 */
export const MockAuthService = {
  socialLogin: authMock.mockSocialLogin,
  logout: authMock.mockLogout,
};

/**
 * Mock Search Service
 */
export const MockSearchService = {
  searchVehicle: searchMock.mockSearchVehicle,
  getHistory: searchMock.mockSearchHistory,
};

/**
 * Mock User Service
 */
export const MockUserService = {
  /**
   * Get user profile
   */
  getProfile: async userId => {
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

    Object.assign(user, updates, {updatedAt: new Date().toISOString()});

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

    user.preferences = {...user.preferences, ...preferences};
    user.updatedAt = new Date().toISOString();

    return formatResponse(user.preferences, true, 'Preferences updated');
  },

  /**
   * Delete account
   */
  deleteAccount: async userId => {
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
  validate: async code => {
    await delay(500);

    // Simple validation - just check format
    const isValid = /^[A-Z0-9]{8}$/i.test(code);

    if (!isValid) {
      throw new Error('Invalid referral code format');
    }

    console.log('✅ Mock referral code validated:', code);

    return formatResponse(
      {
        valid: true,
        code: code.toUpperCase(),
        reward: 10,
      },
      true,
      'Referral code is valid',
    );
  },

  /**
   * Apply referral code
   */
  apply: async code => {
    await delay(800);

    // ✅ Get current user from SecureStorage
    const currentUser = await SecureStorage.getUserData();

    if (!currentUser || !currentUser._id) {
      console.error('❌ No authenticated user for referral apply');
      throw new Error('User not authenticated');
    }

    // ✅ Use async getUserById
    const user = await usersMock.getUserById(currentUser._id);

    if (!user) {
      console.error('❌ User not found:', currentUser._id);
      throw new Error('User not found');
    }

    // Check if already referred
    if (user.referredBy) {
      throw new Error('Referral code already applied');
    }

    const reward = 10;
    const newBalance = (user.callBalance || 0) + reward;

    // Update user in storage
    const updatedUser = {
      ...currentUser,
      callBalance: newBalance,
      referredBy: 'mock_referrer_id',
    };
    await SecureStorage.saveUserData(updatedUser);

    console.log('✅ Mock referral applied. New balance:', newBalance);

    return formatResponse(
      {
        reward,
        newBalance,
        referrerId: 'mock_referrer_id',
      },
      true,
      'Referral code applied successfully',
    );
  },

  /**
   * Get referral stats
   */
  getStats: async () => {
    await delay(600);

    // ✅ Get current user from SecureStorage
    const currentUser = await SecureStorage.getUserData();

    if (!currentUser || !currentUser._id) {
      console.error('❌ No authenticated user for referral stats');
      throw new Error('User not authenticated');
    }

    // ✅ Use async getUserById
    const user = await usersMock.getUserById(currentUser._id);

    if (!user) {
      console.error('❌ User not found:', currentUser._id);
      throw new Error('User not found');
    }

    console.log('✅ Mock referral stats fetched for user:', user.fullName);

    // Mock stats
    const stats = {
      totalReferrals: 3,
      totalEarned: 30,
      pendingRewards: 0,
      referralCode: user.referralCode || currentUser.referralCode,
      referrals: [
        {
          _id: 'ref_001',
          referredUserId: 'user_002',
          referredUserName: 'Priya Sharma',
          status: 'completed',
          reward: 10,
          createdAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          _id: 'ref_002',
          referredUserId: 'user_003',
          referredUserName: 'Rahul Kumar',
          status: 'completed',
          reward: 10,
          createdAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          _id: 'ref_003',
          referredUserId: 'user_004',
          referredUserName: 'Anjali Verma',
          status: 'completed',
          reward: 10,
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    return formatResponse(stats, true, 'Referral stats retrieved');
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
      'Activity retrieved',
    );
  },

  /**
   * Get activity stats
   */
  stats: async userId => {
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
  create: async claimData => {
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
  getStatus: async claimId => {
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
  get: async () => {
    await delay(600);

    // ✅ Get current user from SecureStorage
    const currentUser = await SecureStorage.getUserData();

    if (!currentUser || !currentUser._id) {
      console.error('❌ No authenticated user for balance fetch');
      throw new Error('User not authenticated');
    }

    // ✅ Use async getUserById
    const user = await usersMock.getUserById(currentUser._id);

    if (!user) {
      console.error('❌ User not found:', currentUser._id);
      throw new Error('User not found');
    }

    console.log('✅ Mock balance fetched:', user.callBalance);

    return formatResponse(
      {
        balance: user.callBalance || 0,
        callBalance: user.callBalance || 0,
      },
      true,
      'Balance retrieved',
    );
  },

  /**
   * Get balance history
   */
  history: async (limit = 20) => {
    await delay(800);

    // ✅ Get current user from SecureStorage
    const currentUser = await SecureStorage.getUserData();

    if (!currentUser || !currentUser._id) {
      console.error('❌ No authenticated user for balance history');
      throw new Error('User not authenticated');
    }

    const history = [
      {
        _id: 'bal_001',
        type: 'earned',
        amount: 10,
        description: 'Referral reward from Priya Sharma',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'bal_002',
        type: 'spent',
        amount: -1,
        description: 'Called vehicle owner',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'bal_003',
        type: 'earned',
        amount: 10,
        description: 'Referral reward from Amit Singh',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    console.log('✅ Mock balance history fetched:', history.length, 'items');

    return formatResponse(
      history.slice(0, limit),
      true,
      'Balance history retrieved',
    );
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
