/**
 * Avatar Component
 * User profile picture or initials
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, COMPONENTS, TYPOGRAPHY } from '../../../config/theme';

const Avatar = ({
  size = 'medium',
  source,
  name,
  backgroundColor = COLORS.primary,
  textColor = COLORS.white,
  style,
  testID,
}) => {
  const sizeValue = COMPONENTS.avatar[size] || COMPONENTS.avatar.medium;

  // Get initials from name
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: source ? COLORS.neutralLight : backgroundColor,
        },
        style,
      ]}
      testID={testID}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: sizeValue,
              height: sizeValue,
              borderRadius: sizeValue / 2,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              color: textColor,
              fontSize: sizeValue / 2.5,
            },
          ]}
        >
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
    ...TYPOGRAPHY.bodyBold,
    fontWeight: '700',
  },
});

Avatar.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  name: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  style: PropTypes.object,
  testID: PropTypes.string,
};

export default Avatar;
