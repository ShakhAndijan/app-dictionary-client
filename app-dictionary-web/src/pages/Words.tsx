import { useCallback, useEffect, useMemo, useState } from 'react';
import { errorMessage, ReviewSummary, reviewApi, Word, wordsApi } from '../api';
import { Button, Card, Confirm, Modal, Notice, SpeakButton, Spinner, WordImage } from '../ui';
import { prepareImage } from '../util';

type WordFilter = 'ALL' | 'FAVORITE' | 'WEAK' | 'NEW' | 'LEARNING' | 'MASTERED';

const FILTERS: { key: WordFilter; label: string }[] = [
  { key: 'ALL', label: 'Hammasi' },
  { key: 'FAVORITE', label: '⭐ Sevimli' },
  { key: 'WEAK', label: 'Zaif' },
  { key: 'NEW', label: 'Yangi' },
  { key: 'LEARNING', label: "O'rganilmoqda" },
  { key: 'MASTERED', label: "O'zlashtirilgan" },
];

const STATE_LABEL = { NEW: 'Yangi', LEARNING: "O'rganilmoqda", MASTERED: "O'zlashtirilgan" } as const;
const STATE_CLASS = { NEW: 'chip-new', LEARNING: 'chip-learning', MASTERED: 'chip-mastered' } as const;

function matches(w: Word, f: WordFilter): boolean {
  switch (f) {
    case 'FAVORITE':
      return w.favorite;
    case 'WEAK':
      return w.weak;
    case 'NEW':
    case 'LEARNING':
    case 'MASTERED':
      return w.state === f;
    default:
      return true;
  }
}

interface FormState {
  english: string;
  uzbek: string;
  definition: string;
}

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<WordFilter>('ALL');

  const [detail, setDetail] = useState<Word | null>(null);
  const [editing, setEditing] = useState<Word | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Word | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      setWords(await wordsApi.list());
    } catch (e) {
      setLoadError(errorMessage(e, "So'zlarni yuklab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    reviewApi
      .summary()
      .then(setReview)
      .catch(() => undefined);
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...words]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((w) => matches(w, filter))
      .filter((w) => !q || w.english.toLowerCase().includes(q) || w.uzbek.toLowerCase().includes(q));
  }, [words, query, filter]);

  const replace = (w: Word) => setWords((list) => list.map((x) => (x.id === w.id ? w : x)));

  const toggleFavorite = async (w: Word) => {
    replace({ ...w, favorite: !w.favorite });
    setDetail((d) => (d && d.id === w.id ? { ...d, favorite: !w.favorite } : d));
    try {
      replace(await wordsApi.update(w.id, { favorite: !w.favorite }));
    } catch {
      replace(w);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await wordsApi.remove(deleteTarget.id);
      setWords((list) => list.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDetail(null);
    } catch (e) {
      alert(errorMessage(e, "So'zni o'chirib bo'lmadi"));
    } finally {
      setDeleting(false);
    }
  };

  const counts = {
    total: words.length,
    fresh: words.filter((w) => w.state === 'NEW').length,
    learning: words.filter((w) => w.state === 'LEARNING').length,
    mastered: words.filter((w) => w.state === 'MASTERED').length,
  };

  return (
    <>
      <div className="page-header">
        <h1>So'zlarim</h1>
        <div className="grow" />
        <Button onClick={() => setEditing('new')}>＋ So'z qo'shish</Button>
      </div>

      <div className="stats-strip">
        <div className="tile">
          <div className="tile-value">{counts.total}</div>
          <div className="tile-label">Jami so'z</div>
        </div>
        <div className="tile">
          <div className="tile-value" style={{ color: 'var(--indigo-text)' }}>{counts.fresh}</div>
          <div className="tile-label">Yangi</div>
        </div>
        <div className="tile">
          <div className="tile-value" style={{ color: 'var(--amber-text)' }}>{counts.learning}</div>
          <div className="tile-label">O'rganilmoqda</div>
        </div>
        <div className="tile">
          <div className="tile-value" style={{ color: 'var(--green-text)' }}>{counts.mastered}</div>
          <div className="tile-label">O'zlashtirilgan</div>
        </div>
        {review && (
          <div className="tile">
            <div className="tile-value" style={{ color: 'var(--primary)' }}>{review.dueCount}</div>
            <div className="tile-label">Bugun takrorlash</div>
          </div>
        )}
      </div>

      <div className="search-row">
        <input
          className="input"
          placeholder="🔍 So'z yoki tarjima bo'yicha qidirish"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="tabs">
        {FILTERS.map((f) => (
          <button key={f.key} className={`tab ${filter === f.key ? 'on' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : loadError ? (
        <Card className="empty">
          <p className="muted">{loadError}</p>
          <Button variant="outline" onClick={load}>
            Qayta urinish
          </Button>
        </Card>
      ) : words.length === 0 ? (
        <Card className="empty">
          <div className="empty-emoji">📝</div>
          <h3>Hali so'z yo'q</h3>
          <p className="muted">Birinchi so'zingizni qo'shing va o'rganishni boshlang.</p>
          <Button onClick={() => setEditing('new')}>So'z qo'shish</Button>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="empty">
          <div className="empty-emoji">🔎</div>
          <p className="muted">Hech narsa topilmadi</p>
        </Card>
      ) : (
        visible.map((w) => (
          <div key={w.id} className="word-row" onClick={() => setDetail(w)}>
            <div className="word-main">
              <div className="word-en">{w.english}</div>
              <div className="word-uz">{w.uzbek}</div>
            </div>
            {w.weak && <span className="chip chip-weak">Zaif</span>}
            <span className={`chip ${STATE_CLASS[w.state]}`}>{STATE_LABEL[w.state]}</span>
            <SpeakButton text={w.english} />
            <button
              className="star"
              aria-label="Sevimli"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(w);
              }}
            >
              {w.favorite ? '⭐' : '☆'}
            </button>
          </div>
        ))
      )}

      {detail && (
        <Modal onClose={() => setDetail(null)} wide>
          <div className="row gap">
            <h2 style={{ fontSize: 26 }}>{detail.english}</h2>
            <SpeakButton text={detail.english} />
            <SpeakButton text={detail.english} slow />
            <div className="grow" />
            <button className="star" onClick={() => toggleFavorite(detail)}>
              {detail.favorite ? '⭐' : '☆'}
            </button>
          </div>
          <p style={{ fontSize: 20, fontWeight: 700, margin: '6px 0 10px' }}>{detail.uzbek}</p>
          <div className="row gap wrap mb">
            <span className={`chip ${STATE_CLASS[detail.state]}`}>{STATE_LABEL[detail.state]}</span>
            {detail.weak && <span className="chip chip-weak">Zaif so'z</span>}
            {detail.lapses > 0 && <span className="chip chip-new">{detail.lapses} marta xato</span>}
            {detail.nextReviewDate && <span className="chip chip-new">Keyingi takror: {detail.nextReviewDate}</span>}
          </div>
          {detail.definition && (
            <div className="def-box" style={{ maxHeight: 'none' }}>
              <b>Definition</b>
              <div>{detail.definition}</div>
            </div>
          )}
          <WordImage wordId={detail.id} version={detail.imageVersion} />
          <div className="row end gap mt">
            <Button variant="danger" onClick={() => setDeleteTarget(detail)}>
              O'chirish
            </Button>
            <Button variant="outline" onClick={() => { setEditing(detail); setDetail(null); }}>
              Tahrirlash
            </Button>
            <Button variant="outline" onClick={() => setDetail(null)}>
              Yopish
            </Button>
          </div>
        </Modal>
      )}

      {editing && (
        <WordForm
          word={editing === 'new' ? null : editing}
          existing={words}
          onClose={() => setEditing(null)}
          onSaved={(w) => {
            setWords((list) => (list.some((x) => x.id === w.id) ? list.map((x) => (x.id === w.id ? w : x)) : [w, ...list]));
            setEditing(null);
          }}
        />
      )}

      {deleteTarget && (
        <Confirm
          title="So'zni o'chirish"
          text={`"${deleteTarget.english}" so'zi va uning statistikasi o'chiriladi.`}
          confirmLabel="O'chirish"
          danger
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

function WordForm({
  word,
  existing,
  onClose,
  onSaved,
}: {
  word: Word | null;
  existing: Word[];
  onClose: () => void;
  onSaved: (w: Word) => void;
}) {
  const [form, setForm] = useState<FormState>({
    english: word?.english ?? '',
    uzbek: word?.uzbek ?? '',
    definition: word?.definition ?? '',
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [newImage, setNewImage] = useState<{ contentType: string; data: string } | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const suggest = async () => {
    const english = form.english.trim();
    const translated = form.uzbek.trim();
    const described = form.definition.trim();
    if (!english && !translated && !described) {
      setError("Inglizcha so'z, o'zbekcha so'z yoki definition yozing");
      return;
    }
    setSuggesting(true);
    setError('');
    setInfo('');
    try {
      // Any one field is enough: the English word is looked up from the Uzbek word or from a description.
      const s = await wordsApi.suggest(
        english ? { english } : translated ? { uzbek: translated } : { definition: described }
      );
      const next = { ...form };
      let filled = false;
      if (!english && s.english) {
        next.english = s.english;
        filled = true;
      }
      if (!translated && s.uzbek) {
        next.uzbek = s.uzbek;
        filled = true;
      }
      if (!form.definition.trim() && s.definition) {
        next.definition = s.definition;
        filled = true;
      }
      setForm(next);
      if (!s.english && !s.uzbek && !(s.definition && english)) setInfo("Bu so'z uchun tarjima topilmadi. Qo'lda kiriting.");
      else if (s.alternatives && s.alternatives.length > 0 && !english && !translated)
        setInfo(`Eng mos so'z: ${s.english}. Boshqa variantlar: ${s.alternatives.join(', ')}`);
      else if (!filled) setInfo("Tarjima va definition allaqachon kiritilgan, ustidan yozmadim.");
    } catch (e) {
      setError(errorMessage(e, "Avtomatik to'ldirib bo'lmadi. Internetni tekshiring."));
    } finally {
      setSuggesting(false);
    }
  };

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      setNewImage(await prepareImage(file));
      setRemoveImage(false);
    } catch {
      setError("Rasmni o'qib bo'lmadi");
    }
  };

  const save = async () => {
    const english = form.english.trim();
    const uzbek = form.uzbek.trim();
    if (!english || !uzbek) {
      setError("Inglizcha va o'zbekcha so'zni kiriting");
      return;
    }
    const dup = existing.find((w) => w.english.toLowerCase() === english.toLowerCase() && w.id !== word?.id);
    if (dup && !confirm(`"${english}" allaqachon qo'shilgan. Baribir saqlansinmi?`)) return;
    setSaving(true);
    setError('');
    try {
      const body = { english, uzbek, definition: form.definition.trim() };
      let saved = word ? await wordsApi.update(word.id, body) : await wordsApi.add(body);
      try {
        if (newImage) saved = await wordsApi.setImage(saved.id, newImage);
        else if (removeImage && word?.imageVersion != null) saved = await wordsApi.deleteImage(saved.id);
      } catch (e) {
        alert(`So'z saqlandi, lekin rasm saqlanmadi: ${errorMessage(e, 'xatolik')}`);
      }
      onSaved(saved);
    } catch (e) {
      setError(errorMessage(e, "So'zni saqlab bo'lmadi"));
    } finally {
      setSaving(false);
    }
  };

  const hasImage = !removeImage && (newImage != null || word?.imageVersion != null);

  return (
    <Modal title={word ? "So'zni tahrirlash" : "Yangi so'z"} onClose={onClose} wide>
      {error && <Notice>{error}</Notice>}
      {info && <Notice kind="info">{info}</Notice>}
      <label className="field">
        <span className="field-label">Inglizcha</span>
        <div className="row gap">
          <input className="input" value={form.english} onChange={(e) => set('english', e.target.value)} autoFocus />
          <Button variant="outline" onClick={suggest} loading={suggesting} title="Tarjima va definition'ni avtomatik to'ldirish">
            ✨ Avto
          </Button>
        </div>
      </label>
      <label className="field">
        <span className="field-label">O'zbekcha</span>
        <input className="input" value={form.uzbek} onChange={(e) => set('uzbek', e.target.value)} />
      </label>
      <label className="field">
        <span className="field-label">Definition (ixtiyoriy)</span>
        <textarea className="textarea" value={form.definition} onChange={(e) => set('definition', e.target.value)} />
      </label>

      <div className="field">
        <span className="field-label">Rasm (ixtiyoriy)</span>
        {newImage && <img className="word-image" src={`data:${newImage.contentType};base64,${newImage.data}`} alt="" />}
        {!newImage && word && !removeImage && <WordImage wordId={word.id} version={word.imageVersion} />}
        <div className="row gap">
          <label className="btn btn-outline">
            {hasImage ? 'Rasmni almashtirish' : 'Rasm tanlash'}
            <input type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0])} />
          </label>
          {hasImage && (
            <Button
              variant="ghost"
              onClick={() => {
                setNewImage(null);
                setRemoveImage(true);
              }}
            >
              Rasmni olib tashlash
            </Button>
          )}
        </div>
      </div>

      <div className="row end gap">
        <Button variant="outline" onClick={onClose}>
          Bekor qilish
        </Button>
        <Button onClick={save} loading={saving}>
          Saqlash
        </Button>
      </div>
    </Modal>
  );
}
