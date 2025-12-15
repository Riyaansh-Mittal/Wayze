/**
 * Search Result Card Component
 * Displays owner info with privacy masking
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/theme';
import Card from '../common/Card/Card';

const SearchResultCard = ({ vehicle }) => {
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
    <Card style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.vehicleIcon}>{getVehicleIcon()}</Text>
        <View style={styles.headerText}>
          <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
          <Text style={styles.vehicleType}>
            {vehicle.vehicleType.replace('-', ' ')}
          </Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedIcon}>✓</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Owner Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Owner Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{vehicle.owner?.name || 'Private'}</Text>
        </View>
      </View>

      {/* Contact Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Contact Methods</Text>
        <View style={styles.contactMethods}>
          {getContactMethodIcons().map((icon, index) => (
            <View key={index} style={styles.contactMethodBadge}>
              <Text style={styles.contactMethodIcon}>{icon}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxIcon}>🔒</Text>
        <Text style={styles.infoBoxText}>
          Full contact details will be shared after confirmation
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  vehicleIcon: {
    fontSize: 48,
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  plateNumber: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  vehicleType: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutralBorder,
    marginVertical: SPACING.base,
  },
  section: {
    marginBottom: SPACING.base,
  },
  sectionTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyBold,
  },
  contactMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  contactMethodBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactMethodIcon: {
    fontSize: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  infoBoxIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  infoBoxText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

export default SearchResultCard;
