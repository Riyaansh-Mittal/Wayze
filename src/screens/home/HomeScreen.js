/**
 * Home Dashboard Screen
 * Main screen with segmented control for Find Owner / My Vehicles / Activity
 * FULLY THEME-AWARE
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
import { useTheme } from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import Card from '../../components/common/Card/Card';

const SEGMENTS = {
  FIND_OWNER: 'find_owner',
  MY_VEHICLES: 'my_vehicles',
  ACTIVITY: 'activity',
};

const HomeScreen = ({ navigation }) => {
  const { t, theme } = useTheme();
  const { colors, spacing, layout } = theme;
  const { user } = useAuth();
  const { vehicles } = useVehicles();

  const [activeSegment, setActiveSegment] = useState(SEGMENTS.FIND_OWNER);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {return t?.('home.greeting') || 'Good morning';}
    if (hour < 18) {return t?.('home.greetingAfternoon') || 'Good afternoon';}
    return t?.('home.greetingEvening') || 'Good evening';
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
    <View style={[styles.segmentedControl, {
      backgroundColor: colors.neutralLight,
      padding: 4,
      marginBottom: spacing.base,
    }]}>
      <TouchableOpacity
        style={[
          styles.segment,
          { paddingVertical: spacing.sm },
          activeSegment === SEGMENTS.FIND_OWNER && { backgroundColor: colors.primary },
        ]}
        onPress={() => setActiveSegment(SEGMENTS.FIND_OWNER)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            { 
              color: activeSegment === SEGMENTS.FIND_OWNER ? colors.white : colors.textSecondary,
            }
          ]}
        >
          {t?.('home.tabs.findOwner') || 'Find owner'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.segment,
          { paddingVertical: spacing.sm },
          activeSegment === SEGMENTS.MY_VEHICLES && { backgroundColor: colors.primary },
        ]}
        onPress={() => setActiveSegment(SEGMENTS.MY_VEHICLES)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            { 
              color: activeSegment === SEGMENTS.MY_VEHICLES ? colors.white : colors.textSecondary,
            }
          ]}
        >
          {t?.('home.tabs.myVehicles') || 'My vehicles'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.segment,
          { paddingVertical: spacing.sm },
          activeSegment === SEGMENTS.ACTIVITY && { backgroundColor: colors.primary },
        ]}
        onPress={() => setActiveSegment(SEGMENTS.ACTIVITY)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            { 
              color: activeSegment === SEGMENTS.ACTIVITY ? colors.white : colors.textSecondary,
            }
          ]}
        >
          {t?.('home.tabs.activity') || 'Activity'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render Find Owner card
  const renderFindOwnerCard = () => (
    <Card>
      <Text style={[styles.cardTitle, {
        color: colors.textPrimary,
        marginBottom: spacing.sm,
      }]}>
        {t?.('home.findOwner.title') || 'Find vehicle owner'}
      </Text>
      <Text style={[styles.cardBody, {
        color: colors.textSecondary,
        marginBottom: spacing.base,
      }]}>
        {t?.('home.findOwner.body') || 'Search by plate and contact the owner if needed'}
      </Text>

      <PrimaryButton
        title={t?.('home.findOwner.body') || 'Start search'}
        onPress={handleFindOwner}
        fullWidth
        icon={<Text style={{ color: colors.white, fontSize: 20 }}>🔍</Text>}
        style={{ marginTop: spacing.sm }}
      />

      <Text style={[styles.cardFooter, {
        color: colors.textSecondary,
        marginTop: spacing.sm,
      }]}>
        {t?.('home.findOwner.helper') || 'Works even if vehicle owner is not in your contacts'}
      </Text>
    </Card>
  );

  // Render My Vehicles card
  const renderMyVehiclesCard = () => (
    <Card>
      <Text style={[styles.cardTitle, {
        color: colors.textPrimary,
        marginBottom: spacing.sm,
      }]}>
        {t?.('home.myVehicles.title') || 'My vehicles'}
      </Text>
      <Text style={[styles.cardBody, {
        color: colors.textSecondary,
        marginBottom: spacing.base,
      }]}>
        {hasVehicles
          ? (t?.('home.myVehicles.body') || 'View and manage the vehicles linked to your profile')
          : (t?.('home.noVehicles.bodyEmpty') || "You haven't added any vehicles yet")}
      </Text>

      {hasVehicles ? (
        <>
          <PrimaryButton
            title={t?.('home.myVehicles.button') || 'Open my vehicles'}
            onPress={handleMyVehicles}
            fullWidth
            icon={<Text style={{ color: colors.white, fontSize: 20 }}>🚗</Text>}
            style={{ marginTop: spacing.sm }}
          />

          <TouchableOpacity
            style={[styles.secondaryAction, { 
              paddingVertical: spacing.sm,
              marginTop: spacing.sm,
            }]}
            onPress={handleAddVehicle}
          >
            <Text style={[styles.secondaryActionText, { color: colors.primary }]}>
              {t?.('home.myVehicles.addButton') || 'Add new vehicle'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <PrimaryButton
          title={t?.('home.myVehicles.buttonEmpty') || 'Add your first vehicle'}
          onPress={handleAddVehicle}
          fullWidth
          icon={<Text style={{ color: colors.white, fontSize: 20 }}>✚</Text>}
          style={{ marginTop: spacing.sm }}
        />
      )}
    </Card>
  );

  // Render Activity card
  const renderActivityCard = () => (
    <Card>
      <Text style={[styles.cardTitle, {
        color: colors.textPrimary,
        marginBottom: spacing.sm,
      }]}>
        {t?.('home.activity.title') || 'Recent activity'}
      </Text>
      <Text style={[styles.cardBody, {
        color: colors.textSecondary,
        marginBottom: spacing.base,
      }]}>
        {t?.('home.activity.body') || 'See recent searches and contact requests related to your vehicles'}
      </Text>

      <PrimaryButton
        title={t?.('home.activity.button') || 'View activity'}
        onPress={handleActivity}
        fullWidth
        icon={<Text style={{ color: colors.white, fontSize: 20 }}>📊</Text>}
        style={{ marginTop: spacing.sm }}
      />

      <Text style={[styles.cardFooter, {
        color: colors.textSecondary,
        marginTop: spacing.sm,
      }]}>
        {t?.('home.activity.helper') || 'Only you can see this activity'}
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppBar
        title={t?.('common.appName') || 'QR Parking'}
        rightIcon={<Text style={{ fontSize: 24 }}>🔔</Text>}
        onRightPress={() => navigation.navigate('Profile', { screen: 'Notifications' })}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          padding: layout.screenPadding,
          paddingBottom: spacing.xxxl,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={[styles.greetingSection, { marginBottom: spacing.xl }]}>
          <Text style={[styles.greeting, {
            color: colors.textPrimary,
            marginBottom: spacing.xs,
          }]}>
            {getGreeting()}, {userName}
          </Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            {t?.('home.subtitle') || 'What do you want to do today?'}
          </Text>
        </View>

        {/* Segmented Control */}
        {renderSegmentedControl()}

        {/* Active Content */}
        <View style={[styles.contentSection, { marginTop: spacing.base }]}>
          {renderActiveContent()}
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
  greetingSection: {
    // Styles applied dynamically
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  subGreeting: {
    fontSize: 15,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '500',
  },
  contentSection: {
    // Styles applied dynamically
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 15,
  },
  cardFooter: {
    fontSize: 13,
    textAlign: 'center',
  },
  secondaryAction: {
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default HomeScreen;
