package com.qrparkingappbare

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SplashModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SplashModule"
    }

    @ReactMethod
    fun hide() {
        // Find the MainActivity and tell it to hide the splash
        val activity = currentActivity
        if (activity is MainActivity) {
            activity.runOnUiThread {
                activity.hideSplashScreen()
            }
        }
    }
}
