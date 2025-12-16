/**
 * App Bar Component
 * Top navigation bar with title and actions
 * FULLY THEME-AWARE
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
import { useTheme } from '../../contexts/ThemeContext';
import { LeftArrowIcon } from '../../assets/icons';

const AppBar = ({
  title,
  showBack = false,
  onBackPress,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  backgroundColor,
  style,
  testID,
}) => {
  const { theme, isDarkMode } = useTheme();
  const { colors, components, spacing } = theme;
  const insets = useSafeAreaInsets();

  const bgColor = backgroundColor || colors.white;
  const statusBarStyle = isDarkMode() ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={bgColor}
      />
      <View style={[
        styles.container,
        { 
          backgroundColor: bgColor,
          borderBottomWidth: components.appBar.borderBottomWidth,
          borderBottomColor: colors.neutralBorder,
          paddingTop: Platform.OS === 'android' ? 0 : insets.top,
        },
        style,
      ]}
      testID={testID}
      >
        <View style={[styles.content, {
          height: components.appBar.height,
          paddingHorizontal: components.appBar.paddingHorizontal,
        }]}>
          {/* Left Icon/Button */}
          {(showBack || leftIcon || onLeftPress) && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress || onLeftPress}
              activeOpacity={0.7}
            >
              {leftIcon || <Text style={{ fontSize: 24 }}><LeftArrowIcon width={25} height={25}/></Text>}
            </TouchableOpacity>
          )}
          {!showBack && !leftIcon && !onLeftPress && <View style={{ width: 48 }} />}

          {/* Title */}
          <View style={[styles.titleContainer, { paddingHorizontal: spacing.sm }]}>
            <Text
              style={[styles.title, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          {/* Right Icon/Button */}
          {(rightIcon || onRightPress) && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              activeOpacity={0.7}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
          {!rightIcon && !onRightPress && <View style={{ width: 48 }} />}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles applied dynamically
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

AppBar.propTypes = {
  title: PropTypes.string.isRequired,
  showBack: PropTypes.bool,
  onBackPress: PropTypes.func,
  leftIcon: PropTypes.node,
  onLeftPress: PropTypes.func,
  rightIcon: PropTypes.node,
  onRightPress: PropTypes.func,
  backgroundColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default AppBar;
