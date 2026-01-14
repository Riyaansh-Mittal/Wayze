/**
 * Search Result Found Screen
 * Shows vehicle owner details when found
 * FULLY THEME-AWARE WITH SVG ICONS
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import Card from '../../components/common/Card/Card';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';
import {InfoIcon} from '../../assets/icons';

const SearchResultFoundScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {vehicle, searchQuery} = route.params;

  // ✅ API returns: { plateNumber, owner: { name, photo } }
  const ownerName = vehicle.owner?.name || 'Vehicle Owner';
  const ownerPhoto = vehicle.owner?.photo;
  const plateNumber = vehicle.plateNumber || searchQuery;

  // Get first letter for avatar fallback
  const getInitial = name => {
    return name?.charAt(0).toUpperCase() || 'V';
  };

  // Handle send alert
  const handleSendAlert = () => {
    navigation.navigate('SendAlertModal', {
      vehicle,
      searchQuery,
    });
  };

  // Handle report issue
  const handleReportIssue = () => {
    navigation.navigate('ReportIssueModal', {
      vehicle,
      searchQuery,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('search.results.title') || 'Search Result'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View
          style={[
            styles.header,
            {marginBottom: spacing.xl, alignItems: 'center'},
          ]}>
          <View
            style={[
              styles.successIcon,
              {
                backgroundColor: colors.successLight,
                width: 64,
                height: 64,
                borderRadius: 32,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.md,
              },
            ]}>
            <Text style={{fontSize: 32}}>✓</Text>
          </View>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                marginBottom: spacing.xs,
                textAlign: 'center',
              },
            ]}>
            {t('search.results.found.vehicleTitle') || 'Vehicle Found!'}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                textAlign: 'center',
              },
            ]}>
          </Text>
        </View>

        {/* Vehicle Info Card */}
        <Card style={{marginBottom: spacing.base}}>
          <View style={styles.vehicleRow}>
            <VehicleIcon
              type="4-wheeler"
              size={48}
              color={colors.primary}
              style={{marginRight: spacing.md}}
            />
            <View style={styles.vehicleInfo}>
              <Text
                style={[
                  styles.plateNumber,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.xs,
                  },
                ]}>
                {plateNumber}
              </Text>
              <Text style={[styles.vehicleMeta, {color: colors.textSecondary}]}>
                {t('search.results.found.registered') || 'Registered Vehicle'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Owner Info Card */}
        <Card style={{marginBottom: spacing.lg}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.md,
              },
            ]}>
            {t('search.results.found.ownerTitle') || 'Owner Information'}
          </Text>

          <View style={styles.ownerRow}>
            {/* Owner Avatar */}
            {ownerPhoto ? (
              <Image
                source={{uri: ownerPhoto}}
                style={[
                  styles.avatar,
                  {
                    marginRight: spacing.md,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.primary,
                    marginRight: spacing.md,
                  },
                ]}>
                <Text style={[styles.avatarText, {color: colors.white}]}>
                  {getInitial(ownerName)}
                </Text>
              </View>
            )}

            <View style={styles.ownerInfo}>
              <View style={[styles.ownerNameRow, {marginBottom: spacing.xs}]}>
                <Text
                  style={[
                    styles.ownerName,
                    {
                      color: colors.textPrimary,
                      marginRight: spacing.xs,
                    },
                  ]}>
                  {ownerName}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Contact Section */}
        <View style={[styles.section, {marginBottom: spacing.base}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.md,
              },
            ]}>
            {t('search.results.found.contactTitle') || 'Contact Owner'}
          </Text>

          {/* FREE ALERT OPTION */}
          <Card
            style={[
              styles.freeCard,
              {
                backgroundColor: colors.successLight,
                borderColor: colors.success,
                borderWidth: 1,
                marginBottom: spacing.sm,
              },
            ]}>
            <View style={styles.optionRow}>
              <Text style={[styles.optionIcon, {marginRight: spacing.md}]}>
                🔔
              </Text>
              <View style={styles.optionInfo}>
                <Text
                  style={[
                    styles.optionTitle,
                    {
                      color: colors.textPrimary,
                      marginBottom: spacing.xs,
                    },
                  ]}>
                  {t('search.results.found.alertTitle') || 'Send Alert'}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    {color: colors.textSecondary},
                  ]}>
                  {t('search.results.found.alertDescription') ||
                    "Notify owner instantly. They'll see your message."}
                </Text>
              </View>
              <View
                style={[
                  styles.freeBadge,
                  {
                    backgroundColor: colors.success,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: 4,
                  },
                ]}>
                <Text style={[styles.freeText, {color: colors.white}]}>
                  {t('common.free') || 'FREE'}
                </Text>
              </View>
            </View>
          </Card>

          <PrimaryButton
            title={
              t('search.results.found.alertButton') || 'Send Alert to Owner'
            }
            onPress={handleSendAlert}
            fullWidth
            icon={<Text style={{color: colors.white, fontSize: 18}}>🔔</Text>}
            style={{marginBottom: spacing.lg}}
          />
        </View>

        {/* Respect Message */}
        <Card
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.neutralLight,
              marginBottom: spacing.md,
            },
          ]}>
          <View style={styles.infoRow}>
            <View style={{marginRight: spacing.sm}}>
              <InfoIcon width={20} height={20} fill={colors.primary} />
            </View>
            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('search.results.found.respectMessage') ||
                'Please be respectful when contacting the owner. This service helps connect people in need.'}
            </Text>
          </View>
        </Card>

        {/* Report Link */}
        <TouchableOpacity
          onPress={handleReportIssue}
          style={[styles.reportButton, {paddingVertical: spacing.sm}]}>
          <Text style={[styles.reportLink, {color: colors.primary}]}>
            {t('search.results.found.reportLink') ||
              'Report an issue with this vehicle'}
          </Text>
        </TouchableOpacity>
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
  scrollContent: {},
  header: {},
  successIcon: {},
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  vehicleMeta: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  verifiedBadge: {
    fontSize: 18,
  },
  ownerMeta: {
    fontSize: 14,
  },
  section: {},
  freeCard: {},
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 32,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  freeBadge: {},
  freeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reportButton: {
    alignItems: 'center',
  },
  reportLink: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default SearchResultFoundScreen;
