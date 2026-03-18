package com.qrparkingappbare

import android.os.Bundle
import android.app.Dialog
import android.content.Intent
import android.view.WindowManager
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
    showSplashScreen()
    
    val window = window
    window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON)

    super.onCreate(savedInstanceState)

    android.util.Log.d("CallFlag", "=== MainActivity Intent ===")
    android.util.Log.d("CallFlag", "Action: ${intent?.action}")
    
    if (intent?.action == "com.hiennv.flutter_callkit_incoming.ACTION_CALL_ACCEPT") {
        android.util.Log.d("CallFlag", "Setting offline call flag")
        CallFlagModule.setFlag(this)
        // ✅ Process and save all call data (name + plate)
        processCallData(intent)
    }
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent)

    val action = intent?.action
    android.util.Log.d("CallFlag", "onNewIntent Action: $action")
    if (action == "com.hiennv.flutter_callkit_incoming.ACTION_CALL_ACCEPT") {
      android.util.Log.d("CallFlag", "✅ Setting offline call flag from onNewIntent")
      CallFlagModule.setFlag(this)
      // ✅ Process and save all call data (name + plate)
      processCallData(intent)
    }
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
    }
  }

  fun hideSplashScreen() {
      runOnUiThread {
          try {
              if (mSplashDialog != null && mSplashDialog!!.isShowing) {
                  mSplashDialog!!.dismiss()
                  mSplashDialog = null
              }
          } catch (e: Exception) {
          }
      }
  }

  private fun processCallData(intent: Intent?) {
      try {
          val callData = intent?.getBundleExtra("EXTRA_CALLKIT_CALL_DATA")
            
          // ✅ DUMP ALL KEYS — so you can debug any field at any time
          if (callData == null) {
              android.util.Log.d("CallFlag", "⚠️ EXTRA_CALLKIT_CALL_DATA bundle is NULL")
              return
          }

          android.util.Log.d("CallFlag", "callData bundle: $callData")
          callData.keySet()?.forEach { key ->
              android.util.Log.d("CallFlag", "Bundle key: $key = ${callData.get(key)}")
          }

          // ── Extract Caller Name ──────────────────────────────────────────
          val callerName = callData.getString("EXTRA_CALLKIT_NAME_CALLER") ?: ""

          // ── Extract Plate Number from customData inside payload ──────────
          var plateNumber = ""
          val payloadStr = callData.getString("payload")
          android.util.Log.d("CallFlag", "payload raw: $payloadStr")

          if (!payloadStr.isNullOrEmpty()) {
              try {
                  val payloadJson = org.json.JSONObject(payloadStr)
                  val customDataStr = payloadJson.optString("custom_data", "")
                  android.util.Log.d("CallFlag", "custom_data raw: $customDataStr")

                  if (customDataStr.isNotEmpty()) {
                      val customDataJson = org.json.JSONObject(customDataStr)
                      plateNumber = customDataJson.optString("plateNumber", "")
                  }
              } catch (e: Exception) {
                  android.util.Log.e("CallFlag", "JSON Parsing error: ${e.message}")
              }
          }

          android.util.Log.d("CallFlag", "✅ Final → Caller: '$callerName', Plate: '$plateNumber'")

          // Save both to SharedPreferences
          if (callerName.isNotEmpty() || plateNumber.isNotEmpty()) {
              CallFlagModule.setCallerData(this, callerName, plateNumber)
          }

      } catch (e: Exception) {
          android.util.Log.e("CallFlag", "processCallData error: ${e.message}")
      }
  }
}
