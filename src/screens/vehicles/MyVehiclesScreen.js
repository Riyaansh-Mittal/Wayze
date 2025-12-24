/**
 * My Vehicles Screen
 * WITH FLOATING ACTION BUTTON (FAB)
 */

import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import VehicleCard from '../../components/vehicle/VehicleCard';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Spinner from '../../components/common/Loading/Spinner';
import AppBar from '../../components/navigation/AppBar';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';

const MyVehiclesScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {
    vehicles,
    isLoading,
    isRefreshing,
    refreshVehicles,
    deleteVehicle,
    getVehicleCount,
  } = useVehicles();

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // Load vehicles on mount
  }, []);

  const handleRefresh = useCallback(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const handleVehiclePress = vehicle => {
    navigation.navigate('VehicleDetails', {vehicleId: vehicle._id});
  };

  const handleEditVehicle = vehicle => {
    navigation.navigate('EditVehicle', {vehicleId: vehicle._id});
  };

  const handleDeleteVehicle = vehicle => {
    Alert.alert(
      t('vehicles.details.deleteConfirm.title'),
      t('vehicles.details.deleteConfirm.message'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => confirmDelete(vehicle._id),
        },
      ],
    );
  };

  const confirmDelete = async vehicleId => {
    setDeletingId(vehicleId);
    const result = await deleteVehicle(vehicleId);
    setDeletingId(null);

    if (!result.success) {
      Alert.alert(t('common.error'), t('vehicles.form.deleteFailed'));
    }
  };

  const getVehicleIcon = type => {
    switch (type) {
      case '2-wheeler':
        return <VehicleIcon type="2-wheeler" size={32} />;
      case '3-wheeler':
        return <VehicleIcon type="3-wheeler" size={48} />;
      case '4-wheeler':
        return <VehicleIcon type="4-wheeler" size={64} />;
      default:
        return <VehicleIcon type="4-wheeler" size={64} />;
    }
  };

  const formatTimeAgo = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const months = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30));

    if (months < 1) return t('time.justNow');
    return t('vehicles.meta.added', {date: date.toLocaleDateString()});
  };

  const renderVehicleCard = ({item}) => {
    if (deletingId === item._id) {
      return (
        <View
          style={[
            styles.deletingCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <Spinner size="small" color={colors.error} />
          <Text style={[styles.deletingText, {color: colors.error}]}>
            {t('common.loading')}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.vehicleCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => handleVehiclePress(item)}
        activeOpacity={0.7}>
        <View style={styles.vehicleRow}>
          <Text style={[styles.vehicleIcon, {marginRight: spacing.md}]}>
            {getVehicleIcon(item.vehicleType)}
          </Text>

          <View style={styles.vehicleInfo}>
            <Text
              style={[
                styles.plateNumber,
                {
                  color: colors.textPrimary,
                  marginBottom: spacing.xs,
                },
              ]}>
              {item.plateNumber}
            </Text>

            <Text
              style={[
                styles.vehicleMeta,
                {
                  color: colors.textSecondary,
                  marginBottom: spacing.xs,
                },
              ]}>
              {t(`vehicles.types.${item.vehicleType}`)} ·{' '}
              {formatTimeAgo(item.createdAt)}
            </Text>

            <Text style={[styles.vehicleStats, {color: colors.textSecondary}]}>
              {t('vehicles.meta.contactRequests', {
                count: item.contactRequests || 0,
              })}{' '}
              · {t('vehicles.meta.searches', {count: item.searches || 0})}
            </Text>
          </View>

          <Text style={[styles.chevron, {color: colors.textSecondary}]}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <EmptyState
      icon={<VehicleIcon type="4-wheeler" size={128} />}
      title={t('vehicles.empty.title')}
      message={t('vehicles.empty.message')}
    />
  );

  if (isLoading && vehicles.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}
        edges={['top']}>
        <AppBar title={t('vehicles.title')} showBack={false} />
        <View style={styles.loadingContainer}>
          <Spinner size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              {
                color: colors.textSecondary,
                marginTop: spacing.md,
              },
            ]}>
            {t('common.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Determine FAB style based on whether vehicles exist
  const hasVehicles = vehicles.length > 0;

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('vehicles.title')}
        showBack={false}
        // ✅ Remove rightIcon - we're using FAB now
      />

      <FlatList
        data={vehicles}
        renderItem={renderVehicleCard}
        keyExtractor={item => item._id}
        contentContainerStyle={[
          styles.listContent,
          {
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl + 80, // Extra space for FAB
          },
          vehicles.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* ✅ FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity
        style={[
          hasVehicles ? styles.fabCompact : styles.fabExtended,
          {backgroundColor: colors.primary},
        ]}
        onPress={handleAddVehicle}
        activeOpacity={0.85}>
        {hasVehicles ? (
          // ✅ Compact FAB (just + icon) when vehicles exist
          <Text style={[styles.fabIcon, {color: colors.white}]}>+</Text>
        ) : (
          // ✅ Extended FAB (+ icon + text) when no vehicles
          <>
            <Text style={[styles.fabIcon, {color: colors.white, marginRight: 8}]}>
              +
            </Text>
            <Text style={[styles.fabText, {color: colors.white}]}>
              {t('vehicles.empty.button')}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
  },
  listContent: {
    // Styles applied dynamically
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  vehicleCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    fontSize: 36,
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  vehicleMeta: {
    fontSize: 14,
  },
  vehicleStats: {
    fontSize: 13,
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
  },
  deletingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 12,
  },
  deletingText: {
    fontSize: 15,
    marginLeft: 12,
  },

  // ✅ FAB STYLES
  fabCompact: {
    position: 'absolute',
    right: 24,
    bottom: 88, // Above bottom nav (64dp height + 24dp margin)
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabExtended: {
    position: 'absolute',
    right: 24,
    bottom: 88,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 28,
    fontWeight: '400',
  },
  fabText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyVehiclesScreen;
