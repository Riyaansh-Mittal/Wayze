/**
 * Destructive Button Component
 * Used for dangerous/irreversible actions (delete, logout, etc.)
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
import { COLORS, COMPONENTS, TYPOGRAPHY } from '../../../config/theme';

const DestructiveButton = ({
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
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: COMPONENTS.destructiveButton.height,
    backgroundColor: COMPONENTS.destructiveButton.backgroundColor,
    borderRadius: COMPONENTS.destructiveButton.borderRadius,
    paddingHorizontal: COMPONENTS.destructiveButton.paddingHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 120,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: COLORS.neutralBorder,
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: COMPONENTS.destructiveButton.iconSpacing,
  },
  text: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
});

DestructiveButton.propTypes = {
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

export default DestructiveButton;
