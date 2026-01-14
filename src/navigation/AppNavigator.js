/**
 * App Navigator
 * Root navigator that handles authentication state
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import {navigationRef} from './navigationRef';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Spinner from '../components/common/Loading/Spinner';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <Spinner fullScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          // Auth Stack (Login, Onboarding)
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // Main App Stack (Bottom Tabs)
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
