/**
 * Spinner Component
 * Simple loading spinner
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../../../config/theme';

const Spinner = ({
  size = 'large',
  color = COLORS.primary,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} testID={testID} />
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
  style: PropTypes.object,
  testID: PropTypes.string,
};

export default Spinner;
