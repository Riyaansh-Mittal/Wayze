/**
 * Home Dashboard Screen
 * Main screen with segmented control for Find Owner / My Vehicles / Activity
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles } from '../../contexts/VehicleContext';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import Card from '../../components/common/Card/Card';

const SEGMENTS = {
  FIND_OWNER: 'find_owner',
  MY_VEHICLES: 'my_vehicles',
  ACTIVITY: 'activity',
};

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { vehicles } = useVehicles();

  const [activeSegment, setActiveSegment] = useState(SEGMENTS.FIND_OWNER);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {return 'Good morning';}
    if (hour < 18) {return 'Good afternoon';}
    return 'Good evening';
  };

  const userName = user?.fullName?.split(' ')[0] || 'User';
  const hasVehicles = vehicles.length > 0;

  // Navigation handlers
  const handleFindOwner = () => {
    navigation.navigate('Search', { screen: 'FindVehicle' });
  };

  const handleMyVehicles = () => {
    navigation.navigate('Vehicles', { screen: 'VehiclesList' });
  };

  const handleAddVehicle = () => {
    navigation.navigate('Vehicles', { screen: 'AddVehicle' });
  };

  const handleActivity = () => {
    navigation.navigate('Profile', { screen: 'ActivityHistory' });
  };

  // Render segmented control
  const renderSegmentedControl = () => (
    <View style={styles.segmentedControl}>
      <TouchableOpacity
        style={[
          styles.segment,
          activeSegment === SEGMENTS.FIND_OWNER && styles.segmentActive,
        ]}
        onPress={() => setActiveSegment(SEGMENTS.FIND_OWNER)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === SEGMENTS.FIND_OWNER && styles.segmentTextActive,
          ]}
        >
          Find owner
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.segment,
          activeSegment === SEGMENTS.MY_VEHICLES && styles.segmentActive,
        ]}
        onPress={() => setActiveSegment(SEGMENTS.MY_VEHICLES)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === SEGMENTS.MY_VEHICLES && styles.segmentTextActive,
          ]}
        >
          My vehicles
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.segment,
          activeSegment === SEGMENTS.ACTIVITY && styles.segmentActive,
        ]}
        onPress={() => setActiveSegment(SEGMENTS.ACTIVITY)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === SEGMENTS.ACTIVITY && styles.segmentTextActive,
          ]}
        >
          Activity
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render Find Owner card
  const renderFindOwnerCard = () => (
    <Card>
      <Text style={styles.cardTitle}>Find vehicle owner</Text>
      <Text style={styles.cardBody}>
        Search by plate and contact the owner if needed
      </Text>

      <PrimaryButton
        title="Start search"
        onPress={handleFindOwner}
        fullWidth
        icon={<Text style={styles.buttonIcon}>🔍</Text>}
        style={styles.primaryButton}
      />

      <Text style={styles.cardFooter}>
        Works even if vehicle owner is not in your contacts
      </Text>
    </Card>
  );

  // Render My Vehicles card
  const renderMyVehiclesCard = () => (
    <Card>
      <Text style={styles.cardTitle}>My vehicles</Text>
      <Text style={styles.cardBody}>
        {hasVehicles
          ? 'View and manage the vehicles linked to your profile'
          : "You haven't added any vehicles yet"}
      </Text>

      {hasVehicles ? (
        <>
          <PrimaryButton
            title="Open my vehicles"
            onPress={handleMyVehicles}
            fullWidth
            icon={<Text style={styles.buttonIcon}>🚗</Text>}
            style={styles.primaryButton}
          />

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={handleAddVehicle}
          >
            <Text style={styles.secondaryActionText}>Add new vehicle</Text>
          </TouchableOpacity>
        </>
      ) : (
        <PrimaryButton
          title="Add your first vehicle"
          onPress={handleAddVehicle}
          fullWidth
          icon={<Text style={styles.buttonIcon}>✚</Text>}
          style={styles.primaryButton}
        />
      )}
    </Card>
  );

  // Render Activity card
  const renderActivityCard = () => (
    <Card>
      <Text style={styles.cardTitle}>Recent activity</Text>
      <Text style={styles.cardBody}>
        See recent searches and contact requests related to your vehicles
      </Text>

      <PrimaryButton
        title="View activity"
        onPress={handleActivity}
        fullWidth
        icon={<Text style={styles.buttonIcon}>📊</Text>}
        style={styles.primaryButton}
      />

      <Text style={styles.cardFooter}>
        Only you can see this activity
      </Text>
    </Card>
  );

  // Render active segment content
  const renderActiveContent = () => {
    switch (activeSegment) {
      case SEGMENTS.FIND_OWNER:
        return renderFindOwnerCard();
      case SEGMENTS.MY_VEHICLES:
        return renderMyVehiclesCard();
      case SEGMENTS.ACTIVITY:
        return renderActivityCard();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="QR Parking"
        showNotification
        onNotificationPress={() => navigation.navigate('Profile', { screen: 'Notifications' })}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            {getGreeting()}, {userName}
          </Text>
          <Text style={styles.subGreeting}>
            What do you want to do today?
          </Text>
        </View>

        {/* Segmented Control */}
        {renderSegmentedControl()}

        {/* Active Content */}
        <View style={styles.contentSection}>
          {renderActiveContent()}
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
  greetingSection: {
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
  },
  subGreeting: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutralBg,
    borderRadius: 8,
    padding: 4,
    marginBottom: SPACING.base,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: COLORS.white,
  },
  contentSection: {
    marginTop: SPACING.base,
  },
  cardTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  cardBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
  },
  primaryButton: {
    marginTop: SPACING.sm,
  },
  buttonIcon: {
    color: COLORS.white,
    fontSize: 20,
  },
  cardFooter: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  secondaryAction: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  secondaryActionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default HomeScreen;
