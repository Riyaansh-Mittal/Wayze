/**
 * Permissions Handler
 * Handles device permissions (Camera, Storage, etc.)
 */

import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

/**
 * Request camera permission
 */
export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'QR Parking needs access to your camera to scan QR codes and take photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  }

  // iOS permissions are handled in Info.plist
  return true;
};

/**
 * Request storage permission (Android)
 */
export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        // Android 13+ uses READ_MEDIA_IMAGES
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Storage Permission',
            message: 'QR Parking needs access to your photos to upload RC documents',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'QR Parking needs access to your photos to upload RC documents',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Storage permission error:', err);
      return false;
    }
  }

  // iOS permissions are handled in Info.plist
  return true;
};

/**
 * Request location permission
 */
export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'QR Parking needs access to your location for nearby parking spots',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }

  return true;
};

/**
 * Request notification permission (Android 13+)
 */
export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'QR Parking needs to send you notifications about contact requests',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Notification permission error:', err);
      return false;
    }
  }

  return true;
};

/**
 * Check if permission is granted
 */
export const checkPermission = async (permission) => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.check(permission);
      return granted;
    } catch (err) {
      console.warn('Permission check error:', err);
      return false;
    }
  }

  return true;
};

/**
 * Show permission denied alert with settings option
 */
export const showPermissionDeniedAlert = (permissionName) => {
  Alert.alert(
    `${permissionName} Permission Required`,
    `Please enable ${permissionName} permission in Settings to use this feature.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ]
  );
};

/**
 * Request all essential permissions
 */
export const requestEssentialPermissions = async () => {
  const results = {
    camera: await requestCameraPermission(),
    storage: await requestStoragePermission(),
    notifications: await requestNotificationPermission(),
  };

  return results;
};

export default {
  requestCameraPermission,
  requestStoragePermission,
  requestLocationPermission,
  requestNotificationPermission,
  checkPermission,
  showPermissionDeniedAlert,
  requestEssentialPermissions,
};
