/**
 * Toast Provider
 * Global toast notification system
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../../config/theme';
import { TIME } from '../../../config/constants';

const ToastContext = createContext();

const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = TOAST_TYPES.INFO, duration = TIME.TOAST_DURATION) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      message,
      type,
      duration,
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-100),
    };

    setToasts((prev) => [...prev, newToast]);

    // Animate in
    Animated.parallel([
      Animated.timing(newToast.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(newToast.translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    setTimeout(() => {
      hideToast(id);
    }, duration);

    return id;
  }, [hideToast]);

  const hideToast = useCallback((id) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (!toast) return prev;

      // Animate out
      Animated.parallel([
        Animated.timing(toast.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toast.translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      });

      return prev;
    });
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.SUCCESS, duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.ERROR, duration);
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.WARNING, duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.INFO, duration);
  }, [showToast]);

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
        {toasts.map((toast) => (
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

const Toast = ({ toast, onDismiss }) => {
  const getBackgroundColor = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return COLORS.success;
      case TOAST_TYPES.ERROR:
        return COLORS.error;
      case TOAST_TYPES.WARNING:
        return COLORS.warning;
      case TOAST_TYPES.INFO:
      default:
        return COLORS.primary;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return '✓';
      case TOAST_TYPES.ERROR:
        return '✕';
      case TOAST_TYPES.WARNING:
        return '⚠';
      case TOAST_TYPES.INFO:
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: getBackgroundColor(),
          opacity: toast.opacity,
          transform: [{ translateY: toast.translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={onDismiss}
        activeOpacity={0.9}
      >
        <Text style={styles.toastIcon}>{getIcon()}</Text>
        <Text style={styles.toastMessage} numberOfLines={3}>
          {toast.message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.medium,
    minHeight: 56,
    maxWidth: Dimensions.get('window').width - SPACING.lg * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  toastIcon: {
    fontSize: 20,
    color: COLORS.white,
    marginRight: SPACING.md,
  },
  toastMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    flex: 1,
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
