import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ScreenContainer from '../../components/ScreenContainer';
import { colors } from '../../theme/colors';
import { Word, WordState } from '../../types';
import * as wordsApi from '../../api/wordsApi';
import { dayKey, monthKey } from '../../utils/date';
import { extractErrorMessage } from '../../utils/errors';
import WordImage from '../../components/WordImage';
import { ImageSource, PreparedImage, pickWordImage, primeWordImage } from '../../services/wordImages';

type WordFilter = 'ALL' | 'WEAK' | WordState;

const FILTERS: { key: WordFilter; label: string }[] = [
  { key: 'ALL', label: 'Hammasi' },
  { key: 'WEAK', label: 'Zaif' },
  { key: 'NEW', label: 'Yangi' },
  { key: 'LEARNING', label: "O'rganilmoqda" },
  { key: 'MASTERED', label: "O'zlashtirilgan" },
];

const STATE_LABELS: Record<WordState, string> = {
  NEW: 'Yangi',
  LEARNING: "O'rganilmoqda",
  MASTERED: "O'zlashtirilgan",
};

function matchesFilter(word: Word, filter: WordFilter): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'WEAK') return word.weak;
  return word.state === filter;
}

// Dot next to each word: grey = not answered yet, amber = learning, green = mastered.
const STATE_COLORS: Record<WordState, string> = { NEW: colors.border, LEARNING: '#F59E0B', MASTERED: colors.secondary };

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${d.getFullYear()}`;
}

interface Section {
  letter: string;
  data: Word[];
}

export default function WordsScreen() {
  const [words, setWords] = useState<Word[]>([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<WordFilter>('ALL');
  const [detailWord, setDetailWord] = useState<Word | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [english, setEnglish] = useState('');
  const [uzbek, setUzbek] = useState('');
  const [definition, setDefinition] = useState('');
  const [saving, setSaving] = useState(false);
  // Picture chosen in the form but not uploaded yet; `removeImage` marks an existing picture for deletion.
  const [newImage, setNewImage] = useState<PreparedImage | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [editingImageVersion, setEditingImageVersion] = useState<number | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Word | null>(null);
  const [deleting, setDeleting] = useState(false);

  const listRef = useRef<SectionList<Word, Section>>(null);

  const loadWords = useCallback(async () => {
    setLoadingWords(true);
    try {
      const data = await wordsApi.getWords();
      setWords(data);
    } catch {
      // List load failure is silent; user can pull to refresh
    } finally {
      setLoadingWords(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [loadWords])
  );

  const sections = useMemo<Section[]>(() => {
    const needle = query.trim().toLowerCase();
    const byFilter = words.filter((w) => matchesFilter(w, filter));
    const filtered = needle
      ? byFilter.filter(
          (w) => w.english.toLowerCase().includes(needle) || w.uzbek.toLowerCase().includes(needle)
        )
      : byFilter;

    const groups = new Map<string, Word[]>();
    for (const word of filtered) {
      const first = word.english.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(first) ? first : '#';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(word);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => {
        if (a === '#') return 1;
        if (b === '#') return -1;
        return a.localeCompare(b);
      })
      .map(([letter, data]) => ({
        letter,
        data: data.sort((a, b) => a.english.localeCompare(b.english, undefined, { sensitivity: 'base' })),
      }));
  }, [words, query, filter]);

  const availableLetters = useMemo(() => new Set(sections.map((s) => s.letter)), [sections]);

  const scrollToLetter = (letter: string) => {
    const index = sections.findIndex((s) => s.letter === letter);
    if (index === -1) return;
    listRef.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0, viewOffset: 0, animated: true });
  };

  const resetForm = () => {
    setEnglish('');
    setUzbek('');
    setDefinition('');
    setNewImage(null);
    setRemoveImage(false);
    setEditingImageVersion(null);
  };

  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (word: Word) => {
    setEditingId(word.id);
    setEnglish(word.english);
    setUzbek(word.uzbek);
    setDefinition(word.definition ?? '');
    setNewImage(null);
    setRemoveImage(false);
    setEditingImageVersion(word.imageVersion ?? null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    resetForm();
  };

  const handleSave = async () => {
    if (!english.trim() || !uzbek.trim()) {
      Alert.alert('Xatolik', "Inglizcha va o'zbekcha so'zni kiriting");
      return;
    }
    setSaving(true);
    try {
      // Always send definition explicitly (even "") so editing can clear a previous
      // value — the update endpoint treats an omitted/null field as "leave unchanged".
      const payload = {
        english: english.trim(),
        uzbek: uzbek.trim(),
        definition: definition.trim(),
      };
      let saved: Word;
      if (editingId != null) {
        saved = await wordsApi.updateWord(editingId, payload);
      } else {
        saved = await wordsApi.addWord(payload);
      }
      // The word itself is saved; a failing picture upload must not lose it.
      let imageError: string | null = null;
      try {
        if (newImage) {
          saved = await wordsApi.setWordImage(saved.id, newImage.payload);
          if (saved.imageVersion) primeWordImage(saved.id, saved.imageVersion, newImage.payload);
        } else if (removeImage && editingId != null) {
          saved = await wordsApi.deleteWordImage(saved.id);
        }
      } catch (e: any) {
        imageError = extractErrorMessage(e, "Rasmni saqlab bo'lmadi");
      }
      const result = saved;
      if (editingId != null) {
        setWords((prev) => prev.map((w) => (w.id === result.id ? result : w)));
      } else {
        setWords((prev) => [result, ...prev]);
      }
      closeModal();
      if (imageError) Alert.alert("So'z saqlandi", `Lekin rasm saqlanmadi: ${imageError}`);
    } catch (e: any) {
      Alert.alert('Xatolik', extractErrorMessage(e, "So'zni saqlab bo'lmadi"));
    } finally {
      setSaving(false);
    }
  };

  const choosePicture = async (source: ImageSource) => {
    try {
      const picked = await pickWordImage(source);
      if (picked) {
        setNewImage(picked);
        setRemoveImage(false);
      }
    } catch (e: any) {
      Alert.alert(
        'Xatolik',
        e?.message === 'PERMISSION_DENIED' ? 'Ruxsat berilmadi. Telefon sozlamalarida ruxsat bering.' : "Rasmni tanlab bo'lmadi"
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await wordsApi.deleteWord(deleteTarget.id);
      setWords((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e: any) {
      Alert.alert('Xatolik', extractErrorMessage(e, "So'zni o'chirib bo'lmadi"));
    } finally {
      setDeleting(false);
    }
  };

  const isEmpty = sections.length === 0;

  const today = new Date();
  const todayKey = dayKey(today);
  const thisMonthKey = monthKey(today);
  const wordsAddedToday = words.filter((w) => dayKey(new Date(w.createdAt)) === todayKey).length;
  const wordsAddedThisMonth = words.filter((w) => monthKey(new Date(w.createdAt)) === thisMonthKey).length;

  return (
    <ScreenContainer scroll={false}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Ionicons name="book" size={22} color={colors.primary} />
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>So'zlar</Text>
          <Text style={styles.subtitle}>
            {words.length > 0 ? `${words.length} ta so'z` : "Hali so'z qo'shilmagan"}
          </Text>
        </View>
        <Pressable style={styles.addBtn} onPress={openAddModal} hitSlop={8}>
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      {words.length > 0 && (
        <>
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <StatBlock icon="book" color={colors.primary} value={words.length} label="Jami so'z" />
              <View style={styles.statDivider} />
              <StatBlock icon="add-circle" color={colors.secondary} value={wordsAddedToday} label="Bugun" />
              <View style={styles.statDivider} />
              <StatBlock icon="calendar" color="#F59E0B" value={wordsAddedThisMonth} label="Shu oy" />
            </View>
          </Card>

          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={colors.textMuted} />
            <TextInput
              placeholder="Qidirish..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              style={styles.searchInput}
            />
            {!!query && (
              <Pressable hitSlop={8} onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
            contentContainerStyle={styles.filterContent}
          >
            {FILTERS.map((f) => {
              const active = filter === f.key;
              const count = words.filter((w) => matchesFilter(w, f.key)).length;
              return (
                <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {f.label} {count}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}

      <View style={styles.listWrap}>
        {loadingWords && words.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : isEmpty ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name={query ? 'search-outline' : 'file-tray-outline'} size={30} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>{query ? 'Hech narsa topilmadi' : "Hali so'z yo'q"}</Text>
            {!query && (
              <>
                <Text style={styles.emptyText}>Birinchi so'zingizni qo'shing</Text>
                <Button title="So'z qo'shish" onPress={openAddModal} style={styles.emptyBtn} />
              </>
            )}
          </Card>
        ) : (
          <>
            <SectionList
              ref={listRef}
              sections={sections}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              stickySectionHeadersEnabled
              renderSectionHeader={({ section }) => (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{section.letter}</Text>
                </View>
              )}
              renderItem={({ item }) => (
                <View style={styles.wordRow}>
                  <Pressable
                    onPress={() => setDetailWord(item)}
                    style={({ pressed }) => [styles.wordRowMain, pressed && styles.wordRowPressed]}
                  >
                    <View style={styles.wordAvatar}>
                      <Text style={styles.wordAvatarText}>{item.english.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.wordEnglish} numberOfLines={1}>
                      {item.english}
                    </Text>
                    <View style={[styles.stateDot, { backgroundColor: STATE_COLORS[item.state ?? 'NEW'] }]} />
                  </Pressable>
                  <Pressable hitSlop={8} onPress={() => openEditModal(item)} style={styles.rowIconBtn}>
                    <Ionicons name="create-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                  <Pressable hitSlop={8} onPress={() => setDeleteTarget(item)} style={styles.rowIconBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              refreshControl={
                <RefreshControl refreshing={loadingWords} onRefresh={loadWords} colors={[colors.primary]} />
              }
              contentContainerStyle={styles.listContent}
            />
            <View style={styles.indexBar} pointerEvents="box-none">
              {ALPHABET.map((letter) => (
                <Pressable key={letter} hitSlop={2} onPress={() => scrollToLetter(letter)}>
                  <Text style={[styles.indexLetter, !availableLetters.has(letter) && styles.indexLetterMuted]}>
                    {letter}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <KeyboardAwareScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            bottomOffset={40}
            mode="layout"
          >
            <Pressable style={styles.backdropSpacer} onPress={closeModal} />
            <View style={styles.modalCard}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>
                {editingId != null ? "So'zni tahrirlash" : "Yangi so'z qo'shish"}
              </Text>

              <Input
                label="Inglizcha so'z"
                value={english}
                onChangeText={setEnglish}
                placeholder="e.g. abundant"
                autoCapitalize="none"
              />
              <Input
                label="O'zbekcha tarjimasi"
                value={uzbek}
                onChangeText={setUzbek}
                placeholder="masalan: mo'l-ko'l"
              />
              <Input
                label="Definition (inglizcha izoh, ixtiyoriy)"
                value={definition}
                onChangeText={setDefinition}
                placeholder="e.g. existing in large quantities"
                multiline
                numberOfLines={3}
                style={styles.multiline}
              />

              <Text style={styles.pictureLabel}>Rasm (ixtiyoriy)</Text>
              <View style={styles.pictureRow}>
                {newImage ? (
                  <Image source={{ uri: newImage.uri }} style={styles.picturePreview} />
                ) : editingId != null && editingImageVersion && !removeImage ? (
                  <WordImage wordId={editingId} version={editingImageVersion} style={styles.picturePreview} />
                ) : (
                  <View style={[styles.picturePreview, styles.pictureEmpty]}>
                    <Ionicons name="image-outline" size={26} color={colors.textMuted} />
                  </View>
                )}
                <View style={styles.pictureButtons}>
                  <Pressable style={styles.pictureBtn} onPress={() => choosePicture('library')} hitSlop={6}>
                    <Ionicons name="images-outline" size={16} color={colors.primary} />
                    <Text style={styles.pictureBtnText}>Galereya</Text>
                  </Pressable>
                  <Pressable style={styles.pictureBtn} onPress={() => choosePicture('camera')} hitSlop={6}>
                    <Ionicons name="camera-outline" size={16} color={colors.primary} />
                    <Text style={styles.pictureBtnText}>Kamera</Text>
                  </Pressable>
                  {(newImage || (editingImageVersion && !removeImage)) && (
                    <Pressable
                      style={styles.pictureBtn}
                      onPress={() => {
                        setNewImage(null);
                        if (editingImageVersion) setRemoveImage(true);
                      }}
                      hitSlop={6}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.danger} />
                      <Text style={[styles.pictureBtnText, { color: colors.danger }]}>O'chirish</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Bekor qilish"
                  variant="outline"
                  onPress={closeModal}
                  style={styles.modalActionBtn}
                />
                <Button title="Saqlash" onPress={handleSave} loading={saving} style={styles.modalActionBtn} />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

      <Modal visible={!!detailWord} animationType="slide" transparent onRequestClose={() => setDetailWord(null)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdropSpacer} onPress={() => setDetailWord(null)} />
          <View style={styles.detailCard}>
            <View style={styles.modalHandle} />

            <View style={styles.detailHeader}>
              <View style={styles.detailAvatar}>
                <Text style={styles.detailAvatarText}>{detailWord?.english.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.detailEnglish}>{detailWord?.english}</Text>
            </View>

            {detailWord?.imageVersion ? (
              <WordImage wordId={detailWord.id} version={detailWord.imageVersion} style={styles.detailImage} />
            ) : null}

            <View style={styles.detailRow}>
              <View style={[styles.detailIconWrap, { backgroundColor: `${colors.secondary}1A` }]}>
                <Ionicons name="globe-outline" size={16} color={colors.secondary} />
              </View>
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>O'zbekcha tarjima</Text>
                <Text style={styles.detailValue}>{detailWord?.uzbek}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIconWrap, { backgroundColor: '#F59E0B1A' }]}>
                <Ionicons name="book-outline" size={16} color="#F59E0B" />
              </View>
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>Definition</Text>
                <Text style={styles.detailValue}>{detailWord?.definition || 'Kiritilmagan'}</Text>
              </View>
            </View>

            {detailWord && (
              <View style={styles.detailFooterRow}>
                <View style={[styles.stateDot, { backgroundColor: STATE_COLORS[detailWord.state ?? 'NEW'] }]} />
                <Text style={styles.detailFooterText}>
                  {STATE_LABELS[detailWord.state ?? 'NEW']}
                  {detailWord.lapses > 0 ? ` · ${detailWord.lapses} marta xato` : ''}
                  {detailWord.weak ? ' · zaif' : ''}
                </Text>
              </View>
            )}

            <View style={styles.detailFooterRow}>
              <Ionicons name="time-outline" size={13} color={colors.textMuted} />
              <Text style={styles.detailFooterText}>
                {detailWord ? `${formatDate(detailWord.createdAt)} sanasida qo'shilgan` : ''}
              </Text>
            </View>

            <Button title="Yopish" variant="outline" onPress={() => setDetailWord(null)} style={styles.detailCloseBtn} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!deleteTarget}
        animationType="fade"
        transparent
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.confirmOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setDeleteTarget(null)} />
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <Ionicons name="trash-outline" size={26} color={colors.danger} />
            </View>
            <Text style={styles.confirmTitle}>So'zni o'chirish</Text>
            <Text style={styles.confirmMessage}>
              {deleteTarget
                ? `"${deleteTarget.english}" so'zini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`
                : ''}
            </Text>
            <View style={styles.confirmActions}>
              <Button
                title="Bekor qilish"
                variant="outline"
                onPress={() => setDeleteTarget(null)}
                style={styles.confirmActionBtn}
              />
              <Button
                title="O'chirish"
                variant="danger"
                onPress={confirmDelete}
                loading={deleting}
                style={styles.confirmActionBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function StatBlock({
  icon,
  color,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: number | string;
  label: string;
}) {
  return (
    <View style={styles.statBlock}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pictureLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  pictureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  picturePreview: { width: 96, height: 96, borderRadius: 14 },
  pictureEmpty: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  pictureButtons: { flex: 1, gap: 8 },
  pictureBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  pictureBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  detailImage: { width: '100%', height: 170, borderRadius: 14, marginBottom: 14 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 16 },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: { marginHorizontal: 20, marginTop: 14, marginBottom: 0 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  statBlock: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 2 },
  statLabel: { fontSize: 11, color: colors.textMuted },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 36,
  },
  searchInput: { flex: 1, padding: 0, fontSize: 14, color: colors.text },
  listWrap: { flex: 1, marginTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: 40, paddingRight: 26 },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  sectionHeaderText: { fontSize: 13, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  wordRowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  wordRowPressed: { opacity: 0.6 },
  wordAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordAvatarText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  stateDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  wordEnglish: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  rowIconBtn: { padding: 6, marginLeft: 4 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 68 },
  indexBar: {
    position: 'absolute',
    right: 4,
    top: 4,
    bottom: 4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 20,
  },
  indexLetter: { fontSize: 10, fontWeight: '700', color: colors.primary, lineHeight: 13 },
  indexLetterMuted: { color: colors.border },
  emptyCard: { alignItems: 'center', paddingVertical: 28, marginHorizontal: 20 },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptyText: { fontSize: 13, color: colors.textMuted },
  emptyBtn: { marginTop: 16, alignSelf: 'stretch' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.4)' },
  modalScroll: { flex: 1 },
  modalScrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
  backdropSpacer: { flex: 1 },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  multiline: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalActionBtn: { flex: 1 },
  detailCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  detailHeader: { alignItems: 'center', marginBottom: 20 },
  detailAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  detailAvatarText: { fontSize: 22, fontWeight: '700', color: colors.primary },
  detailEnglish: { fontSize: 20, fontWeight: '700', color: colors.text },
  detailRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  detailIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextWrap: { flex: 1 },
  detailLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 15, color: colors.text, fontWeight: '600', lineHeight: 21 },
  filterRow: { flexGrow: 0, marginBottom: 10 },
  filterContent: { gap: 8, paddingRight: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.border },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: '#fff' },
  detailFooterRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  detailFooterText: { fontSize: 12, color: colors.textMuted },
  detailCloseBtn: { marginTop: 0 },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  confirmIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${colors.danger}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
  confirmMessage: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  confirmActions: { flexDirection: 'row', gap: 10, width: '100%' },
  confirmActionBtn: { flex: 1 },
});
