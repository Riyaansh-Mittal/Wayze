/**
 * Bottom Sheet Modal Component
 * Slides up from bottom of screen
 * FULLY THEME-AWARE
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheet = ({
  visible,
  onClose,
  children,
  title,
  maxHeight = SCREEN_HEIGHT * 0.8,
  closeOnBackdropPress = true,
  showHandle = true,
  testID,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius, shadows, animations } = theme;

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: animations.modal,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: animations.modal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down and fade out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: animations.modal,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: animations.modal,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY, animations.modal]);

  // Pan responder for swipe down to close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5; // Only respond to downward swipes
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Swipe threshold reached, close modal
          onClose();
        } else {
          // Snap back to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: colors.overlay,
              opacity,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.white,
              borderTopLeftRadius: radius.xlarge,
              borderTopRightRadius: radius.xlarge,
              maxHeight,
              ...shadows.bottomSheet,
              transform: [{ translateY }],
            }
          ]}
        >
          {/* Handle */}
          {showHandle && (
            <View
              {...panResponder.panHandlers}
              style={[styles.handleContainer, {
                paddingTop: spacing.md,
                paddingBottom: spacing.sm,
              }]}
            >
              <View style={[styles.handle, {
                backgroundColor: colors.neutralBorder,
                borderRadius: radius.round,
              }]} />
            </View>
          )}

          {/* Title */}
          {title && (
            <View style={[styles.header, {
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.base,
              borderBottomWidth: 1,
              borderBottomColor: colors.neutralBorder,
            }]}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
            </View>
          )}

          {/* Content */}
          <ScrollView style={[styles.content, { padding: spacing.lg }]}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    // Styles applied dynamically
  },
  handleContainer: {
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
  },
  header: {
    // Styles applied dynamically
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    // Styles applied dynamically
  },
});

BottomSheet.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  maxHeight: PropTypes.number,
  closeOnBackdropPress: PropTypes.bool,
  showHandle: PropTypes.bool,
  testID: PropTypes.string,
};

export default BottomSheet;
