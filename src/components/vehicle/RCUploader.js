/**
 * RC Uploader Component
 * Image picker and uploader for RC documents
 * FULLY THEME-AWARE
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useTheme } from '../../contexts/ThemeContext';
import {
  requestCameraPermission,
  requestStoragePermission,
} from '../../utils/permissions';
import Spinner from '../common/Loading/Spinner';

const RCUploader = ({ value, onChange, error }) => {
  const { t, theme } = useTheme();
  const { colors, spacing, shadows } = theme;
  const [uploading, setUploading] = useState(false);

  const showImageSourceOptions = () => {
    Alert.alert(
      t?.('vehicles.uploadRC') || 'Upload RC Photo',
      t?.('vehicles.chooseOption') || 'Choose an option',
      [
        {
          text: t?.('vehicles.takePhoto') || 'Take Photo',
          onPress: handleCamera,
        },
        {
          text: t?.('vehicles.chooseGallery') || 'Choose from Gallery',
          onPress: handleGallery,
        },
        {
          text: t?.('common.cancel') || 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        t?.('permissions.denied') || 'Permission Denied',
        t?.('permissions.cameraRequired') || 'Camera access is required to take photos',
      );
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
    });

    if (result.assets && result.assets[0]) {
      handleImageSelected(result.assets[0]);
    }
  };

  const handleGallery = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        t?.('permissions.denied') || 'Permission Denied',
        t?.('permissions.storageRequired') || 'Storage access is required to select photos',
      );
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
    });

    if (result.assets && result.assets[0]) {
      handleImageSelected(result.assets[0]);
    }
  };

  const handleImageSelected = async (image) => {
    setUploading(true);

    try {
      // In production, upload to Firebase Storage or your backend
      const imageData = {
        uri: image.uri,
        name: image.fileName || 'rc_document.jpg',
        type: image.type || 'image/jpeg',
        size: image.fileSize,
      };

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      onChange(imageData);
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert(
        t?.('common.uploadFailed') || 'Upload Failed',
        t?.('common.uploadFailedMessage') || 'Failed to upload image. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      t?.('vehicles.removePhoto') || 'Remove Photo',
      t?.('vehicles.removePhotoConfirm') || 'Are you sure you want to remove this photo?',
      [
        { text: t?.('common.cancel') || 'Cancel', style: 'cancel' },
        {
          text: t?.('common.remove') || 'Remove',
          style: 'destructive',
          onPress: () => onChange(null),
        },
      ]
    );
  };

  const uploadBoxStyle = [
    styles.uploadBox,
    {
      backgroundColor: colors.neutralLight,
      borderWidth: 2,
      borderColor: error ? colors.error : colors.neutralBorder,
    },
  ];

  return (
    <View style={[styles.container, { marginBottom: spacing.base }]}>
      <Text style={[styles.label, {
        color: colors.textPrimary,
        marginBottom: spacing.xs,
      }]}>
        {t?.('vehicles.rcDocument') || 'RC Document Photo'} *
      </Text>
      <Text style={[styles.helperText, {
        color: colors.textSecondary,
        marginBottom: spacing.sm,
      }]}>
        {t?.('vehicles.rcHelper') || 'Upload a clear photo of your vehicle\'s Registration Certificate'}
      </Text>

      {!value ? (
        <TouchableOpacity
          style={uploadBoxStyle}
          onPress={showImageSourceOptions}
          disabled={uploading}
          activeOpacity={0.7}
        >
          {uploading ? (
            <View style={styles.uploadingContainer}>
              <Spinner size="large" color={colors.primary} />
              <Text style={[styles.uploadingText, {
                color: colors.textSecondary,
                marginTop: spacing.md,
              }]}>
                {t?.('common.uploading') || 'Uploading...'}
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.uploadIcon, { marginBottom: spacing.md }]}>📷</Text>
              <Text style={[styles.uploadText, {
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }]}>
                {t?.('vehicles.tapUpload') || 'Tap to upload RC photo'}
              </Text>
              <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
                {t?.('vehicles.cameraOrGallery') || 'Camera or Gallery'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={[styles.previewContainer, shadows.medium]}>
          <Image source={{ uri: value.uri }} style={styles.previewImage} />
          <TouchableOpacity
            style={[styles.removeButton, {
              backgroundColor: colors.error,
              top: spacing.sm,
              right: spacing.sm,
              ...shadows.small,
            }]}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Text style={[styles.removeIcon, { color: colors.white }]}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.changeButton, {
              bottom: spacing.md,
              left: spacing.md,
              right: spacing.md,
              paddingVertical: spacing.sm,
            }]}
            onPress={showImageSourceOptions}
            activeOpacity={0.7}
          >
            <Text style={[styles.changeText, { color: colors.white }]}>
              {t?.('vehicles.changePhoto') || 'Change Photo'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <Text style={[styles.errorText, {
          color: colors.error,
          marginTop: spacing.xs,
        }]}>
          {error}
        </Text>
      )}

      <View style={[styles.infoBox, {
        backgroundColor: colors.primaryLight,
        padding: spacing.md,
        marginTop: spacing.md,
      }]}>
        <Text style={[styles.infoIcon, { marginRight: spacing.sm }]}>💡</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          {t?.('vehicles.rcInfo') || 'Make sure the RC details are clearly visible and readable'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles applied dynamically
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
  },
  uploadBox: {
    height: 200,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadSubtext: {
    fontSize: 13,
  },
  uploadingContainer: {
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: 15,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  changeButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
});

export default RCUploader;
