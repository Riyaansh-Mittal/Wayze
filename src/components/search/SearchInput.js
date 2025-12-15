/**
 * Search Input Component
 * Auto-uppercase plate number search input
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../config/theme';

const SearchInput = ({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Enter vehicle number',
  autoFocus = false,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text) => {
    // Auto-uppercase and remove spaces
    const formatted = text.toUpperCase().replace(/\s/g, '');
    onChangeText(formatted);
  };

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {/* Search Icon */}
        <Text style={styles.searchIcon}>🔍</Text>

        {/* Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
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
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}

        {/* Search Button */}
        {value.length >= 6 && (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={onSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Helper Text */}
      {!error && (
        <Text style={styles.helperText}>
          Enter complete vehicle registration number
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.neutralBorder,
    paddingHorizontal: SPACING.md,
    height: 56,
    ...SHADOWS.small,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.neutralLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  searchButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default SearchInput;
