// MainNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, InteractionManager} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {COLORS} from '../config/theme';

import VehicleNavigator from './VehicleNavigator';
import SearchNavigator from './SearchNavigator';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileNavigator from './ProfileNavigator';

import {
  HomeIcon as HomeSvg,
  SearchIcon as SearchSvg,
  CarIcon as VehiclesSvg,
  ProfileIcon as ProfileSvg,
} from '../assets/icons';

const Tab = createBottomTabNavigator();

/**
 * Pop nested stack to top for a given tab.
 * Uses target = nested navigator key (fast) instead of full reset (slow).
 */
function popNestedToTop(navigation, tabName) {
  const tabState = navigation.getState();
  const tabRoute = tabState.routes.find(r => r.name === tabName);
  const nestedKey = tabRoute?.state?.key;

  if (!nestedKey) return;

  navigation.dispatch({
    ...StackActions.popToTop(),
    target: nestedKey,
  });
}

/**
 * Create listeners that:
 * 1) On blur: pop stack to top in background (so next open is root)
 * 2) On tabPress: if already focused and deep -> popToTop immediately
 */
function makeTabListeners(tabName) {
  return ({navigation}) => ({
    tabPress: e => {
      const state = navigation.getState();
      const currentTabName = state.routes[state.index]?.name;

      // Only intercept when user taps the already-focused tab
      if (currentTabName !== tabName) return;

      const tabRoute = state.routes.find(r => r.name === tabName);
      const isDeep = (tabRoute?.state?.index ?? 0) > 0;

      if (isDeep) {
        e.preventDefault();
        popNestedToTop(navigation, tabName);
      }
    },

    blur: () => {
      // Do it after interactions so tab switching stays snappy
      InteractionManager.runAfterInteractions(() => {
        popNestedToTop(navigation, tabName);
      });
    },
  });
}

// ✅ Define listeners once (no recreation, no lag)
const searchListeners = makeTabListeners('Search');
const vehiclesListeners = makeTabListeners('Vehicles');
const profileListeners = makeTabListeners('Profile');

const MainNavigator = () => {
  const bottomPadding = Platform.OS === 'android' ? 16 : 8;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        lazy: true,
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
        tabBarIconStyle: {marginTop: 4},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <HomeSvg width={size} height={size} fill={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color, size}) => (
            <SearchSvg width={size} height={size} fill={color} />
          ),
        }}
        listeners={searchListeners}
      />

      <Tab.Screen
        name="Vehicles"
        component={VehicleNavigator}
        options={{
          tabBarLabel: 'Vehicles',
          tabBarIcon: ({color, size}) => (
            <VehiclesSvg width={size} height={size} fill={color} />
          ),
        }}
        listeners={vehiclesListeners}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <ProfileSvg width={size} height={size} fill={color} />
          ),
        }}
        listeners={profileListeners}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
