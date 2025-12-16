/**
 * Search Result Not Found Screen
 * Shows when vehicle is not registered
 * FULLY THEME-AWARE WITH CORRECT TRANSLATION KEYS
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
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';

const SearchResultNotFoundScreen = ({ navigation, route }) => {
  const { t, theme } = useTheme();
  const { colors, spacing, layout } = theme;
  const { searchQuery } = route.params;

  const handleSearchAgain = () => {
    navigation.goBack();
  };

  const handleShareApp = () => {
    // TODO: Implement share functionality
    console.log('Share app');
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <AppBar
        title={t('search.results.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          padding: layout.screenPadding,
          paddingBottom: spacing.xxxl,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Not Found Header */}
        <View style={[styles.header, {
          alignItems: 'center',
          marginBottom: spacing.xl,
        }]}>
          <Text style={[styles.notFoundIcon, { marginBottom: spacing.md }]}>
            🚫
          </Text>
          <Text style={[styles.title, {
            color: colors.textPrimary,
            marginBottom: spacing.sm,
          }]}>
            {t('search.results.notFound.title')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('search.results.notFound.message', { plate: searchQuery })}
          </Text>
        </View>

        {/* What You Can Do Section */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[styles.sectionTitle, {
            color: colors.textPrimary,
            marginBottom: spacing.base,
          }]}>
            {t('search.results.notFound.suggestionsTitle')}
          </Text>

          <View style={[styles.suggestion, { marginBottom: spacing.md }]}>
            <Text style={[styles.suggestionIcon, { marginRight: spacing.md }]}>
              📝
            </Text>
            <Text style={[styles.suggestionText, {
              color: colors.textPrimary,
              flex: 1,
            }]}>
              {t('search.results.notFound.suggestion1')}
            </Text>
          </View>

          <View style={[styles.suggestion, { marginBottom: spacing.md }]}>
            <Text style={[styles.suggestionIcon, { marginRight: spacing.md }]}>
              📅
            </Text>
            <Text style={[styles.suggestionText, {
              color: colors.textPrimary,
              flex: 1,
            }]}>
              {t('search.results.notFound.suggestion2')}
            </Text>
          </View>

          <View style={styles.suggestion}>
            <Text style={[styles.suggestionIcon, { marginRight: spacing.md }]}>
              📤
            </Text>
            <Text style={[styles.suggestionText, {
              color: colors.textPrimary,
              flex: 1,
            }]}>
              {t('search.results.notFound.suggestion3')}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <PrimaryButton
            title={t('search.results.notFound.searchAgainButton')}
            onPress={handleSearchAgain}
            fullWidth
            style={{ marginBottom: spacing.md }}
          />

          <SecondaryButton
            title={t('search.results.notFound.shareButton')}
            onPress={handleShareApp}
            fullWidth
            icon={<Text style={{ color: colors.primary, fontSize: 18 }}>📤</Text>}
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
    // Styles applied dynamically
  },
  header: {
    // Styles applied dynamically
  },
  notFoundIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggestionIcon: {
    fontSize: 24,
  },
  suggestionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    // Styles applied dynamically
  },
});

export default SearchResultNotFoundScreen;
