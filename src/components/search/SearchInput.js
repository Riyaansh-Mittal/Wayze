/**
 * Search Input Component
 * Auto-uppercase plate number search input
 * FULLY THEME-AWARE
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const SearchInput = ({
  value,
  onChangeText,
  onSearch,
  placeholder,
  autoFocus = false,
  error,
}) => {
  const { t, theme } = useTheme();
  const { colors, spacing, shadows } = theme;
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text) => {
    // Auto-uppercase and remove spaces
    const formatted = text.toUpperCase().replace(/\s/g, '');
    onChangeText(formatted);
  };

  const handleClear = () => {
    onChangeText('');
  };

  const inputContainerStyle = [
    styles.inputContainer,
    {
      backgroundColor: colors.white,
      borderWidth: 2,
      borderColor: colors.neutralBorder,
      paddingHorizontal: spacing.md,
      ...shadows.small,
    },
    isFocused && {
      borderColor: colors.primary,
      ...shadows.medium,
    },
    error && {
      borderColor: colors.error,
    },
  ];

  return (
    <View style={[styles.container, { marginBottom: spacing.md }]}>
      <View style={inputContainerStyle}>
        {/* Search Icon */}
        <Text style={[styles.searchIcon, { marginRight: spacing.sm }]}>🔍</Text>

        {/* Input */}
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder || t?.('search.placeholder') || 'Enter vehicle number'}
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus={autoFocus}
          returnKeyType="search"
          onSubmitEditing={onSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Clear Button */}
        {value.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, {
              backgroundColor: colors.neutralLight,
              marginRight: spacing.sm,
            }]}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        )}

        {/* Search Button */}
        {value.length >= 6 && (
          <TouchableOpacity
            style={[styles.searchButton, {
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.base,
              paddingVertical: spacing.sm,
            }]}
            onPress={onSearch}
            activeOpacity={0.7}
          >
            <Text style={[styles.searchButtonText, { color: colors.white }]}>
              {t?.('search.searchButton') || 'Search'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text style={[styles.errorText, {
          color: colors.error,
          marginTop: spacing.xs,
          marginLeft: spacing.xs,
        }]}>
          {error}
        </Text>
      )}

      {/* Helper Text */}
      {!error && (
        <Text style={[styles.helperText, {
          color: colors.textSecondary,
          marginTop: spacing.xs,
          marginLeft: spacing.xs,
        }]}>
          {t?.('search.helperText') || 'Enter complete vehicle registration number'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles applied dynamically
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 56,
  },
  searchIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  searchButton: {
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
  },
  helperText: {
    fontSize: 13,
  },
});

export default SearchInput;
