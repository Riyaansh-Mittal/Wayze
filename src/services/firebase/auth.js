/**
 * Firebase Auth Wrapper
 * Handles Firebase authentication (Google Sign-In)
 * 
 * TODO: Install @react-native-firebase/auth
 * npm install @react-native-firebase/app @react-native-firebase/auth
 * npm install @react-native-google-signin/google-signin
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';

/**
 * Initialize Google Sign-In
 */
export const initializeGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // From Firebase Console
    offlineAccess: true,
  });
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get user info
    const { idToken, user } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    // const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    // const userCredential = await auth().signInWithCredential(googleCredential);

    // For now, return mock data structure
    return {
      success: true,
      user: {
        uid: user.id,
        email: user.email,
        displayName: user.name,
        firstName: user.givenName || '',
        lastName: user.familyName || '',
        photoURL: user.photo,
        idToken,
      },
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sign out from Google
 */
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    // await auth().signOut();
    return { success: true };
  } catch (error) {
    console.error('Sign Out Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser;
  } catch (error) {
    return null;
  }
};

/**
 * Check if user is signed in
 */
export const isSignedIn = async () => {
  const isSignedIn = await GoogleSignin.isSignedIn();
  return isSignedIn;
};

export default {
  initializeGoogleSignIn,
  signInWithGoogle,
  signOutFromGoogle,
  getCurrentUser,
  isSignedIn,
};
