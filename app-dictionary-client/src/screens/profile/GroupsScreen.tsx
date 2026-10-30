import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, themed } from '../../theme/colors';
import * as groupsApi from '../../api/groupsApi';
import { GroupSummary } from '../../api/groupsApi';
import { extractErrorMessage } from '../../utils/errors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Groups'>;

const EMOJIS = ['🏆', '🚀', '🔥', '📚', '🎯', '⭐', '🦁', '🌟'];

type Sheet = 'create' | 'join' | null;

export default function GroupsScreen({ navigation }: Props) {
  const [groups, setGroups] = useState<GroupSummary[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoadError(false);
    groupsApi
      .listGroups()
      .then(setGroups)
      .catch(() => setLoadError(true));
  }, []);

  useFocusEffect(load);

  const open = (s: Sheet) => {
    setName('');
    setCode('');
    setFormError('');
    setSheet(s);
  };

  const submit = async () => {
    setBusy(true);
    setFormError('');
    try {
      const group =
        sheet === 'create'
          ? await groupsApi.createGroup(name.trim(), emoji)
          : await groupsApi.joinGroup(code.trim());
      setSheet(null);
      load();
      navigation.navigate('GroupDetail', { id: group.id, name: group.name });
    } catch (e: any) {
      setFormError(extractErrorMessage(e, "Amalni bajarib bo'lmadi. Internetni tekshiring."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.actions}>
        <Button title="Guruh ochish" onPress={() => open('create')} style={styles.actionBtn} />
        <Button title="Kod bilan qo'shilish" variant="outline" onPress={() => open('join')} style={styles.actionBtn} />
      </View>

      {groups == null ? (
        loadError ? (
          <Text style={styles.muted}>Guruhlarni yuklab bo'lmadi</Text>
        ) : (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )
      ) : groups.length === 0 ? (
        <Card style={styles.empty}>
          <Text style={styles.emptyEmoji}>👥</Text>
          <Text style={styles.emptyTitle}>Hali guruhingiz yo'q</Text>
          <Text style={styles.emptyText}>
            Guruh oching va kodni do'stlaringizga yuboring. Hammangizning haftalik XP reytingingiz shu yerda ko'rinadi.
          </Text>
        </Card>
      ) : (
        groups.map((g) => (
          <Pressable key={g.id} onPress={() => navigation.navigate('GroupDetail', { id: g.id, name: g.name })}>
            <Card style={styles.groupCard}>
              <Text style={styles.groupEmoji}>{g.emoji}</Text>
              <View style={styles.groupBody}>
                <Text style={styles.groupName}>{g.name}</Text>
                <Text style={styles.groupMeta}>
                  {g.memberCount} a'zo{g.ownedByMe ? " · siz egasisiz" : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Card>
          </Pressable>
        ))
      )}

      <Modal visible={sheet != null} transparent animationType="slide" onRequestClose={() => setSheet(null)}>
        <Pressable style={styles.backdrop} onPress={() => setSheet(null)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>{sheet === 'create' ? 'Yangi guruh' : "Guruhga qo'shilish"}</Text>
            {sheet === 'create' ? (
              <>
                <Input
                  label="Guruh nomi"
                  value={name}
                  onChangeText={setName}
                  placeholder="Masalan: Sinfdoshlar"
                  maxLength={40}
                />
                <View style={styles.emojiRow}>
                  {EMOJIS.map((e) => (
                    <Pressable
                      key={e}
                      onPress={() => setEmoji(e)}
                      style={[styles.emojiBtn, e === emoji && styles.emojiBtnOn]}
                    >
                      <Text style={styles.emojiText}>{e}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : (
              <Input
                label="Taklif kodi"
                value={code}
                onChangeText={(t) => setCode(t.toUpperCase())}
                placeholder="K7P2QX"
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={8}
              />
            )}
            {!!formError && <Text style={styles.formError}>{formError}</Text>}
            <Button
              title={sheet === 'create' ? 'Ochish' : "Qo'shilish"}
              onPress={submit}
              loading={busy}
              disabled={sheet === 'create' ? !name.trim() : code.trim().length < 4}
              style={styles.sheetBtn}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  actions: { gap: 10, marginBottom: 16 },
  actionBtn: { marginTop: 0 },
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 30 },
  loader: { marginTop: 30 },
  empty: { alignItems: 'center', paddingVertical: 28 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 8 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  groupCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  groupEmoji: { fontSize: 30 },
  groupBody: { flex: 1 },
  groupName: { fontSize: 16, fontWeight: '700', color: colors.text },
  groupMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(17,24,39,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 14 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBtnOn: { borderColor: colors.primary, backgroundColor: `${colors.primary}14` },
  emojiText: { fontSize: 22 },
  formError: { color: colors.danger, fontSize: 13, marginTop: 10 },
  sheetBtn: { marginTop: 16 },
}));
