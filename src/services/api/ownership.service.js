/**
 * Ownership Service
 * API calls for vehicle ownership claims
 */

import { request, HTTP_METHODS, ENDPOINTS } from './index';
import { FEATURE_FLAGS } from '../../config/constants';
import { MockOwnershipService } from '../mock';

export const OwnershipService = {
  /**
   * Create ownership claim
   */
  create: async (claimData) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockOwnershipService.create(claimData);
    }
    return request(HTTP_METHODS.POST, ENDPOINTS.ownership.create, claimData);
  },

  /**
   * Get claim status
   */
  getStatus: async (claimId) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return MockOwnershipService.getStatus(claimId);
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.ownership.status(claimId));
  },

  /**
   * Get user's claims
   */
  getUserClaims: async (userId) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      // Mock implementation
      return {
        success: true,
        data: [
          {
            _id: 'claim_001',
            plateNumber: 'MH01AB1234',
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }
    return request(HTTP_METHODS.GET, ENDPOINTS.ownership.userClaims(userId));
  },

  /**
   * Cancel claim
   */
  cancel: async (claimId) => {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return { success: true, message: 'Claim cancelled' };
    }
    return request(HTTP_METHODS.DELETE, ENDPOINTS.ownership.cancel(claimId));
  },
};

export default OwnershipService;
