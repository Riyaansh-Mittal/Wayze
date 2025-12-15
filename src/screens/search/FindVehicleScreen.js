/**
 * Find Vehicle Screen
 * Main search screen with input and recent searches
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
import {validatePlateNumber} from '../../utils/validators';
import {COLORS, TYPOGRAPHY, SPACING, LAYOUT} from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import SearchInput from '../../components/search/SearchInput';
import RecentSearchItem from '../../components/search/RecentSearchItem';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Card from '../../components/common/Card/Card';

const FindVehicleScreen = ({navigation}) => {
  const {
    searchVehicle,
    recentSearches,
    clearRecentSearches,
  } = useSearch();

  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    // Clear previous error
    setError('');

    // Validate plate number
    const validation = validatePlateNumber(searchQuery);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // Perform search (no registration check required)
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
        'Search Failed',
        result.error || 'Unable to search. Please try again.',
      );
    }
  };

  const handleRecentSearchPress = search => {
    setSearchQuery(search.plateNumber);
  };

  const handleDeleteRecentSearch = plateNumber => {
    Alert.alert('Clear Search', `Remove ${plateNumber} from recent searches?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Info', 'Use Clear All to remove searches');
        },
      },
    ]);
  };

  const handleClearAllSearches = () => {
    Alert.alert('Clear All', 'Remove all recent searches?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => clearRecentSearches(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar title="Find Vehicle" showBack={false} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Search Input */}
          <View style={styles.searchSection}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSearch}
              error={error}
              autoFocus={false}
            />
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClearAllSearches}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.recentList}>
                {recentSearches.map((search, index) => (
                  <RecentSearchItem
                    key={`${search.plateNumber}-${index}`}
                    search={{
                      ...search,
                      searchedAt: search.timestamp,
                    }}
                    onPress={handleRecentSearchPress}
                    onDelete={handleDeleteRecentSearch}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {recentSearches.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No Recent Searches"
              message="Start by entering a vehicle registration number above"
            />
          )}

          {/* How it Works */}
          <Card style={styles.howItWorksCard}>
            <Text style={styles.howItWorksTitle}>How it works</Text>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Enter the vehicle registration number
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                View owner's contact preferences
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Use 1 credit to contact via phone, SMS, or WhatsApp
              </Text>
            </View>
          </Card>

          {/* Optional Info Card */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>💡</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Want to be reachable too?</Text>
              <Text style={styles.infoDescription}>
                Register your vehicle so others can contact you when they need to reach you
              </Text>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
    paddingBottom: SPACING.xxxl,
  },
  searchSection: {
    marginBottom: SPACING.lg,
  },
  recentSection: {
    marginBottom: SPACING.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  recentTitle: {
    ...TYPOGRAPHY.h3,
  },
  clearAllText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '600',
  },
  recentList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  howItWorksCard: {
    marginTop: SPACING.lg,
  },
  howItWorksTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.base,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  stepText: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    marginTop: SPACING.md,
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
    marginBottom: SPACING.xs,
  },
  infoDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default FindVehicleScreen;
