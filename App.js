/**
 * App Entry Point
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { BalanceProvider } from './src/contexts/BalanceContext';
import { VehicleProvider } from './src/contexts/VehicleContext';
import { SearchProvider } from './src/contexts/SearchContext';
import { ToastProvider } from './src/components/common/Toast/ToastProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/config/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
      />
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
    </GestureHandlerRootView>
  );
};

export default App;
