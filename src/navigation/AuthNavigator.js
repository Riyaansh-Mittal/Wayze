/**
 * Auth Navigator
 * Handles authentication flow navigation
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import ReferralEntryScreen from '../screens/auth/ReferralEntryScreen';
import LegalDocumentScreen from '../screens/legal/LegalDocumentScreen'; // ✅ Add this

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
      // initialRouteName="Splash"
    >
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ReferralEntry"
        component={ReferralEntryScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      {/* ✅ Add Legal Document Screen */}
      <Stack.Screen
        name="LegalDocument"
        component={LegalDocumentScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal', // Optional: Makes it feel like a modal
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
