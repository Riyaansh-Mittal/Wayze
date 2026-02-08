// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from 'react';
// import messaging from '@react-native-firebase/messaging';
// import {AuthService} from '../services/api';
// import SecureStorage from '../services/storage/SecureStorage';
// import GoogleOAuth2Service from '../services/auth/GoogleOAuth2Service'; // ✅ Changed to OAuth2
// import {useToast} from '../components/common/Toast/ToastProvider';
// import {ZegoTokenManager} from '../services/zego/ZegoTokenManager';
// import {ZegoService} from '../services/zego/ZegoService';
// import {useTheme} from './ThemeContext';

// const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [authToken, setAuthToken] = useState(null);
//   const {showSuccess, showError} = useToast();
//   const {t} = useTheme();

//   /**
//    * ✅ Get FCM Token
//    */
//   const getFCMToken = async () => {
//     try {
//       // Request permission (iOS)
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (!enabled) {
//         console.warn('⚠️ FCM permission denied');
//         return null;
//       }

//       // Get FCM token
//       const fcmToken = await messaging().getToken();
//       console.log('✅ FCM Token in authcontext:', fcmToken);
//       return fcmToken;
//     } catch (error) {
//       console.error('❌ Failed to get FCM token:', error);
//       return null;
//     }
//   };

//   /**
//    * Initialize auth state on mount
//    */
//   const initializeAuth = useCallback(async () => {
//     try {
//       setIsLoading(true);

//       // ✅ OAuth2 doesn't need configure() - it's ready to use

//       const tokens = await SecureStorage.getTokens();
//       const storedUser = await SecureStorage.getUserData();

//       if (tokens.authToken && storedUser) {
//         console.log('✅ User already logged in:', storedUser.email);

//         setAuthToken(tokens.authToken);
//         setUser(storedUser);
//         setIsAuthenticated(true);

//         // Initialize Zego for already-logged-in user
//         try {
//           console.log('🔧 Initializing Zego for existing session...');

//           const needsRefresh = await ZegoTokenManager.needsRefresh();
//           if (needsRefresh) {
//             console.log('🔄 Zego token expired, fetching new token...');
//             await ZegoTokenManager.fetchAndStore();
//           } else {
//             console.log('✅ Zego token still valid');
//           }

//           await ZegoService.init(
//             storedUser.id,
//             storedUser.name || storedUser.phoneNumber,
//           );
//           console.log('✅ Zego initialized for existing session');
//         } catch (zegoError) {
//           console.error(
//             '❌ Failed to initialize Zego on app start:',
//             zegoError,
//           );
//         }
//       } else {
//         console.log('⏭️ No stored user - showing login screen');
//       }
//     } catch (error) {
//       console.error('Failed to initialize auth:', error);
//       await SecureStorage.clearAllData();
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   /**
//    * ✅ OAuth2 Google Sign-In with FCM Token
//    */
//   const googleLogin = useCallback(
//     async navigation => {
//       try {
//         // ✅ Step 1: Sign in with Google OAuth2 (opens browser)
//         const googleResult = await GoogleOAuth2Service.signIn();

//         if (!googleResult.success) {
//           if (googleResult.cancelled) {
//             return {success: false, cancelled: true};
//           }
//           throw new Error(googleResult.error);
//         }

//         // ✅ Show loading AFTER OAuth completes
//         setIsLoading(true);

//         // ✅ Step 2: Get FCM Token
//         const fcmToken = await getFCMToken();
//         if (!fcmToken) {
//           console.warn('⚠️ No FCM token available - continuing without it');
//         }

//         // ✅ Step 3: Send to backend WITH FCM token
//         const loginPayload = {
//           ...googleResult.data,
//           fcmToken: fcmToken,
//         };

//         console.log('📤 Sending to backend:', {
//           email: loginPayload.email,
//           hasFcmToken: !!loginPayload.fcmToken,
//         });

//         const response = await AuthService.socialLogin(loginPayload);

//         if (response.success) {
//           const backendData = response.data;
//           console.log('✅ Google login successful:', backendData);

//           // Map backend response to app structure
//           const userData = {
//             _id: backendData._id,
//             userId: backendData._id,
//             id: backendData._id,
//             firstName: backendData.firstName,
//             lastName: backendData.lastName,
//             fullName: backendData.fullName,
//             name: backendData.fullName,
//             email: backendData.email,
//             phoneNumber: backendData.phoneNumber || '',
//             deviceType: backendData.deviceType,
//             fcmToken: Array.isArray(backendData.fcmToken)
//               ? backendData.fcmToken
//               : [backendData.fcmToken],
//             referralCode: backendData.referralCode,
//             callBalance: backendData.callBalance || 0,
//             alertBalance: backendData.alertBalance || 0,
//             photo: googleResult.data.photo || null,
//             vehicleSearched: 0,
//             timesContacted: 0,
//             vehicleRegistered: 0,
//             // ✅ Store OAuth tokens for token refresh
//             googleAccessToken: googleResult.data.accessToken,
//             googleRefreshToken: googleResult.data.refreshToken,
//           };

//           // Save to secure storage
//           await SecureStorage.saveTokens(backendData.token, backendData.token);
//           await SecureStorage.saveUserData(userData);

//           // Update state
//           setUser(userData);
//           setAuthToken(backendData.token);
//           setIsAuthenticated(true);

//           // Fetch Zego token
//           try {
//             console.log('📞 Fetching fresh Zego token on login...');
//             await ZegoTokenManager.fetchAndStore();
//             console.log('✅ Zego token fetched and stored');
//           } catch (error) {
//             console.error('❌ Failed to fetch Zego token on login:', error);
//           }

//           // Initialize Zego service
//           try {
//             console.log('🔧 Calling ZegoService.init()...');
//             await ZegoService.init(
//               userData.id,
//               userData.name || userData.phoneNumber,
//             );
//             console.log('✅ Zego initialized after login');
//           } catch (error) {
//             console.error('❌ Failed to initialize Zego:', error);
//           }

//           showSuccess(t('toast.auth.loginSuccess') || 'Login successful!');

//           return {
//             success: true,
//             user: userData,
//             isFirstTime: backendData.isFirstTime || false,
//           };
//         }

//         throw new Error('Backend login failed');
//       } catch (error) {
//         console.error('❌ Google login error:', error);
//         showError(
//           t('toast.auth.loginFailed') || 'Login failed. Please try again.',
//         );
//         return {success: false, error: error.message};
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [showSuccess, showError, t],
//   );

//   /**
//    * ✅ Social login with FCM Token (for future use with other providers)
//    */
//   const socialLogin = useCallback(
//     async (loginData, navigation) => {
//       try {
//         setIsLoading(true);

//         // ✅ Get FCM token if not provided
//         if (!loginData.fcmToken) {
//           const fcmToken = await getFCMToken();
//           loginData.fcmToken = fcmToken;
//         }

//         const response = await AuthService.socialLogin(loginData);

//         if (response.success) {
//           const backendData = response.data;

//           const userData = {
//             _id: backendData._id,
//             userId: backendData._id,
//             id: backendData._id,
//             firstName: backendData.firstName,
//             lastName: backendData.lastName,
//             fullName: backendData.fullName,
//             name: backendData.fullName,
//             email: backendData.email,
//             phoneNumber: backendData.phoneNumber || '',
//             deviceType: backendData.deviceType,
//             fcmToken: Array.isArray(backendData.fcmToken)
//               ? backendData.fcmToken
//               : [backendData.fcmToken],
//             referralCode: backendData.referralCode,
//             callBalance: backendData.callBalance || 0,
//             alertBalance: backendData.alertBalance || 0,
//             photo: loginData.photo || null,
//             vehicleSearched: 0,
//             timesContacted: 0,
//             vehicleRegistered: 0,
//           };

//           await SecureStorage.saveTokens(backendData.token, backendData.token);
//           await SecureStorage.saveUserData(userData);

//           setUser(userData);
//           setAuthToken(backendData.token);
//           setIsAuthenticated(true);

//           // Fetch Zego token
//           try {
//             console.log('📞 Fetching Zego token on social login...');
//             await ZegoTokenManager.fetchAndStore();
//             console.log('✅ Zego token fetched');
//           } catch (error) {
//             console.error('❌ Failed to fetch Zego token:', error);
//           }

//           try {
//             console.log('🔧 Calling ZegoService.init()...');
//             await ZegoService.init(
//               userData.id,
//               userData.name || userData.phoneNumber,
//             );
//             console.log('✅ Zego initialized');
//           } catch (error) {
//             console.error('❌ Failed to initialize Zego:', error);
//           }

//           showSuccess(t('toast.auth.loginSuccessShort') || 'Login successful!');

//           return {
//             success: true,
//             user: userData,
//           };
//         }

//         return {success: false};
//       } catch (error) {
//         showError(
//           t('toast.auth.loginFailed') || 'Login failed. Please try again.',
//         );
//         return {success: false, error: error.message};
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [showSuccess, showError, t],
//   );

//   /**
//    * ✅ Logout with OAuth2 token revocation
//    */
//   const logout = useCallback(async () => {
//     try {
//       console.log('🚪 Logging out...');

//       // ✅ Get current FCM token before logout
//       let fcmToken = null;
//       try {
//         fcmToken = await messaging().getToken();
//         console.log('📱 Current FCM token:', fcmToken);
//       } catch (fcmError) {
//         console.warn('⚠️ Failed to get FCM token for logout:', fcmError);
//       }

//       // ✅ Call logout API with FCM token
//       try {
//         await AuthService.logout(fcmToken);
//         console.log('✅ Logout API called');
//       } catch (apiError) {
//         console.warn('⚠️ Logout API error (continuing anyway):', apiError);
//       }

//       // ✅ Revoke OAuth2 access token
//       if (user?.googleAccessToken) {
//         try {
//           await GoogleOAuth2Service.revokeAccess(user.googleAccessToken);
//           console.log('✅ OAuth2 token revoked');
//         } catch (revokeError) {
//           console.warn('⚠️ Failed to revoke OAuth token:', revokeError);
//         }
//       }

//       // Uninitialize Zego
//       try {
//         await ZegoService.uninit();
//       } catch (error) {
//         console.warn('⚠️ Failed to uninit Zego:', error);
//       }

//       // Clear Zego token
//       await ZegoTokenManager.clearToken();

//       // Clear state FIRST (immediate UI update)
//       setUser(null);
//       setAuthToken(null);
//       setIsAuthenticated(false);

//       // Sign out from Google OAuth2
//       try {
//         await GoogleOAuth2Service.signOut();
//         console.log('✅ Signed out from Google OAuth2');
//       } catch (googleError) {
//         console.error('⚠️ Google sign-out error (non-critical):', googleError);
//       }

//       // ✅ Delete FCM token from device
//       try {
//         await messaging().deleteToken();
//         console.log('✅ FCM token deleted from device');
//       } catch (deleteError) {
//         console.warn('⚠️ Failed to delete FCM token:', deleteError);
//       }

//       // Clear ALL storage
//       await SecureStorage.clearAllData();
//       console.log('✅ All storage cleared');

//       return {success: true};
//     } catch (error) {
//       console.error('❌ Logout error:', error);

//       // Even if something fails, still clear everything
//       setUser(null);
//       setAuthToken(null);
//       setIsAuthenticated(false);

//       try {
//         await SecureStorage.clearAllData();
//       } catch (clearError) {
//         console.error('Failed to clear storage:', clearError);
//       }

//       return {success: true};
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user]);

//   /**
//    * Update user data
//    */
//   const syncUserData = useCallback(async userData => {
//     try {
//       setUser(userData);
//       await SecureStorage.saveUserData(userData);
//       return {success: true};
//     } catch (error) {
//       console.error('Failed to sync user data:', error);
//       return {success: false, error: error.message};
//     }
//   }, []);

//   const value = {
//     // State
//     user,
//     isAuthenticated,
//     isLoading,
//     authToken,

//     // Methods
//     googleLogin,
//     socialLogin,
//     logout,
//     syncUserData,
//     getFCMToken, // ✅ Export for use elsewhere
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import messaging from '@react-native-firebase/messaging';
import {AuthService} from '../services/api';
import SecureStorage from '../services/storage/SecureStorage';
import GoogleSignInService from '../services/auth/GoogleSignInService'; // ✅ Changed back to native
import {useToast} from '../components/common/Toast/ToastProvider';
import {ZegoTokenManager} from '../services/zego/ZegoTokenManager';
import {ZegoService} from '../services/zego/ZegoService';
import {useTheme} from './ThemeContext';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [legalDocs, setLegalDocs] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const {showSuccess, showError} = useToast();
  const {t} = useTheme();

  /**
   * ✅ Get FCM Token
   */
  const getFCMToken = async () => {
    try {
      // Request permission (iOS)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.warn('⚠️ FCM permission denied');
        return null;
      }

      // Get FCM token
      const fcmToken = await messaging().getToken();
      console.log('✅ FCM Token in authcontext:', fcmToken);
      return fcmToken;
    } catch (error) {
      console.error('❌ Failed to get FCM token:', error);
      return null;
    }
  };

  /**
   * Initialize auth state on mount
   */
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // ✅ Configure native Google Sign-In (fast, synchronous)
      GoogleSignInService.configure();

      const tokens = await SecureStorage.getTokens();
      const storedUser = await SecureStorage.getUserData();

      if (tokens.authToken && storedUser) {
        console.log('✅ User already logged in:', storedUser.email);

        setAuthToken(tokens.authToken);
        setUser(storedUser);
        setIsAuthenticated(true);

        // ✅ NEW: Initialize Zego in BACKGROUND (don't await, don't block)
        setTimeout(() => {
          console.log('🔧 Starting Zego initialization in background...');

          ZegoTokenManager.needsRefresh()
            .then(needsRefresh => {
              if (needsRefresh) {
                console.log('🔄 Zego token expired, fetching new token...');
                return ZegoTokenManager.fetchAndStore();
              } else {
                console.log('✅ Zego token still valid');
                return Promise.resolve();
              }
            })
            .then(() => {
              return ZegoService.init(
                storedUser.id,
                storedUser.name || storedUser.phoneNumber,
              );
            })
            .then(() => {
              console.log('✅ Zego initialized for existing session');
            })
            .catch(zegoError => {
              console.error(
                '❌ Failed to initialize Zego (non-blocking):',
                zegoError,
              );
            });
        }, 100); // Start after 100ms, don't block the UI
      } else {
        console.log('⏭️ No stored user - showing login screen');
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await SecureStorage.clearAllData();
    } finally {
      // ✅ This now happens IMMEDIATELY (within ~200-300ms)
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * ✅ Native Google Sign-In with FCM Token
   */
  const googleLogin = useCallback(
    async navigation => {
      try {
        // ✅ Step 1: Sign in with native Google Sign-In
        const googleResult = await GoogleSignInService.signIn();

        if (!googleResult.success) {
          if (googleResult.cancelled) {
            return {success: false, cancelled: true};
          }
          throw new Error(googleResult.error);
        }

        // ✅ Show loading after Google Sign-In completes
        setIsLoading(true);

        // ✅ Step 2: Get FCM Token
        const fcmToken = await getFCMToken();
        if (!fcmToken) {
          console.warn('⚠️ No FCM token available - continuing without it');
        }

        // ✅ Step 3: Send to backend WITH FCM token
        const loginPayload = {
          ...googleResult.data,
          fcmToken: fcmToken,
        };

        console.log('📤 Sending to backend:', {
          email: loginPayload.email,
          hasFcmToken: !!loginPayload.fcmToken,
        });

        const response = await AuthService.socialLogin(loginPayload);

        if (response.success) {
          const backendData = response.data;
          console.log('✅ Google login successful:', backendData);

          // Map backend response to app structure
          const userData = {
            _id: backendData._id,
            userId: backendData._id,
            id: backendData._id,
            firstName: backendData.firstName,
            lastName: backendData.lastName,
            fullName: backendData.fullName,
            name: backendData.fullName,
            email: backendData.email,
            phoneNumber: backendData.phoneNumber || '',
            deviceType: backendData.deviceType,
            fcmToken: Array.isArray(backendData.fcmToken)
              ? backendData.fcmToken
              : [backendData.fcmToken],
            referralCode: backendData.referralCode,
            callBalance: backendData.callBalance || 0,
            alertBalance: backendData.alertBalance || 0,
            photo: googleResult.data.photo || null,
            vehicleSearched: 0,
            timesContacted: 0,
            vehicleRegistered: 0,
          };

          // Save to secure storage
          await SecureStorage.saveTokens(backendData.token, backendData.token);
          await SecureStorage.saveUserData(userData);

          // Update state
          setUser(userData);
          setAuthToken(backendData.token);
          setIsAuthenticated(true);

          // Fetch Zego token
          try {
            console.log('📞 Fetching fresh Zego token on login...');
            await ZegoTokenManager.fetchAndStore();
            console.log('✅ Zego token fetched and stored');
          } catch (error) {
            console.error('❌ Failed to fetch Zego token on login:', error);
          }

          // Initialize Zego service
          try {
            console.log('🔧 Calling ZegoService.init()...');
            await ZegoService.init(
              userData.id,
              userData.name || userData.phoneNumber,
            );
            console.log('✅ Zego initialized after login');
          } catch (error) {
            console.error('❌ Failed to initialize Zego:', error);
          }

          showSuccess(t('toast.auth.loginSuccess') || 'Login successful!');

          return {
            success: true,
            user: userData,
          };
        }

        throw new Error('Backend login failed');
      } catch (error) {
        console.error('❌ Google login error:', error);

        // ✅ Handle deleted account errors
        const errorMessage = error.message || error.toString();

        if (errorMessage.includes('Your account has been deleted')) {
          showError(
            t('toast.auth.accountDeleted') ||
              'Your account has been permanently deleted and cannot be restored.',
          );
          return {
            success: false,
            error: 'ACCOUNT_DELETED',
            message: errorMessage,
          };
        }

        if (errorMessage.includes('Your account has been blocked')) {
          showError(
            t('toast.auth.accountBlocked') ||
              'Your account has been blocked. Please contact support.',
          );
          return {
            success: false,
            error: 'ACCOUNT_BLOCKED',
            message: errorMessage,
          };
        }

        // Generic error
        showError(
          t('toast.auth.loginFailed') || 'Login failed. Please try again.',
        );
        return {success: false, error: errorMessage};
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess, showError, t],
  );

  /**
   * ✅ Social login with FCM Token (for future use with other providers)
   */
  const socialLogin = useCallback(
    async (loginData, navigation) => {
      try {
        setIsLoading(true);

        // ✅ Get FCM token if not provided
        if (!loginData.fcmToken) {
          const fcmToken = await getFCMToken();
          loginData.fcmToken = fcmToken;
        }

        const response = await AuthService.socialLogin(loginData);

        if (response.success) {
          const backendData = response.data;

          const userData = {
            _id: backendData._id,
            userId: backendData._id,
            id: backendData._id,
            firstName: backendData.firstName,
            lastName: backendData.lastName,
            fullName: backendData.fullName,
            name: backendData.fullName,
            email: backendData.email,
            phoneNumber: backendData.phoneNumber || '',
            deviceType: backendData.deviceType,
            fcmToken: Array.isArray(backendData.fcmToken)
              ? backendData.fcmToken
              : [backendData.fcmToken],
            referralCode: backendData.referralCode,
            callBalance: backendData.callBalance || 0,
            alertBalance: backendData.alertBalance || 0,
            photo: loginData.photo || null,
            vehicleSearched: 0,
            timesContacted: 0,
            vehicleRegistered: 0,
          };

          await SecureStorage.saveTokens(backendData.token, backendData.token);
          await SecureStorage.saveUserData(userData);

          setUser(userData);
          setAuthToken(backendData.token);
          setIsAuthenticated(true);

          // Fetch Zego token
          try {
            console.log('📞 Fetching Zego token on social login...');
            await ZegoTokenManager.fetchAndStore();
            console.log('✅ Zego token fetched');
          } catch (error) {
            console.error('❌ Failed to fetch Zego token:', error);
          }

          try {
            console.log('🔧 Calling ZegoService.init()...');
            await ZegoService.init(
              userData.id,
              userData.name || userData.phoneNumber,
            );
            console.log('✅ Zego initialized');
          } catch (error) {
            console.error('❌ Failed to initialize Zego:', error);
          }

          showSuccess(t('toast.auth.loginSuccessShort') || 'Login successful!');

          return {
            success: true,
            user: userData,
          };
        }

        return {success: false};
      } catch (error) {
        showError(
          t('toast.auth.loginFailed') || 'Login failed. Please try again.',
        );
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess, showError, t],
  );

  /**
   * ✅ Logout with native Google Sign-In
   */
  const logout = useCallback(async () => {
    try {
      console.log('🚪 Logging out...');

      // ✅ Get current FCM token before logout
      let fcmToken = null;
      try {
        fcmToken = await messaging().getToken();
        console.log('📱 Current FCM token:', fcmToken);
      } catch (fcmError) {
        console.warn('⚠️ Failed to get FCM token for logout:', fcmError);
      }

      // ✅ Call logout API with FCM token
      try {
        await AuthService.logout(fcmToken);
        console.log('✅ Logout API called');
      } catch (apiError) {
        console.warn('⚠️ Logout API error (continuing anyway):', apiError);
      }

      // Uninitialize Zego
      try {
        await ZegoService.uninit();
      } catch (error) {
        console.warn('⚠️ Failed to uninit Zego:', error);
      }

      // Clear Zego token
      await ZegoTokenManager.clearToken();

      // Clear state FIRST (immediate UI update)
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);

      // Sign out from native Google Sign-In
      try {
        await GoogleSignInService.signOut();
        console.log('✅ Signed out from Google');
      } catch (googleError) {
        console.error('⚠️ Google sign-out error (non-critical):', googleError);
      }

      // ✅ Delete FCM token from device
      try {
        await messaging().deleteToken();
        console.log('✅ FCM token deleted from device');
      } catch (deleteError) {
        console.warn('⚠️ Failed to delete FCM token:', deleteError);
      }

      // Clear ALL storage
      await SecureStorage.clearAllData();
      console.log('✅ All storage cleared');

      return {success: true};
    } catch (error) {
      console.error('❌ Logout error:', error);

      // Even if something fails, still clear everything
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);

      try {
        await SecureStorage.clearAllData();
      } catch (clearError) {
        console.error('Failed to clear storage:', clearError);
      }

      return {success: true};
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user data
   */
  const syncUserData = useCallback(async userData => {
    try {
      setUser(userData);
      await SecureStorage.saveUserData(userData);
      return {success: true};
    } catch (error) {
      console.error('Failed to sync user data:', error);
      return {success: false, error: error.message};
    }
  }, []);

  /**
   * Fetch legal documents
   */
  const getLegalDocuments = useCallback(async () => {
    try {
      const docs = await AuthService.getLegalDocuments();
      setLegalDocs(docs);
      return docs;
    } catch (error) {
      console.error('Failed to fetch legal documents:', error);
      return null;
    }
  }, []);

  /**
   * Delete user account
   */
  const deleteAccount = useCallback(async () => {
    try {
      console.log('🗑️ Starting account deletion process...');

      // Call delete account API
      await AuthService.deleteAccount();

      console.log('✅ Account deleted from backend');

      // Clear local state
      setUser(null);
      setIsAuthenticated(false);

      // Clear tokens
      await ZegoTokenManager.clearToken();
      console.log('🧹 Tokens cleared');

      // Clear FCM token (optional - account is already deleted)
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          await messaging().deleteToken();
        }
      } catch (fcmError) {
        console.warn('⚠️ Failed to clear FCM token:', fcmError);
      }

      // Clear Zego connection
      try {
        await ZegoService.cleanup();
        console.log('🧹 Zego cleaned up');
      } catch (zegoError) {
        console.warn('⚠️ Failed to cleanup Zego:', zegoError);
      }

      console.log('✅ Account deletion complete - user logged out');

      return {success: true};
    } catch (error) {
      console.error('❌ Account deletion failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete account',
      };
    }
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    authToken,

    // Methods
    legalDocs,
    googleLogin,
    socialLogin,
    logout,
    deleteAccount,
    syncUserData,
    getFCMToken, // ✅ Export for use elsewhere
    getLegalDocuments,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
