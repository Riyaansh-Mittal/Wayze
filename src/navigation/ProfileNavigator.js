/**
 * Profile Navigator
 * Stack navigator for profile-related screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileHomeScreen from '../screens/profile/ProfileHomeScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ActivityHistoryScreen from '../screens/profile/ActivityHistoryScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import PurchaseCreditsScreen from '../screens/profile/PurchaseCreditsScreen';
import ReferralScreen from '../screens/profile/ReferralScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ActivityHistory" component={ActivityHistoryScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PurchaseCredits" component={PurchaseCreditsScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
