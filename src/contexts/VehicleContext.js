import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {VehiclesService} from '../services/api';
import {useToast} from '../components/common/Toast/ToastProvider';
import {useAuth} from './AuthContext';
import {useTheme} from './ThemeContext';

const VehicleContext = createContext();

export const VehicleProvider = ({children}) => {
  const {user, isAuthenticated} = useAuth();
  const {showSuccess, showError} = useToast();
  const {t} = useTheme();

  const [vehicles, setVehicles] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasLoadedRef = useRef(false);

  /**
   * Load all vehicles from userInfo
   */
  const loadVehicles = useCallback(
    async (showLoader = true) => {
      if (!user) {
        console.log('⏭️ No user, skipping vehicle load');
        return {success: false, error: 'Not authenticated'};
      }

      try {
        if (showLoader) setIsLoading(true);

        console.log('🚗 Loading vehicles for user:', user._id);
        const response = await VehiclesService.list();

        if (response.success) {
          if (!response.data) {
            console.log('📭 No vehicles found');
            setVehicles([]);
            setUserInfo(null);
            return {success: true, data: []};
          }

          setUserInfo(response.data);

          const mappedVehicles = (response.data.vehicle || []).map(v => ({
            _id: v._id,
            plateNumber: v.vehicleRegistration,
            vehicleType: `${v.wheelType}-wheeler`,
            wheelType: v.wheelType,
            isVerified: v.isVerified,
            createdAt: v.createdAt,
            emergencyContact: response.data.emergencyContact,
          }));

          console.log('✅ Vehicles loaded:', mappedVehicles.length);
          setVehicles(mappedVehicles);
          return {success: true, data: mappedVehicles};
        }

        return {success: false};
      } catch (error) {
        console.error('❌ Failed to load vehicles:', error);
        showError(t('toast.vehicle.loadFailed') || 'Failed to load vehicles');
        return {success: false, error: error.message};
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [user, showError, t],
  );

  /**
   * Load vehicles when authenticated
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!hasLoadedRef.current || hasLoadedRef.current !== user._id) {
        console.log('🔄 Initial vehicle load for:', user._id);
        hasLoadedRef.current = user._id;
        loadVehicles();
      }
    } else {
      console.log('🧹 Clearing vehicles (logged out)');
      setVehicles([]);
      setUserInfo(null);
      hasLoadedRef.current = false;
    }
  }, [isAuthenticated, user?._id, loadVehicles, user]);

  /**
   * Refresh vehicles
   */
  const refreshVehicles = useCallback(async () => {
    console.log('🔄 Refreshing vehicles...');
    setIsRefreshing(true);
    await loadVehicles(false);
    setIsRefreshing(false);
  }, [loadVehicles]);

  /**
   * Add new vehicle
   */
  const addVehicle = useCallback(
    async vehicleData => {
      if (!user) {
        return {success: false, error: 'User not authenticated'};
      }

      try {
        setIsLoading(true);
        console.log('➕ Adding vehicle:', vehicleData);

        // ✅ Map to API format
        const apiData = {
          wheelType: vehicleData.wheelType || vehicleData.vehicleType,
          vehicleRegistration:
            vehicleData.plateNumber || vehicleData.vehicleRegistration,
          emergencyContact: vehicleData.emergencyContact,
        };

        // Only add referral code if provided
        if (vehicleData.referralCode) {
          apiData.referralCode = vehicleData.referralCode;
        }

        const result = await VehiclesService.create(apiData);

        if (result.success) {
          console.log('✅ Vehicle added successfully');
          await loadVehicles(false);
          showSuccess(t('toast.vehicle.added'));
        } else {
          console.error('❌ Failed to add vehicle:', result.error);
          showError(result.error || 'Failed to add vehicle');
        }

        return result;
      } catch (error) {
        console.error('❌ Error adding vehicle:', error);
        showError(t('toast.vehicle.addFailed') || 'Failed to add vehicle');
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [user, loadVehicles, showSuccess, showError, t],
  );

  /**
   * Delete vehicle
   */
  const deleteVehicle = useCallback(
    async vehicleId => {
      if (!user) {
        return {success: false, error: 'User not authenticated'};
      }

      try {
        console.log('🗑️ Deleting vehicle:', vehicleId);

        const result = await VehiclesService.delete(vehicleId);

        if (result.success) {
          console.log('✅ Vehicle deleted successfully');
          await loadVehicles(false);
          showSuccess(t('toast.vehicle.deleted') || 'Vehicle deleted');
        } else {
          console.error('❌ Failed to delete vehicle:', result.error);
          showError(t('toast.vehicle.deleteFailed') || 'Failed to delete vehicle');
        }

        return result;
      } catch (error) {
        console.error('❌ Error deleting vehicle:', error);
        showError(t('toast.vehicle.deleteFailed') || 'Failed to delete vehicle');
        return {success: false, error: error.message};
      }
    },
    [user, loadVehicles, showSuccess, showError, t],
  );

  /**
   * Get vehicle by ID
   */
  const getVehicleById = useCallback(
    vehicleId => {
      return vehicles.find(v => v._id === vehicleId);
    },
    [vehicles],
  );

  /**
   * Get vehicle count
   */
  const getVehicleCount = useCallback(() => {
    return vehicles.length;
  }, [vehicles]);

  /**
   * ✅ Get model use count (same as vehicle count)
   * Used to determine if this is the first vehicle
   */
  const getModelUseCount = useCallback(() => {
    return vehicles.length;
  }, [vehicles]);

  /**
   * Get emergency contact
   */
  const getEmergencyContact = useCallback(() => {
    return userInfo?.emergencyContact || '';
  }, [userInfo]);

  /**
   * ✅ Check if user has vehicles
   */
  const hasVehicles = useCallback(() => {
    return vehicles.length > 0;
  }, [vehicles]);

  /**
   * ✅ Get first vehicle (if exists)
   */
  const getFirstVehicle = useCallback(() => {
    return vehicles.length > 0 ? vehicles[0] : null;
  }, [vehicles]);

  const value = {
    // State
    vehicles,
    userInfo,
    selectedVehicle,
    isLoading,
    isRefreshing,

    // Actions
    loadVehicles,
    refreshVehicles,
    addVehicle,
    deleteVehicle,
    setSelectedVehicle,

    // Getters
    getVehicleById,
    getVehicleCount,
    getModelUseCount, // ✅ Added this
    getEmergencyContact,
    hasVehicles, // ✅ Added this
    getFirstVehicle, // ✅ Added this
  };

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within VehicleProvider');
  }
  return context;
};

export default VehicleContext;
