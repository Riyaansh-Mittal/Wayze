/**
 * Center Modal Component
 * Modal that appears in center of screen
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CenterModal = ({
  visible,
  onClose,
  children,
  title,
  maxWidth = SCREEN_WIDTH * 0.85,
  closeOnBackdropPress = true,
  testID,
}) => {
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Scale up and fade in
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATIONS.modal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Scale down and fade out
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.3,
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
  }, [visible, opacity, scale]);

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

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modal,
            {
              maxWidth,
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xlarge,
    ...SHADOWS.modal,
    maxHeight: '80%',
    width: '100%',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
});

CenterModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  maxWidth: PropTypes.number,
  closeOnBackdropPress: PropTypes.bool,
  testID: PropTypes.string,
};

export default CenterModal;
