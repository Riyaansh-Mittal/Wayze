/**
 * Empty State Component
 * Displays when no data is available
 * FULLY THEME-AWARE
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import PrimaryButton from '../Button/PrimaryButton';
import { useTheme } from '../../../contexts/ThemeContext';

const EmptyState = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <View style={[styles.container, { padding: spacing.lg }, style]} testID={testID}>
      {icon && (
        <Text style={[styles.icon, { marginBottom: spacing.base }]}>
          {icon}
        </Text>
      )}

      {title && (
        <Text style={[styles.title, {
          color: colors.textPrimary,
          marginBottom: spacing.sm,
        }]}>
          {title}
        </Text>
      )}

      {description && (
        <Text style={[styles.description, {
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        }]}>
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          style={{ marginTop: spacing.base }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
});

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default EmptyState;
