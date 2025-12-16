/**
 * Vehicle Icon Component
 * Replaces emoji icons with SVG icons
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {useTheme} from '../../../contexts/ThemeContext';

// Import SVG icons
import {BikeIcon, AutoIcon, CarIcon} from '../../../assets/icons';

const VEHICLE_ICONS = {
  '2-wheeler': BikeIcon,
  '3-wheeler': AutoIcon,
  '4-wheeler': CarIcon,
};

const VehicleIcon = ({type, size = 32, color, style, ...props}) => {
  const {theme} = useTheme();
  const {colors} = theme;

  // Get icon component based on vehicle type
  const IconComponent = VEHICLE_ICONS[type] || CarIcon;

  // Use provided color or default to theme primary
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.container, style]}>
      <IconComponent width={size} height={size} fill={iconColor} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

VehicleIcon.propTypes = {
  type: PropTypes.oneOf(['2-wheeler', '3-wheeler', '4-wheeler']).isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object,
};

export default VehicleIcon;
