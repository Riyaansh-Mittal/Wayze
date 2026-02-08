import {useEffect, useRef} from 'react';
import {StatusBar, AppState, Platform, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ZegoCallInvitationDialog} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import SplashScreen from 'react-native-splash-screen'; // ✅ Add this import
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
import messaging from '@react-native-firebase/messaging';

const AppContent = () => {
  const {isAuthenticated} = useAuth(); // ✅ Add isLoading
  const callContext = useCall();
  const notificationHandled = useRef(false);

  // ✅ Hide splash screen when auth is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
      console.log('✅ Native splash screen hidden');
    }, 1000); // Show splash for exactly 1.5 seconds

    return () => clearTimeout(timer);
  }, []); // ✅ Run only once on mount

  useEffect(() => {
    requestUserPermission();
    notificationListener();

    const checkToken = async () => {
      if (!isAuthenticated) {
        console.log('⏭️ Skipping token check - user not logged in');
        return;
      }

      try {
        const needsRefresh = await ZegoTokenManager.needsRefresh();
        if (needsRefresh) {
          console.log('🔄 Refreshing Zego token on app start...');
          await ZegoTokenManager.fetchAndStore();
        }
      } catch (error) {
        console.warn('⚠️ Failed to refresh token on app start:', error);
      }
    };

    checkToken();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isAuthenticated) {
        console.log('📱 App came to foreground, checking token...');
        checkToken();
      }
    });

    const handleInitialNotification = async () => {
      if (notificationHandled.current) return;

      try {
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification && isAuthenticated) {
          console.log('📩 App launched by notification:', initialNotification);
          notificationHandled.current = true;

          setTimeout(() => {
            console.log('✅ Navigation ready after notification launch');
          }, 1000);
        }
      } catch (error) {
        console.warn('⚠️ Error handling initial notification:', error);
      }
    };

    handleInitialNotification();

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated]);

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
      <StatusBar barStyle="light-content" backgroundColor="#1490EE" />
      {/* ✅ Match splash color */}
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
