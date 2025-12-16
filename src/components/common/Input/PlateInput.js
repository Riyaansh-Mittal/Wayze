/**
 * Plate Input Component
 * Specialized input for vehicle plate numbers with auto-uppercase and validation
 * FULLY THEME-AWARE
 */

import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import { validatePlateNumber } from '../../../utils/validators';
import { VALIDATION } from '../../../config/constants';
import { useTheme } from '../../../contexts/ThemeContext';

const PlateInput = ({
  label,
  value,
  onChangeText,
  onValidChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  style,
  testID,
}) => {
  const { t } = useTheme();
  const [internalError, setInternalError] = useState(error);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  const handleChange = (text) => {
    // Convert to uppercase
    const upperText = text.toUpperCase();

    // Remove spaces and special characters
    const cleanText = upperText.replace(/[^A-Z0-9]/g, '');

    // Limit to 10 characters (format: AA00AA0000)
    const limitedText = cleanText.slice(0, 10);
    onChangeText(limitedText);

    // Validate when complete (10 characters)
    if (limitedText.length === 10) {
      const validation = validatePlateNumber(limitedText);
      if (validation.valid) {
        setInternalError(null);
        if (onValidChange) {
          onValidChange(validation.value);
        }
      } else {
        setInternalError(validation.message);
      }
    } else if (limitedText.length > 0 && limitedText.length < 10) {
      // Show format hint while typing
      setInternalError(null);
    } else {
      setInternalError(null);
    }
  };

  const leftIcon = <Text style={{ fontSize: 20 }}>🚗</Text>;

  return (
    <TextInput
      label={label || t?.('vehicles.plateLabel') || 'Registration Number'}
      value={value}
      onChangeText={handleChange}
      placeholder={placeholder || 'MH01AB1234'}
      error={internalError}
      helperText={helperText || `Format: ${VALIDATION.PLATE_NUMBER_FORMAT}`}
      disabled={disabled}
      keyboardType="default"
      autoCapitalize="characters"
      leftIcon={leftIcon}
      maxLength={10}
      style={style}
      testID={testID}
    />
  );
};

PlateInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onValidChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default PlateInput;
