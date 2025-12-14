/**
 * App Bar Component
 * Top navigation bar with title and actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { COLORS, COMPONENTS, TYPOGRAPHY, SPACING } from '../../config/theme';

const AppBar = ({
  title,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  backgroundColor = COLORS.white,
  style,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor,
          },
          style,
        ]}
        testID={testID}
      >
        <View style={styles.content}>
          {/* Left Icon/Button */}
          {leftIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              {leftIcon}
            </TouchableOpacity>
          )}
          {!leftIcon && <View style={styles.iconButton} />}

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Right Icon/Button */}
          {rightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Action"
            >
              {rightIcon}
            </TouchableOpacity>
          )}
          {!rightIcon && <View style={styles.iconButton} />}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: COMPONENTS.appBar.borderBottomWidth,
    borderBottomColor: COMPONENTS.appBar.borderBottomColor,
  },
  content: {
    height: COMPONENTS.appBar.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: COMPONENTS.appBar.paddingHorizontal,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
});

AppBar.propTypes = {
  title: PropTypes.string.isRequired,
  leftIcon: PropTypes.node,
  onLeftPress: PropTypes.func,
  rightIcon: PropTypes.node,
  onRightPress: PropTypes.func,
  backgroundColor: PropTypes.string,
  style: PropTypes.object,
  testID: PropTypes.string,
};

export default AppBar;
