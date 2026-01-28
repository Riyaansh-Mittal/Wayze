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

// ✅ Background message handler - Keep simple
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background FCM Message:', remoteMessage);
  return Promise.resolve();
});

// ✅ Create notification channel
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
    created => console.log(`Channel ${created ? 'created' : 'exists'}`),
  );
}

// ✅ Configure push notifications
PushNotification.configure({
  onNotification: function (notification) {
    console.log('🔔 Notification tapped:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
  popInitialNotification: true,
});

// ✅ Enable ZPNs
ZPNs.ZPNs.enableDebug(true);
ZPNs.ZPNs.setPushConfig({enableFCMPush: true});

// ✅ Store FCM token
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

storeFcmToken();

ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

// ✅ Token provider for Zego
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
