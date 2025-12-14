/**
 * Root App Component
 * Sets up providers and initializes app
 */

import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, View, Text, StyleSheet, ScrollView } from 'react-native';

// Providers
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { ToastProvider, useToast } from './src/components/common/Toast/ToastProvider';

// Import components to showcase
import PrimaryButton from './src/components/common/Button/PrimaryButton';
import SecondaryButton from './src/components/common/Button/SecondaryButton';
import DestructiveButton from './src/components/common/Button/DestructiveButton';
import TextInput from './src/components/common/Input/TextInput';
import PhoneInput from './src/components/common/Input/PhoneInput';
import PlateInput from './src/components/common/Input/PlateInput';
import Card from './src/components/common/Card/Card';
import BottomSheet from './src/components/common/Modal/BottomSheet';
import CenterModal from './src/components/common/Modal/CenterModal';
import Spinner from './src/components/common/Loading/Spinner';
import Skeleton from './src/components/common/Loading/Skeleton';
import FullScreenLoader from './src/components/common/Loading/FullScreenLoader';
import Avatar from './src/components/common/Avatar/Avatar';
import EmptyState from './src/components/common/EmptyState/EmptyState';
import AppBar from './src/components/navigation/AppBar';

import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from './src/config/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <ComponentShowcase />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// Component Showcase (Remove this in Batch 8 when we add real navigation)
const ComponentShowcase = () => {
  const { t } = useTheme();
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // State for testing
  const [textValue, setTextValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [plateValue, setPlateValue] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <AppBar
        title="QR Parking - Component Showcase"
        leftIcon={<Text style={styles.icon}>←</Text>}
        onLeftPress={() => showInfo('Back pressed')}
        rightIcon={<Text style={styles.icon}>🔔</Text>}
        onRightPress={() => showInfo('Notification pressed')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Batch 2 Complete!</Text>
          <Text style={styles.sectionSubtitle}>
            All UI components are ready. Test them below:
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buttons</Text>
          <PrimaryButton
            title="Primary Button"
            onPress={() => showSuccess('Primary button pressed!')}
            fullWidth
            icon={<Text style={{ color: COLORS.white }}>✓</Text>}
          />
          <View style={{ height: SPACING.md }} />
          <SecondaryButton
            title="Secondary Button"
            onPress={() => showInfo('Secondary button pressed!')}
            fullWidth
          />
          <View style={{ height: SPACING.md }} />
          <DestructiveButton
            title="Delete Account"
            onPress={() => showError('Destructive action!')}
            fullWidth
            icon={<Text style={{ color: COLORS.white }}>🗑️</Text>}
          />
        </View>

        {/* Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Fields</Text>
          <TextInput
            label="Full Name"
            value={textValue}
            onChangeText={setTextValue}
            placeholder="Enter your name"
            helperText="This is a helper text"
            leftIcon={<Text>👤</Text>}
          />
          <View style={{ height: SPACING.base }} />

          <PhoneInput
            value={phoneValue}
            onChangeText={setPhoneValue}
            onValidChange={(value, formatted) => {
              showSuccess(`Valid phone: ${formatted}`);
            }}
          />
          <View style={{ height: SPACING.base }} />

          <PlateInput
            value={plateValue}
            onChangeText={setPlateValue}
            onValidChange={(value) => {
              showSuccess(`Valid plate: ${value}`);
            }}
          />
        </View>

        {/* Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card</Text>
          <Card onPress={() => showInfo('Card tapped!')}>
            <Text style={TYPOGRAPHY.bodyBold}>Tappable Card</Text>
            <Text style={[TYPOGRAPHY.caption, { marginTop: SPACING.xs }]}>
              This card has elevation and can be tapped
            </Text>
          </Card>
        </View>

        {/* Modals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modals</Text>
          <SecondaryButton
            title="Show Bottom Sheet"
            onPress={() => setShowBottomSheet(true)}
            fullWidth
          />
          <View style={{ height: SPACING.md }} />
          <SecondaryButton
            title="Show Center Modal"
            onPress={() => setShowCenterModal(true)}
            fullWidth
          />
          <View style={{ height: SPACING.md }} />
          <SecondaryButton
            title="Show Full Screen Loader"
            onPress={() => {
              setShowLoader(true);
              setTimeout(() => setShowLoader(false), 2000);
            }}
            fullWidth
          />
        </View>

        {/* Loading States */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loading States</Text>
          <Card>
            <Text style={TYPOGRAPHY.caption}>Spinner:</Text>
            <Spinner size="large" style={{ marginVertical: SPACING.base }} />
            <Text style={[TYPOGRAPHY.caption, { marginTop: SPACING.base }]}>
              Skeleton:
            </Text>
            <Skeleton width="100%" height={20} style={{ marginTop: SPACING.sm }} />
            <Skeleton width="80%" height={20} style={{ marginTop: SPACING.sm }} />
            <Skeleton width="60%" height={20} style={{ marginTop: SPACING.sm }} />
          </Card>
        </View>

        {/* Avatars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avatars</Text>
          <View style={styles.avatarRow}>
            <Avatar size="small" name="John Doe" />
            <Avatar size="medium" name="Jane Smith" backgroundColor={COLORS.success} />
            <Avatar size="large" name="Bob Wilson" backgroundColor={COLORS.warning} />
            <Avatar size="xlarge" name="Alice Brown" backgroundColor={COLORS.error} />
          </View>
        </View>

        {/* Empty State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empty State</Text>
          <Card>
            <EmptyState
              icon="🚗"
              title="No Vehicles Yet"
              message="Add your first vehicle to get started"
              actionLabel="Add Vehicle"
              onAction={() => showSuccess('Add vehicle action!')}
            />
          </Card>
        </View>

        {/* Toast Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toast Notifications</Text>
          <SecondaryButton
            title="Show Success Toast"
            onPress={() => showSuccess('Operation successful!')}
            fullWidth
          />
          <View style={{ height: SPACING.sm }} />
          <SecondaryButton
            title="Show Error Toast"
            onPress={() => showError('Something went wrong!')}
            fullWidth
          />
          <View style={{ height: SPACING.sm }} />
          <SecondaryButton
            title="Show Warning Toast"
            onPress={() => showWarning('Please be careful!')}
            fullWidth
          />
          <View style={{ height: SPACING.sm }} />
          <SecondaryButton
            title="Show Info Toast"
            onPress={() => showInfo('Here is some information')}
            fullWidth
          />
        </View>

        {/* Bottom padding */}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Modals */}
      <BottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="Bottom Sheet Title"
      >
        <Text style={TYPOGRAPHY.body}>
          This is a bottom sheet modal. You can swipe down to close it.
        </Text>
        <View style={{ height: SPACING.base }} />
        <PrimaryButton
          title="Close"
          onPress={() => setShowBottomSheet(false)}
          fullWidth
        />
      </BottomSheet>

      <CenterModal
        visible={showCenterModal}
        onClose={() => setShowCenterModal(false)}
        title="Center Modal"
      >
        <Text style={TYPOGRAPHY.body}>
          This is a center modal. Tap outside to close it.
        </Text>
        <View style={{ height: SPACING.base }} />
        <PrimaryButton
          title="Got it"
          onPress={() => setShowCenterModal(false)}
          fullWidth
        />
      </CenterModal>

      <FullScreenLoader
        visible={showLoader}
        message="Loading components..."
      />
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.base,
  },
});

export default App;
