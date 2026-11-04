import React, { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Announcement, getAnnouncements } from '../api/announcementsApi';
import { themed } from '../theme/colors';

const TONE = {
  INFO: { bg: '#4f46e5', icon: 'information-circle' },
  WARNING: { bg: '#d97706', icon: 'warning' },
  CRITICAL: { bg: '#dc2626', icon: 'alert-circle' },
} as const;

/** Notices from the admins. Loaded on start and whenever the app comes back to the foreground; dismissed ones stay hidden until the app restarts. */
export default function AnnouncementBanner() {
  const { top } = useSafeAreaInsets();
  const [items, setItems] = useState<Announcement[]>([]);
  const [hidden, setHidden] = useState<number[]>([]);

  useEffect(() => {
    const load = () => getAnnouncements().then(setItems).catch(() => undefined);
    load();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') load();
    });
    return () => sub.remove();
  }, []);

  const shown = items.filter((a) => !hidden.includes(a.id));
  if (shown.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: top + 40 }]}>
      {shown.map((a) => {
        const tone = TONE[a.severity] ?? TONE.INFO;
        return (
          <View key={a.id} style={[styles.card, { backgroundColor: tone.bg }]}>
            <Ionicons name={tone.icon} size={18} color="#fff" />
            <Text style={styles.text}>{a.message}</Text>
            <Pressable hitSlop={10} onPress={() => setHidden((h) => [...h, a.id])}>
              <Ionicons name="close" size={18} color="#fff" />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, gap: 8, zIndex: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  text: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '600' },
}));
