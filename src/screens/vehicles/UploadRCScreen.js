/**
 * Upload RC Screen
 * REDESIGNED FOR BEAUTIFUL DARK MODE
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {OwnershipService} from '../../services/api';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';

const UploadRCScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {plateNumber, newVehicleData} = route.params;
  const {user} = useAuth();

  const [rcPhoto, setRcPhoto] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
    });

    if (!result.didCancel && result.assets?.[0]) {
      setRcPhoto(result.assets[0]);
    }
  };

  const handleChoosePhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
    });

    if (!result.didCancel && result.assets?.[0]) {
      setRcPhoto(result.assets[0]);
    }
  };

  const handleUploadPhoto = () => {
    Alert.alert(t('vehicles.ownership.upload.heading'), '', [
      {
        text: t('vehicles.ownership.upload.takePhoto'),
        onPress: handleTakePhoto,
      },
      {
        text: t('vehicles.ownership.upload.chooseGallery'),
        onPress: handleChoosePhoto,
      },
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
    ]);
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      t('vehicles.ownership.upload.removePhoto'),
      t('vehicles.ownership.upload.removeMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: () => setRcPhoto(null),
        },
      ],
    );
  };

  const validateForm = () => {
    if (!rcPhoto) {
      Alert.alert(t('common.error'), t('validation.required'));
      return false;
    }

    if (!isConfirmed) {
      Alert.alert(t('common.error'), t('validation.required'));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Upload RC photo to storage first
      const uploadedUrl = rcPhoto.uri;

      const claimData = {
        userId: user._id,
        plateNumber,
        rcPhotoUrl: uploadedUrl,
        vehicleData: newVehicleData,
      };

      const result = await OwnershipService.create(claimData);

      if (result.success) {
        navigation.replace('ClaimSubmitted', {
          claimId: result.data._id,
          plateNumber,
        });
      } else {
        Alert.alert(
          t('common.error'),
          t('vehicles.ownership.upload.submitFailed'),
        );
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error.message || t('vehicles.ownership.upload.submitFailed'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('vehicles.ownership.upload.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              padding: layout.screenPadding,
              paddingBottom: spacing.xxxl,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={[styles.header, {marginBottom: spacing.lg}]}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                  marginBottom: spacing.sm,
                },
              ]}>
              {t('vehicles.ownership.upload.heading')}
            </Text>
            <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
              {t('vehicles.ownership.upload.subtitle')}
            </Text>
          </View>

          {/* Upload Area */}
          {!rcPhoto ? (
            <TouchableOpacity
              style={[
                styles.uploadArea,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.primary,
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderRadius: 16,
                  padding: spacing.xxxl,
                  alignItems: 'center',
                  marginBottom: spacing.lg,
                },
              ]}
              onPress={handleUploadPhoto}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.uploadIconContainer,
                  {
                    backgroundColor: colors.primaryLight,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing.md,
                  },
                ]}>
                <Text style={[styles.uploadIcon, {fontSize: 40}]}>📷</Text>
              </View>
              <Text
                style={[
                  styles.uploadTitle,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.xs,
                  },
                ]}>
                {t('vehicles.ownership.upload.tapToUpload')}
              </Text>
              <Text
                style={[styles.uploadSubtitle, {color: colors.textSecondary}]}>
                {t('vehicles.ownership.upload.fileInfo')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Card style={{padding: 0, marginBottom: spacing.lg}}>
              <View
                style={[
                  styles.photoPreview,
                  {padding: spacing.md, position: 'relative'},
                ]}>
                <Image
                  source={{uri: rcPhoto.uri}}
                  style={[styles.rcImage, {borderRadius: 12}]}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    {
                      position: 'absolute',
                      top: spacing.md + 8,
                      right: spacing.md + 8,
                      backgroundColor: colors.error,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    },
                  ]}
                  onPress={handleRemovePhoto}>
                  <Text
                    style={[
                      styles.removeButtonText,
                      {color: colors.white, fontSize: 18},
                    ]}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Tips */}
          <Card
            style={{marginBottom: spacing.lg, backgroundColor: colors.surface}}>
            <Text
              style={[
                styles.tipsTitle,
                {
                  color: colors.textPrimary,
                  marginBottom: spacing.base,
                },
              ]}>
              {t('vehicles.ownership.upload.tipsTitle')}
            </Text>

            <View style={[styles.tip, {marginBottom: spacing.sm}]}>
              <Text
                style={[
                  styles.tipBullet,
                  {marginRight: spacing.sm, color: colors.primary},
                ]}>
                •
              </Text>
              <Text
                style={[
                  styles.tipText,
                  {
                    color: colors.textSecondary,
                    flex: 1,
                  },
                ]}>
                {t('vehicles.ownership.upload.tip1')}
              </Text>
            </View>

            <View style={[styles.tip, {marginBottom: spacing.sm}]}>
              <Text
                style={[
                  styles.tipBullet,
                  {marginRight: spacing.sm, color: colors.primary},
                ]}>
                •
              </Text>
              <Text
                style={[
                  styles.tipText,
                  {
                    color: colors.textSecondary,
                    flex: 1,
                  },
                ]}>
                {t('vehicles.ownership.upload.tip2')}
              </Text>
            </View>

            <View style={[styles.tip, {marginBottom: spacing.sm}]}>
              <Text
                style={[
                  styles.tipBullet,
                  {marginRight: spacing.sm, color: colors.primary},
                ]}>
                •
              </Text>
              <Text
                style={[
                  styles.tipText,
                  {
                    color: colors.textSecondary,
                    flex: 1,
                  },
                ]}>
                {t('vehicles.ownership.upload.tip3')}
              </Text>
            </View>

            <View style={styles.tip}>
              <Text
                style={[
                  styles.tipBullet,
                  {marginRight: spacing.sm, color: colors.primary},
                ]}>
                •
              </Text>
              <Text
                style={[
                  styles.tipText,
                  {
                    color: colors.textSecondary,
                    flex: 1,
                  },
                ]}>
                {t('vehicles.ownership.upload.tip4')}
              </Text>
            </View>
          </Card>

          {/* Confirmation Checkbox */}
          <TouchableOpacity
            style={[styles.confirmRow, {marginBottom: spacing.xl}]}
            onPress={() => setIsConfirmed(!isConfirmed)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: isConfirmed ? colors.primary : colors.border,
                  backgroundColor: isConfirmed ? colors.primary : 'transparent',
                  marginRight: spacing.sm,
                },
              ]}>
              {isConfirmed && (
                <Text style={[styles.checkboxCheck, {color: colors.white}]}>
                  ✓
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.confirmText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.ownership.upload.confirmation', {
                plate: plateNumber,
              })}
            </Text>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={t('vehicles.ownership.upload.submitButton')}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!rcPhoto || !isConfirmed}
              fullWidth
            />

            <SecondaryButton
              title={t('vehicles.ownership.upload.cancelButton')}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
              fullWidth
              style={{marginTop: spacing.md}}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  keyboardView: {flex: 1},
  scrollView: {flex: 1},
  scrollContent: {},
  header: {},
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  uploadArea: {},
  uploadIconContainer: {},
  uploadIcon: {},
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadSubtitle: {
    fontSize: 13,
  },
  photoPreview: {},
  rcImage: {
    width: '100%',
    height: 250,
  },
  removeButton: {},
  removeButtonText: {},
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 20,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCheck: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {},
});

export default UploadRCScreen;
