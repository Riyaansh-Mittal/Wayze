/**
 * Mock Vehicle Data
 * Sample vehicles for testing
 */

import { generateId } from '../../utils/helpers';

export const MOCK_VEHICLES = [
  {
    _id: 'vehicle_001',
    userId: 'user_001',
    plateNumber: 'MH01AB1234',
    rcNumber: 'MH0120240012345',
    vehicleType: '2-wheeler',
    contactPhone: '9876543210',
    contactMethods: {
      phone: true,
      sms: true,
      whatsapp: false,
      email: false,
    },
    rcPhotoUrl: 'https://example.com/rc/vehicle_001.jpg',
    stats: {
      totalSearches: 12,
      contactRequests: 3,
      lastSearched: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    createdAt: new Date('2024-06-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'vehicle_002',
    userId: 'user_001',
    plateNumber: 'MH02CD5678',
    rcNumber: 'MH0220240056789',
    vehicleType: '4-wheeler',
    contactPhone: '9876543210',
    contactMethods: {
      phone: true,
      sms: false,
      whatsapp: true,
      email: true,
    },
    rcPhotoUrl: 'https://example.com/rc/vehicle_002.jpg',
    stats: {
      totalSearches: 5,
      contactRequests: 1,
      lastSearched: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    createdAt: new Date('2024-07-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'vehicle_003',
    userId: 'user_002',
    plateNumber: 'MH03EF9012',
    rcNumber: 'MH0320240090123',
    vehicleType: '2-wheeler',
    contactPhone: '9123456789',
    contactMethods: {
      phone: true,
      sms: true,
      whatsapp: true,
      email: false,
    },
    rcPhotoUrl: 'https://example.com/rc/vehicle_003.jpg',
    stats: {
      totalSearches: 8,
      contactRequests: 2,
      lastSearched: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    createdAt: new Date('2024-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'vehicle_004',
    userId: 'user_003',
    plateNumber: 'MH12GH3456',
    rcNumber: 'MH1220240034567',
    vehicleType: '3-wheeler',
    contactPhone: '9988776655',
    contactMethods: {
      phone: true,
      sms: false,
      whatsapp: false,
      email: true,
    },
    rcPhotoUrl: 'https://example.com/rc/vehicle_004.jpg',
    stats: {
      totalSearches: 15,
      contactRequests: 4,
      lastSearched: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    },
    createdAt: new Date('2024-08-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'vehicle_005',
    userId: 'user_003',
    plateNumber: 'DL01IJ7890',
    rcNumber: 'DL0120240078901',
    vehicleType: '4-wheeler',
    contactPhone: '9988776655',
    contactMethods: {
      phone: true,
      sms: true,
      whatsapp: true,
      email: true,
    },
    rcPhotoUrl: 'https://example.com/rc/vehicle_005.jpg',
    stats: {
      totalSearches: 3,
      contactRequests: 0,
      lastSearched: null,
    },
    createdAt: new Date('2024-09-05').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get vehicle by ID
 */
export const getVehicleById = (vehicleId) => {
  return MOCK_VEHICLES.find((vehicle) => vehicle._id === vehicleId);
};

/**
 * Get vehicle by plate number
 */
export const getVehicleByPlate = (plateNumber) => {
  return MOCK_VEHICLES.find(
    (vehicle) => vehicle.plateNumber.toUpperCase() === plateNumber.toUpperCase()
  );
};

/**
 * Get vehicles by user ID
 */
export const getVehiclesByUserId = (userId) => {
  return MOCK_VEHICLES.filter((vehicle) => vehicle.userId === userId);
};

/**
 * Create new vehicle (mock)
 */
export const createMockVehicle = (userId, vehicleData) => {
  return {
    _id: generateId(),
    userId,
    plateNumber: vehicleData.plateNumber.toUpperCase(),
    rcNumber: vehicleData.rcNumber,
    vehicleType: vehicleData.vehicleType,
    contactPhone: vehicleData.contactPhone,
    contactMethods: vehicleData.contactMethods,
    rcPhotoUrl: vehicleData.rcPhotoUrl || 'https://example.com/rc/default.jpg',
    stats: {
      totalSearches: 0,
      contactRequests: 0,
      lastSearched: null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export default {
  MOCK_VEHICLES,
  getVehicleById,
  getVehicleByPlate,
  getVehiclesByUserId,
  createMockVehicle,
};
