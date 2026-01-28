/**
 * Toast Provider
 * Global toast notification system with modern design
 */

import React, {createContext, useContext, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, SPACING, RADIUS, TYPOGRAPHY} from '../../../config/theme';
import {TIME} from '../../../config/constants';

const ToastContext = createContext();

const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Toast configuration with proper icons and colors
const TOAST_CONFIG = {
  success: {
    icon: 'check-circle',
    backgroundColor: '#4CAF50',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF',
  },
  error: {
    icon: 'error',
    backgroundColor: '#EF5350',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF',
  },
  warning: {
    icon: 'warning',
    backgroundColor: '#FF9800',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF',
  },
  info: {
    icon: 'info',
    backgroundColor: '#2196F3',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF',
  },
};

export const ToastProvider = ({children}) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO, duration = TIME.TOAST_DURATION) => {
      const id = Date.now().toString();
      const newToast = {
        id,
        message,
        type,
        duration,
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(-100),
        scale: new Animated.Value(0.9),
      };

      setToasts(prev => [...prev, newToast]);

      // Animate in with bounce effect
      Animated.parallel([
        Animated.timing(newToast.opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(newToast.translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(newToast.scale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      setTimeout(() => {
        hideToast(id);
      }, duration);

      return id;
    },
    [hideToast],
  );

  const hideToast = useCallback(id => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (!toast) return prev;

      // Animate out
      Animated.parallel([
        Animated.timing(toast.opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(toast.translateY, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(toast.scale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts(current => current.filter(t => t.id !== id));
      });

      return prev;
    });
  }, []);

  const showSuccess = useCallback(
    (message, duration) => {
      return showToast(message, TOAST_TYPES.SUCCESS, duration);
    },
    [showToast],
  );

  const showError = useCallback(
    (message, duration) => {
      return showToast(message, TOAST_TYPES.ERROR, duration);
    },
    [showToast],
  );

  const showWarning = useCallback(
    (message, duration) => {
      return showToast(message, TOAST_TYPES.WARNING, duration);
    },
    [showToast],
  );

  const showInfo = useCallback(
    (message, duration) => {
      return showToast(message, TOAST_TYPES.INFO, duration);
    },
    [showToast],
  );

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => hideToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const Toast = ({toast, onDismiss}) => {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.backgroundColor,
          opacity: toast.opacity,
          transform: [{translateY: toast.translateY}, {scale: toast.scale}],
        },
      ]}>
      <TouchableOpacity
        style={styles.toastContent}
        onPress={onDismiss}
        activeOpacity={0.9}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <Icon name={config.icon} size={24} color={config.iconColor} />
        </View>

        {/* Message */}
        <Text
          style={[styles.toastMessage, {color: config.textColor}]}
          numberOfLines={3}>
          {toast.message}
        </Text>

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDismiss}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="close" size={18} color={config.iconColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: SPACING.base,
  },
  toast: {
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.large,
    width: '100%',
    maxWidth: 500,
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    minHeight: 64,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  toastMessage: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastContext;
