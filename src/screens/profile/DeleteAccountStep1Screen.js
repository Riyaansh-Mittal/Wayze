/**
 * Delete Account Step 1 Screen
 * Warning about account deletion consequences
 * MATCHES SCREENSHOT DESIGN
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import {WarningIcon} from '../../assets/icons';

const DeleteAccountStep1Screen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;

  const handleContinue = () => {
    navigation.navigate('DeleteAccountStep2');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('profile.deleteAccount.step1.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Warning Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              alignItems: 'center',
              marginTop: spacing.xl,
              marginBottom: spacing.xl,
            },
          ]}>
          <WarningIcon width={56} height={56} fill={colors.error} />
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: colors.error,
              textAlign: 'center',
              marginBottom: spacing.sm,
            },
          ]}>
          {t('profile.deleteAccount.step1.heading')}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: spacing.xl,
            },
          ]}>
          {t('profile.deleteAccount.step1.subtitle')}
        </Text>

        {/* What Will Be Deleted Card */}
        <Card
          style={{marginBottom: spacing.lg, backgroundColor: colors.surface}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.base,
              },
            ]}>
            {t('profile.deleteAccount.step1.whatWillBeDeleted')}
          </Text>

          <View style={[styles.warningItem, {marginBottom: spacing.sm}]}>
            <Text style={[styles.warningX, {color: colors.error}]}>✕</Text>
            <Text
              style={[
                styles.warningText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('profile.deleteAccount.step1.warning1')}
            </Text>
          </View>

          <View style={[styles.warningItem, {marginBottom: spacing.sm}]}>
            <Text style={[styles.warningX, {color: colors.error}]}>✕</Text>
            <Text
              style={[
                styles.warningText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('profile.deleteAccount.step1.warning2')}
            </Text>
          </View>

          <View style={[styles.warningItem, {marginBottom: spacing.sm}]}>
            <Text style={[styles.warningX, {color: colors.error}]}>✕</Text>
            <Text
              style={[
                styles.warningText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('profile.deleteAccount.step1.warning3')}
            </Text>
          </View>

          <View style={styles.warningItem}>
            <Text style={[styles.warningX, {color: colors.error}]}>✕</Text>
            <Text
              style={[
                styles.warningText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('profile.deleteAccount.step1.warning4')}
            </Text>
          </View>
        </Card>

        {/* Final Warning Card */}
        <Card
          style={[
            styles.finalWarningCard,
            {
              backgroundColor: colors.warningLight,
              borderColor: colors.warning,
              borderWidth: 1,
              marginBottom: spacing.xl,
            },
          ]}>
          <View style={styles.warningRow}>
            <WarningIcon width={15} height={15} fill={colors.warning}/>
            <Text
              style={[
                styles.finalWarningText,
                {
                  color: colors.textPrimary,
                  flex: 1,
                },
              ]}>
              {t('profile.deleteAccount.step1.finalWarning')}
            </Text>
          </View>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={t('profile.deleteAccount.step1.continueButton')}
            onPress={handleContinue}
            fullWidth
            style={{
              backgroundColor: colors.error,
              marginBottom: spacing.md,
            }}
          />

          <SecondaryButton
            title={t('profile.deleteAccount.step1.keepButton')}
            onPress={() => navigation.goBack()}
            fullWidth
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
  scrollContent: {},
  iconContainer: {},
  iconCircle: {},
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningX: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    fontSize: 15,
    lineHeight: 22,
  },
  finalWarningCard: {},
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIconLarge: {
    fontSize: 24,
  },
  finalWarningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {},
});

export default DeleteAccountStep1Screen;
