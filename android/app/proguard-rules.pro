# ============================================
# 🚀 PERFORMANCE OPTIMIZATIONS
# ============================================

# 1. Remove logging in Release builds (HUGE speed boost for video calls)
# This strips out all Log.d/v/i calls from the compiled code.
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# 2. Optimize React Native
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

# ============================================
# 📹 ZEGO SDK (Critical for Calls)
# ============================================

# Keep Zego Native Libraries
-keep class im.zego.** { *; }
-keep class com.zego.** { *; }
-keep class com.zegocloud.** { *; }

# Keep Zego UIKit & Prebuilt (Required for UI reflection)
-keep class com.zegocloud.uikit.** { *; }
-keep class com.zegocloud.uikit.prebuilt.** { *; }

# Keep Interfaces (Critical for callbacks)
-keep interface im.zego.** { *; }
-keep interface com.zegocloud.** { *; }

# ============================================
# 🔥 FIREBASE & GOOGLE SERVICES
# ============================================

# Keep RN Firebase specific bridges
-keep class io.invertase.firebase.** { *; }

# Keep generic Firebase components (needed for background handlers)
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Keep your specific service
-keep class com.qrparkingappbare.MyFirebaseMessagingService { *; }

# ============================================
# ⚛️ REACT NATIVE LIBRARIES
# ============================================

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Reanimated / Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.rnscreens.** { *; }

# React Native Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# ============================================
# 🛠 ESSENTIALS
# ============================================

# Keep OkHttp (Network)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Keep Kotlin Metadata
-keep class kotlin.Metadata { *; }

# ============================================
# 🛠 ESSENTIALS (FIXED)
# ============================================

# Keep Native Methods (JNI)
-keepclasseswithmembers class * {
    native <methods>;
}

# Keep View Constructors (XML Layouts)
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

# Keep Enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
