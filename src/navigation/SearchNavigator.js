/**
 * Search Navigator
 * Stack navigator for search-related screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FindVehicleScreen from '../screens/search/FindVehicleScreen';
import SearchResultFoundScreen from '../screens/search/SearchResultFoundScreen';
import SearchResultNotFoundScreen from '../screens/search/SearchResultNotFoundScreen';
import CallOwnerModal from '../screens/search/CallOwnerModal';
import SendAlertModal from '../screens/search/SendAlertModal';

const Stack = createNativeStackNavigator();

const SearchNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="FindVehicle"
        component={FindVehicleScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="SearchResultFound"
        component={SearchResultFoundScreen}
      />
      <Stack.Screen
        name="SearchResultNotFound"
        component={SearchResultNotFoundScreen}
      />
      <Stack.Screen
        name="SendAlertModal"
        component={SendAlertModal}
        options={{
          headerShown: false,
          presentation: 'modal', // Modal presentation on iOS
        }}
      />
      <Stack.Screen
        name="CallOwnerModal"
        component={CallOwnerModal}
        options={{
          headerShown: false,
          presentation: 'modal', // Modal presentation on iOS
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
