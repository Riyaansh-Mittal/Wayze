/**
 * App Navigator
 * Root navigator that handles authentication state
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Spinner from '../components/common/Loading/Spinner';
import NotificationsScreen from '../screens/notifications/NotificationsScreen'; // ✅ Import this
// ✅ Import BOTH Zego screens
import {
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallWaitingScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <Spinner fullScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        // Auth Stack (Login, Onboarding)
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // Main App Stack with Zego call screens
        <>
          <Stack.Screen name="Main" component={MainNavigator} />

          {/* ✅ Notifications Screen */}
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              headerShown: false,
              presentation: 'modal', // Slide up from bottom (iOS) or fade (Android)
              animation: 'slide_from_right', // Or 'slide_from_bottom' for modal feel
            }}
          />

          {/* ✅ Call screen - shown when in active call */}
          <Stack.Screen
            name="ZegoUIKitPrebuiltCallInCallScreen"
            component={ZegoUIKitPrebuiltCallInCallScreen}
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
            }}
          />

          {/* ✅ Waiting screen - shown while waiting for receiver to accept */}
          <Stack.Screen
            name="ZegoUIKitPrebuiltCallWaitingScreen"
            component={ZegoUIKitPrebuiltCallWaitingScreen}
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
