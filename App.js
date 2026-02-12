import {useEffect, useRef} from 'react';
import {StatusBar, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ZegoCallInvitationDialog} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeProvider} from './src/contexts/ThemeContext';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import {UserProvider} from './src/contexts/UserContext';
import {BalanceProvider} from './src/contexts/BalanceContext';
import {VehicleProvider} from './src/contexts/VehicleContext';
import {SearchProvider} from './src/contexts/SearchContext';
import {CallProvider, useCall} from './src/contexts/CallContext';
import {ToastProvider} from './src/components/common/Toast/ToastProvider';
import {NotificationProvider} from './src/contexts/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import {navigationRef} from './src/navigation/navigationRef';
import {
  requestUserPermission,
  notificationListener,
} from './src/services/firebase/NotificationService';
import {ZegoTokenManager} from './src/services/zego/ZegoTokenManager';
import {ZegoService} from './src/services/zego/ZegoService';

const AppContent = () => {
  const {isAuthenticated, isLoading} = useAuth();
  const callContext = useCall();
  const notificationHandled = useRef(false);


  // ✅ NEW: Setup FCM (moved from index.js for non-blocking startup)
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const fcmToken = await messaging().getToken();
        console.log('📱 FCM Token:', fcmToken);
        await AsyncStorage.setItem('FCM_TOKEN', fcmToken);
      } catch (err) {
        console.error('🔥 FCM Token Error:', err);
      }
    };

    // Start FCM setup in background
    setupFCM();

    // Setup token refresh listener
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      console.log('🔑 FCM Token refreshed:', token);
      AsyncStorage.setItem('FCM_TOKEN', token);
    });

    return () => unsubscribeTokenRefresh();
  }, []);

  // ✅ NEW: Setup foreground message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📨 Foreground FCM:', remoteMessage);
    });

    return unsubscribe;
  }, []);

  // ✅ Setup notification permissions and listeners
  useEffect(() => {
    requestUserPermission();
    notificationListener();

    // Handle initial notification (app opened from notification)
    const handleInitialNotification = async () => {
      if (notificationHandled.current) return;

      try {
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification && isAuthenticated) {
          console.log('📩 App launched by notification:', initialNotification);
          notificationHandled.current = true;
        }
      } catch (error) {
        console.warn('⚠️ Error handling initial notification:', error);
      }
    };

    handleInitialNotification();
  }, [isAuthenticated]);

  // ✅ Zego token refresh on app state change
  useEffect(() => {
    const checkToken = async () => {
      if (!isAuthenticated) {
        console.log('⏭️ Skipping token check - user not logged in');
        return;
      }

      try {
        const needsRefresh = await ZegoTokenManager.needsRefresh();
        if (needsRefresh) {
          console.log('🔄 Refreshing Zego token...');
          await ZegoTokenManager.fetchAndStore();
        }
      } catch (error) {
        console.warn('⚠️ Failed to refresh token:', error);
      }
    };

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isAuthenticated) {
        console.log('📱 App came to foreground, checking token...');
        checkToken();
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated]);

  // ✅ Setup CallContext in ZegoService
  useEffect(() => {
    if (callContext) {
      console.log('✅ Setting CallContext in ZegoService');
      ZegoService.setCallContext(callContext);
    }

    return () => {
      ZegoService.setCallContext(null);
    };
  }, [callContext]);

  return (
    <>
      <ZegoCallInvitationDialog />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#0779FF" />
      <ThemeProvider>
        <ToastProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              console.log('✅ Navigation container ready');
            }}>
            <AuthProvider>
              <UserProvider>
                <BalanceProvider>
                  <VehicleProvider>
                    <SearchProvider>
                      <NotificationProvider>
                        <CallProvider>
                          <AppContent />
                        </CallProvider>
                      </NotificationProvider>
                    </SearchProvider>
                  </VehicleProvider>
                </BalanceProvider>
              </UserProvider>
            </AuthProvider>
          </NavigationContainer>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
