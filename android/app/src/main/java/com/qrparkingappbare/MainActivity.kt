package com.qrparkingappbare

import android.os.Bundle // ✅ Required
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen // ✅ Required import

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "QRParkingAppBare"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    // ✅ Use the simple show() method. 
    // If the library version is standard, this is all you need.
    SplashScreen.show(this)
    
    super.onCreate(savedInstanceState)
  }
}
