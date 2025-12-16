/**
 * Secondary Button Component
 * Secondary action button with border and transparent background
 * FULLY THEME-AWARE
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

const SecondaryButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = false,
  style,
  textStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const { colors, components, spacing } = theme;

  const isDisabled = disabled || loading;

  const buttonStyle = [
    styles.button,
    {
      height: components.secondaryButton.height,
      backgroundColor: 'transparent',
      borderRadius: components.secondaryButton.borderRadius,
      borderWidth: components.secondaryButton.borderWidth,
      borderColor: isDisabled ? colors.neutralBorder : colors.primary,
      paddingHorizontal: components.secondaryButton.paddingHorizontal,
    },
    fullWidth && styles.fullWidth,
    isDisabled && { opacity: 0.6 },
    style,
  ];

  const textStyles = [
    styles.text,
    { color: isDisabled ? colors.textDisabled : colors.primary },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && (
            <View style={{ marginRight: spacing.sm }}>
              {icon}
            </View>
          )}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 120,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

SecondaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  fullWidth: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default SecondaryButton;
