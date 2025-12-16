/**
 * Vehicle Type Selector Component
 * Radio button group for vehicle type selection
 * FULLY THEME-AWARE
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const VEHICLE_TYPES = [
  {
    value: '2-wheeler',
    label: '2-Wheeler',
    icon: '🏍️',
    description: 'Bike, Scooter',
  },
  {value: '4-wheeler', label: '4-Wheeler', icon: '🚗', description: 'Car, SUV'},
  {
    value: 'heavy-vehicle',
    label: 'Heavy Vehicle',
    icon: '🚚',
    description: 'Truck, Bus',
  },
];

const VehicleTypeSelector = ({value, onChange, error}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, shadows} = theme;

  return (
    <View style={[styles.container, {marginBottom: spacing.base}]}>
      <Text
        style={[
          styles.label,
          {
            color: colors.textPrimary,
            marginBottom: spacing.sm,
          },
        ]}>
        {t?.('vehicles.form.vehicleType') || 'Vehicle Type'} *
      </Text>

      <View style={[styles.optionsContainer, {gap: spacing.sm}]}>
        {VEHICLE_TYPES.map(type => {
          const isSelected = value === type.value;
          const hasError = error && !value;

          return (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? colors.primaryLight
                    : colors.white,
                  borderWidth: 2,
                  borderColor: hasError
                    ? colors.error
                    : isSelected
                    ? colors.primary
                    : colors.neutralBorder,
                  padding: spacing.base,
                  ...shadows.small,
                },
              ]}
              onPress={() => onChange(type.value)}
              activeOpacity={0.7}>
              <Text style={[styles.optionIcon, {marginRight: spacing.md}]}>
                {type.icon}
              </Text>
              <View style={styles.optionTextContainer}>
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: isSelected ? colors.primary : colors.textPrimary,
                      fontWeight: isSelected ? '600' : '400',
                      marginBottom: spacing.xs,
                    },
                  ]}>
                  {type.label}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    {color: colors.textSecondary},
                  ]}>
                  {type.description}
                </Text>
              </View>
              {isSelected && (
                <View
                  style={[styles.checkmark, {backgroundColor: colors.primary}]}>
                  <Text style={[styles.checkmarkIcon, {color: colors.white}]}>
                    ✓
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: colors.error,
              marginTop: spacing.xs,
            },
          ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles applied dynamically
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    // Gap applied dynamically
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  optionIcon: {
    fontSize: 36,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
  },
  optionDescription: {
    fontSize: 13,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
  },
});

export default VehicleTypeSelector;
