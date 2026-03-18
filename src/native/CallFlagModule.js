// src/native/CallFlagModule.js
import {NativeModules} from 'react-native';

const {CallFlagModule} = NativeModules;

export const getAndClearCallFlag = () => {
  try {
    return CallFlagModule?.getAndClearFlag?.() ?? false;
  } catch (e) {
    return false;
  }
};

// ✅ NEW — read caller name synchronously
export const getCallerName = () => {
  try {
    return CallFlagModule?.getCallerName?.() ?? '';
  } catch (e) {
    return '';
  }
};

export const getPlateNumber = () => {
  try {
    return CallFlagModule?.getPlateNumber?.() ?? '';
  } catch (e) {
    return '';
  }
};
