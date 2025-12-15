/**
 * Search Result Not Found Screen
 * Shows when vehicle is not registered
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';

const SearchResultNotFoundScreen = ({ navigation, route }) => {
  const { searchQuery } = route.params;

  const handleSearchAgain = () => {
    navigation.goBack();
  };

  const handleInviteOwner = () => {
    // TODO: Implement invite functionality
    // Share app link with plate number context
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Not Found"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Not Found Header */}
        <View style={styles.header}>
          <Text style={styles.notFoundIcon}>🔍</Text>
          <Text style={styles.title}>Vehicle Not Found</Text>
          <Text style={styles.subtitle}>
            {searchQuery} is not registered in our system yet
          </Text>
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>What does this mean?</Text>
            <Text style={styles.infoDescription}>
              The owner of this vehicle hasn't registered it on our platform yet.
              You can invite them to join!
            </Text>
          </View>
        </Card>

        {/* Why Register Card */}
        <Card>
          <Text style={styles.sectionTitle}>Why should they register?</Text>

          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>
              Get notified when someone needs to contact them
            </Text>
          </View>

          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>
              Control how they want to be contacted
            </Text>
          </View>

          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>
              View search statistics for their vehicle
            </Text>
          </View>

          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>
              Free to register and use
            </Text>
          </View>
        </Card>

        {/* Suggestions Card */}
        <Card style={styles.suggestionsCard}>
          <Text style={styles.sectionTitle}>What you can do</Text>

          <View style={styles.suggestion}>
            <Text style={styles.suggestionNumber}>1</Text>
            <Text style={styles.suggestionText}>
              Double-check the vehicle number and try again
            </Text>
          </View>

          <View style={styles.suggestion}>
            <Text style={styles.suggestionNumber}>2</Text>
            <Text style={styles.suggestionText}>
              Leave a note on the vehicle windshield
            </Text>
          </View>

          <View style={styles.suggestion}>
            <Text style={styles.suggestionNumber}>3</Text>
            <Text style={styles.suggestionText}>
              Invite the owner to register on our platform
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Search Another Vehicle"
            onPress={handleSearchAgain}
            fullWidth
          />

          <SecondaryButton
            title="Invite Vehicle Owner"
            onPress={handleInviteOwner}
            fullWidth
            style={{ marginTop: SPACING.md }}
            icon={<Text style={{ color: COLORS.primary }}>📤</Text>}
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
  notFoundIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
    opacity: 0.6,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.md,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.sm,
  },
  infoDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.base,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  benefitIcon: {
    fontSize: 20,
    color: COLORS.success,
    marginRight: SPACING.sm,
    fontWeight: '700',
  },
  benefitText: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  suggestionsCard: {
    marginTop: SPACING.md,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  suggestionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 28,
    ...TYPOGRAPHY.bodyBold,
    marginRight: SPACING.md,
  },
  suggestionText: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  actions: {
    marginTop: SPACING.xl,
  },
});

export default SearchResultNotFoundScreen;
