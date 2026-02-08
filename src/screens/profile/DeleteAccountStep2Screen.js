/**
 * Delete Account Step 2 Screen
 * Final confirmation with DELETE typing requirement
 * FULLY THEME-AWARE
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import {TrashIcon} from '../../assets/icons';

const DeleteAccountStep2Screen = ({navigation}) => {
  const {deleteAccount} = useAuth();
  const {t, theme} = useTheme();
  const {colors, typography, spacing, layout, components} = theme;

  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = confirmText === 'DELETE';

  const handleDelete = () => {
    Alert.alert(
      t('profile.deleteAccount.step2.lastChance.title'),
      t('profile.deleteAccount.step2.lastChance.message'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('profile.deleteAccount.step2.lastChance.confirm'),
          style: 'destructive',
          onPress: performDelete,
        },
      ],
    );
  };

  const performDelete = async () => {
    setIsDeleting(true);

    try {
      console.log('🗑️ Performing account deletion...');

      // ✅ Call deleteAccount from AuthContext
      const result = await deleteAccount();

      if (result.success) {
        console.log('✅ Account deleted successfully');

        // ✅ Show success alert (NO TOAST as requested)
        Alert.alert(
          t('profile.deleteAccount.step2.success.title') || 'Account Deleted',
          t('profile.deleteAccount.step2.success.message') ||
            'Your account has been permanently deleted. We are sorry to see you go.',
          [
            {
              text: t('common.ok') || 'OK',
              onPress: () => {
                // User is already logged out by deleteAccount()
                // AuthNavigator will automatically show Welcome screen
              },
            },
          ],
          {cancelable: false}, // Prevent dismissing by tapping outside
        );
      } else {
        // Show error
        Alert.alert(
          t('common.error') || 'Error',
          result.error ||
            t('profile.deleteAccount.step2.failed') ||
            'Failed to delete account. Please try again.',
          [{text: t('common.ok') || 'OK'}],
        );
      }
    } catch (error) {
      console.error('❌ Delete account error:', error);
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.deleteAccount.step2.failed') ||
          'An unexpected error occurred. Please try again.',
        [{text: t('common.ok') || 'OK'}],
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('profile.deleteAccount.step2.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: layout.screenPadding},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, {marginBottom: spacing.xl}]}>
          <TrashIcon width={126} height={126} fill={colors.error} />
          <Text
            style={[typography.h1, {color: colors.error, textAlign: 'center'}]}>
            {t('profile.deleteAccount.step2.heading')}
          </Text>
        </View>

        {/* Instructions */}
        <View style={{marginBottom: spacing.xl}}>
          <Text
            style={[
              typography.body,
              {textAlign: 'center', marginBottom: spacing.base},
            ]}>
            {t('profile.deleteAccount.step2.instruction')}
          </Text>

          <TextInput
            style={[
              {
                ...components.inputField,
                textAlign: 'center',
                backgroundColor: colors.white,
                color: colors.textPrimary,
                borderColor:
                  confirmText && !isConfirmed
                    ? colors.error
                    : colors.neutralBorder,
              },
            ]}
            placeholder={t('profile.deleteAccount.step2.placeholder')}
            placeholderTextColor={colors.textDisabled}
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        {/* Final Warning */}
        <Card
          style={{
            backgroundColor: colors.errorLight,
            marginBottom: spacing.xl,
          }}>
          <Text
            style={[
              typography.caption,
              {color: colors.error, textAlign: 'center'},
            ]}>
            {t('profile.deleteAccount.step2.finalWarning')}
          </Text>
        </Card>

        {/* Actions */}
        <View>
          <SecondaryButton
            title={t('profile.deleteAccount.step2.deleteButton')}
            onPress={handleDelete}
            loading={isDeleting}
            disabled={!isConfirmed || isDeleting}
            fullWidth
            style={{
              borderColor: colors.error,
              opacity: !isConfirmed || isDeleting ? 0.5 : 1,
            }}
            textStyle={{
              color: colors.error,
            }}
          />

          <PrimaryButton
            title={t('common.cancel')}
            onPress={() => navigation.goBack()}
            disabled={isDeleting}
            fullWidth
            style={{marginTop: spacing.md}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
  },
});

export default DeleteAccountStep2Screen;
