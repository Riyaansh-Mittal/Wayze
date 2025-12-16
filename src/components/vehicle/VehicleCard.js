/**
 * Vehicle Card Component
 * Swipeable card for vehicle list with actions
 * FULLY THEME-AWARE
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDate } from '../../utils/formatters';

const VehicleCard = ({ vehicle, onPress, onEdit, onDelete }) => {
  const { t, theme } = useTheme();
  const { colors, spacing, shadows } = theme;
  const swipeableRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-160, 0],
      outputRange: [0, 160],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.actionsContainer,
          {
            marginBottom: spacing.md,
            marginRight: spacing.base,
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, {
            backgroundColor: colors.primary,
            marginLeft: spacing.xs,
          }]}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit(vehicle);
          }}
        >
          <Text style={[styles.actionIcon, { marginBottom: spacing.xs }]}>✏️</Text>
          <Text style={[styles.actionText, { color: colors.white }]}>
            {t?.('common.edit') || 'Edit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {
            backgroundColor: colors.error,
            marginLeft: spacing.xs,
          }]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete(vehicle);
          }}
        >
          <Text style={[styles.actionIcon, { marginBottom: spacing.xs }]}>🗑️</Text>
          <Text style={[styles.actionText, { color: colors.white }]}>
            {t?.('common.delete') || 'Delete'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getVehicleIcon = () => {
    switch (vehicle.vehicleType) {
      case '2-wheeler':
        return '🏍️';
      case '4-wheeler':
        return '🚗';
      case 'heavy-vehicle':
        return '🚚';
      default:
        return '🚗';
    }
  };

  const getStatusColor = () => {
    switch (vehicle.verificationStatus) {
      case 'verified':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'rejected':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.white,
            padding: spacing.base,
            marginHorizontal: spacing.base,
            marginBottom: spacing.md,
            ...shadows.small,
          },
        ]}
        onPress={() => onPress(vehicle)}
        activeOpacity={0.7}
      >
        {/* Vehicle Icon */}
        <View style={[styles.iconContainer, {
          backgroundColor: colors.primaryLight,
          marginRight: spacing.base,
        }]}>
          <Text style={styles.icon}>{getVehicleIcon()}</Text>
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoContainer}>
          <View style={[styles.headerRow, { marginBottom: spacing.xs }]}>
            <Text style={[styles.plateNumber, { color: colors.textPrimary }]}>
              {vehicle.plateNumber}
            </Text>
            {vehicle.verificationStatus === 'verified' && (
              <Text style={[styles.verifiedBadge, { color: colors.success }]}>✓</Text>
            )}
          </View>

          <Text style={[styles.vehicleType, {
            color: colors.textSecondary,
            marginBottom: spacing.sm,
          }]}>
            {vehicle.vehicleType.replace('-', ' ')}
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.stat, { marginRight: spacing.md }]}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {vehicle.stats.totalSearches}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t?.('vehicles.searches') || 'Searches'}
              </Text>
            </View>
            <View style={[styles.statDivider, {
              backgroundColor: colors.neutralBorder,
              marginRight: spacing.md,
            }]} />
            <View style={[styles.stat, { marginRight: spacing.md }]}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {vehicle.stats.contactRequests}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t?.('vehicles.contacts') || 'Contacts'}
              </Text>
            </View>
            {vehicle.stats.lastSearched && (
              <>
                <View style={[styles.statDivider, {
                  backgroundColor: colors.neutralBorder,
                  marginRight: spacing.md,
                }]} />
                <View style={styles.stat}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t?.('vehicles.lastSearched') || 'Last searched'}
                  </Text>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {formatDate(vehicle.stats.lastSearched, 'relative')}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Status Indicator */}
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  verifiedBadge: {
    fontSize: 20,
  },
  vehicleType: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    // Styles applied dynamically
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 20,
  },
  statusIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default VehicleCard;
