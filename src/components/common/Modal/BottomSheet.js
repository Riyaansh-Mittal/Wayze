/**
 * Bottom Sheet Modal Component
 * Slides up from bottom of screen
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
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  ANIMATIONS,
} from '../../../config/theme';

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
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATIONS.modal,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATIONS.modal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down and fade out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: ANIMATIONS.modal,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATIONS.modal,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

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
      statusBarTranslucent
      testID={testID}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View style={[styles.backdrop, { opacity }]} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight,
              transform: [{ translateY }],
            },
          ]}
          {...(showHandle ? panResponder.panHandlers : {})}
        >
          {/* Handle */}
          {showHandle && (
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          )}

          {/* Title */}
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xlarge,
    borderTopRightRadius: RADIUS.xlarge,
    ...SHADOWS.bottomSheet,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.neutralBorder,
    borderRadius: RADIUS.round,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorder,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  content: {
    padding: SPACING.lg,
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
