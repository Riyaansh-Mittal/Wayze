/**
 * Hooks Index
 * Central export for all custom hooks
 */

export { useAuth } from './useAuth';
export { useVehicles } from './useVehicles';
export { useSearch } from './useSearch';
export { useReferral } from './useReferral';
export { useBalance } from './useBalance';
export { useDebounce, useDebouncedCallback } from './useDebounce';

// Re-export context hooks
export { useUser } from '../contexts/UserContext';

// Re-export theme hook
export { useTheme } from '../contexts/ThemeContext';

// Re-export toast hook
export { useToast } from '../components/common/Toast/ToastProvider';
