import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKit from '@zegocloud/zego-uikit-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ZegoTokenManager} from './src/services/zego/ZegoTokenManager';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';

// ✅ CRITICAL: Background message handler MUST be registered FIRST
// This is the OFFICIAL pattern from React Native Firebase docs [web:388]
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background FCM Message:', remoteMessage);
  // ✅ Don't return Promise.resolve() - just let async function complete naturally
});

// ✅ CRITICAL: Create notification channel IMMEDIATELY
if (Platform.OS === 'android') {
  PushNotification.createChannel(
    {
      channelId: 'zego_audio_call',
      channelName: 'Zego Audio Call',
      importance: 4,
      vibrate: true,
      soundName: 'zego_incoming',
      playSound: true,
    },
    created => console.log(`✅ Channel ${created ? 'created' : 'exists'}`),
  );
}

// ✅ Configure push notifications synchronously
PushNotification.configure({
  onNotification: function (notification) {
    console.log('🔔 Notification tapped:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
  popInitialNotification: true,
});

// ✅ CRITICAL: Enable ZPNs IMMEDIATELY (required for background calls)
// ZPNs.ZPNs.enableDebug(true);
// ZPNs.ZPNs.setPushConfig({enableFCMPush: true});

// ✅ CRITICAL: Register Zego system calling UI IMMEDIATELY
ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

// ✅ Store FCM token IMMEDIATELY (async but non-blocking)
const storeFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    console.log('📱 FCM Token:', fcmToken);
    await AsyncStorage.setItem('FCM_TOKEN', fcmToken);

    messaging().onTokenRefresh(token => {
      console.log('🔑 FCM Token refreshed:', token);
      AsyncStorage.setItem('FCM_TOKEN', token);
    });

    messaging().onMessage(async remoteMessage => {
      console.log('📨 Foreground FCM:', remoteMessage);
    });
  } catch (err) {
    console.error('🔥 FCM Token Error:', err);
  }
};

// Start fetching token immediately (runs in background)
storeFcmToken();

// ✅ CRITICAL: Token provider MUST be registered immediately
ZegoUIKit.onTokenProvide(async () => {
  try {
    console.log('🔑 Zego requesting token...');
    const token = await ZegoTokenManager.ensureValidToken();
    if (!token) {
      console.warn('⚠️ No token available');
      return '';
    }
    console.log('✅ Zego token provided');
    return token;
  } catch (error) {
    console.error('❌ Token provider error:', error);
    return '';
  }
});

AppRegistry.registerComponent(appName, () => App);
