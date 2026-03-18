import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ZegoService} from '../../services/zego/ZegoService';
import {getCallerName} from '../../native/CallFlagModule';

const {width, height} = Dimensions.get('window');

// ── Concentric ripple ring (Perfect Circles) ──────────────
const RippleRing = ({delay, size, opacityLevel}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1200, // Slightly slower for smoother feel
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(100), // Small pause at the end of cycle
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25], // Less extreme scale prevents pixelation
  });

  return (
    <Animated.View
      style={[
        styles.rippleRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2, // Perfect circle
          borderColor: `rgba(255, 255, 255, ${opacityLevel})`,
          backgroundColor: `rgba(255, 255, 255, ${opacityLevel * 0.15})`, // Subtle fill
          transform: [{scale}],
        },
      ]}
    />
  );
};

// ── Pulsing ring ──────────────────────────────────────────────────────────────
const Ring = ({delay, size, borderOpacity}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {toValue: 0, duration: 0, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1.14],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: `rgba(255,255,255,${borderOpacity})`,
          transform: [{scale}],
          opacity,
        },
      ]}
    />
  );
};

// ── Blinking dot in "Connecting..." ──────────────────────────────────────────
const BlinkDot = ({delay}) => {
  const anim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 390,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1300 - 390 - 520 - delay),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return <Animated.Text style={[styles.dot, {opacity: anim}]}>.</Animated.Text>;
};

// ── Jumping dot at bottom ─────────────────────────────────────────────────────
const JumpDot = ({delay}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 240,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1200 - 480 - delay),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -9],
  });
  const opacity = anim.interpolate({inputRange: [0, 1], outputRange: [0.3, 1]});

  return (
    <Animated.View
      style={[styles.jumpDot, {transform: [{translateY}], opacity}]}
    />
  );
};

// ── Animated background gradient ─────────────────────────────────────────────
const AnimatedBackground = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 4500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 4500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Interpolate between two gradient states
  const topColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0779FF', '#3394FF'],
  });
  const midColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#053C8C', '#064BA5'],
  });

  // Animated.View wrapping LinearGradient to animate colors
  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);

  return (
    <AnimatedLinearGradient
      colors={[topColor, midColor, '#08080E']}
      locations={[0, 0.45, 1]}
      style={StyleSheet.absoluteFill}
    />
  );
};

// ── Animated avatar glow ──────────────────────────────────────────────────────
const AvatarGlow = ({children}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 4500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 4500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const shadowRadius = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 36],
  });
  const shadowOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.55],
  });

  return (
    <Animated.View
      style={[styles.avatarGlowWrap, {shadowRadius, shadowOpacity}]}>
      {children}
    </Animated.View>
  );
};

// ── Helper to get initials from full name ─────────────────────────────────────
const getInitials = name => {
  if (!name) {
    return ' ';
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// ── Main screen ───────────────────────────────────────────────────────────────
const CallConnectingScreen = () => {
  // ✅ Read synchronously from SharedPreferences — available immediately
  const [callerName] = useState(() => {
    const fromNative = getCallerName();
    // Fallback to ZegoService if already set (background case)
    return fromNative || ZegoService.callerName || '';
  });
  console.log('📞 CallConnectingScreen rendered with callerName:', callerName);
  const initials = getInitials(callerName);
  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View style={styles.card}>
        {/* Avatar with rings */}
        <View style={styles.avatarWrap}>
          {/* Outermost ring first (so it renders behind) */}
          <RippleRing delay={800} size={300} opacityLevel={0.08} />
          <RippleRing delay={600} size={250} opacityLevel={0.15} />
          <RippleRing delay={400} size={200} opacityLevel={0.25} />
          <RippleRing delay={200} size={150} opacityLevel={0.4} />

          {/* No AvatarGlow wrapper needed, it causes shadow artifacts too */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* "Connecting..." label */}
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>Connecting</Text>
          <BlinkDot delay={0} />
          <BlinkDot delay={220} />
          <BlinkDot delay={440} />
        </View>

        {/* Jumping dots */}
        <View style={styles.jumpDotsRow}>
          <JumpDot delay={0} />
          <JumpDot delay={170} />
          <JumpDot delay={340} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    zIndex: 1,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  avatarWrap: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  rippleRing: {
    position: 'absolute',
    borderWidth: 1.5, // Crisp border
    // NO shadows or elevation here! This is what caused the polygons.
  },

  avatarGlowWrap: {
    borderRadius: 53,
    shadowColor: '#0779FF',
    shadowOffset: {width: 0, height: 0},
    elevation: 20,
    zIndex: 2,
  },
  avatar: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: '#9e9ea8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure avatar is on top
    // Add a static shadow ONLY to the avatar, not the animated rings
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 44,
  },
  statusText: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)', // ✅ High contrast — clearly visible
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  dot: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.85)', // ✅ Matches statusText
    lineHeight: 22,
    fontWeight: '500',
  },
  jumpDotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  jumpDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

export default CallConnectingScreen;
