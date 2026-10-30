import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../theme/colors';

export type AlertVariant = 'error' | 'warning' | 'network' | 'success' | 'info';

export interface AlertContent {
  variant: AlertVariant;
  title: string;
  message: string;
  /** Primary button label. Defaults to "Tushunarli". */
  confirmText?: string;
  /** When set, the primary button runs this (e.g. "Qayta urinish") before closing. */
  onConfirm?: () => void;
  /** Adds a quiet second button that only closes the modal. */
  cancelText?: string;
}

const VARIANTS = themed((): Record<AlertVariant, { icon: keyof typeof Ionicons.glyphMap; color: string }> => ({
  error: { icon: 'close-circle', color: colors.danger },
  warning: { icon: 'alert-circle', color: '#F59E0B' },
  network: { icon: 'cloud-offline', color: '#F59E0B' },
  success: { icon: 'checkmark-circle', color: colors.secondary },
  info: { icon: 'information-circle', color: colors.primary },
}));

interface Props {
  alert: AlertContent | null;
  onClose: () => void;
}

export default function AlertModal({ alert, onClose }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  // Keep the last content while the closing animation plays.
  const last = useRef<AlertContent | null>(null);
  if (alert) last.current = alert;
  const content = alert ?? last.current;

  useEffect(() => {
    Animated.timing(anim, { toValue: alert ? 1 : 0, duration: alert ? 180 : 120, useNativeDriver: true }).start();
  }, [alert, anim]);

  if (!content) return null;
  const { icon, color } = VARIANTS[content.variant];

  const confirm = () => {
    onClose();
    content.onConfirm?.();
  };

  return (
    <Modal visible={!!alert} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: anim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Yopish" />
        <Animated.View
          style={[
            styles.card,
            {
              opacity: anim,
              transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
            },
          ]}
          accessibilityRole="alert"
        >
          <View style={[styles.iconRing, { backgroundColor: `${color}1A` }]}>
            <View style={[styles.iconCore, { backgroundColor: `${color}26` }]}>
              <Ionicons name={icon} size={34} color={color} />
            </View>
          </View>

          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>

          <View style={styles.actions}>
            {content.cancelText ? (
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.btn, styles.btnQuiet, pressed && styles.pressed]}
              >
                <Text style={styles.btnQuietText}>{content.cancelText}</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={confirm}
              style={({ pressed }) => [styles.btn, { backgroundColor: color }, pressed && styles.pressed]}
            >
              <Text style={styles.btnText}>{content.confirmText ?? 'Tushunarli'}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = themed(() => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  iconRing: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconCore: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 19, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 14.5, lineHeight: 21, color: colors.textMuted, textAlign: 'center', marginBottom: 22 },
  actions: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  btn: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 15.5, fontWeight: '600' },
  btnQuiet: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  btnQuietText: { color: colors.text, fontSize: 15.5, fontWeight: '600' },
  pressed: { opacity: 0.85 },
}));
