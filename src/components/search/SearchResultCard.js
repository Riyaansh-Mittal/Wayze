/**
 * Search Result Card Component
 * Displays owner info with privacy masking
 * FULLY THEME-AWARE
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card/Card';

const SearchResultCard = ({ vehicle }) => {
  const { t, theme } = useTheme();
  const { colors, spacing } = theme;

  const getVehicleIcon = () => {
    switch (vehicle.vehicleType) {
      case '2-wheeler':
        return '🏍️';
      case '4-wheeler':
        return '🚗';
      case 'heavy-vehicle':
        return '🚚';
      default:
        return '🚗';
    }
  };

  const getContactMethodIcons = () => {
    const methods = [];
    if (vehicle.contactMethods?.phone) {methods.push('📞');}
    if (vehicle.contactMethods?.sms) {methods.push('💬');}
    if (vehicle.contactMethods?.whatsapp) {methods.push('📱');}
    if (vehicle.contactMethods?.email) {methods.push('📧');}
    return methods;
  };

  return (
    <Card style={{ marginVertical: spacing.md }}>
      {/* Header */}
      <View style={[styles.header, { marginBottom: spacing.base }]}>
        <Text style={[styles.vehicleIcon, { marginRight: spacing.md }]}>
          {getVehicleIcon()}
        </Text>
        <View style={styles.headerText}>
          <Text style={[styles.plateNumber, {
            color: colors.textPrimary,
            marginBottom: spacing.xs,
          }]}>
            {vehicle.plateNumber}
          </Text>
          <Text style={[styles.vehicleType, { color: colors.textSecondary }]}>
            {vehicle.vehicleType.replace('-', ' ')}
          </Text>
        </View>
        <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
          <Text style={[styles.verifiedIcon, { color: colors.white }]}>✓</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, {
        backgroundColor: colors.neutralBorder,
        marginVertical: spacing.base,
      }]} />

      {/* Owner Info */}
      <View style={[styles.section, { marginBottom: spacing.base }]}>
        <Text style={[styles.sectionTitle, {
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        }]}>
          {t?.('search.ownerInfo') || 'Owner Information'}
        </Text>
        <View style={[styles.infoRow, { paddingVertical: spacing.sm }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            {t?.('search.name') || 'Name:'}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
            {vehicle.owner?.name || 'Private'}
          </Text>
        </View>
      </View>

      {/* Contact Methods */}
      <View style={[styles.section, { marginBottom: spacing.base }]}>
        <Text style={[styles.sectionTitle, {
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        }]}>
          {t?.('search.contactMethods') || 'Available Contact Methods'}
        </Text>
        <View style={[styles.contactMethods, { gap: spacing.sm }]}>
          {getContactMethodIcons().map((icon, index) => (
            <View
              key={index}
              style={[styles.contactMethodBadge, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={styles.contactMethodIcon}>{icon}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Info Box */}
      <View style={[styles.infoBox, {
        backgroundColor: colors.primaryLight,
        padding: spacing.md,
        marginTop: spacing.sm,
      }]}>
        <Text style={[styles.infoBoxIcon, { marginRight: spacing.sm }]}>🔒</Text>
        <Text style={[styles.infoBoxText, { color: colors.textSecondary }]}>
          {t?.('search.privacyNote') || 'Full contact details will be shared after confirmation'}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    fontSize: 48,
  },
  headerText: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
  vehicleType: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  section: {
    // Styles applied dynamically
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactMethodBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactMethodIcon: {
    fontSize: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  infoBoxIcon: {
    fontSize: 20,
  },
  infoBoxText: {
    fontSize: 13,
    flex: 1,
  },
});

export default SearchResultCard;
