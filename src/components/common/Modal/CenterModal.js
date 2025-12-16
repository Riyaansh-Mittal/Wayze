/**
 * Center Modal Component
 * Modal that appears in center of screen
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
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const { colors, spacing, radius, shadows, animations } = theme;

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
          duration: animations.modal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Scale down and fade out
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.3,
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
  }, [visible, opacity, scale, animations.modal]);

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

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: colors.white,
              borderRadius: radius.xlarge,
              maxWidth,
              ...shadows.modal,
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {/* Title */}
          {title && (
            <View style={[styles.header, {
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.md,
            }]}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
            </View>
          )}

          {/* Content */}
          <ScrollView style={[styles.content, {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
          }]}>
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
  modal: {
    maxHeight: '80%',
    width: '100%',
  },
  header: {
    // Styles applied dynamically
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    // Styles applied dynamically
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
