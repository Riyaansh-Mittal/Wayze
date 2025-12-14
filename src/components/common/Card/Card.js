/**
 * Card Component
 * Container with elevation and border for content grouping
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { COMPONENTS } from '../../../config/theme';

const Card = ({
  children,
  onPress,
  style,
  contentStyle,
  disabled = false,
  testID,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, style]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      accessibilityRole={onPress ? 'button' : 'none'}
      testID={testID}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COMPONENTS.card.backgroundColor,
    borderRadius: COMPONENTS.card.borderRadius,
    borderWidth: COMPONENTS.card.borderWidth,
    borderColor: COMPONENTS.card.borderColor,
    ...COMPONENTS.card,
  },
  content: {
    padding: COMPONENTS.card.padding,
  },
});

Card.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

export default Card;
