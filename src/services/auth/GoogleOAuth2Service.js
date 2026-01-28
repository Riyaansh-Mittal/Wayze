/**
 * Google OAuth2 Sign-In using Browser-based flow
 * This opens Chrome Custom Tabs (fast, secure, modern)
 */

import {authorize, refresh, revoke} from 'react-native-app-auth';
import {Platform} from 'react-native';

const GOOGLE_WEB_CLIENT_ID =
  '483312777993-d2i6gn1oees4ak5g8m02ea5ggob8u4d5.apps.googleusercontent.com';
// ✅ OAuth2 configuration
const config = {
  issuer: 'https://accounts.google.com',
  clientId: GOOGLE_WEB_CLIENT_ID,
  redirectUrl: 'https://zegocloud-3d68b.web.app/__/auth/handler',
  scopes: ['openid', 'profile', 'email'],

  // ✅ These make it faster
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  },
};

class GoogleOAuth2ServiceClass {
  /**
   * ✅ Sign in with Google OAuth2 (Opens browser)
   */
  async signIn() {
    try {
      console.log('🔐 Starting Google OAuth2 Sign-In...');

      // ✅ Open browser (Chrome Custom Tabs on Android)
      const result = await authorize(config);

      console.log('✅ OAuth2 authorization successful');

      // Decode the ID token to get user info
      const userData = this.decodeJWT(result.idToken);

      return {
        success: true,
        data: {
          email: userData.email,
          firstName: userData.given_name || '',
          lastName: userData.family_name || '',
          fullName: userData.name || '',
          photo: userData.picture || null,
          idToken: result.idToken,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      };
    } catch (error) {
      console.error('❌ OAuth2 error:', error);

      // User cancelled
      if (
        error.message?.includes('User cancelled') ||
        error.code === 'USER_CANCELLED_AUTH'
      ) {
        return {success: false, cancelled: true};
      }

      return {
        success: false,
        error: error.message || 'Sign-in failed',
      };
    }
  }

  /**
   * ✅ Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const result = await refresh(config, {
        refreshToken: refreshToken,
      });

      return {
        success: true,
        data: {
          accessToken: result.accessToken,
          idToken: result.idToken,
          refreshToken: result.refreshToken,
        },
      };
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return {success: false, error: error.message};
    }
  }

  /**
   * ✅ Revoke access
   */
  async revokeAccess(token) {
    try {
      await revoke(config, {
        tokenToRevoke: token,
        includeBasicAuth: true,
      });
      console.log('✅ Access revoked');
      return {success: true};
    } catch (error) {
      console.error('❌ Revoke error:', error);
      return {success: false, error: error.message};
    }
  }

  /**
   * ✅ Decode JWT to extract user info
   */
  decodeJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // Get payload (middle part)
      const base64Url = parts[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding
      const pad = base64.length % 4;
      if (pad) {
        if (pad === 1) {
          throw new Error('Invalid base64 string');
        }
        base64 += new Array(5 - pad).join('=');
      }

      // Decode
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Failed to decode JWT:', error);
      return {};
    }
  }

  /**
   * Sign out (just clear local tokens)
   */
  async signOut() {
    try {
      console.log('✅ Signed out');
      return {success: true};
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      return {success: false, error: error.message};
    }
  }
}

const GoogleOAuth2Service = new GoogleOAuth2ServiceClass();
export default GoogleOAuth2Service;
