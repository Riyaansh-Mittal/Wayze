/**
 * Delete Account Step 2 Screen
 * Final confirmation with DELETE typing requirement
 * FULLY THEME-AWARE
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';

const DeleteAccountStep2Screen = ({ navigation }) => {
  const { logout } = useAuth();
  const { t, theme } = useTheme();
  const { colors, typography, spacing, layout, components } = theme;

  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = confirmText === 'DELETE';

  const handleDelete = () => {
    Alert.alert(
      t('profile.deleteAccount.step2.lastChance.title'),
      t('profile.deleteAccount.step2.lastChance.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.deleteAccount.step2.lastChance.confirm'),
          style: 'destructive',
          onPress: performDelete,
        },
      ]
    );
  };

  const performDelete = async () => {
    setIsDeleting(true);

    try {
      // TODO: Call delete account API
      // await AuthService.deleteAccount();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Logout user
      await logout();

      // Show success message
      Alert.alert(
        'Account Deleted',
        t('profile.deleteAccount.step2.success'),
        [{ text: t('common.ok') }]
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('profile.deleteAccount.step2.failed'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.neutralLight }]} edges={['top']}>
      <AppBar
        title={t('profile.deleteAccount.step2.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: layout.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { marginBottom: spacing.xl }]}>
          <Text style={[styles.icon, { marginBottom: spacing.md }]}>🗑️</Text>
          <Text style={[typography.h1, { color: colors.error, textAlign: 'center' }]}>
            {t('profile.deleteAccount.step2.heading')}
          </Text>
        </View>

        {/* Instructions */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.body, { textAlign: 'center', marginBottom: spacing.base }]}>
            {t('profile.deleteAccount.step2.instruction')}
          </Text>

          <TextInput
            style={[
              {
                ...components.inputField,
                textAlign: 'center',
                backgroundColor: colors.white,
                color: colors.textPrimary,
                borderColor: confirmText && !isConfirmed 
                  ? colors.error 
                  : colors.neutralBorder,
              }
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
        <Card style={{ backgroundColor: colors.errorLight, marginBottom: spacing.xl }}>
          <Text style={[typography.caption, { color: colors.error, textAlign: 'center' }]}>
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
          />

          <PrimaryButton
            title={t('common.cancel')}
            onPress={() => navigation.goBack()}
            disabled={isDeleting}
            fullWidth
            style={{ marginTop: spacing.md }}
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
