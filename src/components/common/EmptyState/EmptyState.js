/**
 * Empty State Component
 * Displays when no data is available
 * FULLY THEME-AWARE
 * SUPPORTS: String emoji OR React component (SVG icon)
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import PrimaryButton from '../Button/PrimaryButton';
import {useTheme} from '../../../contexts/ThemeContext';

const EmptyState = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  style,
  testID,
}) => {
  const {theme} = useTheme();
  const {colors, spacing} = theme;

  // ✅ FIX: Check if icon is a React component or string
  const isReactComponent = React.isValidElement(icon) || typeof icon === 'function';

  return (
    <View
      style={[styles.container, {padding: spacing.lg}, style]}
      testID={testID}>
      {icon && (
        <View style={[styles.iconContainer, {marginBottom: spacing.base}]}>
          {isReactComponent ? (
            // ✅ Render React component (SVG icon)
            typeof icon === 'function' ? (
              React.createElement(icon, {
                width: 64,
                height: 64,
                fill: colors.textSecondary,
              })
            ) : (
              icon
            )
          ) : (
            // ✅ Render emoji string
            <Text style={styles.iconEmoji}>{icon}</Text>
          )}
        </View>
      )}

      {title && (
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              marginBottom: spacing.sm,
            },
          ]}>
          {title}
        </Text>
      )}

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              marginBottom: spacing.xl,
            },
          ]}>
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          style={{marginTop: spacing.base}}
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
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
  icon: PropTypes.oneOfType([
    PropTypes.string, // Emoji
    PropTypes.element, // React element
    PropTypes.func, // SVG component function
  ]),
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default EmptyState;
