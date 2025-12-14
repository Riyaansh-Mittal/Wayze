/**
 * Main Navigator
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING } from '../config/theme';
import VehicleNavigator from './VehicleNavigator';

const Tab = createBottomTabNavigator();

// Placeholder screens
const HomeScreen = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Home Screen (Coming in Batch 7)</Text>
  </View>
);

const SearchScreen = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Search Screen (Coming in Batch 7)</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Profile Screen (Coming in Batch 8)</Text>
  </View>
);

const HomeIcon = ({ size }) => <Text style={{ fontSize: size + 4 }}>🏠</Text>;
const SearchIcon = ({ size }) => <Text style={{ fontSize: size + 4 }}>🔍</Text>;
const VehiclesIcon = ({ size }) => <Text style={{ fontSize: size + 4 }}>🚗</Text>;
const ProfileIcon = ({ size }) => <Text style={{ fontSize: size + 4 }}>👤</Text>;

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  // ✅ Debug: Check what insets are being returned
  console.log('📱 Safe Area Insets:', insets);

  // ✅ Use actual insets on iOS, fixed value on Android
  const bottomPadding = Platform.OS === 'android'
    ? 16  // Fixed padding for Android (adjust as needed: 12-20)
    : insets.bottom || 8;

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
          shadowOffset: { width: 0, height: -2 },
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
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: HomeIcon }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: SearchIcon }} />
      <Tab.Screen name="Vehicles" component={VehicleNavigator} options={{ tabBarIcon: VehiclesIcon }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ProfileIcon }} />
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
