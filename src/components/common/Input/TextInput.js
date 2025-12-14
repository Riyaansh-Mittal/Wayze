/**
 * Text Input Component
 * Standard text input with label, error states, and validation
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {COLORS, COMPONENTS, TYPOGRAPHY, SPACING} from '../../../config/theme';

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
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) {return COLORS.error;}
    if (isFocused) {return COLORS.primary;}
    return COLORS.neutralBorder;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {borderColor: getBorderColor()},
          disabled && styles.inputContainerDisabled,
          multiline && styles.inputContainerMultiline,
        ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <RNTextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDisabled}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || placeholder}
          accessibilityState={{disabled}}
          testID={testID}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {/* Helper or Error Text */}
      {(helperText || error) && (
        <View style={styles.helperContainer}>
          {error && <Text style={styles.helperIcon}>⚠️</Text>}
          {!error && helperText && <Text style={styles.helperIcon}>ℹ️</Text>}
          <Text style={[styles.helperText, error && styles.errorText]}>
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
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  labelDisabled: {
    color: COLORS.textDisabled,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: COMPONENTS.inputField.height,
    borderRadius: COMPONENTS.inputField.borderRadius,
    borderWidth: COMPONENTS.inputField.borderWidth,
    backgroundColor: COMPONENTS.inputField.backgroundColor,
    paddingHorizontal: COMPONENTS.inputField.paddingHorizontal,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.neutralLight,
    borderColor: COLORS.neutralBorder,
  },
  inputContainerMultiline: {
    height: 'auto',
    minHeight: COMPONENTS.inputField.height,
    paddingVertical: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: COMPONENTS.inputField.fontSize,
    color: COLORS.textPrimary,
    padding: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  inputWithLeftIcon: {
    marginLeft: SPACING.sm,
  },
  inputWithRightIcon: {
    marginRight: SPACING.sm,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.xs,
  },
  helperIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
  errorText: {
    color: COLORS.error,
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
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  testID: PropTypes.string,
};

export default TextInput;
