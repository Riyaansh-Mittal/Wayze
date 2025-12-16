/**
 * Recent Search Item Component
 * Tappable recent search with delete option
 * FULLY THEME-AWARE
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDate } from '../../utils/formatters';

const RecentSearchItem = ({ search, onPress, onDelete }) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.white,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.base,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutralBorder,
        }
      ]}
      onPress={() => onPress(search)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        {
          backgroundColor: colors.neutralLight,
          marginRight: spacing.md,
        }
      ]}>
        <Text style={styles.icon}>🕐</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.plateNumber, {
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        }]}>
          {search.plateNumber}
        </Text>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {search.found ? '✓ Found' : '✕ Not found'} • {formatDate(search.searchedAt, 'relative')}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.errorLight }]}
        onPress={() => onDelete(search.plateNumber)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.deleteIcon, { color: colors.error }]}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 13,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RecentSearchItem;
