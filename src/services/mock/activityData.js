/**
 * Mock Activity History Data
 */

import { ACTIVITY_TYPES } from '../../config/constants';

const now = new Date();
const today = new Date(now);
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const fourDaysAgo = new Date(now);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
const oneWeekAgo = new Date(now);
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

export const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: ACTIVITY_TYPES.VEHICLE_SEARCHED,
    searchQuery: 'DL 3C AB 1234',
    timestamp: today.toISOString(),
    details: 'Found owner contact',
  },
  {
    id: '2',
    type: ACTIVITY_TYPES.OWNER_CONTACTED,
    searchQuery: 'MH 02 BX 5678',
    timestamp: today.toISOString(),
    details: 'Called vehicle owner',
  },
  {
    id: '3',
    type: ACTIVITY_TYPES.VEHICLE_ADDED,
    searchQuery: 'KA 05 MN 9012',
    timestamp: yesterday.toISOString(),
    details: 'Added new vehicle',
  },
  {
    id: '4',
    type: ACTIVITY_TYPES.VEHICLE_SEARCHED,
    searchQuery: 'GJ 01 CD 3456',
    timestamp: yesterday.toISOString(),
    details: 'No results found',
  },
  {
    id: '5',
    type: ACTIVITY_TYPES.VEHICLE_EDITED,
    searchQuery: 'TN 07 EF 7890',
    timestamp: twoDaysAgo.toISOString(),
    details: 'Updated vehicle details',
  },
  {
    id: '6',
    type: ACTIVITY_TYPES.VEHICLE_SEARCHED,
    searchQuery: 'UP 14 GH 2345',
    timestamp: twoDaysAgo.toISOString(),
    details: 'Found owner contact',
  },
  {
    id: '7',
    type: ACTIVITY_TYPES.OWNER_CONTACTED,
    searchQuery: 'RJ 08 IJ 6789',
    timestamp: fourDaysAgo.toISOString(),
    details: 'Called vehicle owner',
  },
  {
    id: '8',
    type: ACTIVITY_TYPES.VEHICLE_ADDED,
    searchQuery: 'WB 20 KL 0123',
    timestamp: fourDaysAgo.toISOString(),
    details: 'Added new vehicle',
  },
  {
    id: '9',
    type: ACTIVITY_TYPES.VEHICLE_SEARCHED,
    searchQuery: 'HR 26 MN 4567',
    timestamp: oneWeekAgo.toISOString(),
    details: 'Found owner contact',
  },
  {
    id: '10',
    type: ACTIVITY_TYPES.VEHICLE_SEARCHED,
    searchQuery: 'PB 03 OP 8901',
    timestamp: oneWeekAgo.toISOString(),
    details: 'No results found',
  },
];

export const getMockActivities = (filter = 'all', limit = 20) => {
  let filtered = MOCK_ACTIVITIES;

  if (filter !== 'all') {
    filtered = MOCK_ACTIVITIES.filter((activity) => {
      if (filter === 'vehicles') {
        return [ACTIVITY_TYPES.VEHICLE_ADDED, ACTIVITY_TYPES.VEHICLE_EDITED, ACTIVITY_TYPES.VEHICLE_DELETED].includes(activity.type);
      }
      if (filter === 'searches') {
        return activity.type === ACTIVITY_TYPES.VEHICLE_SEARCHED;
      }
      if (filter === 'contacts') {
        return activity.type === ACTIVITY_TYPES.OWNER_CONTACTED;
      }
      return true;
    });
  }

  return filtered.slice(0, limit);
};
