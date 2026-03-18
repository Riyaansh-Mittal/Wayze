import ZegoUIKitPrebuiltCallService, {
  ZegoMenuBarButtonName,
  ZegoMultiCertificate,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import messaging from '@react-native-firebase/messaging';
import ZEGO_CONFIG from '../../config/keyCenter';
import {ZegoTokenManager} from './ZegoTokenManager';
import {navigationRef} from '../../navigation/navigationRef';
import {Alert} from 'react-native';

export class ZegoService {
  static isInitialized = false;
  static callContext = null; // ✅ Store { updateCallStatus } reference
  static currentCallId = null; // ✅ Track current call
  static callAnswered = false; // ✅ Track if call was answered
  static callEndHandled = false; // ✅ Prevent duplicate end calls
  static isCaller = false; // ✅ Track if current user is the caller
  static callerName = null;

  static pendingOfflineCall = null;
  static onRoomJoined = null; // ✅ ADD THIS

  static setCallContext(context) {
    this.callContext = context;
    console.log('✅ CallContext set');
  }

  /**
   * ✅ Set current call ID and mark as caller
   */
  static setCurrentCallId(callId, isCaller = true) {
    this.currentCallId = callId;
    this.callAnswered = false;
    this.callEndHandled = false;
    this.isCaller = isCaller; // ✅ Store if user is the caller
    console.log('✅ CallId set:', callId, 'isCaller:', isCaller);
  }

  static clearCallState() {
    this.currentCallId = null;
    this.callAnswered = false;
    this.callEndHandled = false;
    this.isCaller = false; // ✅ Reset caller flag
    console.log('🧹 State cleared');
  }

  static async init(userId, userName) {
    try {
      if (this.isInitialized) {
        console.log('⚠️ Zego already initialized, skipping...');
        return;
      }

      console.log('🔧 Initializing Zego service...');
      console.log('📱 User ID:', userId);
      console.log('👤 User Name:', userName);

      // ✅ Register device for remote messages FIRST
      await messaging().registerDeviceForRemoteMessages();

      await ZegoUIKitPrebuiltCallService.init(
        ZEGO_CONFIG.appID,
        '',
        userId.toString(),
        userName,
        [ZIM, ZPNs],
        {
          ringtoneConfig: {
            incomingCallFileName: 'zego_incoming.mp3',
            outgoingCallFileName: 'zego_outgoing.mp3',
          },
          certificateIndex: ZegoMultiCertificate.first,
          androidNotificationConfig: {
            channelID: 'zego_audio_call_v3', // ✅ Match new channel ID
            channelName: 'Zego Audio Call',
            // sound: 'zego_incoming',
          },
          notifyWhenAppRunningInBackgroundOrQuit: true,
          zimConfig: {
            isMultiplePlatformOnline: true,
          },
          isIOSSandboxEnvironment: false,
          onIncomingCallReceived: (
            callID,
            inviter,
            type,
            invitees,
            customData,
          ) => {
            console.log('📞++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Incoming call received:', callID, inviter);
            ZegoService.pendingOfflineCall = {callID, inviter};
            ZegoService.setCurrentCallId(callID, false); // false = callee, not caller
            ZegoService.callerName = inviter?.userName || inviter?.name || null; // ✅ Add this
          },

          onIncomingCallCanceled: (callID, inviter) => {
            console.log('❌ Incoming call canceled:', callID);
            ZegoService.clearCallState();
          },

          onIncomingCallTimeout: (callID, inviter) => {
            console.log('⏱️ Incoming call timed out:', callID);
            ZegoService.clearCallState();
          },

          onIncomingCallAcceptButtonPressed: () => {
            console.log('✅ User accepted incoming call');
            ZegoService.pendingOfflineCall = null; // ✅ ADD THIS - clear on manual in-app accept
          },

          onIncomingCallDeclineButtonPressed: () => {
            console.log('❌ User declined incoming call');
            ZegoService.clearCallState();
          },
          onRequireNewToken: async () => {
            console.log('🔑 Zego SDK requesting new token...');
            return await ZegoTokenManager.getToken();
          },
          onOutgoingCallInvitationFailed: (
            errorCode,
            errorMessage,
            errorInvitees,
          ) => {
            console.log('❌ Call Invitation Failed:', errorCode, errorMessage);

            // ✅ Mark call as FAILED (only if caller)
            this.handleCallFailed('invitation_failed');

            // Force the UI to close immediately
            ZegoUIKitPrebuiltCallService.hangUp();

            Alert.alert(
              'Receiver Unavailable',
              'The user is not registered or is currently offline.',
              [{text: 'OK'}],
            );
          },
          requireConfig: data => {
            console.log('📞 Zego requireConfig called with data:', data);

            return {
              turnOnMicrophoneWhenJoining: true,
              turnOnCameraWhenJoining: false,
              useSpeakerWhenJoining: false,

              audioVideoViewConfig: {
                showSelfViewInVideoVoiceCall: false,
                useVideoViewAspectFill: true,
              },
              layout: {
                mode: 0,
              },
              timingConfig: {
                isDurationVisible: true,
                onDurationUpdate: duration => {
                  console.log('⏱️ Call duration:', duration);

                  // ✅ Mark call as ANSWERED when duration starts (only if caller)
                  if (duration === 1 && !this.callAnswered) {
                    console.log('✅ Call answered (duration started)');
                    this.handleCallAnswered();
                  }

                  // Auto-hangup after 3 minutes
                  if (duration === 3 * 60) {
                    ZegoUIKitPrebuiltCallService.hangUp();
                  }
                },
              },

              containerViewConfig: {
                showAvatarInAudioMode: true,
                showUserNameInAudioMode: true,
              },

              bottomMenuBarConfig: {
                maxCount: 3,
                buttons: [
                  ZegoMenuBarButtonName.toggleMicrophoneButton,
                  ZegoMenuBarButtonName.hangUpButton,
                  ZegoMenuBarButtonName.switchAudioOutputButton,
                ],
                hideAutomatically: false,
                hideByClick: false,
                showCameraToggleButton: false,
                showCameraFlipButton: false,
                showScreenSharingButton: false,
                showTextChatButton: false,
                showInRoomMessageButton: false,
              },

              topMenuBarConfig: {
                isVisible: true,
                hideAutomatically: false,
                hideByClick: false,
                buttons: [],
              },

              onOutgoingCallAccepted: callID => {
                console.log('✅ RECEIVER ACCEPTED CALL:', callID);
                // Note: We mark as ANSWERED when duration starts
              },

              onOutgoingCallRejectedCauseBusy: callID => {
                console.log('❌ RECEIVER BUSY:', callID);
                this.handleCallFailed('busy');
              },

              onOutgoingCallDeclined: callID => {
                console.log('❌ RECEIVER DECLINED:', callID);
                this.handleCallFailed('declined');
              },

              onOutgoingCallTimeout: callID => {
                console.log('⏱️ CALL TIMEOUT:', callID);
                this.handleCallFailed('timeout');
              },

              onOnlySelfInRoom: callID => {
                console.log('👤 ONLY SELF IN ROOM - Receiver hung up:', callID);
                this.handleCallEnded('receiver_hung_up');
              },

              onCallEnd: (callID, reason, duration) => {
                console.log('📞 Call ended:', {callID, reason, duration});
                this.handleCallEnded('call_end');
              },

              onHangUp: duration => {
                console.log('📞 User hung up manually, duration:', duration);
                this.handleCallEnded('manual_hang_up');
              },

              // ✅ ADD THIS — fires when room is successfully joined
              // Matches log: [ZegoUIKitPrebuiltCallInCallScreen] onJoinRoom at 00:05:37.009
              onJoinRoom: () => {
                console.log('✅ onJoinRoom fired — call room connected');
                ZegoService.pendingOfflineCall = null; // clear pending flag
                if (ZegoService.onRoomJoined) {
                  ZegoService.onRoomJoined(); // notify AppNavigator to hide CallConnecting
                  ZegoService.onRoomJoined = null;
                }
              },
            };
          },
        },
      );

      console.log('✅ Requesting system alert window permission...');
      await ZegoUIKitPrebuiltCallService.requestSystemAlertWindow({
        message: 'We need permissions for offline call functionality',
        allow: 'Allow',
        deny: 'Deny',
      });

      this.isInitialized = true;
      console.log('✅ Zego service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Zego:', error);
      throw error;
    }
  }

  /**
   * ✅ Handle call answered - ONLY CALLER UPDATES
   */
  static async handleCallAnswered() {
    console.log(
      '✅ Call answered - callId:',
      this.currentCallId,
      'isCaller:',
      this.isCaller,
    );

    // ✅ Check if user is the caller
    if (!this.isCaller) {
      console.log('⏭️ User is callee, skipping API call');
      return;
    }

    if (this.callAnswered) {
      console.log('⏭️ Already marked as answered');
      return;
    }

    this.callAnswered = true;

    if (!this.callContext?.updateCallStatus) {
      console.error('❌ updateCallStatus not available');
      return;
    }

    try {
      // ✅ Only caller makes API call
      await this.callContext.updateCallStatus(this.currentCallId, 'ANSWERED');
      console.log('✅ Status updated to ANSWERED');
    } catch (error) {
      console.error('❌ Failed to update ANSWERED:', error);
    }
  }

  /**
   * ✅ Handle call ended - ONLY CALLER UPDATES
   */
  static async handleCallEnded(reason) {
    if (this.callEndHandled) {
      console.log('⏭️ Already handled');
      return;
    }

    this.callEndHandled = true;
    console.log(`🔚 Call ended: ${reason}, isCaller:`, this.isCaller);

    // ✅ Check if user is the caller
    if (!this.isCaller) {
      console.log('⏭️ User is callee, skipping API call');
      this.clearCallState();
      this.navigateBackAfterCall(reason);
      return;
    }

    if (!this.callContext?.updateCallStatus) {
      console.warn('⚠️ updateCallStatus not available');
      this.navigateBackAfterCall(reason);
      return;
    }

    try {
      // ✅ Only caller makes API call
      await this.callContext.updateCallStatus(this.currentCallId, 'ENDED');
      console.log('✅ Status updated to ENDED');
    } catch (error) {
      console.error('❌ Failed to update ENDED:', error);
    } finally {
      this.clearCallState();
      this.navigateBackAfterCall(reason);
    }
  }

  /**
   * ✅ Handle call failed - ONLY CALLER UPDATES
   */
  static async handleCallFailed(reason) {
    if (this.callEndHandled) {
      console.log('⏭️ Already handled');
      return;
    }

    this.callEndHandled = true;
    console.log(`❌ Call failed: ${reason}, isCaller:`, this.isCaller);

    // ✅ Check if user is the caller
    if (!this.isCaller) {
      console.log('⏭️ User is callee, skipping API call');
      this.clearCallState();
      this.navigateBackAfterCall(reason);
      return;
    }

    if (!this.callContext?.updateCallStatus) {
      console.warn('⚠️ updateCallStatus not available');
      this.navigateBackAfterCall(reason);
      return;
    }

    try {
      // ✅ Only caller makes API call
      await this.callContext.updateCallStatus(this.currentCallId, 'FAILED');
      console.log('✅ Status updated to FAILED');
    } catch (error) {
      console.error('❌ Failed to update FAILED:', error);
    } finally {
      this.clearCallState();
      this.navigateBackAfterCall(reason);
    }
  }

  /**
   * ✅ Navigate back after call
   */
  static navigateBackAfterCall(reason) {
    console.log(`🔙 Call ended (${reason}) - Closing all call screens...`);

    setTimeout(() => {
      if (navigationRef.isReady()) {
        const state = navigationRef.getState();
        const routes = state.routes;

        const currentRoute = routes[routes.length - 1];
        const isOnZegoScreen =
          currentRoute.name === 'ZegoUIKitPrebuiltCallInCallScreen' ||
          currentRoute.name === 'ZegoUIKitPrebuiltCallWaitingScreen' ||
          currentRoute.name === 'CallConnecting'; // ✅ ADD THIS

        if (isOnZegoScreen) {
          console.log('🔙 Navigating to Main screen...');
          navigationRef.reset({
            index: 0,
            routes: [{name: 'Main', params: {screen: 'Home'}}],
          });
        }
      }
    }, 500);
  }

  static async uninit() {
    try {
      if (!this.isInitialized) {
        console.log('⚠️ Zego not initialized');
        return;
      }

      console.log('🔌 Uninitializing Zego service...');

      // ✅ Clean up any active calls (only if caller)
      if (this.currentCallId && !this.callEndHandled && this.isCaller) {
        console.log('⚠️ Forcing call end during uninit');
        await this.handleCallEnded('app_closing');
      }

      await ZegoUIKitPrebuiltCallService.uninit();
      this.isInitialized = false;
      this.callContext = null;
      this.clearCallState();

      console.log('✅ Zego service uninitialized');
    } catch (error) {
      console.error('❌ Failed to uninit Zego:', error);
    }
  }
}
