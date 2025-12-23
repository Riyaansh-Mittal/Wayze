/**
 * Vehicle Navigator
 * Stack navigator for vehicle management screens
 * WITH RESET TO FIRST SCREEN ON TAB SWITCH
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyVehiclesScreen from '../screens/vehicles/MyVehiclesScreen';
import AddVehicleScreen from '../screens/vehicles/AddVehicleScreen';
import EditVehicleScreen from '../screens/vehicles/EditVehicleScreen';
import VehicleDetailsScreen from '../screens/vehicles/VehicleDetailsScreen';
import OwnershipConflictScreen from '../screens/vehicles/OwnershipConflictScreen';
import UploadRCScreen from '../screens/vehicles/UploadRCScreen';
import ClaimSubmittedScreen from '../screens/vehicles/ClaimSubmittedScreen';

const Stack = createNativeStackNavigator();

const VehicleNavigator = () => {
  return (
    <Stack.Navigator
      // ✅ This ensures it always starts from MyVehicles
      initialRouteName="MyVehicles"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
      <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
      <Stack.Screen
        name="OwnershipConflict"
        component={OwnershipConflictScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="UploadRC" component={UploadRCScreen} />
      <Stack.Screen
        name="ClaimSubmitted"
        component={ClaimSubmittedScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default VehicleNavigator;
