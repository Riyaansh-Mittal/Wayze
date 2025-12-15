/**
 * Send Alert Modal
 * Free action to notify vehicle owner
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContactService } from '../../services/api';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';

const SendAlertModal = ({ navigation, route }) => {
  const { vehicle, searchQuery } = route.params;
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendAlert = async () => {
    if (!message.trim()) {
      Alert.alert('Message Required', 'Please enter a message for the owner.');
      return;
    }

    setIsSending(true);

    try {
      const response = await ContactService.sendAlert({
        vehicleId: vehicle._id,
        searchQuery,
        message: message.trim(),
      });

      if (response.success) {
        Alert.alert(
          'Alert Sent!',
          'The vehicle owner has been notified.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('FindVehicle'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to send alert. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send alert. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Send Alert"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>🔔</Text>
          <Text style={styles.title}>Notify Owner</Text>
          <Text style={styles.subtitle}>
            Send a free alert to the owner of {searchQuery}
          </Text>
        </View>

        {/* Free Badge */}
        <Card style={styles.freeCard}>
          <View style={styles.freeRow}>
            <Text style={styles.freeIcon}>✨</Text>
            <View style={styles.freeInfo}>
              <Text style={styles.freeTitle}>100% Free</Text>
              <Text style={styles.freeDescription}>
                No credits deducted for sending alerts
              </Text>
            </View>
          </View>
        </Card>

        {/* Message Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Your Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Your vehicle is blocking my car. Please move it."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={200}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{message.length}/200</Text>
        </View>

        {/* Info Box */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>What Happens Next?</Text>
              <Text style={styles.infoDescription}>
                • Owner gets a notification{'\n'}
                • Your message is delivered{'\n'}
                • Contact details remain private{'\n'}
                • This action is logged for safety
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title={isSending ? 'Sending...' : 'Send Alert'}
            onPress={handleSendAlert}
            loading={isSending}
            fullWidth
            disabled={!message.trim()}
          />

          <SecondaryButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            fullWidth
            style={{ marginTop: SPACING.md }}
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
  icon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  freeCard: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    marginBottom: SPACING.lg,
  },
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  freeInfo: {
    flex: 1,
  },
  freeTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  freeDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.sm,
  },
  textInput: {
    ...TYPOGRAPHY.body,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutralBorder,
    borderRadius: 8,
    padding: SPACING.md,
    minHeight: 100,
  },
  charCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  infoCard: {
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 24,
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
  actions: {
    marginTop: SPACING.base,
  },
});

export default SendAlertModal;
