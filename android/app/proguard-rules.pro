# Add project specific ProGuard rules here.

# ============================================
# React Native Core Rules
# ============================================

-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *

-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

-dontwarn com.facebook.react.**
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# ============================================
# Hermes (React Native 0.70+)
# ============================================

-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.** { *; }

# ============================================
# CRITICAL: Zego SDK - Background Calls
# ============================================

# Keep ALL Zego classes and interfaces
-keep class im.zego.** { *; }
-keep interface im.zego.** { *; }
-keep enum im.zego.** { *; }
-keepclassmembers class im.zego.** { *; }

-keep class com.zego.** { *; }
-keep interface com.zego.** { *; }
-keep enum com.zego.** { *; }
-keepclassmembers class com.zego.** { *; }

# Zego Express Engine
-keep class im.zego.zegoexpress.** { *; }
-keep class im.zego.zegoexpress.callback.** { *; }
-keep class im.zego.zegoexpress.constants.** { *; }
-keep class im.zego.zegoexpress.entity.** { *; }

# Zego ZIM (messaging/signaling)
-keep class im.zego.zim.** { *; }
-keep class im.zego.zim.callback.** { *; }
-keep class im.zego.zim.entity.** { *; }
-keep class im.zego.zim.enums.** { *; }

# Zego ZPNs (push notifications)
-keep class im.zego.zpns.** { *; }
-keep class im.zego.zpns_reactnative_sdk.** { *; }

# Zego React Native Bridge (CRITICAL)
-keep class im.zego.reactnative.** { *; }
-keep class com.zegocloud.** { *; }
-keepclassmembers class com.zegocloud.** { *; }

# Zego UIKit Prebuilt Call (CRITICAL for call UI when app is killed)
-keep class com.zegocloud.uikit.** { *; }
-keep class com.zegocloud.uikit.prebuilt.** { *; }
-keep class com.zegocloud.uikit.prebuilt.call.** { *; }
-keep class com.zegocloud.uikit.prebuilt.call.invite.** { *; }
-keep class com.zegocloud.uikit.prebuilt.call.internal.** { *; }

# Keep all Zego callback interfaces
-keep interface im.zego.**$*Callback { *; }
-keep interface im.zego.**$*Listener { *; }
-keep interface im.zego.**$*Handler { *; }

-dontwarn im.zego.**
-dontwarn com.zego.**
-dontwarn com.zegocloud.**

# ============================================
# Firebase & FCM (CRITICAL for background calls)
# ============================================

-keep class com.google.firebase.** { *; }
-keep class com.google.firebase.messaging.** { *; }
-keep class com.google.firebase.iid.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.android.gms.tasks.** { *; }
-keepclassmembers class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Keep your custom Firebase service (CRITICAL)
-keep class com.qrparkingappbare.MyFirebaseMessagingService { *; }
-keep class * extends com.google.firebase.messaging.FirebaseMessagingService { *; }

# ============================================
# React Native Firebase
# ============================================

-keep class io.invertase.firebase.** { *; }
-keep class io.invertase.firebase.messaging.** { *; }
-keepclassmembers class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# ============================================
# Google Sign-In
# ============================================

-keep class com.google.android.libraries.identity.googleid.** { *; }
-keep class androidx.credentials.** { *; }
-dontwarn com.google.android.libraries.identity.googleid.**

# ============================================
# React Native Libraries
# ============================================

# Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-dontwarn com.reactnativecommunity.asyncstorage.**

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.reanimated.** { *; }

# Screens
-keep class com.swmansion.rnscreens.** { *; }

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Navigation
-keep class com.reactnativecommunity.** { *; }

# ============================================
# OkHttp (used by React Native)
# ============================================

-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# ============================================
# Kotlin
# ============================================

-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.**

# ============================================
# AndroidX
# ============================================

-keep class androidx.** { *; }
-dontwarn androidx.**

# Notification-related classes (CRITICAL for call UI)
-keep class android.app.Notification { *; }
-keep class android.app.NotificationManager { *; }
-keep class android.app.NotificationChannel { *; }
-keep class androidx.core.app.NotificationCompat** { *; }

# Intent-related classes (CRITICAL for opening app from notification)
-keep class android.content.Intent { *; }
-keep class android.app.PendingIntent { *; }

# Service classes
-keep class * extends android.app.Service { *; }
-keep class * extends android.content.BroadcastReceiver { *; }

# ============================================
# Keep all native methods
# ============================================

-keepclasseswithmembernames class * {
    native <methods>;
}

-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# ============================================
# Keep serializable classes
# ============================================

-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ============================================
# Keep Parcelable classes
# ============================================

-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# ============================================
# Keep enums
# ============================================

-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ============================================
# CRITICAL: Zego Notification System
# ============================================

# Keep notification helper classes (CRITICAL - used via reflection)
-keep class com.zegocloud.uikit.prebuilt.call.invite.internal.NotificationHelper { *; }
-keep class com.zegocloud.uikit.prebuilt.call.invite.internal.CallNotificationManager { *; }
-keep class com.zegocloud.uikit.prebuilt.call.invite.internal.CallNotificationReceiver { *; }
-keep class com.zegocloud.uikit.prebuilt.call.invite.internal.CallNotificationConfig { *; }

# Keep all internal classes (they use reflection extensively)
-keep class com.zegocloud.uikit.prebuilt.call.invite.internal.** { *; }
-keep class com.zegocloud.uikit.prebuilt.call.internal.** { *; }

# Keep all Zego activities (launched from notifications)
-keep class com.zegocloud.uikit.prebuilt.call.** extends android.app.Activity { *; }
-keep class com.zegocloud.uikit.prebuilt.call.ZegoCallActivity { *; }
-keep class com.zegocloud.uikit.prebuilt.call.ZegoUIKitPrebuiltCallActivity { *; }

# Keep PendingIntent and Intent classes (CRITICAL)
-keep class android.app.PendingIntent { *; }
-keep class android.content.IntentSender { *; }
-keep class android.content.Intent { *; }
-keepclassmembers class android.content.Intent { *; }

# Keep notification action handlers
-keep class * implements com.zegocloud.uikit.prebuilt.call.invite.internal.INotificationActionHandler { *; }

# Keep all broadcast receivers (used for notification actions)
-keep class * extends android.content.BroadcastReceiver {
    public <init>(...);
    public void onReceive(...);
}

# Keep MainActivity (launched from notifications)
-keep class com.qrparkingappbare.MainActivity { *; }
-keepclassmembers class com.qrparkingappbare.MainActivity { *; }

# ============================================
# CRITICAL: Android System Classes for Calls
# ============================================

# Keep Activity launching mechanisms
-keep class android.app.ActivityManager { *; }
-keep class android.app.ActivityThread { *; }
-keep class android.app.Application { *; }

# Keep fragment classes (used in call UI)
-keep class androidx.fragment.app.Fragment { *; }
-keep class androidx.fragment.app.FragmentActivity { *; }
-keep class androidx.fragment.app.FragmentManager { *; }

# Keep all constructors for Activities
-keepclassmembers class * extends android.app.Activity {
    public <init>(...);
}

# Keep all constructors for Fragments
-keepclassmembers class * extends androidx.fragment.app.Fragment {
    public <init>(...);
}

# ============================================
# Remove Debug Logging (Keep for Zego)
# ============================================

# ✅ CHANGED: Don't remove Zego logs in release (for debugging)
# Comment out the assumenosideeffects rule for now
# -assumenosideeffects class android.util.Log {
#     public static *** d(...);
#     public static *** v(...);
#     public static *** i(...);
# }
