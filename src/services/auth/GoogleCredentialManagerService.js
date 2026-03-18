/**
 * Google Sign-In using Android Credential Manager
 * This is the MODERN approach with bottom sheet UI
 */

import {CredentialManager} from 'react-native-credentials-manager';
import {Platform} from 'react-native';

// Your Google Web Client ID
const WEB_CLIENT_ID =
  '483312777993-cois2s5otk9bmpm9fa08titejqihidbj.apps.googleusercontent.com';

class GoogleCredentialManagerServiceClass {
  /**
   * ✅ Sign in with Google using Credential Manager (Bottom Sheet)
   */
  async signIn() {
    try {
      if (Platform.OS !== 'android') {
        // Fallback to regular Google Sign-In on iOS
        const GoogleSignInService = require('./GoogleSignInService').default;
        return await GoogleSignInService.signIn();
      }

      console.log('🔐 Starting Google Sign-In via Credential Manager...');

      // Generate a random nonce for security
      const nonce = this.generateNonce();

      // ✅ Request Google ID Token via Credential Manager
      const result = await CredentialManager.getCredential({
        type: 'google',
        nonce: nonce,
        serverClientId: WEB_CLIENT_ID,
        filterByAuthorizedAccounts: false, // Show all accounts
      });

      console.log('✅ Credential Manager sign-in successful');

      // Extract user data from the ID token
      const userData = this.parseIdToken(result.idToken);

      return {
        success: true,
        data: {
          email: userData.email,
          firstName: userData.given_name || '',
          lastName: userData.family_name || '',
          fullName: userData.name || '',
          photo: userData.picture || null,
          idToken: result.idToken,
        },
      };
    } catch (error) {
      console.error('❌ Credential Manager error:', error);

      // User cancelled
      if (error.code === 'USER_CANCELED' || error.message?.includes('cancel')) {
        return {success: false, cancelled: true};
      }

      // No credentials found
      if (
        error.code === 'NO_CREDENTIAL' ||
        error.message?.includes('No credentials')
      ) {
        console.log('ℹ️ No saved credentials - showing account picker');
        return {success: false, cancelled: true};
      }

      return {
        success: false,
        error: error.message || 'Sign-in failed',
      };
    }
  }

  /**
   * ✅ Generate a random nonce for security (React Native compatible)
   */
  generateNonce() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 32; i++) {
      nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonce;
  }

  /**
   * ✅ Parse JWT ID token to extract user info (React Native compatible)
   */
  parseIdToken(idToken) {
    try {
      // Split the JWT
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // Get the payload (middle part)
      const base64Url = parts[1];

      // Convert base64url to base64
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if needed
      const pad = base64.length % 4;
      if (pad) {
        if (pad === 1) {
          throw new Error('Invalid base64 string');
        }
        base64 += new Array(5 - pad).join('=');
      }

      // ✅ Use Buffer instead of atob (works in React Native)
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Failed to parse ID token:', error);
      return {};
    }
  }

  /**
   * Sign out (clear credentials)
   */
  async signOut() {
    try {
      if (Platform.OS === 'android') {
        // Credential Manager doesn't have explicit sign-out
        // Credentials are managed by the system
        console.log('✅ Signed out');
      }
      return {success: true};
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      return {success: false, error: error.message};
    }
  }
}

const GoogleCredentialManagerService =
  new GoogleCredentialManagerServiceClass();
export default GoogleCredentialManagerService;
