import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, themed } from '../theme/colors';
import { useOnline } from '../services/connectivity';
import { syncNow, usePendingCount } from '../services/offlineSync';

/** A small pill over the top of the screen: shown while offline or while answers are still waiting to upload. */
export default function OfflineBanner() {
  const online = useOnline();
  const pending = usePendingCount();
  const { top } = useSafeAreaInsets();

  if (online && pending === 0) return null;

  const label = online
    ? `Sinxronlanmoqda · ${pending} ta javob`
    : pending > 0
    ? `Offlayn · ${pending} ta javob kutmoqda`
    : 'Offlayn rejim';

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: top + 6 }]}>
      <Pressable onPress={() => syncNow()} style={[styles.pill, online && styles.pillSync]}>
        <Ionicons name={online ? 'sync' : 'cloud-offline-outline'} size={14} color="#fff" />
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 50 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#374151',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pillSync: { backgroundColor: colors.primary },
  text: { color: '#fff', fontSize: 12, fontWeight: '700' },
}));
