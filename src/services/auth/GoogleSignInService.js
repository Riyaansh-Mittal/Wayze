/**
 * Google Sign-In Service
 * Handles Google authentication
 */

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Platform} from 'react-native';

// Your Google Web Client ID
const WEB_CLIENT_ID =
  '63738134619-9loqipgmkh84d3v35llvd1f22k4sfkr3.apps.googleusercontent.com';

class GoogleSignInServiceClass {
  configure() {
    try {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        scopes: ['email', 'profile'],
      });
      console.log('✅ Google Sign-In configured');
    } catch (error) {
      console.error('❌ Configuration failed:', error);
    }
  }

  async signIn() {
    try {
      console.log('🔐 Starting Google Sign-In...');

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      // Sign out first for fresh account picker
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore
      }

      // ✅ Get user info
      const response = await GoogleSignin.signIn();

      // ✅ Log the full response to debug
      console.log(
        '📦 Full Google Sign-In response:',
        JSON.stringify(response, null, 2),
      );

      // ✅ Handle different response structures (v10+ vs older versions)
      const user = response.data?.user || response.user || response;
      const idToken = response.data?.idToken || response.idToken;

      console.log('👤 Extracted user:', JSON.stringify(user, null, 2));

      // ✅ Validate required fields
      if (!user || !user.email) {
        throw new Error('Failed to get user email from Google Sign-In');
      }

      const userData = {
        email: user.email,
        firstName: user.givenName || user.name?.split(' ')[0] || '',
        lastName:
          user.familyName || user.name?.split(' ').slice(1).join(' ') || '',
        fullName:
          user.name ||
          `${user.givenName || ''} ${user.familyName || ''}`.trim(),
        photo: user.photo || null,
        idToken: idToken || null,
      };

      console.log('✅ Formatted user data:', userData);

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {success: false, cancelled: true};
      }

      if (error.code === statusCodes.IN_PROGRESS) {
        return {success: false, error: 'Sign-in already in progress'};
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {success: false, error: 'Play Services not available'};
      }

      return {
        success: false,
        error: error.message || 'Sign-in failed',
      };
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut();
      console.log('✅ Signed out successfully');
      return {success: true};
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      return {success: false, error: error.message};
    }
  }

  async revokeAccess() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('✅ Access revoked');
      return {success: true};
    } catch (error) {
      console.error('❌ Revoke error:', error);
      return {success: false, error: error.message};
    }
  }

  async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      const user = userInfo.data?.user || userInfo.user || userInfo;

      return {
        success: true,
        data: {
          email: user.email,
          firstName: user.givenName || '',
          lastName: user.familyName || '',
          fullName: user.name || '',
          photo: user.photo || null,
        },
      };
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return {success: false, error: error.message};
    }
  }
}

const GoogleSignInService = new GoogleSignInServiceClass();
export default GoogleSignInService;
