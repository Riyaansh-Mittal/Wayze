/**
 * Contact Methods Selector Component
 * Checkbox group for contact preferences
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/theme';

const CONTACT_METHODS = [
  { key: 'phone', label: 'Phone Call', icon: '📞', description: 'Direct phone call' },
  { key: 'sms', label: 'SMS', icon: '💬', description: 'Text message' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '📱', description: 'WhatsApp message' },
  { key: 'email', label: 'Email', icon: '📧', description: 'Email notification' },
];

const ContactMethodsSelector = ({ value, onChange, error }) => {
  const toggleMethod = (method) => {
    onChange({
      ...value,
      [method]: !value[method],
    });
  };

  const hasAtLeastOneSelected = Object.values(value).some((v) => v === true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Contact Methods *</Text>
      <Text style={styles.helperText}>
        Select how others can contact you (at least one required)
      </Text>

      <View style={styles.methodsContainer}>
        {CONTACT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.key}
            style={[
              styles.methodItem,
              value[method.key] && styles.methodItemSelected,
              error && !hasAtLeastOneSelected && styles.methodItemError,
            ]}
            onPress={() => toggleMethod(method.key)}
            activeOpacity={0.7}
          >
            <View style={styles.methodLeft}>
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <View style={styles.methodText}>
                <Text
                  style={[
                    styles.methodLabel,
                    value[method.key] && styles.methodLabelSelected,
                  ]}
                >
                  {method.label}
                </Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </View>

            <View
              style={[
                styles.checkbox,
                value[method.key] && styles.checkboxSelected,
              ]}
            >
              {value[method.key] && <Text style={styles.checkboxIcon}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {error && !hasAtLeastOneSelected && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  methodsContainer: {
    gap: SPACING.sm,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.neutralLight,
    borderWidth: 1,
    borderColor: COLORS.neutralBorder,
    borderRadius: 12,
    padding: SPACING.base,
  },
  methodItemSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  methodItemError: {
    borderColor: COLORS.error,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  methodText: {
    flex: 1,
  },
  methodLabel: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xs,
  },
  methodLabelSelected: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  methodDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.neutralBorder,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default ContactMethodsSelector;
