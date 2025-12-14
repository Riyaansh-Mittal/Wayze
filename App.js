/**
 * Root App Component
 * Sets up all providers and navigation
 *
 * BATCH 5 UPDATE: Added complete authentication flow
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';

// Providers
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ToastProvider } from './src/components/common/Toast/ToastProvider';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import { VehicleProvider } from './src/contexts/VehicleContext';
import { SearchProvider } from './src/contexts/SearchContext';
import { BalanceProvider } from './src/contexts/BalanceContext';

// Navigation
import { RootNavigator } from './src/navigation';

import { COLORS } from './src/config/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <UserProvider>
                <VehicleProvider>
                  <SearchProvider>
                    <BalanceProvider>
                      <StatusBar
                        barStyle="dark-content"
                        backgroundColor={COLORS.white}
                      />
                      <RootNavigator />
                    </BalanceProvider>
                  </SearchProvider>
                </VehicleProvider>
              </UserProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
