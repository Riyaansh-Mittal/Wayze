/**
 * Profile Stack Navigator
 * All profile-related screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Profile Screens
import ProfileHomeScreen from '../screens/profile/ProfileHomeScreen';
import ActivityHistoryScreen from '../screens/profile/ActivityHistoryScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import DeleteAccountStep1Screen from '../screens/profile/DeleteAccountStep1Screen';
import DeleteAccountStep2Screen from '../screens/profile/DeleteAccountStep2Screen';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // We use custom AppBar
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHomeScreen}
      />
      <Stack.Screen
        name="ActivityHistory"
        component={ActivityHistoryScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
      />
      <Stack.Screen
        name="DeleteAccountStep1"
        component={DeleteAccountStep1Screen}
      />
      <Stack.Screen
        name="DeleteAccountStep2"
        component={DeleteAccountStep2Screen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
