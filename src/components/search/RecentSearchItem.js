/**
 * Recent Search Item Component
 * Tappable recent search with delete option
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/theme';
import { formatDate } from '../../utils/formatters';

const RecentSearchItem = ({ search, onPress, onDelete }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(search)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🕐</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.plateNumber}>{search.plateNumber}</Text>
        <Text style={styles.timestamp}>
          {search.found ? '✓ Found' : '✕ Not found'} • {formatDate(search.searchedAt, 'relative')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(search.plateNumber)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorder,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutralLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  plateNumber: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '700',
  },
});

export default RecentSearchItem;
