/**
 * Google Sign-In Service
 * Handles Google authentication
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

// Your Google Web Client ID
const WEB_CLIENT_ID = '63738134619-9loqipgmkh84d3v35llvd1f22k4sfkr3.apps.googleusercontent.com';

class GoogleSignInService {
  constructor() {
    this.isConfigured = false;
  }

  /**
   * Configure Google Sign-In
   * Call this on app initialization
   */
  configure() {
    try {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
      this.isConfigured = true;
      console.log('✅ Google Sign-In configured');
    } catch (error) {
      console.error('❌ Google Sign-In configuration failed:', error);
      throw error;
    }
  }

  /**
   * Sign in with Google
   * Returns user data formatted for backend
   */
  async signIn() {
    try {
      // Ensure configured
      if (!this.isConfigured) {
        this.configure();
      }

      // Check for Play Services (Android)
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign in
      const userInfo = await GoogleSignin.signIn();
      console.log('✅ Google Sign-In Success:', userInfo);

      // Extract user data (new SDK structure)
      const googleUser = userInfo?.data?.user || userInfo?.user;

      if (!googleUser) {
        throw new Error('No user data received from Google');
      }

      // Format for backend API
      const formattedUser = {
        firstName: googleUser.givenName || googleUser.name?.split(' ')[0] || '',
        lastName: googleUser.familyName || googleUser.name?.split(' ').slice(1).join(' ') || '',
        fullName: googleUser.name || `${googleUser.givenName} ${googleUser.familyName}`,
        email: googleUser.email,
        phoneNumber: '', // Not provided by Google
        deviceType: Platform.OS.toUpperCase(),
        password: '', // Social login doesn't use password
        fcmToken: 'Sample-FCM', // Will be replaced with actual FCM token
        photo: googleUser.photo || null,
        googleId: googleUser.id,
      };

      return {
        success: true,
        data: formattedUser,
      };
    } catch (error) {
      console.error('❌ Google Sign-In Error:', error);

      // Handle specific errors
      if (error.code === 'SIGN_IN_CANCELLED') {
        return {
          success: false,
          error: 'Sign in cancelled',
          cancelled: true,
        };
      }

      if (error.code === 'IN_PROGRESS') {
        return {
          success: false,
          error: 'Sign in already in progress',
        };
      }

      if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        return {
          success: false,
          error: 'Google Play Services not available',
        };
      }

      return {
        success: false,
        error: error.message || 'Google Sign-In failed',
      };
    }
  }

  /**
   * Sign out from Google
   */
  async signOut() {
    try {
      await GoogleSignin.signOut();
      console.log('✅ Google Sign-Out Success');
      return { success: true };
    } catch (error) {
      console.error('❌ Google Sign-Out Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Revoke access (stronger than signOut)
   */
  async revokeAccess() {
    try {
      await GoogleSignin.revokeAccess();
      console.log('✅ Google Access Revoked');
      return { success: true };
    } catch (error) {
      console.error('❌ Google Revoke Access Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get current signed-in user
   */
  async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return {
        success: true,
        data: userInfo,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if user is signed in
   */
  async isSignedIn() {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      return isSignedIn;
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return false;
    }
  }
}

export default new GoogleSignInService();
