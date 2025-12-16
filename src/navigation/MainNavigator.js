/**
 * Main Navigator
 * Main app navigation with bottom tabs
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {COLORS, TYPOGRAPHY, SPACING} from '../config/theme';
import VehicleNavigator from './VehicleNavigator';
import SearchNavigator from './SearchNavigator'; // ✅ Import SearchNavigator
import HomeScreen from '../screens/home/HomeScreen';
import ProfileNavigator from './ProfileNavigator';
import {
  HomeIcon as HomeSvg,
  SearchIcon as SearchSvg,
  CarIcon as VehiclesSvg,
  ProfileIcon as ProfileSvg,
} from '../assets/icons';

const Tab = createBottomTabNavigator();

// Tab bar icons
const HomeIcon = ({size, color}) => (
  <HomeSvg width={size} height={size} fill={color} />
);

const SearchIcon = ({size, color}) => (
  <SearchSvg width={size} height={size} fill={color} />
);

const VehiclesIcon = ({size, color}) => (
  <VehiclesSvg width={size} height={size} fill={color} />
);

const ProfileIcon = ({size, color}) => (
  <ProfileSvg width={size} height={size} fill={color} />
);

const MainNavigator = () => {
  // Use fixed padding for Android
  const bottomPadding = Platform.OS === 'android' ? 16 : 8;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: COLORS.neutralBorder,
          backgroundColor: COLORS.white,
          elevation: 8,
          shadowColor: COLORS.black,
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: HomeIcon}}
      />
      <Tab.Screen
        name="Search"
        component={SearchNavigator} // ✅ Use SearchNavigator instead of placeholder
        options={{tabBarIcon: SearchIcon}}
      />
      <Tab.Screen
        name="Vehicles"
        component={VehicleNavigator}
        options={{tabBarIcon: VehiclesIcon}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{tabBarIcon: ProfileIcon}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  placeholderText: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
});

export default MainNavigator;
