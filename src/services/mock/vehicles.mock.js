/**
 * Mock Vehicle Data
 * UPDATED: API v1.1.0 format (userInfo structure)
 */

import {generateId} from '../../utils/helpers';

/**
 * Mock UserInfo Documents (matches API structure)
 */
export const MOCK_USER_INFO = [
  {
    _id: 'userinfo_001',
    userId: 'user_001',
    emergencyContact: '+919876543210',
    vehicle: [
      {
        _id: 'vehicle_001',
        wheelType: 2,
        vehicleRegistration: 'MH01AB1234',
        isVerified: true,
        createdAt: new Date('2024-06-15').toISOString(),
      },
      {
        _id: 'vehicle_002',
        wheelType: 4,
        vehicleRegistration: 'MH02CD5678',
        isVerified: true,
        createdAt: new Date('2024-07-01').toISOString(),
      },
    ],
    createdAt: new Date('2024-06-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'userinfo_002',
    userId: 'user_002',
    emergencyContact: '+919123456789',
    vehicle: [
      {
        _id: 'vehicle_003',
        wheelType: 2,
        vehicleRegistration: 'MH03EF9012',
        isVerified: true,
        createdAt: new Date('2024-07-20').toISOString(),
      },
    ],
    createdAt: new Date('2024-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'userinfo_003',
    userId: 'user_003',
    emergencyContact: '+919988776655',
    vehicle: [
      {
        _id: 'vehicle_004',
        wheelType: 3,
        vehicleRegistration: 'MH12GH3456',
        isVerified: true,
        createdAt: new Date('2024-08-10').toISOString(),
      },
      {
        _id: 'vehicle_005',
        wheelType: 4,
        vehicleRegistration: 'DL01IJ7890',
        isVerified: true,
        createdAt: new Date('2024-09-05').toISOString(),
      },
    ],
    createdAt: new Date('2024-08-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get userInfo by userId
 */
export const getUserInfoByUserId = userId => {
  return MOCK_USER_INFO.find(info => info.userId === userId);
};

/**
 * Get vehicle by ID (search across all userInfo)
 */
export const getVehicleById = vehicleId => {
  for (const userInfo of MOCK_USER_INFO) {
    const vehicle = userInfo.vehicle.find(v => v._id === vehicleId);
    if (vehicle) {
      return {
        ...vehicle,
        emergencyContact: userInfo.emergencyContact,
        userInfoId: userInfo._id,
      };
    }
  }
  return null;
};

/**
 * Get vehicle by plate number (search across all userInfo)
 */
export const getVehicleByPlate = plateNumber => {
  const upperPlate = plateNumber.toUpperCase().trim();

  for (const userInfo of MOCK_USER_INFO) {
    const vehicle = userInfo.vehicle.find(
      v => v.vehicleRegistration.toUpperCase() === upperPlate,
    );
    if (vehicle) {
      return {
        userInfo,
        vehicle,
      };
    }
  }
  return null;
};

/**
 * Create new vehicle for user
 */
export const addVehicleToUserInfo = (userId, vehicleData) => {
  let userInfo = getUserInfoByUserId(userId);

  const newVehicle = {
    _id: generateId(),
    wheelType: vehicleData.wheelType,
    vehicleRegistration: vehicleData.vehicleRegistration.toUpperCase().trim(),
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  // If userInfo doesn't exist, create it
  if (!userInfo) {
    userInfo = {
      _id: generateId(),
      userId: userId,
      emergencyContact: vehicleData.emergencyContact || '',
      vehicle: [newVehicle],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_USER_INFO.push(userInfo);
  } else {
    // Update existing userInfo
    userInfo.vehicle.push(newVehicle);
    if (vehicleData.emergencyContact) {
      userInfo.emergencyContact = vehicleData.emergencyContact;
    }
    userInfo.updatedAt = new Date().toISOString();
  }

  return userInfo;
};

/**
 * Delete vehicle from userInfo
 */
export const deleteVehicleFromUserInfo = (userId, vehicleId) => {
  const userInfo = getUserInfoByUserId(userId);

  if (!userInfo) {
    return null;
  }

  const vehicleIndex = userInfo.vehicle.findIndex(v => v._id === vehicleId);

  if (vehicleIndex === -1) {
    return null;
  }

  userInfo.vehicle.splice(vehicleIndex, 1);
  userInfo.updatedAt = new Date().toISOString();

  return userInfo;
};

export default {
  MOCK_USER_INFO,
  getUserInfoByUserId,
  getVehicleById,
  getVehicleByPlate,
  addVehicleToUserInfo,
  deleteVehicleFromUserInfo,
};
