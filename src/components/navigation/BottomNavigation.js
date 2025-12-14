/**
 * Bottom Navigation Component
 * Tab navigation bar at bottom of screen
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { COLORS, COMPONENTS, SPACING, TYPOGRAPHY } from '../../config/theme';

const BottomNavigation = ({
  tabs,
  activeIndex,
  onTabPress,
  style,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      testID={testID}
    >
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        
        return (
          <TouchableOpacity
            key={tab.key || index}
            style={styles.tab}
            onPress={() => onTabPress(index, tab)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              {React.cloneElement(tab.icon, {
                color: isActive ? COLORS.primary : COLORS.textSecondary,
                size: COMPONENTS.bottomNav.iconSize,
              })}
            </View>

            {/* Label */}
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>

            {/* Badge (optional) */}
            {tab.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: COMPONENTS.bottomNav.height,
    backgroundColor: COMPONENTS.bottomNav.backgroundColor,
    borderTopWidth: COMPONENTS.bottomNav.borderTopWidth,
    borderTopColor: COMPONENTS.bottomNav.borderTopColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  iconContainer: {
    marginBottom: 2,
  },
  label: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: '30%',
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

BottomNavigation.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  activeIndex: PropTypes.number.isRequired,
  onTabPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  testID: PropTypes.string,
};

export default BottomNavigation;
