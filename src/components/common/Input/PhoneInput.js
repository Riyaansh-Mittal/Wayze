/**
 * Phone Input Component
 * Specialized input for Indian phone numbers with validation
 */

import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import { validatePhoneNumber } from '../../../utils/validators';
import { formatPhoneNumber } from '../../../utils/formatters';

const PhoneInput = ({
  label = 'Phone Number',
  value,
  onChangeText,
  onValidChange,
  placeholder = '+91 98765 43210',
  error,
  helperText = 'Enter 10-digit mobile number',
  disabled = false,
  style,
  testID,
}) => {
  const [internalError, setInternalError] = useState(error);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  const handleChange = (text) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    onChangeText(limitedDigits);

    // Validate if 10 digits entered
    if (limitedDigits.length === 10) {
      const validation = validatePhoneNumber(limitedDigits);
      if (validation.valid) {
        setInternalError(null);
        if (onValidChange) {
          onValidChange(validation.value, validation.formatted);
        }
      } else {
        setInternalError(validation.message);
      }
    } else {
      setInternalError(null);
    }
  };

  // Format display value
  const displayValue = value ? formatPhoneNumber(value) : '';

  const leftIcon = <Text style={{ fontSize: 16, color: '#616161' }}>📱</Text>;

  return (
    <TextInput
      label={label}
      value={displayValue}
      onChangeText={handleChange}
      placeholder={placeholder}
      error={internalError}
      helperText={!internalError ? helperText : undefined}
      disabled={disabled}
      keyboardType="phone-pad"
      autoCapitalize="none"
      maxLength={17} // +91 XXXXX XXXXX format
      leftIcon={leftIcon}
      style={style}
      testID={testID}
    />
  );
};

PhoneInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onValidChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  testID: PropTypes.string,
};

export default PhoneInput;
