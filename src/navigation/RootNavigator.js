/**
 * Root Navigator
 * Manages app-level navigation (Auth vs Main)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import FullScreenLoader from '../components/common/Loading/FullScreenLoader';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoading } = useAuth();

  // Show loading screen during auth initialization
  if (isLoading) {
    return <FullScreenLoader visible={true} message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* Always show AuthNavigator - it handles its own routing */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
