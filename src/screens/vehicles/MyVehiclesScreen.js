/**
 * My Vehicles Screen
 * List of user's registered vehicles
 */

import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicles } from '../../hooks';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import VehicleCard from '../../components/vehicle/VehicleCard';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import Spinner from '../../components/common/Loading/Spinner';
import AppBar from '../../components/navigation/AppBar';

const MyVehiclesScreen = ({ navigation }) => {
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
    // Load vehicles on mount (context does this automatically)
  }, []);

  const handleRefresh = useCallback(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const handleVehiclePress = (vehicle) => {
    navigation.navigate('VehicleDetails', { vehicleId: vehicle._id });
  };

  const handleEditVehicle = (vehicle) => {
    navigation.navigate('EditVehicle', { vehicleId: vehicle._id });
  };

  const handleDeleteVehicle = (vehicle) => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.plateNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(vehicle._id),
        },
      ]
    );
  };

  const confirmDelete = async (vehicleId) => {
    setDeletingId(vehicleId);
    const result = await deleteVehicle(vehicleId);
    setDeletingId(null);

    if (!result.success) {
      Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
    }
  };

  const renderVehicleCard = ({ item }) => {
    if (deletingId === item._id) {
      return (
        <View style={styles.deletingCard}>
          <Spinner size="small" color={COLORS.error} />
          <Text style={styles.deletingText}>Deleting...</Text>
        </View>
      );
    }

    return (
      <VehicleCard
        vehicle={item}
        onPress={handleVehiclePress}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
      />
    );
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="🚗"
      title="No Vehicles Yet"
      message="Add your first vehicle to get started and let others find you easily"
      actionLabel="Add Vehicle"
      onActionPress={handleAddVehicle}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Vehicles</Text>
      <Text style={styles.headerSubtitle}>
        {getVehicleCount()} {getVehicleCount() === 1 ? 'vehicle' : 'vehicles'} registered
      </Text>
    </View>
  );

  if (isLoading && vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppBar title="My Vehicles" showBack={false} />
        <View style={styles.loadingContainer}>
          <Spinner size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading vehicles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="My Vehicles"
        showBack={false}
        rightIcon={<Text style={styles.addIcon}>+</Text>}
        onRightPress={handleAddVehicle}
      />

      <FlatList
        data={vehicles}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.listContent,
          vehicles.length === 0 && styles.listContentEmpty,
        ]}
        ListHeaderComponent={vehicles.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button (when list has items) */}
      {vehicles.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={handleAddVehicle}
            activeOpacity={0.8}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: LAYOUT.screenPadding,
    marginBottom: SPACING.base,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  addIcon: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.primary,
  },
  deletingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  deletingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
    marginLeft: SPACING.md,
  },
  fabContainer: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '300',
  },
});

export default MyVehiclesScreen;
