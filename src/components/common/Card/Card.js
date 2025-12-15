/**
 * Card Component
 * Container with elevation and border for content grouping
 * NOW FULLY THEME-AWARE
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

const Card = ({
  children,
  onPress,
  style,
  contentStyle,
  disabled = false,
  testID,
}) => {
  const { theme } = useTheme();
  const { components, colors } = theme;

  const Container = onPress ? TouchableOpacity : View;

  // Create card style with theme colors
  const cardStyle = {
    backgroundColor: colors.white,
    borderRadius: components.card.borderRadius,
    borderWidth: components.card.borderWidth,
    borderColor: colors.neutralBorder,
    ...components.card,
  };

  return (
    <Container
      style={[
        cardStyle,
        style, // ✅ Automatically handles both object and array
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      accessibilityRole={onPress ? 'button' : 'none'}
      testID={testID}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16, // Default padding, can be overridden
  },
});

Card.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array, // ✅ Now accepts arrays
  ]),
  contentStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

export default Card;
