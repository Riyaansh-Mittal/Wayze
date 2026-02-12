/**
 * Search Context - OPTIMIZED
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {SearchService} from '../services/api';
import {useToast} from '../components/common/Toast/ToastProvider';
import {useAuth} from './AuthContext';
import AsyncStorage from '../services/storage/AsyncStorage';
import {STORAGE_KEYS} from '../config/constants';
import {useTheme} from './ThemeContext';

const SearchContext = createContext();

const MAX_RECENT_SEARCHES = 10;

export const SearchProvider = ({children}) => {
  const {user} = useAuth();
  const {showSuccess, showError} = useToast();
  const {t} = useTheme();

  const [searchHistory, setSearchHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // ✅ NEW: Prevent duplicate calls
  const searchInProgress = useRef(null);

  /**
   * Load recent searches from storage on mount
   */
  useEffect(() => {
    if (user) {
      loadRecentSearches();
    }
  }, [user]);

  /**
   * Clear search history when user logs out
   */
  useEffect(() => {
    if (!user) {
      console.log('🚪 User logged out - clearing search history');
      setRecentSearches([]);
      setSearchHistory([]);
      setSearchResult(null);
    }
  }, [user]);

  /**
   * Load recent searches from AsyncStorage
   */
  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.get(STORAGE_KEYS.RECENT_SEARCHES);
      if (stored && Array.isArray(stored)) {
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
   * ✅ FIXED: Remove from useCallback dependencies
   */
  const addToRecentSearches = (plateNumber, found) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.plateNumber !== plateNumber);

      const newSearch = {
        plateNumber: String(plateNumber).toUpperCase(),
        found: Boolean(found),
        timestamp: new Date().toISOString(),
      };

      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updated);

      return updated;
    });
  };

  /**
   * Search for vehicle by plate number
   * ✅ FIXED: Remove dependencies, use ref to prevent duplicates
   */
  const searchVehicle = useCallback(async plateNumber => {
    if (!plateNumber || plateNumber.length < 8) {
      return {success: false, error: 'Invalid plate number'};
    }

    const normalizedPlate = plateNumber.toUpperCase();

    // ✅ NEW: Prevent duplicate calls for same plate
    if (searchInProgress.current === normalizedPlate) {
      console.log('⏭️ Search already in progress for', normalizedPlate);
      return {success: false, error: 'Search already in progress'};
    }

    try {
      searchInProgress.current = normalizedPlate;
      setIsSearching(true);
      console.log('🔍 Searching vehicle:', normalizedPlate);

      const response = await SearchService.searchVehicle(normalizedPlate);

      console.log('📦 Search response:', response);

      if (response.success) {
        const hasVehicleData =
          response.data &&
          (response.data.fullName ||
            response.data.firstName ||
            response.data.ownerName);

        const found = Boolean(hasVehicleData);

        // Add to recent searches
        addToRecentSearches(normalizedPlate, found);

        console.log(
          found
            ? '✅ Vehicle found - Owner: ' +
                response.data.fullName +
                ' (ID: ' +
                response.data.userId +
                ')'
            : 'ℹ️ Vehicle not found (no owner data)',
        );

        return {
          success: true,
          data: {
            found: found,
            vehicle: found
              ? {
                  plateNumber: normalizedPlate,
                  owner: {
                    name: response.data.fullName,
                    photo: response.data.image,
                    userId: response.data.userId,
                  },
                }
              : null,
          },
        };
      }

      if (response.message?.includes('Vehicle not found')) {
        addToRecentSearches(normalizedPlate, false);

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
      searchInProgress.current = null; // ✅ Clear the lock
    }
  }, []); // ✅ Empty deps - function never recreated

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
      showError(
        t('toast.search.clearFailed') || 'Failed to clear recent searches',
      );
      return {success: false, error: error.message};
    }
  }, [showSuccess, showError, t]);

  /**
   * Get search history from API
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
    searchHistory,
    recentSearches,
    searchResult,
    isSearching,
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
