/**
 * RC Uploader Component
 * Image picker and uploader for RC documents
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {COLORS, TYPOGRAPHY, SPACING, SHADOWS} from '../../config/theme';
import {
  requestCameraPermission,
  requestStoragePermission,
} from '../../utils/permissions';
import Spinner from '../common/Loading/Spinner';

const RCUploader = ({value, onChange, error}) => {
  const [uploading, setUploading] = useState(false);

  const showImageSourceOptions = () => {
    Alert.alert(
      'Upload RC Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleCamera,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera access is required to take photos',
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
        'Permission Denied',
        'Storage access is required to select photos',
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

  const handleImageSelected = async image => {
    setUploading(true);

    try {
      // In production, upload to Firebase Storage or your backend
      // For now, just use the local URI
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
      // ✅ Changed from 'error' to 'err'
      console.error('Upload failed:', err);
      Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => onChange(null),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>RC Document Photo *</Text>
      <Text style={styles.helperText}>
        Upload a clear photo of your vehicle's Registration Certificate
      </Text>

      {!value ? (
        <TouchableOpacity
          style={[styles.uploadBox, error && styles.uploadBoxError]}
          onPress={showImageSourceOptions}
          disabled={uploading}
          activeOpacity={0.7}>
          {uploading ? (
            <View style={styles.uploadingContainer}>
              <Spinner size="large" color={COLORS.primary} />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Tap to upload RC photo</Text>
              <Text style={styles.uploadSubtext}>Camera or Gallery</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{uri: value.uri}} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemove}
            activeOpacity={0.7}>
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={showImageSourceOptions}
            activeOpacity={0.7}>
            <Text style={styles.changeText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Make sure the RC details are clearly visible and readable
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  uploadBox: {
    height: 200,
    backgroundColor: COLORS.neutralLight,
    borderWidth: 2,
    borderColor: COLORS.neutralBorder,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBoxError: {
    borderColor: COLORS.error,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  uploadText: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  uploadSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  uploadingContainer: {
    alignItems: 'center',
  },
  uploadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  removeIcon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  changeButton: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

export default RCUploader;
