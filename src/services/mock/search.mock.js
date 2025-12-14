/**
 * Mock Search Service
 * Simulates vehicle search API responses
 */

import { delay } from '../../utils/helpers';
import { formatResponse } from '../../utils/error.handler';
import { getVehicleByPlate } from './vehicles.mock';
import { getUserById } from './users.mock';
import { maskName } from '../../utils/formatters';

/**
 * Mock vehicle search
 */
export const mockSearchVehicle = async (plateNumber) => {
  // Simulate API delay
  await delay(1200);

  const vehicle = getVehicleByPlate(plateNumber);

  if (!vehicle) {
    return formatResponse(
      {
        found: false,
        vehicle: null,
        message: 'Vehicle not found in our network',
      },
      true,
      'Search completed'
    );
  }

  // Get owner information
  const owner = getUserById(vehicle.userId);

  if (!owner) {
    return formatResponse(
      {
        found: false,
        vehicle: null,
        message: 'Vehicle owner information not available',
      },
      true,
      'Search completed'
    );
  }

  // Update search stats (in real app, this would be done on backend)
  vehicle.stats.totalSearches += 1;
  vehicle.stats.lastSearched = new Date().toISOString();

  // Build search result
  const searchResult = {
    found: true,
    vehicle: {
      vehicleId: vehicle._id,
      plateNumber: vehicle.plateNumber,
      vehicleType: vehicle.vehicleType,
      registeredAt: vehicle.createdAt,
      owner: {
        userId: owner._id,
        name: maskName(owner.fullName), // Mask for privacy
        photo: owner.photo,
        memberSince: owner.createdAt,
        verified: owner.verification.email && owner.verification.phone,
        contactMethods: vehicle.contactMethods,
      },
    },
    message: 'Vehicle found',
  };

  return formatResponse(searchResult, true, 'Search completed');
};

/**
 * Mock search history
 */
export const mockSearchHistory = async (userId, limit = 20) => {
  await delay(800);

  // Generate mock search history
  const mockHistory = [
    {
      _id: 'search_001',
      userId,
      plateNumber: 'MH01AB1234',
      found: true,
      vehicleType: '2-wheeler',
      searchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'search_002',
      userId,
      plateNumber: 'MH12XY9876',
      found: false,
      vehicleType: null,
      searchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'search_003',
      userId,
      plateNumber: 'DL01IJ7890',
      found: true,
      vehicleType: '4-wheeler',
      searchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'search_004',
      userId,
      plateNumber: 'MH03EF9012',
      found: true,
      vehicleType: '2-wheeler',
      searchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'search_005',
      userId,
      plateNumber: 'KA05PQ3456',
      found: false,
      vehicleType: null,
      searchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return formatResponse(
    mockHistory.slice(0, limit),
    true,
    'Search history retrieved'
  );
};

/**
 * Mock log contact action
 */
export const mockLogContact = async (contactData) => {
  await delay(600);

  const logEntry = {
    _id: `contact_${Date.now()}`,
    ...contactData,
    timestamp: new Date().toISOString(),
  };

  return formatResponse(
    logEntry,
    true,
    'Contact logged successfully'
  );
};

export default {
  mockSearchVehicle,
  mockSearchHistory,
  mockLogContact,
};
