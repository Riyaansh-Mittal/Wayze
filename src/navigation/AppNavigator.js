import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import Spinner from '../components/common/Loading/Spinner';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import CallConnectingScreen from '../screens/call/CallConnectingScreen';
import {
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallWaitingScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {getAndClearCallFlag} from '../native/CallFlagModule';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  // ✅ Synchronous — no useEffect, no delay, reads before first render
  const [isOfflineCall] = useState(() => getAndClearCallFlag());

  if (isLoading) {
    if (isOfflineCall) return <CallConnectingScreen />;
    return <Spinner fullScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={
        isOfflineCall ? 'CallConnecting' : !isAuthenticated ? 'Auth' : 'Main'
      }>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_right',
            }}
          />
        </>
      )}

      <Stack.Screen
        name="ZegoUIKitPrebuiltCallInCallScreen"
        component={ZegoUIKitPrebuiltCallInCallScreen}
        options={{presentation: 'fullScreenModal'}}
      />
      <Stack.Screen
        name="ZegoUIKitPrebuiltCallWaitingScreen"
        component={ZegoUIKitPrebuiltCallWaitingScreen}
        options={{presentation: 'fullScreenModal'}}
      />

      {/* ✅ Always present in stack — navigated to imperatively by ZegoService */}
      <Stack.Screen
        name="CallConnecting"
        component={CallConnectingScreen}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
