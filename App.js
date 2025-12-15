/**
 * App Entry Point
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { BalanceProvider } from './src/contexts/BalanceContext';
import { VehicleProvider } from './src/contexts/VehicleContext';
import { SearchProvider } from './src/contexts/SearchContext';
import { ToastProvider } from './src/components/common/Toast/ToastProvider';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BalanceProvider>
              <VehicleProvider>
                <SearchProvider>
                  <AppNavigator />
                </SearchProvider>
              </VehicleProvider>
            </BalanceProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
