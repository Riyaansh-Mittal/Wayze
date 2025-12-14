/**
 * Vehicle Card Component
 * Swipeable card for vehicle list with actions
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../config/theme';
import { formatDate } from '../../utils/formatters';

const VehicleCard = ({ vehicle, onPress, onEdit, onDelete }) => {
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
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit(vehicle);
          }}
        >
          <Text style={styles.actionIcon}>✏️</Text>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete(vehicle);
          }}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={styles.actionText}>Delete</Text>
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
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'rejected':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
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
        style={styles.card}
        onPress={() => onPress(vehicle)}
        activeOpacity={0.7}
      >
        {/* Vehicle Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getVehicleIcon()}</Text>
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
            {vehicle.verificationStatus === 'verified' && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
          </View>

          <Text style={styles.vehicleType}>
            {vehicle.vehicleType.replace('-', ' ')}
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{vehicle.stats.totalSearches}</Text>
              <Text style={styles.statLabel}>Searches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{vehicle.stats.contactRequests}</Text>
              <Text style={styles.statLabel}>Contacts</Text>
            </View>
            {vehicle.stats.lastSearched && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Last searched</Text>
                  <Text style={styles.statValue}>
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
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.base,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
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
    marginBottom: SPACING.xs,
  },
  plateNumber: {
    ...TYPOGRAPHY.h3,
    flex: 1,
  },
  verifiedBadge: {
    fontSize: 20,
    color: COLORS.success,
  },
  vehicleType: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
    marginBottom: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    marginRight: SPACING.md,
  },
  statValue: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.neutralBorder,
    marginRight: SPACING.md,
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
    marginBottom: SPACING.md,
    marginRight: SPACING.base,
  },
  actionButton: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: SPACING.xs,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default VehicleCard;
