/**
 * Delete Account Step 1 Screen
 * Warning about account deletion consequences
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';

const DeleteAccountStep1Screen = ({ navigation }) => {
  const { t } = useTheme();

  const handleContinue = () => {
    navigation.navigate('DeleteAccountStep2');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title={t('deleteAccount.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning Icon */}
        <View style={styles.header}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.title}>{t('deleteAccount.warning')}</Text>
        </View>

        {/* Consequences List */}
        <Card style={styles.warningCard}>
          <Text style={styles.cardTitle}>{t('deleteAccount.willHappen')}</Text>

          <View style={styles.consequenceItem}>
            <Text style={styles.consequenceIcon}>🗑️</Text>
            <Text style={styles.consequenceText}>
              {t('deleteAccount.allVehiclesDeleted')}
            </Text>
          </View>

          <View style={styles.consequenceItem}>
            <Text style={styles.consequenceIcon}>📊</Text>
            <Text style={styles.consequenceText}>
              {t('deleteAccount.activityDeleted')}
            </Text>
          </View>

          <View style={styles.consequenceItem}>
            <Text style={styles.consequenceIcon}>💰</Text>
            <Text style={styles.consequenceText}>
              {t('deleteAccount.balanceLost')}
            </Text>
          </View>

          <View style={styles.consequenceItem}>
            <Text style={styles.consequenceIcon}>🔗</Text>
            <Text style={styles.consequenceText}>
              {t('deleteAccount.referralsLost')}
            </Text>
          </View>

          <View style={styles.consequenceItem}>
            <Text style={styles.consequenceIcon}>🚫</Text>
            <Text style={styles.consequenceText}>
              {t('deleteAccount.cantRecover')}
            </Text>
          </View>
        </Card>

        {/* Alternative Options */}
        <Card>
          <Text style={styles.cardTitle}>{t('deleteAccount.alternativeTitle')}</Text>
          <Text style={styles.cardBody}>
            {t('deleteAccount.alternativeText')}
          </Text>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <SecondaryButton
            title={t('deleteAccount.continueDelete')}
            onPress={handleContinue}
            fullWidth
            style={styles.deleteButton}
          />

          <PrimaryButton
            title={t('common.cancel')}
            onPress={() => navigation.goBack()}
            fullWidth
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  warningIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.error,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
    marginBottom: SPACING.base,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.base,
  },
  cardBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  consequenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  consequenceIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  consequenceText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.error,
  },
  actions: {
    marginTop: SPACING.xl,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
});

export default DeleteAccountStep1Screen;
