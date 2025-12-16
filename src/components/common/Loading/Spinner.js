/**
 * Spinner Component
 * Simple loading spinner
 * FULLY THEME-AWARE
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

const Spinner = ({ size = 'small', color, style, testID }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const spinnerColor = color || colors.primary;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ActivityIndicator size={size} color={spinnerColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default Spinner;
