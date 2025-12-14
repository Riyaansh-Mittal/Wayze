/**
 * Async Storage Wrapper
 * Wrapper around React Native AsyncStorage for convenience
 */

import AsyncStorageLib from '@react-native-async-storage/async-storage';

/**
 * Save data to AsyncStorage
 */
export const save = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorageLib.setItem(key, jsonValue);
    return { success: true };
  } catch (error) {
    console.error(`Error saving to AsyncStorage (${key}):`, error);
    return { success: false, error };
  }
};

/**
 * Get data from AsyncStorage
 */
export const get = async (key) => {
  try {
    const jsonValue = await AsyncStorageLib.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error reading from AsyncStorage (${key}):`, error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 */
export const remove = async (key) => {
  try {
    await AsyncStorageLib.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error(`Error removing from AsyncStorage (${key}):`, error);
    return { success: false, error };
  }
};

/**
 * Remove multiple keys from AsyncStorage
 */
export const removeMultiple = async (keys) => {
  try {
    await AsyncStorageLib.multiRemove(keys);
    return { success: true };
  } catch (error) {
    console.error('Error removing multiple from AsyncStorage:', error);
    return { success: false, error };
  }
};

/**
 * Clear all AsyncStorage data
 */
export const clear = async () => {
  try {
    await AsyncStorageLib.clear();
    return { success: true };
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    return { success: false, error };
  }
};

/**
 * Get all keys from AsyncStorage
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorageLib.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys from AsyncStorage:', error);
    return [];
  }
};

/**
 * Save multiple items to AsyncStorage
 */
export const saveMultiple = async (items) => {
  try {
    const pairs = items.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorageLib.multiSet(pairs);
    return { success: true };
  } catch (error) {
    console.error('Error saving multiple to AsyncStorage:', error);
    return { success: false, error };
  }
};

/**
 * Get multiple items from AsyncStorage
 */
export const getMultiple = async (keys) => {
  try {
    const pairs = await AsyncStorageLib.multiGet(keys);
    const result = {};
    pairs.forEach(([key, value]) => {
      result[key] = value ? JSON.parse(value) : null;
    });
    return result;
  } catch (error) {
    console.error('Error getting multiple from AsyncStorage:', error);
    return {};
  }
};

export default {
  save,
  get,
  remove,
  removeMultiple,
  clear,
  getAllKeys,
  saveMultiple,
  getMultiple,
};
