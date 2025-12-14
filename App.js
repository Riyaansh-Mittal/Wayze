/**
 * Root App Component
 * Sets up providers and initializes app
 *
 * BATCH 3 UPDATE: Added service layer testing
 */

import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar, View, Text, StyleSheet, ScrollView} from 'react-native';

// Providers
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import {
  ToastProvider,
  useToast,
} from './src/components/common/Toast/ToastProvider';

// Components
import PrimaryButton from './src/components/common/Button/PrimaryButton';
import SecondaryButton from './src/components/common/Button/SecondaryButton';
import Card from './src/components/common/Card/Card';
import Spinner from './src/components/common/Loading/Spinner';
import AppBar from './src/components/navigation/AppBar';

// Services (NEW - Batch 3)
import {
  AuthService,
  VehiclesService,
  SearchService,
  ReferralService,
} from './src/services/api';
import SecureStorage from './src/services/storage/SecureStorage';

import {COLORS, TYPOGRAPHY, SPACING, LAYOUT} from './src/config/theme';
import {FEATURE_FLAGS} from './src/config/constants';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <ServiceLayerDemo />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// Service Layer Demo Component
const ServiceLayerDemo = () => {
  const {t} = useTheme();
  const {showSuccess, showError, showInfo} = useToast();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  // ✅ FIXED: Memoized function
  const loadUserData = useCallback(async () => {
    try {
      const storedUser = await SecureStorage.getUserData();
      if (storedUser) {
        setUserData(storedUser);
        showInfo('Welcome back!');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  }, [showInfo]);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Test 1: Mock Login
  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await AuthService.socialLogin({
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        email: 'test.user@example.com',
        phoneNumber: '9876543210',
        deviceType: 'ANDROID',
        fcmToken: 'test-fcm-token',
      });

      if (response.success) {
        setUserData(response.data.user);

        // Save to storage
        await SecureStorage.saveTokens(
          response.data.token,
          response.data.refreshToken,
        );
        await SecureStorage.saveUserData(response.data.user);

        showSuccess('Login successful! 🎉');
      }
    } catch (error) {
      showError('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Get Vehicles
  const testGetVehicles = async () => {
    if (!userData) {
      showError('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await VehiclesService.list(userData._id);

      if (response.success) {
        setVehicles(response.data);
        showSuccess(`Found ${response.data.length} vehicles`);
      }
    } catch (error) {
      showError('Failed to get vehicles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Search Vehicle
  const testSearchVehicle = async () => {
    setLoading(true);
    setSearchResult(null);
    try {
      const response = await SearchService.searchVehicle('MH01AB1234');

      if (response.success) {
        setSearchResult(response.data);
        if (response.data.found) {
          showSuccess('Vehicle found! ✅');
        } else {
          showInfo('Vehicle not found');
        }
      }
    } catch (error) {
      showError('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Validate Referral Code
  const testReferralCode = async () => {
    setLoading(true);
    try {
      const response = await ReferralService.validate('RIYA2024');

      if (response.success && response.data.valid) {
        showSuccess(`Valid code! Get ${response.data.reward} free calls 🎁`);
      }
    } catch (error) {
      showError('Invalid referral code');
    } finally {
      setLoading(false);
    }
  };

  // Test 5: Add Vehicle
  const testAddVehicle = async () => {
    if (!userData) {
      showError('Please login first');
      return;
    }

    setLoading(true);
    try {
      const newVehicle = {
        plateNumber: 'MH05XY' + Math.floor(Math.random() * 10000),
        rcNumber: 'MH05202400' + Math.floor(Math.random() * 100000),
        vehicleType: '2-wheeler',
        contactPhone: '9876543210',
        contactMethods: {
          phone: true,
          sms: true,
          whatsapp: false,
          email: false,
        },
      };

      const response = await VehiclesService.create(userData._id, newVehicle);

      if (response.success) {
        showSuccess('Vehicle added successfully! 🚗');
        // Refresh vehicle list
        testGetVehicles();
      }
    } catch (error) {
      showError('Failed to add vehicle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test 6: Logout
  const testLogout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      await SecureStorage.clearAuth();

      setUserData(null);
      setVehicles([]);
      setSearchResult(null);

      showSuccess('Logged out successfully');
    } catch (error) {
      showError('Logout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <AppBar
        title="QR Parking - Service Layer"
        rightIcon={<Text style={styles.icon}>⚙️</Text>}
        onRightPress={() =>
          showInfo(`Mock Mode: ${FEATURE_FLAGS.USE_MOCK_DATA ? 'ON' : 'OFF'}`)
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔌 Batch 3 Complete!</Text>
          <Text style={styles.sectionSubtitle}>
            Service layer with mock data is ready. Test the APIs below:
          </Text>
          <Card style={{marginTop: SPACING.base}}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Mock Mode:</Text>
              <Text style={[styles.statusValue, {color: COLORS.success}]}>
                {FEATURE_FLAGS.USE_MOCK_DATA ? 'ENABLED ✓' : 'DISABLED'}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>User:</Text>
              <Text style={styles.statusValue}>
                {userData ? userData.fullName : 'Not logged in'}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Vehicles:</Text>
              <Text style={styles.statusValue}>{vehicles.length}</Text>
            </View>
          </Card>
        </View>

        {/* Authentication Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Authentication</Text>
          {!userData ? (
            <PrimaryButton
              title="Test Login (Mock)"
              onPress={testLogin}
              loading={loading}
              fullWidth
              icon={<Text style={{color: COLORS.white}}>🔓</Text>}
            />
          ) : (
            <SecondaryButton
              title="Test Logout"
              onPress={testLogout}
              loading={loading}
              fullWidth
              icon={<Text style={{color: COLORS.primary}}>🔒</Text>}
            />
          )}
        </View>

        {/* Vehicle Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚗 Vehicles Service</Text>
          <SecondaryButton
            title="Get My Vehicles"
            onPress={testGetVehicles}
            loading={loading}
            fullWidth
            disabled={!userData}
          />
          <View style={{height: SPACING.md}} />
          <SecondaryButton
            title="Add Random Vehicle"
            onPress={testAddVehicle}
            loading={loading}
            fullWidth
            disabled={!userData}
          />

          {vehicles.length > 0 && (
            <Card style={{marginTop: SPACING.base}}>
              <Text style={TYPOGRAPHY.captionBold}>Your Vehicles:</Text>
              {vehicles.map((vehicle, index) => (
                <View key={vehicle._id} style={styles.vehicleItem}>
                  <Text style={TYPOGRAPHY.body}>
                    {index + 1}. {vehicle.plateNumber}
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, {marginTop: 2}]}>
                    {vehicle.vehicleType} • {vehicle.stats.totalSearches}{' '}
                    searches
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </View>

        {/* Search Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Search Service</Text>
          <SecondaryButton
            title="Search Vehicle (MH01AB1234)"
            onPress={testSearchVehicle}
            loading={loading}
            fullWidth
          />

          {searchResult && (
            <Card style={{marginTop: SPACING.base}}>
              {searchResult.found ? (
                <>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Status:</Text>
                    <Text style={[styles.resultValue, {color: COLORS.success}]}>
                      Found ✓
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Plate:</Text>
                    <Text style={styles.resultValue}>
                      {searchResult.vehicle.plateNumber}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Type:</Text>
                    <Text style={styles.resultValue}>
                      {searchResult.vehicle.vehicleType}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Owner:</Text>
                    <Text style={styles.resultValue}>
                      {searchResult.vehicle.owner.name}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={[TYPOGRAPHY.body, {color: COLORS.textSecondary}]}>
                  ❌ {searchResult.message}
                </Text>
              )}
            </Card>
          )}
        </View>

        {/* Referral Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎁 Referral Service</Text>
          <SecondaryButton
            title="Validate Code (RIYA2024)"
            onPress={testReferralCode}
            loading={loading}
            fullWidth
          />
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={TYPOGRAPHY.captionBold}>💡 How It Works:</Text>
          <Text style={[TYPOGRAPHY.caption, {marginTop: SPACING.xs}]}>
            • All services use mock data in development{'\n'}• Switch to real
            API by changing USE_MOCK_DATA flag{'\n'}• Mock APIs simulate
            realistic delays{'\n'}• Data persists in AsyncStorage{'\n'}• Ready
            for real backend integration
          </Text>
        </Card>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Spinner size="large" />
            <Text style={[TYPOGRAPHY.caption, {marginTop: SPACING.sm}]}>
              Calling mock API...
            </Text>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{height: SPACING.xl}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
  },
  section: {
    marginBottom: LAYOUT.sectionGap,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  icon: {
    fontSize: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  statusValue: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  vehicleItem: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralBorder,
    marginTop: SPACING.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  resultLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  resultValue: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  infoCard: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    marginTop: SPACING.base,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
});

export default App;
