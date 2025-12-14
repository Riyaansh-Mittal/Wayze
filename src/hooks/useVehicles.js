/**
 * useVehicles Hook
 * Convenient hook for vehicle operations
 * Re-exports VehicleContext hook with helpers
 */

import { useVehicles as useVehiclesContext } from '../contexts/VehicleContext';
import { useMemo, useCallback } from 'react';

/**
 * Vehicles hook with additional helper methods
 */
export const useVehicles = () => {
  const vehicles = useVehiclesContext();

  /**
   * Get vehicles by type
   */
  const getVehiclesByType = useCallback((type) => {
    return vehicles.vehicles.filter((v) => v.vehicleType === type);
  }, [vehicles.vehicles]);

  /**
   * Get vehicle by plate number
   */
  const getVehicleByPlate = useCallback((plateNumber) => {
    return vehicles.vehicles.find(
      (v) => v.plateNumber.toUpperCase() === plateNumber.toUpperCase()
    );
  }, [vehicles.vehicles]);

  /**
   * Check if user has any vehicles
   */
  const hasVehicles = useCallback(() => {
    return vehicles.vehicles.length > 0;
  }, [vehicles.vehicles]);

  /**
   * Get total searches across all vehicles
   * ✅ FIXED: Wrapped in useCallback
   */
  const getTotalSearches = useCallback(() => {
    return vehicles.vehicles.reduce((total, v) => total + v.stats.totalSearches, 0);
  }, [vehicles.vehicles]);

  /**
   * Get total contact requests across all vehicles
   * ✅ FIXED: Wrapped in useCallback
   */
  const getTotalContactRequests = useCallback(() => {
    return vehicles.vehicles.reduce((total, v) => total + v.stats.contactRequests, 0);
  }, [vehicles.vehicles]);

  /**
   * Get most searched vehicle
   * ✅ FIXED: Wrapped in useCallback
   */
  const getMostSearchedVehicle = useCallback(() => {
    if (vehicles.vehicles.length === 0) {return null;}
    return vehicles.vehicles.reduce((max, v) =>
      v.stats.totalSearches > max.stats.totalSearches ? v : max
    );
  }, [vehicles.vehicles]);

  /**
   * Get vehicles summary stats
   */
  const getVehicleStats = useMemo(() => {
    return {
      total: vehicles.vehicles.length,
      totalSearches: getTotalSearches(),
      totalContactRequests: getTotalContactRequests(),
      mostSearched: getMostSearchedVehicle(),
    };
  }, [vehicles.vehicles, getTotalSearches, getTotalContactRequests, getMostSearchedVehicle]);

  return {
    ...vehicles,
    getVehiclesByType,
    getVehicleByPlate,
    hasVehicles,
    getTotalSearches,
    getTotalContactRequests,
    getMostSearchedVehicle,
    getVehicleStats,
  };
};

export default useVehicles;
