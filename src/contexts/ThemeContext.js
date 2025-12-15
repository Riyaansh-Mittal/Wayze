/**
 * Theme Context
 * Provides theme (light/dark) and language to entire app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../config/theme';
import { STORAGE_KEYS, LANGUAGES, THEME_MODES } from '../config/constants';

// Import locale files
import en from '../assets/locales/en.json';
import hi from '../assets/locales/hi.json';

const locales = {
  [LANGUAGES.EN]: en,
  [LANGUAGES.HI]: hi,
  // Add Marathi when ready
  // [LANGUAGES.MR]: mr,
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(THEME_MODES.LIGHT);
  const [theme, setTheme] = useState(lightTheme);
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.EN);
  const [strings, setStrings] = useState(locales[LANGUAGES.EN]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [savedTheme, savedLanguage] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
      ]);

      // Load theme
      if (savedTheme === THEME_MODES.DARK) {
        setCurrentTheme(THEME_MODES.DARK);
        setTheme(darkTheme);
      } else {
        setCurrentTheme(THEME_MODES.LIGHT);
        setTheme(lightTheme);
      }

      // Load language
      if (savedLanguage && locales[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
        setStrings(locales[savedLanguage]);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = async () => {
    try {
      const newTheme = currentTheme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      const newThemeConfig = newTheme === THEME_MODES.DARK ? darkTheme : lightTheme;

      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      setCurrentTheme(newTheme);
      setTheme(newThemeConfig);

      return { success: true, theme: newTheme };
    } catch (error) {
      console.error('Failed to toggle theme:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Change app language
   */
  const changeLanguage = async (languageCode) => {
    if (!locales[languageCode]) {
      console.error(`Language ${languageCode} not available`);
      return { success: false, error: 'Language not available' };
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, languageCode);
      setCurrentLanguage(languageCode);
      setStrings(locales[languageCode]);
      return { success: true, language: languageCode };
    } catch (error) {
      console.error('Failed to save language:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Get translated string with interpolation
   * Usage: t('home.greeting', { name: 'John' })
   * Result: "Good morning, John"
   */
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = strings;

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // If value is not a string, return key
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Replace parameters (e.g., {{name}} with actual value)
    let result = value;
    Object.keys(params).forEach((param) => {
      result = result.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });

    return result;
  };

  /**
   * Check if dark mode is active
   */
  const isDarkMode = () => currentTheme === THEME_MODES.DARK;

  const value = {
    theme, // Full theme object with colors, typography, spacing, etc.
    currentTheme, // 'light' or 'dark'
    currentLanguage, // 'en' or 'hi'
    strings, // Full locale object
    t, // Translation function
    changeLanguage, // Function to change language
    toggleTheme, // Function to toggle theme
    isDarkMode, // Function to check if dark mode
    isLoading, // Loading state
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
