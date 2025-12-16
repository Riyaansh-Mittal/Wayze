/**
 * Text Input Component
 * Standard text input with label, error states, and validation
 * FULLY THEME-AWARE
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';
import { InfoIcon, WarningIcon } from '../../../assets/icons';

const TextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  leftIcon = null,
  rightIcon = null,
  onRightIconPress,
  style,
  inputStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const { colors, components, spacing } = theme;
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) {return colors.error;}
    if (isFocused) {return colors.primary;}
    return colors.neutralBorder;
  };

  const containerStyle = [
    styles.inputContainer,
    {
      height: multiline ? 'auto' : components.inputField.height,
      minHeight: multiline ? components.inputField.height : undefined,
      borderRadius: components.inputField.borderRadius,
      borderWidth: components.inputField.borderWidth,
      backgroundColor: disabled ? colors.neutralLight : colors.white,
      borderColor: disabled ? colors.neutralBorder : getBorderColor(),
      paddingHorizontal: components.inputField.paddingHorizontal,
      paddingVertical: multiline ? spacing.sm : 0,
    },
  ];

  const inputStyles = [
    styles.input,
    {
      fontSize: components.inputField.fontSize,
      color: colors.textPrimary,
    },
    multiline && styles.inputMultiline,
    leftIcon && { marginLeft: spacing.sm },
    rightIcon && { marginRight: spacing.sm },
    inputStyle,
  ];

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label,
          {
            color: disabled ? colors.textDisabled : colors.textSecondary,
            marginBottom: spacing.sm,
          },
        ]}>
          {label}
        </Text>
      )}

      <View style={containerStyle}>
        {leftIcon && (
          <View style={{ marginRight: spacing.sm }}>
            {leftIcon}
          </View>
        )}

        <RNTextInput
          style={inputStyles}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || placeholder}
          accessibilityState={{ disabled }}
          testID={testID}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={{ marginLeft: spacing.sm }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(helperText || error) && (
        <View style={[styles.helperContainer, { marginTop: spacing.xs }]}>
          <Text style={styles.helperIcon}>
            {error ? <WarningIcon width={20} height={20} fill={colors.warning}/> : <InfoIcon width={15} height={15} fill={colors.primary}/>}
          </Text>
          <Text style={[
            styles.helperText,
            {
              color: error ? colors.error : colors.textSecondary,
              marginLeft: spacing.xs,
            },
          ]}>
            {error || helperText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helperIcon: {
    fontSize: 14,
  },
  helperText: {
    fontSize: 13,
    flex: 1,
  },
});

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onRightIconPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default TextInput;
