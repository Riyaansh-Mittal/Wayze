/**
 * Avatar Component
 * User profile picture or initials
 * FULLY THEME-AWARE
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

const Avatar = ({
  size = 'medium',
  source,
  name,
  backgroundColor,
  textColor,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const { colors, components } = theme;

  const sizeValue = components.avatar[size] || components.avatar.medium;
  const bgColor = backgroundColor || colors.primary;
  const txtColor = textColor || colors.white;

  // Get initials from name
  const getInitials = (fullName) => {
    if (!fullName) {return '?';}

    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const initials = getInitials(name);

  const containerStyle = [
    styles.container,
    {
      width: sizeValue,
      height: sizeValue,
      borderRadius: sizeValue / 2,
      backgroundColor: bgColor,
    },
    style,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      {source ? (
        <Image
          source={source}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { color: txtColor }]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
  },
});

Avatar.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  name: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default Avatar;
