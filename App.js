/**
 * Root App Component
 * Sets up all providers in correct order
 * 
 * BATCH 4 UPDATE: Added all context providers
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, View, Text, StyleSheet, ScrollView } from 'react-native';

// Providers
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ToastProvider } from './src/components/common/Toast/ToastProvider';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import { VehicleProvider } from './src/contexts/VehicleContext';
import { SearchProvider } from './src/contexts/SearchContext';
import { BalanceProvider } from './src/contexts/BalanceContext';

// Hooks
import {
  useAuth,
  useVehicles,
  useSearch,
  useBalance,
  useReferral,
} from './src/hooks';

// Components
import PrimaryButton from './src/components/common/Button/PrimaryButton';
import SecondaryButton from './src/components/common/Button/SecondaryButton';
import Card from './src/components/common/Card/Card';
import PlateInput from './src/components/common/Input/PlateInput';
import AppBar from './src/components/navigation/AppBar';

import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from './src/config/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <UserProvider>
                <VehicleProvider>
                  <SearchProvider>
                    <BalanceProvider>
                      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
                      <ContextDemo />
                    </BalanceProvider>
                  </SearchProvider>
                </VehicleProvider>
              </UserProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// Context Demo Component
// Context Demo Component
const ContextDemo = () => {
  const auth = useAuth();
  const vehicles = useVehicles();
  const search = useSearch();
  const balance = useBalance();
  const referral = useReferral();

  const [plateInput, setPlateInput] = useState('');

  // ✅ FIXED: Wrapped in useCallback
  const handleLogin = useCallback(async () => {
    await auth.socialLogin({
      firstName: 'Riyaansh',
      lastName: 'Mittal',
      fullName: 'Riyaansh Mittal',
      email: 'riyaansh@example.com',
      phoneNumber: '9876543210',
      deviceType: 'ANDROID',
      fcmToken: 'test-fcm-token',
    });
  }, [auth]);

  // Auto-login on mount for demo
  useEffect(() => {
    if (!auth.isAuthenticated) {
      handleLogin();
    }
  }, [auth.isAuthenticated, handleLogin]);

  const handleSearch = async () => {
    if (plateInput) {
      await search.searchWithValidation(plateInput);
    }
  };

  if (auth.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={TYPOGRAPHY.h2}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="QR Parking - State Management"
        rightIcon={<Text style={styles.icon}>👤</Text>}
        onRightPress={() => {}}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 Batch 4 Complete!</Text>
          <Text style={styles.sectionSubtitle}>
            Context API with custom hooks ready
          </Text>
        </View>

        {/* Auth Status */}
        <Card>
          <Text style={TYPOGRAPHY.h2}>Authentication</Text>
          <View style={styles.statusRow}>
            <Text style={TYPOGRAPHY.caption}>User:</Text>
            <Text style={TYPOGRAPHY.captionBold}>
              {auth.isAuthenticated ? auth.getUserName() : 'Not logged in'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={TYPOGRAPHY.caption}>Email:</Text>
            <Text style={TYPOGRAPHY.caption}>{auth.getUserEmail()}</Text>
          </View>
          {auth.isAuthenticated && (
            <SecondaryButton
              title="Logout"
              onPress={auth.logout}
              style={{ marginTop: SPACING.md }}
            />
          )}
        </Card>

        {/* Balance */}
        <View style={styles.section}>
          <Card>
            <Text style={TYPOGRAPHY.h2}>Call Balance</Text>
            <View style={styles.balanceContainer}>
              <Text style={[styles.balanceAmount, { color: balance.getBalanceColor() }]}>
                {balance.getFormattedBalance()}
              </Text>
              <Text style={TYPOGRAPHY.caption}>
                Status: {balance.getBalanceStatus()}
              </Text>
            </View>
            <SecondaryButton
              title="View Balance History"
              onPress={balance.getBalanceHistory}
              loading={balance.isLoading}
              style={{ marginTop: SPACING.md }}
            />
          </Card>
        </View>

        {/* Vehicles */}
        <View style={styles.section}>
          <Card>
            <Text style={TYPOGRAPHY.h2}>My Vehicles</Text>
            <View style={styles.statusRow}>
              <Text style={TYPOGRAPHY.caption}>Total:</Text>
              <Text style={TYPOGRAPHY.captionBold}>
                {vehicles.getVehicleCount()}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={TYPOGRAPHY.caption}>Total Searches:</Text>
              <Text style={TYPOGRAPHY.captionBold}>
                {vehicles.getTotalSearches()}
              </Text>
            </View>
            <SecondaryButton
              title="Refresh Vehicles"
              onPress={vehicles.refreshVehicles}
              loading={vehicles.isRefreshing}
              style={{ marginTop: SPACING.md }}
            />
          </Card>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <Card>
            <Text style={TYPOGRAPHY.h2}>Search Vehicle</Text>
            <PlateInput
              value={plateInput}
              onChangeText={setPlateInput}
              style={{ marginTop: SPACING.md }}
            />
            <PrimaryButton
              title="Search"
              onPress={handleSearch}
              loading={search.isSearching}
              fullWidth
              style={{ marginTop: SPACING.md }}
            />

            {search.searchResult && (
              <View style={styles.resultContainer}>
                <Text style={TYPOGRAPHY.captionBold}>
                  {search.isResultFound() ? '✅ Vehicle Found!' : '❌ Not Found'}
                </Text>
                {search.isResultFound() && (
                  <>
                    <Text style={TYPOGRAPHY.caption}>
                      Plate: {search.searchResult.vehicle.plateNumber}
                    </Text>
                    <Text style={TYPOGRAPHY.caption}>
                      Owner: {search.searchResult.vehicle.owner.name}
                    </Text>
                  </>
                )}
              </View>
            )}

            <Text style={[TYPOGRAPHY.caption, { marginTop: SPACING.md }]}>
              Recent searches: {search.recentSearches.length}
            </Text>
          </Card>
        </View>

        {/* Referral */}
        <View style={styles.section}>
          <Card>
            <Text style={TYPOGRAPHY.h2}>Referral Program</Text>
            <View style={styles.statusRow}>
              <Text style={TYPOGRAPHY.caption}>Your Code:</Text>
              <Text style={TYPOGRAPHY.captionBold}>
                {referral.getReferralCode() || 'N/A'}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={TYPOGRAPHY.caption}>Total Referrals:</Text>
              <Text style={TYPOGRAPHY.captionBold}>
                {referral.getTotalReferrals()}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={TYPOGRAPHY.caption}>Total Earned:</Text>
              <Text style={TYPOGRAPHY.captionBold}>
                {referral.getTotalEarnings()} calls
              </Text>
            </View>
            <SecondaryButton
              title="Share Referral Code"
              onPress={referral.shareReferralCode}
              style={{ marginTop: SPACING.md }}
            />
          </Card>
        </View>

        {/* Info */}
        <Card style={styles.infoCard}>
          <Text style={TYPOGRAPHY.captionBold}>✅ What's Working:</Text>
          <Text style={[TYPOGRAPHY.caption, { marginTop: SPACING.xs }]}>
            • Auth context with login/logout{'\n'}
            • Vehicle context with CRUD operations{'\n'}
            • Search context with history{'\n'}
            • Balance context with referrals{'\n'}
            • Custom hooks for clean code{'\n'}
            • Automatic state persistence{'\n'}
            • Optimized re-renders
          </Text>
        </Card>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
  },
  section: {
    marginBottom: LAYOUT.cardGap,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
  },
  icon: {
    fontSize: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.base,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  resultContainer: {
    marginTop: SPACING.base,
    padding: SPACING.md,
    backgroundColor: COLORS.neutralLight,
    borderRadius: 8,
  },
  infoCard: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    marginTop: SPACING.base,
  },
});

export default App;
