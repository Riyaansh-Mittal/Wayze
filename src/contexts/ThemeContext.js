/**
 * Theme Context
 * Provides theme and language to entire app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../config/theme';
import { STORAGE_KEYS, LANGUAGES } from '../config/constants';

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
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.EN);
  const [strings, setStrings] = useState(locales[LANGUAGES.EN]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage && locales[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
        setStrings(locales[savedLanguage]);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode) => {
    if (!locales[languageCode]) {
      console.error(`Language ${languageCode} not available`);
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, languageCode);
      setCurrentLanguage(languageCode);
      setStrings(locales[languageCode]);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  /**
   * Get translated string with interpolation
   * Usage: t('home.greeting', { name: 'John' })
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

  const value = {
    theme,
    currentLanguage,
    strings,
    t,
    changeLanguage,
    isLoading,
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
