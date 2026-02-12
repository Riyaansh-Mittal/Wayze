package com.qrparkingappbare

import android.os.Bundle
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen // ✅ NEW: Android 12+ API
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "QRParkingAppBare"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    // ✅ CRITICAL: Install Android 12+ splash BEFORE super.onCreate()
    // This uses the native system splash (fastest possible)
    installSplashScreen()
    
    super.onCreate(savedInstanceState)
    
    // ✅ REMOVED: Old react-native-splash-screen (no longer needed)
    // The Android 12+ API handles everything automatically
  }
}
