/**
 * Find Vehicle Screen
 * Main search screen with input and recent searches
 * FULLY THEME-AWARE WITH CORRECT TRANSLATION KEYS
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSearch } from '../../contexts/SearchContext';
import { useTheme } from '../../contexts/ThemeContext';
import { validatePlateNumber } from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import TextInput from '../../components/common/Input/TextInput';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import Card from '../../components/common/Card/Card';
import {
  SearchIcon,
  SearchIcon as SearchSvg,
} from '../../assets/icons';

const FindVehicleScreen = ({ navigation }) => {
  const { t, theme } = useTheme();
  const { colors, spacing, layout } = theme;
  const {
    searchVehicle,
    recentSearches,
    clearRecentSearches,
    isLoading,
  } = useSearch();

  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');

    // Validate plate number
    const validation = validatePlateNumber(searchQuery);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // Perform search
    const result = await searchVehicle(searchQuery);

    if (result.success) {
      if (result.data?.found) {
        navigation.navigate('SearchResultFound', {
          vehicle: result.data.vehicle,
          searchQuery,
        });
      } else {
        navigation.navigate('SearchResultNotFound', {
          searchQuery,
        });
      }
    } else {
      Alert.alert(
        t('common.error'),
        result.error || t('search.searchFailed'),
      );
    }
  };

  const handleRecentSearchPress = (search) => {
    setSearchQuery(search.plateNumber);
  };

  const handleClearAllSearches = () => {
    Alert.alert(
      t('search.recentTitle'),
      t('search.recentEmpty'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => clearRecentSearches(),
        },
      ]
    );
  };

  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {return t('time.justNow');}
    if (hours < 24) {return t('time.hoursAgo', { count: hours });}
    if (days < 7) {return t('time.daysAgo', { count: days });}
    return t('time.weeksAgo', { count: Math.floor(days / 7) });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <AppBar
        title={t('search.title')}
        showBack={false}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, {
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl,
          }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Search Input Section */}
          <View style={[styles.searchSection, { marginBottom: spacing.lg }]}>
            <TextInput
              label={t('search.inputLabel')}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text.toUpperCase());
                setError('');
              }}
              placeholder={t('search.inputPlaceholder')}
              autoCapitalize="characters"
              maxLength={13}
              error={error}
              helperText={!error ? t('search.inputHelper') : undefined}
            />

            <PrimaryButton
              title={t('search.searchButton')}
              onPress={handleSearch}
              loading={isLoading}
              disabled={searchQuery.length < 6}
              fullWidth
              icon={<SearchSvg width={20} height={20} fill={colors.white} />}
              style={{ marginTop: spacing.base }}
            />
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={[styles.recentSection, { marginBottom: spacing.lg }]}>
              <View style={[styles.recentHeader, { marginBottom: spacing.md }]}>
                <Text style={[styles.recentTitle, { color: colors.textPrimary }]}>
                  {t('search.recentTitle')}
                </Text>
                <TouchableOpacity onPress={handleClearAllSearches}>
                  <Text style={[styles.clearAllText, { color: colors.error }]}>
                    {t('common.delete')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Card style={{ padding: 0 }}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={`${search.plateNumber}-${index}`}
                    style={[
                      styles.recentItem,
                      {
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.base,
                        borderBottomWidth: index < recentSearches.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                      }
                    ]}
                    onPress={() => handleRecentSearchPress(search)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.searchIcon, { marginRight: spacing.sm }]}>
                      <SearchSvg width={20} height={20} fill={colors.primary} />
                    </Text>
                    <View style={styles.recentInfo}>
                      <Text style={[styles.recentPlate, { color: colors.textPrimary }]}>
                        {search.plateNumber}
                      </Text>
                    </View>
                    <Text style={[styles.recentTime, { 
                      color: colors.textSecondary,
                      marginRight: spacing.sm,
                    }]}>
                      {getTimeAgo(search.timestamp)}
                    </Text>
                    <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                      ›
                    </Text>
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          )}

          {/* Empty State */}
          {recentSearches.length === 0 && (
            <View style={[styles.emptyState, {
              paddingVertical: spacing.xxxl,
              alignItems: 'center',
            }]}>
              <SearchSvg width={30} height={30} fill={colors.primary} />
              <Text style={[styles.emptyTitle, {
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              }]}>
                {t('search.recentEmpty')}
              </Text>
              <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                {t('search.inputHelper')}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Styles applied dynamically
  },
  searchSection: {
    // Styles applied dynamically
  },
  recentSection: {
    // Styles applied dynamically
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },
  recentInfo: {
    flex: 1,
  },
  recentPlate: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentTime: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  emptyState: {
    // Styles applied dynamically
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FindVehicleScreen;
