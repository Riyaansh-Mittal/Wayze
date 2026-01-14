/**
 * Find Vehicle Screen
 * Main search screen with input and recent searches
 * FULLY THEME-AWARE WITH CORRECT TRANSLATION KEYS
 */

import React, {useState} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSearch} from '../../contexts/SearchContext';
import {useTheme} from '../../contexts/ThemeContext';
import {validatePlateNumber} from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import TextInput from '../../components/common/Input/TextInput';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import Card from '../../components/common/Card/Card';
import {SearchIcon, SearchIcon as SearchSvg} from '../../assets/icons';

const FindVehicleScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {searchVehicle, recentSearches, clearRecentSearches, isSearching} =
    useSearch();

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
      Alert.alert(t('common.error'), result.error || t('search.searchFailed'));
    }
  };

  const handleRecentSearchPress = search => {
    setSearchQuery(search.plateNumber);
  };

  const handleClearAllSearches = () => {
    Alert.alert(
      t('search.clearRecent.title') || 'Clear Recent Searches',
      t('search.clearRecent.message') ||
        'Are you sure you want to clear all recent searches?',
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => clearRecentSearches(),
        },
      ],
    );
  };

  const getTimeAgo = timestamp => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return t('time.justNow');
    if (hours < 24) return t('time.hoursAgo', {count: hours});
    if (days < 7) return t('time.daysAgo', {count: days});
    return t('time.weeksAgo', {count: Math.floor(days / 7)});
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar title={t('search.title')} showBack={false} />

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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Search Input Section */}
          <View style={[styles.searchSection, {marginBottom: spacing.lg}]}>
            <TextInput
              label={t('search.inputLabel')}
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text.toUpperCase());
                setError('');
              }}
              placeholder={
                t('search.inputPlaceholder') || 'MH12AB1234 or 26BH1234AA'
              } // ✅ Updated
              autoCapitalize="characters"
              maxLength={15} // ✅ Updated (was 13)
              error={error}
              helperText={
                !error
                  ? t('search.inputHelper') ||
                    'Standard, BH series, or Delhi special formats' // ✅ Updated
                  : undefined
              }
            />

            <PrimaryButton
              title={t('search.searchButton')}
              onPress={handleSearch}
              loading={isSearching}
              disabled={searchQuery.length < 8} // ✅ Updated (was 6)
              fullWidth
              icon={<SearchSvg width={20} height={20} fill={colors.white} />}
              style={{marginTop: spacing.base}}
            />
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={[styles.recentSection, {marginBottom: spacing.lg}]}>
              <View style={[styles.recentHeader, {marginBottom: spacing.md}]}>
                <Text style={[styles.recentTitle, {color: colors.textPrimary}]}>
                  {t('search.recentTitle')}
                </Text>
                <TouchableOpacity onPress={handleClearAllSearches}>
                  <Text style={[styles.clearAllText, {color: colors.error}]}>
                    {t('common.clearAll') || t('common.delete')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Card style={{padding: 0}}>
                {recentSearches.map((search, index) => {
                  // ✅ SAFETY CHECK - Skip invalid items
                  if (
                    !search ||
                    typeof search !== 'object' ||
                    !search.plateNumber
                  ) {
                    console.warn('Invalid search item:', search);
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      key={`${search.plateNumber}-${index}`}
                      style={[
                        styles.recentItem,
                        {
                          paddingVertical: spacing.md,
                          paddingHorizontal: spacing.base,
                          borderBottomWidth:
                            index < recentSearches.length - 1 ? 1 : 0,
                          borderBottomColor: colors.border,
                        },
                      ]}
                      onPress={() => handleRecentSearchPress(search)}
                      activeOpacity={0.7}>
                      <View
                        style={[
                          styles.searchIconContainer,
                          {marginRight: spacing.sm},
                        ]}>
                        <SearchSvg
                          width={20}
                          height={20}
                          fill={colors.primary}
                        />
                      </View>
                      <View style={styles.recentInfo}>
                        <Text
                          style={[
                            styles.recentPlate,
                            {color: colors.textPrimary},
                          ]}>
                          {String(search.plateNumber)} {/* ✅ Ensure string */}
                        </Text>
                        {search.found !== undefined && (
                          <Text
                            style={[
                              styles.recentStatus,
                              {
                                color: search.found
                                  ? colors.success
                                  : colors.textSecondary,
                                fontSize: 12,
                                marginTop: 2,
                              },
                            ]}>
                            {search.found ? '✓ Found' : 'Not found'}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.recentTime,
                          {
                            color: colors.textSecondary,
                            marginRight: spacing.sm,
                          },
                        ]}>
                        {search.timestamp
                          ? getTimeAgo(search.timestamp)
                          : 'Recently'}{' '}
                        {/* ✅ Safety check */}
                      </Text>
                      <Text
                        style={[styles.chevron, {color: colors.textSecondary}]}>
                        ›
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </Card>
            </View>
          )}

          {/* Empty State */}
          {recentSearches.length === 0 && (
            <View
              style={[
                styles.emptyState,
                {
                  paddingVertical: spacing.xxxl,
                  alignItems: 'center',
                },
              ]}>
              <View style={{marginBottom: spacing.md}}>
                <SearchSvg
                  width={64}
                  height={64}
                  fill={colors.primary}
                  opacity={0.3}
                />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.sm,
                  },
                ]}>
                {t('search.recentEmpty') || 'No Recent Searches'}
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
  scrollContent: {},
  searchSection: {},
  recentSection: {},
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
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentInfo: {
    flex: 1,
  },
  recentPlate: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentStatus: {
    fontSize: 12,
  },
  recentTime: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  emptyState: {},
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
