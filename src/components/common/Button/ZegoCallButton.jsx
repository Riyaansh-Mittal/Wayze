/**
 * Zego Call Button Component
 * Wraps ZegoSendCallInvitationButton with SecondaryButton styling
 * FULLY THEME-AWARE with CallContext integration
 * ✅ API-FIRST: Creates call record before starting Zego call
 */

import React, {useMemo, useCallback, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Alert} from 'react-native';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {useTheme} from '../../../contexts/ThemeContext';
import {useCall} from '../../../contexts/CallContext';
import {CallIcon} from '../../../assets/icons';
import {ZegoService} from '../../../services/zego/ZegoService';
import NetInfo from '@react-native-community/netinfo';

const ZegoCallButton = ({
  invitees = [],
  receiverId, // ✅ REQUIRED: Pass receiverId to create call
  onPressed,
  onWillPressed,
  onError,
  disabled = false,
  title = 'Call Owner Now',
  fullWidth = true,
  resourceID = 'zego_data',
  customData,
  style,
}) => {
  const {theme} = useTheme();
  const {colors, components, layout} = theme;
  const {createCall, updateCallStatus} = useCall(); // ✅ Get CallContext methods

  const [currentCallId, setCurrentCallId] = useState(null);

  const buttonHeight = components.secondaryButton.height;

  // Compute width for Zego button touch area
  const buttonWidth = useMemo(() => {
    if (!fullWidth) return 200;
    const screenW = Dimensions.get('window').width;
    const padding = layout?.screenPadding ?? 16;
    return Math.max(120, screenW - padding * 2);
  }, [fullWidth, layout]);

  /**
   * ✅ Check network before call
   */
  const checkNetwork = useCallback(async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{text: 'OK'}],
      );
      return false;
    }
    return true;
  }, []);

  /**
   * ✅ STEP 1: Create call BEFORE starting Zego
   */
  const handleWillPressed = useCallback(async () => {
    console.log('📞 Will press - creating call...');

    if (!receiverId) {
      console.error('❌ No receiverId');
      Alert.alert('Error', 'Receiver not specified');
      return false;
    }

    const hasNetwork = await checkNetwork();
    if (!hasNetwork) return false;

    if (onWillPressed) {
      const result = await onWillPressed();
      if (result === false) return false;
    }

    try {
      console.log('📡 Creating call with status INITIATED...');

      const callData = await createCall(receiverId);

      if (!callData || !callData._id) {
        throw new Error('Failed to create call');
      }

      const callId = callData._id;
      console.log('✅ Call created with ID:', callId);

      // ✅ Store callId in component state AND ZegoService
      setCurrentCallId(callId);
      ZegoService.setCurrentCallId(callId, true);
      ZegoService.setCallContext({
        updateCallStatus: updateCallStatus, // ✅ Pass function as-is
      });

      return true; // ✅ Start call
    } catch (error) {
      console.error('❌ Failed to create call:', error);
      Alert.alert('Call Failed', error.message || 'Unable to initiate call');
      return false; // ✅ Block call
    }
  }, [receiverId, createCall, updateCallStatus, onWillPressed, checkNetwork]);

  /**
   * ✅ STEP 2: Handle Zego call started
   */
  const handlePressed = useCallback(
    async (code, message, inviteeList) => {
      console.log('📞 Pressed:', {code, message});

      const isSuccess = !code || code === 0 || code === '0' || code === '';

      if (!isSuccess) {
        console.error('❌ Zego failed to start:', code, message);

        // ✅ Update to FAILED using stored callId
        if (currentCallId) {
          try {
            await updateCallStatus(currentCallId, 'FAILED');
          } catch (error) {
            console.error('❌ Failed to update status:', error);
          }
        }

        Alert.alert('Call Error', message || 'Failed to start call');
        if (onError) onError({code, message});
        return;
      }

      console.log('✅ Zego call started successfully');
      if (onPressed) onPressed(code, message, inviteeList);
    },
    [currentCallId, updateCallStatus, onPressed, onError],
  );

  const handleError = useCallback(
    async errorInfo => {
      console.error('❌ Error:', errorInfo);

      if (currentCallId) {
        try {
          await updateCallStatus(currentCallId, 'FAILED');
        } catch (error) {
          console.error('❌ Failed to update status:', error);
        }
      }

      ZegoService.clearCallState();
      if (onError) onError(errorInfo);
    },
    [currentCallId, updateCallStatus, onError],
  );

  // Validate props
  if (!receiverId) {
    console.warn('⚠️ ZegoCallButton requires receiverId prop');
  }

  if (!invitees || invitees.length === 0) {
    console.warn('⚠️ ZegoCallButton requires invitees prop');
  }

  const getInitials = fullName => {
    if (!fullName) {
      return '?';
    }

    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <View style={[styles.container, fullWidth && {width: '100%'}, style]}>
      {/* LAYER 1: Your Custom UI (Visuals) */}
      <View
        style={[
          styles.visualButton,
          {
            height: buttonHeight,
            width: '100%',
            borderRadius: components.secondaryButton.borderRadius,
            borderWidth: components.secondaryButton.borderWidth,
            borderColor: disabled ? colors.neutralBorder : colors.primary,
            opacity: disabled ? 0.6 : 1,
          },
        ]}>
        <View style={{marginRight: 8}}>
          <CallIcon
            width={20}
            height={20}
            fill={disabled ? colors.textDisabled : colors.primary}
          />
        </View>
        <Text
          style={[
            styles.text,
            {color: disabled ? colors.textDisabled : colors.primary},
          ]}>
          {title}
        </Text>
      </View>

      {/* LAYER 2: Zego Button (Functional) */}
      {!disabled && receiverId && invitees.length > 0 && (
        <View style={styles.zegoWrapper}>
          <ZegoSendCallInvitationButton
            invitees={invitees}
            isVideoCall={false}
            resourceID={resourceID}
            timeout={60}
            customData={JSON.stringify({
              plateNumber: customData?.plateNumber || '',
            })}
            onPressed={handlePressed}
            onWillPressed={handleWillPressed}
            onError={handleError}
            width={buttonWidth}
            height={buttonHeight}
            backgroundColor="transparent"
            borderRadius={components.secondaryButton.borderRadius}
            borderWidth={0}
            borderColor="transparent"
            textColor="transparent"
            fontSize={1}
            verticalLayout={false}
            icon={null}
            text=""
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  visualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  zegoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});

export default ZegoCallButton;
