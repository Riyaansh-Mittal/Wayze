/**
 * Search Context
 * Manages search history and results cache
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

const SearchContext = createContext();

const MAX_RECENT_SEARCHES = 10;

export const SearchProvider = ({children}) => {
  const {user} = useAuth();
  const {showSuccess, showError} = useToast();

  const [searchHistory, setSearchHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Load recent searches from storage on mount
   */
  useEffect(() => {
    loadRecentSearches();
  }, []);

  /**
   * Load recent searches from AsyncStorage
   */
  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.get(STORAGE_KEYS.RECENT_SEARCHES);
      if (stored && Array.isArray(stored)) {
        setRecentSearches(stored);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
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
   * ✅ Fixed - Moved before searchVehicle to avoid circular dependency
   */
  const addToRecentSearches = useCallback((plateNumber, found) => {
    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.plateNumber !== plateNumber);

      // Add to beginning
      const updated = [
        {
          plateNumber,
          found,
          timestamp: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, MAX_RECENT_SEARCHES);

      // Save to storage
      saveRecentSearches(updated);

      return updated;
    });
  }, []); // ✅ No dependencies needed

  /**
   * Search for vehicle by plate number
   */
  const searchVehicle = useCallback(
    async plateNumber => {
      try {
        setIsSearching(true);
        setSearchResult(null);

        const response = await SearchService.searchVehicle(plateNumber);

        if (response.success) {
          setSearchResult(response.data);

          // Add to recent searches
          addToRecentSearches(plateNumber, response.data.found);

          if (response.data.found) {
            showSuccess('Vehicle found!');
          } else {
            showError('Vehicle not found in our network');
          }

          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        showError('Search failed. Please try again.');
        return {success: false, error: error.message};
      } finally {
        setIsSearching(false);
      }
    },
    [showSuccess, showError, addToRecentSearches], // ✅ Fixed - addToRecentSearches now stable
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
      showSuccess('Search removed');
    },
    [showSuccess],
  );

  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.remove(STORAGE_KEYS.RECENT_SEARCHES);
      showSuccess('Recent searches cleared');
      return {success: true};
    } catch (error) {
      showError('Failed to clear searches');
      return {success: false, error: error.message};
    }
  }, [showSuccess, showError]);

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
        showError('Failed to load search history');
        return {success: false, error: error.message};
      }
    },
    [user, showError],
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
    // ✅ Removed logContact - now handled by ContactService directly in modals
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
