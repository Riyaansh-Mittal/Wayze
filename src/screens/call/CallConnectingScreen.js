import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import {ZegoService} from '../../services/zego/ZegoService';
import {getCallerName, getPlateNumber} from '../../native/CallFlagModule';
import CallInviteHelper from '@zegocloud/zego-uikit-prebuilt-call-rn/lib/commonjs/call_invitation/services/call_invite_helper';

// ── Outward ripple ring (ease-out: fast start → slow fade = signal radiating)
const Ring = ({delay, size, opacity: opacityLevel}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease), // ease-out ONLY per spec
          useNativeDriver: true,
        }),
        Animated.timing(anim, {toValue: 0, duration: 0, useNativeDriver: true}),
        Animated.delay(600),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.22], // spec: scale 1→1.22
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [opacityLevel, opacityLevel, 0], // fade→0 per spec
  });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: '#FFFFFF',
          transform: [{scale}],
          opacity,
        },
      ]}
    />
  );
};

// ── Status dot with phase-aware color and pulse speed
const StatusDot = ({phase}) => {
  const anim = useRef(new Animated.Value(0.4)).current;
  const durationRef = useRef(900);

  const color = phase === 1 ? '#4CAF50' : phase === 2 ? '#F57C00' : '#F57C00';
  durationRef.current = phase === 1 ? 900 : phase === 2 ? 750 : 450;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: durationRef.current,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: durationRef.current,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase]); // restart when phase changes → new speed

  return (
    <Animated.View
      style={[styles.statusDot, {backgroundColor: color, opacity: anim}]}
    />
  );
};

// ── Progress bar: 0→40% fast, 40→72% slow, holds, NEVER 100%
const ProgressBar = ({visible, reset}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      Animated.timing(barOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      return;
    }
    Animated.timing(barOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  useEffect(() => {
    progress.setValue(0);
    if (!visible) return;
    // 0→40% in 1500ms fast, 40→72% in 3500ms slow, hold at 72%
    Animated.sequence([
      Animated.timing(progress, {
        toValue: 0.4,
        duration: 1500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(progress, {
        toValue: 0.72,
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      // holds at 72% — no further animation
    ]).start();
  }, [visible, reset]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.progressTrack, {opacity: barOpacity}]}>
      <Animated.View style={[styles.progressFill, {width: fillWidth}]} />
    </Animated.View>
  );
};

// ── Helper: initials from full name
const getInitials = name => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// ── Main Screen
const CallConnectingScreen = () => {
  const [callerName] = useState(() => {
    return getCallerName() || ZegoService.callerName || '';
  });
  const [plateNumber, setPlateNumber] = useState();
  useEffect(() => {
    const offlineData = CallInviteHelper.getInstance().getOfflineData();
    if (offlineData?.custom_data) {
      try {
        const parsed = JSON.parse(offlineData.custom_data);
        if (parsed.plateNumber) {
          setPlateNumber(parsed.plateNumber);
        }
      } catch (e) {}
    }
  }, []);
  const getInitials = (name = '') => {
    return name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(n => n[0].toUpperCase())
      .join('');
  };

  const initials = getInitials(callerName);

  // Phase state: 1 = 0–2s, 2 = 2–7s, 3 = 7s+
  const [phase, setPhase] = useState(1);
  const [progressReset, setProgressReset] = useState(0);
  const subTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 2000);
    const t2 = setTimeout(() => {
      setPhase(3);
      setProgressReset(r => r + 1); // restart progress bar
      // Fade in subtext
      Animated.timing(subTextOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 7000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Disable OS back button — only gesture exit
  useEffect(() => {
    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true, // block back
    );
    return () => handler.remove();
  }, []);

  const statusText =
    phase === 1
      ? 'Connecting you...'
      : phase === 2
      ? 'Almost there...'
      : 'Taking a moment...';

  const statusTextColor = phase === 3 ? '#FFB74D' : '#AAAAAA';

  return (
    <View style={styles.container}>
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <Text style={styles.topLeft}>🚗 {plateNumber || '—'}</Text>
        <Text style={styles.topRight}>🔒 Secured</Text>
      </View>

      {/* ── CENTER ── */}
      <View style={styles.center}>
        {/* Rings + Avatar */}
        <View style={styles.avatarWrap}>
          {/* Back→front: Ring_3, Ring_2, Ring_1, Avatar */}
          <Ring delay={600} size={220} opacity={0.03} />
          <Ring delay={300} size={170} opacity={0.06} />
          <Ring delay={0} size={124} opacity={0.09} />

          {/* Avatar — no border, no shadow, no animation per spec */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Caller Name */}
        <Text style={styles.callerName}>{callerName || 'Unknown'}</Text>

        {/* Status Row */}
        <View style={styles.statusRow}>
          <StatusDot phase={phase} />
          <Text style={[styles.statusText, {color: statusTextColor}]}>
            {statusText}
          </Text>
        </View>

        {/* Progress Bar — GONE in phase 1 */}
        <ProgressBar visible={phase >= 2} reset={progressReset} />

        {/* Sub Text — only visible in phase 3 */}
        <Animated.Text style={[styles.subText, {opacity: subTextOpacity}]}>
          Poor network may cause delay
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A', // flat — matches Zego screen BG exactly
  },

  // ── TOP BAR
  topBar: {
    position: 'absolute',
    top: 48,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topLeft: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.70)',
  },
  topRight: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.45)',
  },

  // ── CENTER
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── RINGS
  avatarWrap: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },

  // ── AVATAR — no shadow, no border, no animation (matches Zego exactly)
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },

  // ── NAME
  callerName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },

  // ── STATUS ROW
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '400',
  },

  // ── PROGRESS BAR
  progressTrack: {
    width: 180,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 1,
  },

  // ── SUB TEXT
  subText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.38)',
    textAlign: 'center',
  },
});

export default CallConnectingScreen;
