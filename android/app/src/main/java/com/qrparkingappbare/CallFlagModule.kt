package com.qrparkingappbare  // ← match your actual package name

import android.content.Context
import com.facebook.react.bridge.*

class CallFlagModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "CallFlagModule"

    companion object {
        private const val PREFS_NAME = "CallPrefs"
        private const val KEY_FLAG = "pendingOfflineCall"
        private const val KEY_CALLER = "pendingCallerName"
        private const val KEY_PLATE = "pendingPlateNumber" // ✅ NEW KEY

        fun setFlag(context: Context) {
            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit().putBoolean(KEY_FLAG, true).commit()
        }

        // ✅ NEW — store both caller name and plate number
        fun setCallerData(context: Context, name: String, plate: String) {
            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(KEY_CALLER, name)
                .putString(KEY_PLATE, plate)
                .commit()
        }

        fun clearFlag(context: Context) {
            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putBoolean(KEY_FLAG, false)
                .putString(KEY_CALLER, "")
                .putString(KEY_PLATE, "")
                .commit()
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getAndClearFlag(): Boolean {
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val value = prefs.getBoolean(KEY_FLAG, false)
        if (value) prefs.edit().putBoolean(KEY_FLAG, false).commit()
        return value
    }
    
    // Non-destructive read for index.js
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun peekFlag(): Boolean {
        return reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getBoolean(KEY_FLAG, false)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getCallerName(): String {
        return reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_CALLER, "") ?: ""
    }

    // ✅ NEW — read plate number synchronously from JS
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getPlateNumber(): String {
        return reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_PLATE, "") ?: ""
    }
}
