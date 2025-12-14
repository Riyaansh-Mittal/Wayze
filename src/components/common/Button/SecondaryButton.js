/**
 * Secondary Button Component
 * Secondary action button with border and transparent background
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
import { COLORS, COMPONENTS, TYPOGRAPHY, SPACING } from '../../../config/theme';

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
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, isDisabled && styles.textDisabled, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: COMPONENTS.secondaryButton.height,
    backgroundColor: COMPONENTS.secondaryButton.backgroundColor,
    borderRadius: COMPONENTS.secondaryButton.borderRadius,
    borderWidth: COMPONENTS.secondaryButton.borderWidth,
    borderColor: COMPONENTS.secondaryButton.borderColor,
    paddingHorizontal: COMPONENTS.secondaryButton.paddingHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 120,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    borderColor: COLORS.neutralBorder,
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: COMPONENTS.secondaryButton.iconSpacing,
  },
  text: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.textDisabled,
  },
});

SecondaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  fullWidth: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  testID: PropTypes.string,
};

export default SecondaryButton;
