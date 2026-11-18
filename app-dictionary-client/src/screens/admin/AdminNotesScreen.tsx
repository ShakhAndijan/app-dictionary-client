import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, Linking, Modal, Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { API_BASE_URL } from '../../config/env';
import { colors, themed } from '../../theme/colors';
import * as adminApi from '../../api/adminApi';

const PAGE = 40;

const size = (n: number | null) => {
  if (!n) return '';
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const dayKey = (iso: string) => new Date(iso).toDateString();
const dayLabel = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const yest = new Date(now.getTime() - 86400000);
  if (d.toDateString() === now.toDateString()) return 'Bugun';
  if (d.toDateString() === yest.toDateString()) return 'Kecha';
  return d.toLocaleDateString();
};
const fileUri = (n: adminApi.AdminNote) => (n.fileUrl ? `${API_BASE_URL}${n.fileUrl}` : null);

export default function AdminNotesScreen() {
  const [items, setItems] = useState<adminApi.AdminNote[]>([]); // newest first (the list is inverted)
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [more, setMore] = useState(false);
  const loadingMore = useRef(false);

  const [text, setText] = useState('');
  const [picked, setPicked] = useState<adminApi.PickedFile | null>(null);
  const [editing, setEditing] = useState<adminApi.AdminNote | null>(null);
  const [sending, setSending] = useState(false);
  const [percent, setPercent] = useState(0);
  const [viewer, setViewer] = useState<string | null>(null);

  useEffect(() => {
    adminApi.notes(undefined, PAGE)
      .then((r) => { setItems(r); setMore(r.length === PAGE); })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const loadOlder = useCallback(() => {
    if (!more || loadingMore.current || items.length === 0) return;
    loadingMore.current = true;
    adminApi.notes(items[items.length - 1].id, PAGE)
      .then((r) => { setItems((cur) => [...cur, ...r]); setMore(r.length === PAGE); })
      .catch(() => undefined)
      .finally(() => { loadingMore.current = false; });
  }, [more, items]);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], quality: 0.9 });
    if (res.canceled || !res.assets[0]) return;
    const a = res.assets[0];
    const ext = a.mimeType?.split('/')[1] ?? (a.type === 'video' ? 'mp4' : 'jpg');
    setPicked({ uri: a.uri, name: a.fileName ?? `${a.type ?? 'file'}-${Date.now()}.${ext}`, mimeType: a.mimeType });
  };

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (res.canceled || !res.assets[0]) return;
    const a = res.assets[0];
    setPicked({ uri: a.uri, name: a.name, mimeType: a.mimeType });
  };

  const attach = () =>
    Alert.alert('Biriktirish', undefined, [
      { text: 'Rasm yoki video', onPress: pickMedia },
      { text: 'Fayl', onPress: pickFile },
      { text: 'Bekor qilish', style: 'cancel' },
    ]);

  const send = async () => {
    const t = text.trim();
    if (sending || (!t && !picked && !editing)) return;
    setSending(true);
    setPercent(0);
    try {
      if (editing) {
        const upd = await adminApi.editNote(editing.id, t);
        setItems((cur) => cur.map((n) => (n.id === upd.id ? upd : n)));
        setEditing(null);
      } else {
        const created = await adminApi.addNote(t, picked, setPercent);
        setItems((cur) => [created, ...cur]);
        setPicked(null);
      }
      setText('');
    } catch {
      Alert.alert('Xatolik', "Yuborib bo'lmadi. Internetni va fayl hajmini (300 MB gacha) tekshiring.");
    } finally {
      setSending(false);
    }
  };

  const remove = (n: adminApi.AdminNote) =>
    Alert.alert("O'chirish", "Bu xabar butunlay o'chiriladi.", [
      { text: 'Bekor qilish', style: 'cancel' },
      {
        text: "O'chirish",
        style: 'destructive',
        onPress: () => adminApi.deleteNote(n.id).then(() => setItems((cur) => cur.filter((x) => x.id !== n.id))).catch(() => Alert.alert('Xatolik', "O'chirib bo'lmadi.")),
      },
    ]);

  const actions = (n: adminApi.AdminNote) =>
    Alert.alert('Xabar', undefined, [
      { text: 'Tahrirlash', onPress: () => { setEditing(n); setText(n.text ?? ''); setPicked(null); } },
      { text: "O'chirish", style: 'destructive', onPress: () => remove(n) },
      { text: 'Bekor qilish', style: 'cancel' },
    ]);

  const cancelEdit = () => { setEditing(null); setText(''); };

  const render = ({ item, index }: { item: adminApi.AdminNote; index: number }) => {
    const older = items[index + 1];
    const showDay = !older || dayKey(older.createdAt) !== dayKey(item.createdAt);
    const uri = fileUri(item);
    return (
      <View>
        {showDay && <Text style={styles.day}>{dayLabel(item.createdAt)}</Text>}
        <Pressable style={styles.bubble} onLongPress={() => actions(item)} delayLongPress={300}>
          {item.kind === 'IMAGE' && uri && (
            <Pressable onPress={() => setViewer(uri)}>
              <Image source={{ uri }} style={styles.image} resizeMode="cover" />
            </Pressable>
          )}
          {(item.kind === 'VIDEO' || item.kind === 'FILE') && uri && (
            <Pressable style={styles.file} onPress={() => Linking.openURL(uri)}>
              <View style={styles.fileIcon}>
                <Ionicons name={item.kind === 'VIDEO' ? 'play' : 'document-text'} size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>{item.fileName}</Text>
                <Text style={styles.meta}>{item.kind === 'VIDEO' ? 'Video · ochish uchun bosing' : 'Fayl · ochish uchun bosing'}{item.fileSize ? ` · ${size(item.fileSize)}` : ''}</Text>
              </View>
            </Pressable>
          )}
          {!!item.text && <Text style={styles.text} selectable>{item.text}</Text>}
          <Text style={styles.time}>{item.editedAt ? 'tahrirlangan · ' : ''}{hhmm(item.createdAt)}</Text>
        </Pressable>
      </View>
    );
  };

  const canSend = !!text.trim() || (!!picked && !editing);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding" keyboardVerticalOffset={90}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : failed ? (
          <Text style={styles.empty}>Yuklab bo'lmadi. Internetni tekshiring.</Text>
        ) : items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.pin}>📌</Text>
            <Text style={styles.emptyTitle}>Hali hech narsa yo'q</Text>
            <Text style={styles.empty}>Eslatma yozing, rasm yoki video tashlang. Hammasi shu yerda, faqat sizda saqlanadi.</Text>
          </View>
        ) : (
          <FlatList
            style={styles.flex}
            contentContainerStyle={styles.list}
            data={items}
            inverted
            keyExtractor={(n) => String(n.id)}
            renderItem={render}
            onEndReached={loadOlder}
            onEndReachedThreshold={0.4}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {editing && (
          <View style={styles.banner}>
            <Ionicons name="create-outline" size={16} color={colors.primary} />
            <Text style={styles.bannerText} numberOfLines={1}>Tahrirlanmoqda: {editing.text ?? editing.fileName}</Text>
            <Pressable onPress={cancelEdit} hitSlop={10}><Ionicons name="close" size={18} color={colors.textMuted} /></Pressable>
          </View>
        )}
        {picked && !editing && (
          <View style={styles.banner}>
            <Ionicons name="attach" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerText} numberOfLines={1}>{picked.name}</Text>
              {sending && (
                <View style={styles.track}><View style={[styles.fill, { width: `${percent}%` }]} /></View>
              )}
            </View>
            {!sending && <Pressable onPress={() => setPicked(null)} hitSlop={10}><Ionicons name="close" size={18} color={colors.textMuted} /></Pressable>}
          </View>
        )}

        <View style={styles.composer}>
          {!editing && (
            <Pressable style={styles.iconBtn} onPress={attach} disabled={sending} hitSlop={6}>
              <Ionicons name="attach" size={24} color={colors.textMuted} />
            </Pressable>
          )}
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Xabar yozing..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={5000}
          />
          <Pressable style={[styles.send, (!canSend || sending) && { opacity: 0.45 }]} onPress={send} disabled={!canSend || sending}>
            {sending ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name={editing ? 'checkmark' : 'send'} size={18} color="#fff" />}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={!!viewer} transparent animationType="fade" onRequestClose={() => setViewer(null)}>
        <Pressable style={styles.viewer} onPress={() => setViewer(null)}>
          {viewer && <Image source={{ uri: viewer }} style={styles.viewerImg} resizeMode="contain" />}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = themed(() => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  list: { padding: 14, gap: 8 },
  day: { alignSelf: 'center', fontSize: 12, fontWeight: '700', color: colors.textMuted, backgroundColor: colors.surface, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4, marginVertical: 10, overflow: 'hidden' },
  bubble: { alignSelf: 'flex-end', maxWidth: '86%', backgroundColor: colors.indigoBg, borderRadius: 16, borderBottomRightRadius: 4, padding: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  image: { width: 240, height: 180, borderRadius: 10, marginBottom: 4, backgroundColor: colors.border },
  file: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4, minWidth: 200 },
  fileIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  fileName: { fontSize: 14, fontWeight: '700', color: colors.indigoText },
  meta: { fontSize: 11, color: colors.textMuted },
  text: { fontSize: 15, color: colors.indigoText, paddingHorizontal: 4, paddingTop: 2 },
  time: { fontSize: 10, color: colors.textMuted, alignSelf: 'flex-end', marginTop: 3, paddingHorizontal: 4 },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  pin: { fontSize: 44, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 12 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 12, marginTop: 6, padding: 10, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bannerText: { flex: 1, fontSize: 13, color: colors.text },
  track: { height: 4, borderRadius: 99, backgroundColor: colors.border, overflow: 'hidden', marginTop: 6 },
  fill: { height: '100%', backgroundColor: colors.primary },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10 },
  iconBtn: { width: 40, height: 42, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, maxHeight: 120, minHeight: 42, borderRadius: 21, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  viewer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  viewerImg: { width: '100%', height: '100%' },
}));
