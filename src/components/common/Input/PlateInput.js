/**
 * Plate Input Component
 * Specialized input for vehicle plate numbers with auto-uppercase and validation
 * FULLY THEME-AWARE
 */

/**
 * Plate Input Component
 * UPDATED: Support 2026 Indian plate formats
 */

import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import {
  validatePlateNumber,
  formatPlateNumber,
} from '../../../utils/validators';
import {VALIDATION} from '../../../config/constants';
import {useTheme} from '../../../contexts/ThemeContext';

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
  const {t} = useTheme();
  const [internalError, setInternalError] = useState(error);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  const handleChange = text => {
    // ✅ Convert to uppercase
    const upperText = text.toUpperCase();

    // ✅ Allow alphanumeric and spaces/hyphens (for BH series and formatting)
    const cleanText = upperText.replace(/[^A-Z0-9\s-]/g, '');

    // ✅ Limit to 15 characters (to accommodate spaces: "26 BH 1234 AA")
    const limitedText = cleanText.slice(0, 15);
    onChangeText(limitedText);

    // ✅ Validate in real-time
    if (limitedText.length >= VALIDATION.PLATE_NUMBER_MIN_LENGTH) {
      const validation = validatePlateNumber(limitedText);
      if (validation.valid) {
        setInternalError(null);
        if (onValidChange) {
          onValidChange(validation.value);
        }
      } else {
        setInternalError(validation.message);
      }
    } else if (limitedText.length > 0) {
      // Clear error while typing
      setInternalError(null);
    } else {
      setInternalError(null);
    }
  };

  const leftIcon = <Text style={{fontSize: 20}}>🚗</Text>;

  return (
    <TextInput
      label={label || t?.('vehicles.plateLabel') || 'Registration Number'}
      value={value}
      onChangeText={handleChange}
      placeholder={placeholder || 'MH12AB1234 or 26BH1234AA'} // ✅ Updated
      error={internalError}
      helperText={
        helperText || `Examples: ${VALIDATION.PLATE_NUMBER_EXAMPLES.join(', ')}` // ✅ Updated
      }
      disabled={disabled}
      keyboardType="default"
      autoCapitalize="characters"
      leftIcon={leftIcon}
      maxLength={15} // ✅ Updated (was 10)
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
