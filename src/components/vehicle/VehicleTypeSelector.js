/**
 * Vehicle Type Selector Component
 * Radio button group for vehicle type selection
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../config/theme';

const VEHICLE_TYPES = [
  { value: '2-wheeler', label: '2-Wheeler', icon: '🏍️', description: 'Bike, Scooter' },
  { value: '4-wheeler', label: '4-Wheeler', icon: '🚗', description: 'Car, SUV' },
  { value: 'heavy-vehicle', label: 'Heavy Vehicle', icon: '🚚', description: 'Truck, Bus' },
];

const VehicleTypeSelector = ({ value, onChange, error }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Vehicle Type *</Text>

      <View style={styles.optionsContainer}>
        {VEHICLE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.option,
              value === type.value && styles.optionSelected,
              error && !value && styles.optionError,
            ]}
            onPress={() => onChange(type.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionIcon}>{type.icon}</Text>
            <View style={styles.optionTextContainer}>
              <Text
                style={[
                  styles.optionLabel,
                  value === type.value && styles.optionLabelSelected,
                ]}
              >
                {type.label}
              </Text>
              <Text style={styles.optionDescription}>{type.description}</Text>
            </View>
            {value === type.value && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkIcon}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.sm,
  },
  optionsContainer: {
    gap: SPACING.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.neutralBorder,
    borderRadius: 12,
    padding: SPACING.base,
    ...SHADOWS.small,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionError: {
    borderColor: COLORS.error,
  },
  optionIcon: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  optionLabelSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default VehicleTypeSelector;
