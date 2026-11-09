import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];

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

  const groups = useMemo(() => {
    const sorted = [...visible].sort((x, y) => x.english.localeCompare(y.english, 'en', { sensitivity: 'base' }));
    const map = new Map<string, Word[]>();
    for (const w of sorted) {
      const first = w.english.trim().charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(first) ? first : '#';
      map.set(letter, [...(map.get(letter) ?? []), w]);
    }
    return [...map.entries()]
      .sort(([p], [q]) => (p === '#' ? 1 : q === '#' ? -1 : p.localeCompare(q)))
      .map(([letter, items]) => ({ letter, items }));
  }, [visible]);

  const [activeLetter, setActiveLetter] = useState('');
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.dx-group'));
    if (nodes.length === 0) return;
    setActiveLetter(nodes[0].dataset.letter ?? '');
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top)[0];
        if (hit) setActiveLetter((hit.target as HTMLElement).dataset.letter ?? '');
      },
      { rootMargin: '-140px 0px -65% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [groups]);

  const jumpTo = (letter: string) => {
    document.getElementById(`L-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveLetter(letter);
  };

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
      <header className="dx-head rise">
        <div>
          <div className="eyebrow">Shaxsiy lug'at</div>
          <h1 className="dx-title">So'zlarim</h1>
        </div>
        <div className="dx-head-side">
          {review && review.dueCount > 0 && (
            <Link to="/study" className="dx-due">
              <b>{review.dueCount}</b> takrorlash
            </Link>
          )}
          <Button onClick={() => setEditing('new')}>＋ Yangi so'z</Button>
        </div>
      </header>

      <div className="dx-facts rise" style={{ ['--d' as string]: '0.04s' }}>
        <span><b>{counts.total}</b> so'z</span>
        <span><i className="dot-done" /><b>{counts.mastered}</b> o'zlashtirilgan</span>
        <span><i className="dot-learn" /><b>{counts.learning}</b> o'rganilmoqda</span>
        <span><i className="dot-new" /><b>{counts.fresh}</b> yangi</span>
      </div>

      <div className="dx-tools rise" style={{ ['--d' as string]: '0.08s' }}>
        <div className="dx-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input placeholder="Lug'atdan qidirish…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Qidirish" />
          {query && (
            <button className="dx-clear" onClick={() => setQuery('')} aria-label="Tozalash">
              ✕
            </button>
          )}
        </div>
        <div className="dx-filters" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.key} role="tab" aria-selected={filter === f.key} className={`dx-seg ${filter === f.key ? 'on' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
              <em>{words.filter((w) => matches(w, f.key)).length}</em>
            </button>
          ))}
        </div>
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
          <Button onClick={() => setEditing('new')}>＋ Yangi so'z</Button>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="empty">
          <div className="empty-emoji">🔎</div>
          <p className="muted">Hech narsa topilmadi</p>
        </Card>
      ) : (
        <div className="dx-wrap">
          <nav className="dx-rail" aria-label="Alifbo">
            {ALPHABET.map((l) => {
              const has = groups.some((g) => g.letter === l);
              return (
                <button key={l} className={`dx-letter ${activeLetter === l ? 'on' : ''}`} disabled={!has} onClick={() => jumpTo(l)}>
                  {l}
                </button>
              );
            })}
          </nav>
          <div className="dx-list">
            {groups.map((g) => (
              <section key={g.letter} id={`L-${g.letter}`} data-letter={g.letter} className="dx-group">
                <div className="dx-group-head">
                  <span className="dx-big">{g.letter}</span>
                  <span className="dx-group-count">{g.items.length} ta so'z</span>
                </div>
                {g.items.map((w) => (
                  <article
                    key={w.id}
                    className={`dx-entry st-${w.state.toLowerCase()}`}
                    onClick={() => setDetail(w)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setDetail(w);
                    }}
                  >
                    <span className="dx-state-bar" aria-hidden="true" />
                    <div className="dx-body">
                      <div className="dx-line">
                        <span className="dx-en">{w.english}</span>
                        <span className="dx-uz">{w.uzbek}</span>
                      </div>
                      {w.definition && <p className="dx-def">{w.definition}</p>}
                    </div>
                    <div className="dx-side">
                      {w.weak && <span className="dx-weak">Zaif</span>}
                      <span className={`dx-pill ${STATE_CLASS[w.state]}`}>{STATE_LABEL[w.state]}</span>
                      <SpeakButton text={w.english} />
                      <button
                        className={`dx-star ${w.favorite ? 'on' : ''}`}
                        aria-label="Sevimli"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(w);
                        }}
                      >
                        {w.favorite ? '★' : '☆'}
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </div>
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
  const [drag, setDrag] = useState(false);
  const canSave = form.english.trim() !== '' && form.uzbek.trim() !== '';

  return (
    <Modal onClose={onClose} className="wf-modal">
      <div
        className="wf"
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSave && !saving) save();
        }}
      >
        <header className="wf-head">
          <span className="wf-badge" aria-hidden="true">{word ? '✎' : '＋'}</span>
          <div>
            <h2 className="wf-title">{word ? "So'zni tahrirlash" : "Yangi so'z"}</h2>
            <p className="wf-sub">Inglizcha yoki o'zbekcha so'zni yozing va «Avto» ni bosing, qolganini to'ldiramiz.</p>
          </div>
          <div className="grow" />
          <button className="wf-x" onClick={onClose} aria-label="Yopish">✕</button>
        </header>

        <div className="wf-grid">
          <div className="wf-left">
            {error && <Notice>{error}</Notice>}
            {info && <Notice kind="info">{info}</Notice>}

            <div className="wf-field">
              <label htmlFor="wf-en">Inglizcha</label>
              <div className="wf-hero-input">
                <input
                  id="wf-en"
                  value={form.english}
                  onChange={(e) => set('english', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && form.english.trim() && !form.uzbek.trim()) {
                      e.preventDefault();
                      suggest();
                    }
                  }}
                  placeholder="masalan: serendipity"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="button" className="wf-magic" onClick={suggest} disabled={suggesting} title="Tarjima va definition'ni avtomatik to'ldirish">
                  {suggesting ? <span className="spinner small" /> : <>✨ Avto</>}
                </button>
              </div>
            </div>

            <div className="wf-field">
              <label htmlFor="wf-uz">O'zbekcha</label>
              <div className="wf-hero-input sm">
                <input
                  id="wf-uz"
                  value={form.uzbek}
                  onChange={(e) => set('uzbek', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && form.uzbek.trim() && !form.english.trim()) {
                      e.preventDefault();
                      suggest();
                    }
                  }}
                  placeholder="masalan: tasodif"
                  autoComplete="off"
                />
                <button type="button" className="wf-magic" onClick={suggest} disabled={suggesting} title="O'zbekcha so'zdan inglizcha so'zni va ta'rifni topish">
                  {suggesting ? <span className="spinner small" /> : <>✨ Avto</>}
                </button>
              </div>
            </div>

            <div className="wf-field">
              <label htmlFor="wf-def">
                Ta'rif <em>(ixtiyoriy)</em>
              </label>
              <textarea
                id="wf-def"
                className="wf-input wf-area"
                value={form.definition}
                onChange={(e) => set('definition', e.target.value.slice(0, 400))}
                placeholder="So'zning inglizcha izohi yoki misol gap"
              />
              <div className="wf-count">{form.definition.length} / 400</div>
            </div>
          </div>

          <aside className="wf-right">
            <div className="wf-label">Ko'rinishi</div>
            <div className="wf-preview">
              <span className="wf-preview-bar" aria-hidden="true" />
              <div className="wf-preview-line">
                <span className={`wf-preview-en ${form.english.trim() ? '' : 'ph'}`}>{form.english.trim() || 'so\'z'}</span>
                <span className={`wf-preview-uz ${form.uzbek.trim() ? '' : 'ph'}`}>{form.uzbek.trim() || 'tarjima'}</span>
              </div>
              {form.definition.trim() && <p className="wf-preview-def">{form.definition.trim()}</p>}
              {form.english.trim() && (
                <div className="wf-preview-foot">
                  <SpeakButton text={form.english} />
                </div>
              )}
            </div>

            <div className="wf-label">Rasm <em>(ixtiyoriy)</em></div>
            {hasImage ? (
              <div className="wf-photo">
                {newImage ? (
                  <img className="wf-photo-img" src={`data:${newImage.contentType};base64,${newImage.data}`} alt="" />
                ) : word ? (
                  <WordImage wordId={word.id} version={word.imageVersion} className="wf-photo-img" />
                ) : null}
                <div className="wf-photo-actions">
                  <label className="wf-chip-btn">
                    Almashtirish
                    <input type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0])} />
                  </label>
                  <button
                    type="button"
                    className="wf-chip-btn danger"
                    onClick={() => {
                      setNewImage(null);
                      setRemoveImage(true);
                    }}
                  >
                    Olib tashlash
                  </button>
                </div>
              </div>
            ) : (
              <label
                className={`wf-drop ${drag ? 'over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  pickImage(e.dataTransfer.files?.[0]);
                }}
              >
                <span className="wf-drop-ico" aria-hidden="true">🖼</span>
                <b>Rasm qo'shing</b>
                <small>Bosing yoki shu yerga tashlang</small>
                <input type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0])} />
              </label>
            )}
          </aside>
        </div>

        <footer className="wf-foot">
          <span className="wf-hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> — saqlash</span>
          <div className="grow" />
          <Button variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button onClick={save} loading={saving} disabled={!canSave}>
            {word ? 'Saqlash' : "So'zni qo'shish"}
          </Button>
        </footer>
      </div>
    </Modal>
  );
}
