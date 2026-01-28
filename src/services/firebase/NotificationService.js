import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

// ✅ CONFIGURE PUSH NOTIFICATION (runs once)
PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

// ✅ CREATE NOTIFICATION CHANNEL (REQUIRED for Android 8+)
PushNotification.createChannel(
  {
    channelId: 'default-channel-id',
    channelName: 'Default Channel',
    channelDescription: 'Default notification channel',
    playSound: true,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => console.log(`Notification channel created: ${created}`),
);

export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('POST_NOTIFICATIONS permission:', granted);
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  } else {
    console.log('Notification permission denied');
  }
}

async function getFcmToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    // TODO: Send this token to your Django backend
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
  }
}

export function notificationListener() {
  // ✅ FOREGROUND: Display notification manually
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground FCM message:', remoteMessage);

    // Show local notification when app is open
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: remoteMessage.notification?.title || 'New Notification',
      message: remoteMessage.notification?.body || 'You have a new message',
      playSound: true,
      soundName: 'default',
      vibrate: true,
      data: remoteMessage.data,
    });
  });

  // ✅ BACKGROUND: User taps notification
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened app from background:', remoteMessage);
    // TODO: Navigate to specific screen
    // navigation.navigate(remoteMessage.data.type);
  });

  // ✅ QUIT: User taps notification when app was closed
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification opened app from quit state:', remoteMessage);
        // TODO: Navigate to specific screen
        // setInitialRoute(remoteMessage.data.type);
      }
    });
}
