/**
 * Search Context
 * Manages search history and results cache
 * UPDATED: Uses API v1.1.0 search endpoint
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {SearchService} from '../services/api';
import {useToast} from '../components/common/Toast/ToastProvider';
import {useAuth} from './AuthContext';
import AsyncStorage from '../services/storage/AsyncStorage';
import {STORAGE_KEYS} from '../config/constants';
import { useTheme } from './ThemeContext';

const SearchContext = createContext();

const MAX_RECENT_SEARCHES = 10;

export const SearchProvider = ({children}) => {
  const {user} = useAuth();
  const {showSuccess, showError} = useToast();

  const [searchHistory, setSearchHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const {t} = useTheme();

  /**
   * Load recent searches from storage on mount
   */
  useEffect(() => {
    if (user) {
      // ✅ Only load if user is logged in
      loadRecentSearches();
    }
  }, [user]); // ✅ Re-run when user changes

  /**
   * ✅ NEW: Clear search history when user logs out
   */
  useEffect(() => {
    if (!user) {
      // User logged out - clear everything
      console.log('🚪 User logged out - clearing search history');
      setRecentSearches([]);
      setSearchHistory([]);
      setSearchResult(null);
      // Storage will be cleared by AuthContext.logout()
    }
  }, [user]);

  /**
   * Load recent searches from AsyncStorage
   */
  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.get(STORAGE_KEYS.RECENT_SEARCHES);
      if (stored && Array.isArray(stored)) {
        // ✅ Validate and clean each item
        const cleaned = stored
          .filter(
            item =>
              item &&
              typeof item === 'object' &&
              typeof item.plateNumber === 'string',
          )
          .map(item => ({
            plateNumber: String(item.plateNumber),
            found: Boolean(item.found),
            timestamp:
              typeof item.timestamp === 'string'
                ? item.timestamp
                : new Date().toISOString(),
          }));

        setRecentSearches(cleaned);
        console.log('✅ Loaded', cleaned.length, 'recent searches');
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      // Clear corrupt data
      await AsyncStorage.remove(STORAGE_KEYS.RECENT_SEARCHES);
    }
  };

  /**
   * Save recent searches to AsyncStorage
   */
  const saveRecentSearches = async searches => {
    try {
      await AsyncStorage.save(STORAGE_KEYS.RECENT_SEARCHES, searches);
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  };

  /**
   * Add plate to recent searches
   */
  const addToRecentSearches = useCallback((plateNumber, found) => {
    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.plateNumber !== plateNumber);

      // ✅ Create clean object with primitives only
      const newSearch = {
        plateNumber: String(plateNumber).toUpperCase(), // ✅ Ensure string
        found: Boolean(found), // ✅ Ensure boolean
        timestamp: new Date().toISOString(), // ✅ Ensure string (not Date object)
      };

      // Add to beginning
      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // Save to storage
      saveRecentSearches(updated);

      return updated;
    });
  }, []);

  /**
   * Search for vehicle by plate number
   * POST /api/user/search-vehicle
   */
  const searchVehicle = useCallback(
    async plateNumber => {
      if (!plateNumber || plateNumber.length < 8) {
        return {success: false, error: 'Invalid plate number'};
      }

      try {
        setIsSearching(true);
        console.log('🔍 Searching vehicle:', plateNumber);

        const response = await SearchService.searchVehicle(plateNumber);

        console.log('📦 Search response:', response);

        // ✅ UPDATED: Check if vehicle data exists and extract userId
        if (response.success) {
          const hasVehicleData =
            response.data &&
            (response.data.fullName ||
              response.data.firstName ||
              response.data.ownerName);

          const found = Boolean(hasVehicleData);

          // Add to recent searches
          addToRecentSearches(plateNumber.toUpperCase(), found);

          console.log(
            found
              ? '✅ Vehicle found - Owner: ' +
                  response.data.fullName +
                  ' (ID: ' +
                  response.data.userId +
                  ')'
              : 'ℹ️ Vehicle not found (no owner data)',
          );

          // ✅ UPDATED: Include userId in vehicle data
          return {
            success: true,
            data: {
              found: found,
              vehicle: found
                ? {
                    plateNumber: plateNumber.toUpperCase(),
                    owner: {
                      name: response.data.fullName,
                      photo: response.data.image,
                      userId: response.data.userId, // ✅ ADD THIS
                    },
                  }
                : null,
            },
          };
        }

        // Handle "Vehicle not found"
        if (response.message?.includes('Vehicle not found')) {
          addToRecentSearches(plateNumber.toUpperCase(), false);

          return {
            success: true,
            data: {
              found: false,
              vehicle: null,
            },
          };
        }

        return {success: false, error: response.message};
      } catch (error) {
        console.error('❌ Search failed:', error);
        return {
          success: false,
          error: error.message || 'Failed to search vehicle',
        };
      } finally {
        setIsSearching(false);
      }
    },
    [addToRecentSearches],
  );

  /**
   * Remove single search from recent
   */
  const removeRecentSearch = useCallback(
    plateNumber => {
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.plateNumber !== plateNumber);
        saveRecentSearches(filtered);
        return filtered;
      });
      showSuccess(t('toast.search.removed') || 'Search removed from recent');
    },
    [showSuccess, t],
  );

  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.remove(STORAGE_KEYS.RECENT_SEARCHES);
      showSuccess(t('toast.search.cleared') || 'Recent searches cleared');
      return {success: true};
    } catch (error) {
      showError(t('toast.search.clearFailed') || 'Failed to clear recent searches');
      return {success: false, error: error.message};
    }
  }, [showSuccess, showError, t]);

  /**
   * Get search history from API
   * NOTE: This endpoint doesn't exist yet in the API
   * Keeping for future implementation
   */
  const getSearchHistory = useCallback(
    async (limit = 20) => {
      if (!user) {
        return {success: false, error: 'Not authenticated'};
      }

      try {
        const response = await SearchService.getHistory(limit);

        if (response.success) {
          setSearchHistory(response.data);
          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        console.log('Search history endpoint not available yet');
        return {success: false, error: error.message};
      }
    },
    [user],
  );

  /**
   * Clear search result
   */
  const clearSearchResult = useCallback(() => {
    setSearchResult(null);
  }, []);

  const value = {
    // State
    searchHistory,
    recentSearches,
    searchResult,
    isSearching,

    // Methods
    searchVehicle,
    clearRecentSearches,
    removeRecentSearch,
    getSearchHistory,
    clearSearchResult,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export default SearchContext;
