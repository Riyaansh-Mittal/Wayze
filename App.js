/**
 * Root App Component
 * Sets up providers and initializes app
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, View, Text, StyleSheet } from 'react-native';

// Providers
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ToastProvider } from './src/components/common/Toast/ToastProvider';

import { COLORS, TYPOGRAPHY, SPACING } from './src/config/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={COLORS.white}
            />
            <PlaceholderScreen />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// Temporary placeholder component (remove in Batch 2)
const PlaceholderScreen = () => {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>
        🚗 QR Parking
      </Text>
      <Text style={styles.placeholderSubtext}>
        Batch 1 Complete! ✅
      </Text>
      <Text style={styles.placeholderHelper}>
        Foundation & Configuration Ready
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
  },
  placeholderText: {
    ...TYPOGRAPHY.h1,
    fontSize: 32,
    marginBottom: SPACING.base,
  },
  placeholderSubtext: {
    ...TYPOGRAPHY.h2,
    color: COLORS.success,
    marginBottom: SPACING.sm,
  },
  placeholderHelper: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});

export default App;
