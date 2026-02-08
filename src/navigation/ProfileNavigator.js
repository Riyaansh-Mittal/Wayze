/**
 * Profile Stack Navigator
 * All profile-related screens
 * WITH RESET TO FIRST SCREEN ON TAB SWITCH
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileHomeScreen from '../screens/profile/ProfileHomeScreen';
import ActivityHistoryScreen from '../screens/profile/ActivityHistoryScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import LegalDocumentScreen from '../screens/legal/LegalDocumentScreen';
import DeleteAccountStep1Screen from '../screens/profile/DeleteAccountStep1Screen';
import DeleteAccountStep2Screen from '../screens/profile/DeleteAccountStep2Screen';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      // ✅ This ensures it always starts from ProfileHome
      initialRouteName="ProfileHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} />
      <Stack.Screen name="ActivityHistory" component={ActivityHistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen
        name="LegalDocument"
        component={LegalDocumentScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
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
