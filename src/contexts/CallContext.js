/**
 * Call Context
 * Manages call lifecycle, status updates, and error recovery
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import {ContactService} from '../services/api';
import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within CallProvider');
  }
  return context;
};

export const CallProvider = ({children}) => {
  const [currentCall, setCurrentCall] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const statusUpdateAttempts = useRef({});
  const callStartTime = useRef(null);

  /**
   * ✅ Create call - Returns call object with _id
   */
  const createCall = useCallback(async receiverId => {
    try {
      console.log('📞 Creating call to:', receiverId);

      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      const response = await ContactService.initiateCall(receiverId);

      if (response?.success && response?.data?.callId) {
        const {callId} = response.data;

        console.log('✅ Call created - callId:', callId);

        // Store call data
        const callData = {
          _id: callId, // ✅ Match backend response
          callId,
          receiverId,
          status: 'INITIATED',
          createdAt: new Date().toISOString(),
        };

        setCurrentCall(callData);
        setCallStatus('INITIATED');
        setIsCallActive(true);

        return callData; // ✅ Return full call object
      }

      throw new Error(response?.message || 'Failed to create call');
    } catch (error) {
      console.error('❌ Failed to create call:', error);
      throw error; // ✅ Throw to be caught by ZegoCallButton
    }
  }, []);

  /**
   * ✅ Initiate call - Alias for createCall (backward compatibility)
   */
  const initiateCall = useCallback(
    async receiverId => {
      try {
        const callData = await createCall(receiverId);
        return {success: true, callId: callData._id};
      } catch (error) {
        return {success: false, error: error.message};
      }
    },
    [createCall],
  );

  /**
   * ✅ Update call status - Uses current call or accepts callId
   */
  const updateCallStatus = useCallback(
    async (callId, status) => {
      if (!callId || !status) {
        console.error('❌ Missing parameters:', {callId, status});
        return {success: false, error: 'Missing callId or status'};
      }

      const validStatuses = ['INITIATED', 'ANSWERED', 'ENDED', 'FAILED'];
      if (!validStatuses.includes(status)) {
        console.error('❌ Invalid status:', status);
        return {success: false, error: 'Invalid status'};
      }

      console.log(`📡 Updating call status: ${status} for callId: ${callId}`);

      const attemptKey = `${callId}_${status}`;

      // Prevent duplicate status updates
      if (statusUpdateAttempts.current[attemptKey]) {
        console.log('⏭️ Status already updated:', status);
        return {success: true, cached: true};
      }

      try {
        console.log(`📡 Updating call status: ${status} for callId: ${callId}`);

        // Check network connectivity
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          console.warn('⚠️ No internet - queuing status update');
          queueStatusUpdate(callId, status);
          return {
            success: false,
            error: 'No internet connection',
            queued: true,
          };
        }

        const response = await ContactService.updateCallStatus(callId, status);

        if (response?.success) {
          console.log(`✅ Call status updated: ${status}`);

          // Mark as successfully updated
          statusUpdateAttempts.current[attemptKey] = true;

          // Update local state
          setCallStatus(status);
          setCurrentCall(prev => ({
            ...prev,
            status,
            [`${status.toLowerCase()}At`]: new Date().toISOString(),
          }));

          // Special handling for ANSWERED status
          if (status === 'ANSWERED') {
            callStartTime.current = Date.now();
          }

          // Clean up on call end
          if (status === 'ENDED' || status === 'FAILED') {
            setTimeout(() => {
              cleanupCall();
            }, 1000);
          }

          return {success: true};
        }

        throw new Error(response?.message || 'Failed to update status');
      } catch (error) {
        console.error(`❌ Failed to update status (${status}):`, error);

        // Retry once after delay
        console.log('🔄 Retrying status update...');
        setTimeout(async () => {
          try {
            const retryResponse = await ContactService.updateCallStatus(
              callId,
              status,
            );
            if (retryResponse?.success) {
              console.log('✅ Retry successful');
              statusUpdateAttempts.current[attemptKey] = true;
            }
          } catch (retryError) {
            console.error('❌ Retry failed:', retryError);
            queueStatusUpdate(callId, status);
          }
        }, 2000);

        return {success: false, error: error.message, willRetry: true};
      }
    },
    [queueStatusUpdate, cleanupCall],
  );

  /**
   * ✅ Queue status update for retry when connection returns
   */
  const queueStatusUpdate = useCallback((callId, status) => {
    const queueKey = `queue_${callId}_${status}`;

    try {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      AsyncStorage.setItem(
        queueKey,
        JSON.stringify({
          callId,
          status,
          queuedAt: Date.now(),
        }),
      );
      console.log('📦 Status update queued:', status);
    } catch (error) {
      console.error('❌ Failed to queue update:', error);
    }
  }, []);

  /**
   * ✅ Process queued status updates
   */
  const processQueuedUpdates = useCallback(async () => {
    try {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      const keys = await AsyncStorage.getAllKeys();
      const queuedKeys = keys.filter(key => key.startsWith('queue_'));

      if (queuedKeys.length === 0) {
        return;
      }

      console.log('🔄 Processing queued status updates:', queuedKeys.length);

      for (const key of queuedKeys) {
        try {
          const dataStr = await AsyncStorage.getItem(key);
          if (!dataStr) continue;

          const {callId, status} = JSON.parse(dataStr);

          const response = await ContactService.updateCallStatus(
            callId,
            status,
          );

          if (response?.success) {
            console.log(`✅ Queued update successful: ${status}`);
            await AsyncStorage.removeItem(key);
          }
        } catch (error) {
          console.error('❌ Failed to process queued update:', error);
        }
      }
    } catch (error) {
      console.error('❌ Failed to process queue:', error);
    }
  }, []);

  /**
   * ✅ Handle call answered
   */
  const handleCallAnswered = useCallback(async () => {
    console.log('✅ Call answered - updating status');
    return await updateCallStatus('ANSWERED');
  }, [updateCallStatus]);

  /**
   * ✅ Handle call ended (normal hangup)
   */
  const handleCallEnded = useCallback(async () => {
    console.log('📞 Call ended normally');

    let duration = 0;
    if (callStartTime.current) {
      duration = Math.floor((Date.now() - callStartTime.current) / 1000);
      console.log(`⏱️ Call duration: ${duration} seconds`);
    }

    return await updateCallStatus('ENDED');
  }, [updateCallStatus]);

  /**
   * ✅ Handle call failed (missed, rejected, timeout)
   */
  const handleCallFailed = useCallback(
    async (reason = 'timeout') => {
      console.log(`❌ Call failed: ${reason}`);
      return await updateCallStatus('FAILED');
    },
    [updateCallStatus],
  );

  /**
   * ✅ Clean up call state
   */
  const cleanupCall = useCallback(() => {
    console.log('🧹 Cleaning up call state');
    setCurrentCall(null);
    setCallStatus(null);
    setIsCallActive(false);
    callStartTime.current = null;
    statusUpdateAttempts.current = {};
  }, []);

  /**
   * ✅ Force cleanup (emergency)
   */
  const forceCleanup = useCallback(async () => {
    console.log('⚠️ Force cleanup initiated');

    if (
      currentCall?.callId &&
      callStatus !== 'ENDED' &&
      callStatus !== 'FAILED'
    ) {
      try {
        await updateCallStatus('ENDED');
      } catch (error) {
        console.error('❌ Force cleanup failed:', error);
        queueStatusUpdate(currentCall.callId, 'ENDED');
      }
    }

    cleanupCall();
  }, [
    currentCall,
    callStatus,
    updateCallStatus,
    cleanupCall,
    queueStatusUpdate,
  ]);

  // Monitor network connectivity
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('✅ Internet connected - processing queued updates');
        processQueuedUpdates();
      }
    });

    return unsubscribe;
  }, [processQueuedUpdates]);

  const value = {
    currentCall,
    callStatus,
    isCallActive,
    createCall, // ✅ Export createCall
    initiateCall,
    updateCallStatus,
    handleCallAnswered,
    handleCallEnded,
    handleCallFailed,
    cleanupCall,
    forceCleanup,
    processQueuedUpdates,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
