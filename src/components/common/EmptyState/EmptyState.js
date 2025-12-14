/**
 * Empty State Component
 * Displays when no data is available
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import PrimaryButton from '../Button/PrimaryButton';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../config/theme';

const EmptyState = ({
  icon = '📭',
  title,
  message,
  actionLabel,
  onAction,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      {title && <Text style={styles.title}>{title}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
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
    padding: SPACING.lg,
  },
  icon: {
    fontSize: 80,
    marginBottom: SPACING.base,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: SPACING.base,
  },
});

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  style: PropTypes.object,
  testID: PropTypes.string,
};

export default EmptyState;
