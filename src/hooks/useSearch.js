/**
 * useSearch Hook
 * Convenient hook for search operations
 * Re-exports SearchContext hook with helpers
 */

import { useSearch as useSearchContext } from '../contexts/SearchContext';
import { validatePlateNumber } from '../utils/validators';

/**
 * Search hook with additional helper methods
 */
export const useSearch = () => {
  const search = useSearchContext();

  /**
   * Search with validation
   */
  const searchWithValidation = async (plateNumber) => {
    // Validate plate number first
    const validation = validatePlateNumber(plateNumber);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.message,
      };
    }

    return await search.searchVehicle(validation.value);
  };

  /**
   * Get recent search by plate
   */
  const getRecentSearch = (plateNumber) => {
    return search.recentSearches.find(
      (s) => s.plateNumber.toUpperCase() === plateNumber.toUpperCase()
    );
  };

  /**
   * Check if plate was searched recently
   */
  const wasSearchedRecently = (plateNumber) => {
    return !!getRecentSearch(plateNumber);
  };

  /**
   * Get successful searches count
   */
  const getSuccessfulSearchesCount = () => {
    return search.recentSearches.filter((s) => s.found).length;
  };

  /**
   * Get failed searches count
   */
  const getFailedSearchesCount = () => {
    return search.recentSearches.filter((s) => !s.found).length;
  };

  /**
   * Check if currently viewing a result
   */
  const hasActiveResult = () => {
    return search.searchResult !== null;
  };

  /**
   * Check if result shows vehicle found
   */
  const isResultFound = () => {
    return search.searchResult?.found || false;
  };

  return {
    ...search,
    searchWithValidation,
    getRecentSearch,
    wasSearchedRecently,
    getSuccessfulSearchesCount,
    getFailedSearchesCount,
    hasActiveResult,
    isResultFound,
  };
};

export default useSearch;
