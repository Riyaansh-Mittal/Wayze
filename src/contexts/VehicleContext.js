/**
 * Vehicle Context
 * Manages vehicle list and CRUD operations
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { VehiclesService } from '../services/api';
import { useToast } from '../components/common/Toast/ToastProvider';
import { useAuth } from './AuthContext';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Load all vehicles
   * ✅ Moved before useEffect to avoid dependency issues
   */
  const loadVehicles = useCallback(async (showLoader = true) => {
    if (!user) {return { success: false, error: 'Not authenticated' };}

    try {
      if (showLoader) {setIsLoading(true);}

      const response = await VehiclesService.list(user._id);

      if (response.success) {
        setVehicles(response.data);
        return { success: true, data: response.data };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to load vehicles');
      return { success: false, error: error.message };
    } finally {
      if (showLoader) {setIsLoading(false);}
    }
  }, [user, showError]); // ✅ Only depends on user and showError

  /**
   * Load vehicles when authenticated
   * ✅ Fixed - Now loadVehicles is stable
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      loadVehicles();
    } else {
      setVehicles([]);
    }
  }, [isAuthenticated, user, loadVehicles]); // ✅ Safe now

  /**
   * Refresh vehicles (pull-to-refresh)
   */
  const refreshVehicles = useCallback(async () => {
    setIsRefreshing(true);
    await loadVehicles(false);
    setIsRefreshing(false);
  }, [loadVehicles]);

  /**
   * Add new vehicle
   */
  const addVehicle = useCallback(async (vehicleData) => {
    if (!user) {return { success: false, error: 'Not authenticated' };}

    try {
      setIsLoading(true);
      const response = await VehiclesService.create(user._id, vehicleData);

      if (response.success) {
        setVehicles((prev) => [...prev, response.data]);
        showSuccess('Vehicle added successfully!');
        return { success: true, data: response.data };
      }

      return { success: false };
    } catch (error) {
      showError(error.message || 'Failed to add vehicle');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user, showSuccess, showError]);

  /**
   * Get vehicle details
   */
  const getVehicleDetails = useCallback(async (vehicleId) => {
    try {
      setIsLoading(true);
      const response = await VehiclesService.details(vehicleId);

      if (response.success) {
        setSelectedVehicle(response.data);
        return { success: true, data: response.data };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to load vehicle details');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  /**
   * Update vehicle
   */
  const updateVehicle = useCallback(async (vehicleId, updates) => {
    try {
      setIsLoading(true);
      const response = await VehiclesService.update(vehicleId, updates);

      if (response.success) {
        // Update in list
        setVehicles((prev) =>
          prev.map((v) => (v._id === vehicleId ? response.data : v))
        );

        // Update selected if it's the same vehicle
        if (selectedVehicle?._id === vehicleId) {
          setSelectedVehicle(response.data);
        }

        showSuccess('Vehicle updated successfully');
        return { success: true, data: response.data };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to update vehicle');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [selectedVehicle, showSuccess, showError]);

  /**
   * Delete vehicle
   */
  const deleteVehicle = useCallback(async (vehicleId) => {
    try {
      setIsLoading(true);
      const response = await VehiclesService.delete(vehicleId);

      if (response.success) {
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));

        if (selectedVehicle?._id === vehicleId) {
          setSelectedVehicle(null);
        }

        showSuccess('Vehicle deleted successfully');
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to delete vehicle');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [selectedVehicle, showSuccess, showError]);

  /**
   * Check if plate number exists
   */
  const checkPlateExists = useCallback(async (plateNumber) => {
    try {
      const response = await VehiclesService.checkPlate(plateNumber);
      return {
        success: true,
        exists: response.data.exists,
        vehicle: response.data.vehicle,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Get vehicle count
   */
  const getVehicleCount = useCallback(() => {
    return vehicles.length;
  }, [vehicles]);

  /**
   * Select vehicle
   */
  const selectVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const value = {
    // State
    vehicles,
    selectedVehicle,
    isLoading,
    isRefreshing,

    // Methods
    loadVehicles,
    refreshVehicles,
    addVehicle,
    getVehicleDetails,
    updateVehicle,
    deleteVehicle,
    checkPlateExists,
    getVehicleCount,
    selectVehicle,
    clearSelection,
  };

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within VehicleProvider');
  }
  return context;
};

export default VehicleContext;
