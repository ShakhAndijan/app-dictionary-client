import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { useAuth } from '../../context/AuthContext';
import { colors, themed } from '../../theme/colors';
import { DEFAULT_MODULES, DIRECTIONS } from '../../config/directions';

/** Pick the directions to study: each opens to its modules, and a chosen module appears in the tab bar. */
export default function DirectionsScreen() {
  const { user, updateProfile } = useAuth();
  const [open, setOpen] = useState('english');
  const [saving, setSaving] = useState(false);
  const chosen = user?.modules ?? DEFAULT_MODULES;

  const toggle = async (key: string) => {
    if (saving) return;
    const next = chosen.includes(key) ? chosen.filter((k) => k !== key) : [...chosen, key];
    setSaving(true);
    try {
      await updateProfile({ modules: next });
    } catch {
      Alert.alert('Xatolik', "Saqlab bo'lmadi. Internetni tekshiring.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.lead}>
        Nimani o'rganmoqchisiz? Yo'nalishni oching va o'zingizga kerak bo'limlarni qo'shing. Ular pastdagi menyuda paydo bo'ladi.
      </Text>

      {DIRECTIONS.map((d) => {
        const count = d.modules.filter((m) => chosen.includes(m.key)).length;
        const isOpen = open === d.key;
        return (
          <View key={d.key} style={[styles.card, isOpen && { borderColor: d.color }]}>
            <Pressable style={styles.head} onPress={() => setOpen(isOpen ? '' : d.key)}>
              <View style={[styles.ico, { backgroundColor: `${d.color}22` }]}>
                <Ionicons name={d.icon} size={26} color={d.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{d.title}</Text>
                <Text style={styles.sub}>{count > 0 ? `${count} ta tanlandi` : d.sub}</Text>
              </View>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
            </Pressable>

            {isOpen && (
              <View style={styles.body}>
                {d.modules.map((m) => {
                  const on = chosen.includes(m.key);
                  return (
                    <Pressable key={m.key} style={[styles.mod, m.locked && { opacity: 0.55 }, on && { borderColor: d.color, backgroundColor: `${d.color}14` }]} onPress={() => toggle(m.key)} disabled={saving || m.locked}>
                      <Ionicons name={m.icon} size={22} color={on ? d.color : colors.textMuted} />
                      <View style={{ flex: 1 }}>
                        <View style={styles.modTitleRow}>
                          <Text style={styles.modTitle}>{m.title}</Text>
                          {!m.ready && (
                            <View style={styles.soon}>
                              <Text style={styles.soonText}>Tez orada</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.modSub}>{m.sub}</Text>
                      </View>
                      <Switch value={on && !m.locked} onValueChange={() => toggle(m.key)} disabled={saving || m.locked} trackColor={{ true: d.color, false: colors.border }} thumbColor="#fff" />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    lead: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginBottom: 16 },
    card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, marginBottom: 14, overflow: 'hidden' },
    head: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
    ico: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    title: { color: colors.text, fontSize: 18, fontWeight: '800' },
    sub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
    body: { gap: 10, paddingHorizontal: 12, paddingBottom: 14 },
    mod: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border },
    modTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    modTitle: { color: colors.text, fontSize: 15.5, fontWeight: '700' },
    modSub: { color: colors.textMuted, fontSize: 12.5, lineHeight: 18, marginTop: 2 },
    soon: { backgroundColor: colors.amberBg, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
    soonText: { color: colors.amberText, fontSize: 10.5, fontWeight: '800', textTransform: 'uppercase' },
  }),
);
