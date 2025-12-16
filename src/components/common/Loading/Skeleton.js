/**
 * Skeleton Component
 * Animated placeholder for loading content
 * FULLY THEME-AWARE
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.neutralLight,
          opacity,
        },
        style,
      ]}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    // Styles applied dynamically
  },
});

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  borderRadius: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default Skeleton;
