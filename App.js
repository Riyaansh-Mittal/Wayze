import {useEffect, useRef} from 'react';
import {StatusBar, AppState, Platform, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ZegoCallInvitationDialog} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {ThemeProvider} from './src/contexts/ThemeContext';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import {UserProvider} from './src/contexts/UserContext';
import {BalanceProvider} from './src/contexts/BalanceContext';
import {VehicleProvider} from './src/contexts/VehicleContext';
import {SearchProvider} from './src/contexts/SearchContext';
import {CallProvider, useCall} from './src/contexts/CallContext'; // ✅ ADD THIS
import {ToastProvider} from './src/components/common/Toast/ToastProvider';
import {NotificationProvider} from './src/contexts/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import {navigationRef} from './src/navigation/navigationRef';
import {
  requestUserPermission,
  notificationListener,
} from './src/services/firebase/NotificationService';
import {ZegoTokenManager} from './src/services/zego/ZegoTokenManager';
import {ZegoService} from './src/services/zego/ZegoService'; // ✅ ADD THIS
import messaging from '@react-native-firebase/messaging';

const AppContent = () => {
  const {isAuthenticated} = useAuth();
  const callContext = useCall(); // ✅ ADD THIS
  const notificationHandled = useRef(false);

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

    // ✅ CRITICAL: Handle notification that launched the app
    const handleInitialNotification = async () => {
      if (notificationHandled.current) return;

      try {
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification && isAuthenticated) {
          console.log('📩 App launched by notification:', initialNotification);
          notificationHandled.current = true;

          // Give navigation time to be ready
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

  // ✅ Connect CallContext to ZegoService
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
      <StatusBar barStyle="dark-content" />
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
                        {/* ✅ ADD CallProvider HERE */}
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
