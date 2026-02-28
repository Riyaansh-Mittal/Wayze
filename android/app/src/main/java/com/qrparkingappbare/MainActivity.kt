package com.qrparkingappbare

import android.os.Bundle
import android.app.Dialog
import android.view.WindowManager // ✅ REQUIRED for Lock Screen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "QRParkingAppBare"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  private var mSplashDialog: Dialog? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    // 1. Show Splash IMMEDIATELY
    showSplashScreen()
    
    // 2. ✅ CRITICAL: Allow this activity to show over lock screen
    // This is required even if you have it in Manifest for some devices
    val window = window
    window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON)

    // 3. Call super.onCreate
    super.onCreate(savedInstanceState)
  }

  private fun showSplashScreen() {
    try {
        if (mSplashDialog == null) {
            mSplashDialog = Dialog(this, android.R.style.Theme_NoTitleBar_Fullscreen)
            mSplashDialog?.setContentView(R.layout.launch_screen)
            mSplashDialog?.setCancelable(false)
            mSplashDialog?.show()
        }
    } catch (e: Exception) {
        // Safe fail if activity is dying
    }
  }

  // 4. Hide Splash (Called from JS)
  fun hideSplashScreen() {
      runOnUiThread {
          try {
              if (mSplashDialog != null && mSplashDialog!!.isShowing) {
                  mSplashDialog!!.dismiss()
                  mSplashDialog = null
              }
          } catch (e: Exception) {
              // Safe exit
          }
      }
  }
}
