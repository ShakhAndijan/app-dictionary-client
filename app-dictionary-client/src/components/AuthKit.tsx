import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/**
 * Shared building blocks of the login and register screens. The auth screens are always dark, whatever
 * the app theme is, so these colours are fixed on purpose and never read from the theme palette.
 */
export const AU = {
  bg: '#070912',
  text: '#E8EBFF',
  muted: 'rgba(226,232,255,0.58)',
  faint: 'rgba(199,210,254,0.45)',
  cyan: '#67E8F9',
  indigo: '#6366F1',
  line: 'rgba(255,255,255,0.1)',
  field: 'rgba(255,255,255,0.05)',
};

const loop = (v: Animated.Value, to: number, duration: number) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(v, { toValue: to, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])
  );

/* ------------------------------------------------------------ background */

/** A soft radial glow, faked with concentric translucent discs (no radial gradient in the toolkit). */
function Glow({ rgb, size, style }: { rgb: string; size: number; style: object }) {
  const rings = 9;
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      {Array.from({ length: rings }, (_, i) => {
        const d = size * (1 - (i / rings) * 0.92);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: d,
              height: d,
              borderRadius: d / 2,
              left: (size - d) / 2,
              top: (size - d) / 2,
              backgroundColor: `rgba(${rgb},0.045)`,
            }}
          />
        );
      })}
    </View>
  );
}

function Drift({ children, dx, dy, ms }: { children: ReactNode; dx: number; dy: number; ms: number }) {
  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = loop(x, dx, ms);
    const b = loop(y, dy, ms * 1.3);
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [x, y, dx, dy, ms]);
  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={{ flex: 1, transform: [{ translateX: x }, { translateY: y }] }}>{children}</Animated.View>
    </Animated.View>
  );
}

function Star({ x, y, r, ms, delay }: { x: number; y: number; r: number; ms: number; delay: number }) {
  const o = useRef(new Animated.Value(0.15)).current;
  const dy = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(o, { toValue: 0.95, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(o, { toValue: 0.15, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
      loop(dy, 18, ms * 2).start();
    }, delay);
    return () => clearTimeout(t);
  }, [o, dy, ms, delay]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        backgroundColor: '#C7D2FE',
        opacity: o,
        transform: [{ translateY: dy }],
      }}
    />
  );
}

export function AuthBackground() {
  const { width, height } = useWindowDimensions();
  const stars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        key: i,
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 1.4,
        ms: 1800 + Math.random() * 2600,
        delay: Math.random() * 1500,
      })),
    [width, height]
  );
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: AU.bg, overflow: 'hidden' }]}>
      <Drift dx={40} dy={30} ms={9000}>
        <Glow rgb="99,102,241" size={width * 1.5} style={{ left: -width * 0.55, top: -width * 0.45 }} />
      </Drift>
      <Drift dx={-36} dy={44} ms={11000}>
        <Glow rgb="34,211,238" size={width * 1.1} style={{ right: -width * 0.55, top: height * 0.12 }} />
      </Drift>
      <Drift dx={30} dy={-40} ms={13000}>
        <Glow rgb="168,85,247" size={width * 1.4} style={{ left: -width * 0.3, bottom: -width * 0.7 }} />
      </Drift>
      {stars.map(({ key, ...s }) => (
        <Star key={key} {...s} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------ headline */

/** Fades and lifts in; `index` staggers siblings. */
export function Reveal({ index = 0, children, style }: { index?: number; children: ReactNode; style?: object }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 800,
      delay: 120 + index * 110,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v, index]);
  return (
    <Animated.View
      style={[
        style,
        { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function BrandPill() {
  const ping = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.timing(ping, { toValue: 1, duration: 2200, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    a.start();
    return () => a.stop();
  }, [ping]);
  return (
    <View style={s.pill}>
      <View style={s.dotWrap}>
        <Animated.View
          style={[
            s.ping,
            { opacity: ping.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }), transform: [{ scale: ping.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) }] },
          ]}
        />
        <View style={s.dot} />
      </View>
      <Text style={s.pillText}>Lug'at</Text>
    </View>
  );
}

/* ------------------------------------------------------------ word stage */

const GLYPHS = "abcdefghijklmnopqrstuvwxyz'";
const PAIRS: [string, string][] = [
  ['journey', 'sayohat'],
  ['brave', 'jasur'],
  ['library', 'kutubxona'],
  ['knowledge', 'bilim'],
  ['horizon', 'ufq'],
  ['friend', "do'st"],
  ['curious', 'qiziquvchan'],
  ['dream', 'orzu'],
];
const PAIR_MS = 3600;

/** Text that decodes letter by letter from random glyphs whenever the target changes. */
function useScramble(text: string): string {
  const [shown, setShown] = useState(text);
  const prev = useRef(text);
  useEffect(() => {
    const len = Math.max(prev.current.length, text.length);
    const start = Date.now();
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / 850);
      let out = '';
      for (let i = 0; i < len; i++) {
        const settleAt = (i / len) * 0.7 + 0.2;
        const ch = text[i] ?? '';
        out += t >= settleAt || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (t >= 1) {
        clearInterval(id);
        setShown(text);
        prev.current = text;
      }
    }, 45);
    return () => clearInterval(id);
  }, [text]);
  return shown;
}

export function WordStage() {
  const [i, setI] = useState(0);
  const fill = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % PAIRS.length), PAIR_MS);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    fill.setValue(0);
    Animated.timing(fill, { toValue: 1, duration: PAIR_MS, easing: Easing.linear, useNativeDriver: true }).start();
  }, [i, fill]);
  const en = useScramble(PAIRS[i][0]);
  const uz = useScramble(PAIRS[i][1]);
  return (
    <View style={s.stage}>
      <View style={s.stageRow}>
        <Text style={s.stageTag}>EN</Text>
        <Text style={s.stageEn} numberOfLines={1}>{en}</Text>
      </View>
      <View style={s.stageLine}>
        <Animated.View
          style={[
            s.stageFill,
            { transform: [{ translateX: fill.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] }) }] },
          ]}
        />
      </View>
      <View style={s.stageRow}>
        <Text style={s.stageTag}>UZ</Text>
        <Text style={s.stageUz} numberOfLines={1}>{uz}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------ form pieces */

export function GlassCard({ children }: { children: ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 900, delay: 250, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [v]);
  return (
    <Animated.View
      style={[
        s.card,
        { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }, { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] },
      ]}
    >
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)', 'rgba(103,232,249,0.22)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.cardBorder}
      />
      <View style={s.cardInner}>{children}</View>
    </Animated.View>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function AuthInput({ label, icon, secureTextEntry, value, onFocus, onBlur, style, ...rest }: FieldProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const [focused, setFocused] = useState(false);
  const float = useRef(new Animated.Value(value ? 1 : 0)).current;
  const line = useRef(new Animated.Value(0)).current;
  const up = focused || !!value;

  useEffect(() => {
    Animated.timing(float, { toValue: up ? 1 : 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [up, float]);
  useEffect(() => {
    Animated.timing(line, { toValue: focused ? 1 : 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [focused, line]);

  return (
    <View style={[s.field, focused && s.fieldFocus]}>
      <Ionicons name={icon} size={18} color={focused ? AU.cyan : AU.faint} style={s.fieldIcon} />
      <Animated.Text
        pointerEvents="none"
        style={[
          s.fieldLabel,
          focused && { color: AU.cyan, fontWeight: '700' },
          {
            transform: [
              { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -11] }) },
              { scale: float.interpolate({ inputRange: [0, 1], outputRange: [1, 0.76] }) },
            ],
          },
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        {...rest}
        value={value}
        secureTextEntry={secureTextEntry ? hidden : false}
        selectionColor={AU.cyan}
        keyboardAppearance="dark"
        placeholderTextColor="transparent"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[s.fieldInput, style]}
      />
      {secureTextEntry && (
        <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)} style={s.eye}>
          <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={AU.faint} />
        </Pressable>
      )}
      <Animated.View style={[s.fieldBar, { transform: [{ scaleX: line }] }]}>
        <LinearGradient colors={[AU.indigo, AU.cyan]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

export function AuthButton({ title, onPress, loading }: { title: string; onPress: () => void; loading?: boolean }) {
  const press = useRef(new Animated.Value(1)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(1400),
        Animated.timing(sweep, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(sweep, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    a.start();
    return () => a.stop();
  }, [sweep]);
  const spring = (to: number) => Animated.spring(press, { toValue: to, speed: 40, bounciness: 6, useNativeDriver: true }).start();

  return (
    <Animated.View style={[s.btnShadow, { transform: [{ scale: press }] }]}>
      <Pressable onPress={onPress} disabled={loading} onPressIn={() => spring(0.97)} onPressOut={() => spring(1)} style={s.btn}>
        <LinearGradient colors={['#4F46E5', '#6366F1', '#22B8D4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        <Animated.View
          pointerEvents="none"
          style={[s.shine, { transform: [{ translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-120, 420] }) }, { skewX: '-20deg' }] }]}
        />
        {loading ? (
          <Spinner />
        ) : (
          <View style={s.btnRow}>
            <Text style={s.btnText}>{title}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function Spinner() {
  const r = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.timing(r, { toValue: 1, duration: 750, easing: Easing.linear, useNativeDriver: true }));
    a.start();
    return () => a.stop();
  }, [r]);
  return (
    <Animated.View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2.5,
        borderColor: 'rgba(255,255,255,0.35)',
        borderTopColor: '#fff',
        transform: [{ rotate: r.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
      }}
    />
  );
}

const s = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dotWrap: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: AU.cyan },
  ping: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: AU.cyan },
  pillText: { color: AU.text, fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },

  stage: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  stageRow: { flexDirection: 'row', alignItems: 'baseline', gap: 14, minHeight: 36 },
  stageTag: { width: 24, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: 'rgba(165,180,252,0.7)' },
  stageEn: { flex: 1, fontSize: 26, fontWeight: '700', color: '#fff', letterSpacing: -0.4 },
  stageUz: { flex: 1, fontSize: 26, fontWeight: '700', color: AU.cyan, letterSpacing: -0.4 },
  stageLine: { height: 2, marginVertical: 6, marginLeft: 38, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  stageFill: { width: 300, height: 2, backgroundColor: AU.cyan },

  card: { borderRadius: 26, padding: 1, shadowColor: '#6366F1', shadowOpacity: 0.3, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 12 },
  cardBorder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 26 },
  cardInner: { borderRadius: 25, padding: 22, backgroundColor: 'rgba(12,15,32,0.94)' },

  field: {
    height: 58,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AU.line,
    backgroundColor: AU.field,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fieldFocus: { borderColor: 'rgba(103,232,249,0.55)', backgroundColor: 'rgba(255,255,255,0.08)' },
  fieldIcon: { position: 'absolute', left: 16 },
  fieldLabel: { position: 'absolute', left: 46, color: AU.muted, fontSize: 16, transformOrigin: 'left center' },
  fieldInput: { color: '#fff', fontSize: 16, paddingLeft: 46, paddingRight: 46, paddingTop: 20, paddingBottom: 4, height: 58 },
  eye: { position: 'absolute', right: 14 },
  fieldBar: { position: 'absolute', left: 14, right: 14, bottom: 0, height: 2, borderRadius: 1, overflow: 'hidden' },

  btnShadow: { marginTop: 6, borderRadius: 16, shadowColor: '#6366F1', shadowOpacity: 0.5, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  btn: { height: 56, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  shine: { position: 'absolute', top: 0, bottom: 0, width: 60, backgroundColor: 'rgba(255,255,255,0.28)' },
});
