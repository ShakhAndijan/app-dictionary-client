import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { errorMessage, wordsApi } from '../api';
import { Button, Modal } from '../ui';
import { speakEnglish } from '../util';

/** A word the learner added while working on this lesson (also saved to their dictionary). */
interface LessonWord {
  english: string;
  uzbek: string;
}

const storeKey = (code: string) => `lesson-words:${code}`;

function load(code: string): LessonWord[] {
  try {
    const raw = localStorage.getItem(storeKey(code));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((w) => w && typeof w.english === 'string' && typeof w.uzbek === 'string') : [];
  } catch {
    return [];
  }
}

function save(code: string, list: LessonWord[]) {
  try {
    localStorage.setItem(storeKey(code), JSON.stringify(list));
  } catch {
    /* private mode: the list simply is not remembered */
  }
}

/**
 * Side window of a lesson: shows the words added during this lesson (with translation) and opens a small dialog to add more.
 * One word in either language is enough, the other side is looked up.
 */
export function LessonWordsDock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [words, setWords] = useState<LessonWord[]>(() => load(code));

  useEffect(() => {
    setWords(load(code));
  }, [code]);

  const update = (next: LessonWord[]) => {
    setWords(next);
    save(code, next);
  };

  // Rendered into <body>: a transformed page ancestor would otherwise become the containing block of the fixed tab and panel.
  return createPortal(
    <>
      <button className={`lw-tab${open ? ' on' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="So'zlar oynasi">
        <span>📖</span>
        <b>So'zlar</b>
        {words.length > 0 && <i>{words.length}</i>}
      </button>
      {open && (
        <aside className="lw-panel" aria-label="Darsdagi so'zlar">
          <header>
            <div>
              <b>Darsdagi so'zlar</b>
              <small>{words.length > 0 ? `${words.length} ta so'z qo'shildi` : "Hali so'z qo'shilmagan"}</small>
            </div>
            <button className="lw-close" onClick={() => setOpen(false)} aria-label="Yopish">✕</button>
          </header>
          <button className="lw-add" onClick={() => setAdding(true)}>+ So'z qo'shish</button>
          {words.length === 0 ? (
            <p className="lw-empty">Dars davomida uchragan noma'lum so'zni shu yerdan qo'shing. U lug'atingizga ham tushadi va tarjimasi shu oynada ko'rinib turadi.</p>
          ) : (
            <ul className="lw-list">
              {[...words].reverse().map((w) => (
                <li key={w.english.toLowerCase()}>
                  <button className="lw-say" onClick={() => speakEnglish(w.english)} aria-label={`${w.english} ni eshitish`}>🔊</button>
                  <div>
                    <b>{w.english}</b>
                    <span>{w.uzbek}</span>
                  </div>
                  <button
                    className="lw-del"
                    onClick={() => update(words.filter((x) => x.english.toLowerCase() !== w.english.toLowerCase()))}
                    aria-label="Ro'yxatdan olib tashlash"
                    title="Faqat shu ro'yxatdan olib tashlaydi, lug'atda qoladi"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}
      {adding && (
        <AddWordModal
          onClose={() => setAdding(false)}
          onAdded={(w) => {
            update([...words.filter((x) => x.english.toLowerCase() !== w.english.toLowerCase()), w]);
            setOpen(true);
          }}
        />
      )}
    </>,
    document.body
  );
}

function AddWordModal({ onClose, onAdded }: { onClose: () => void; onAdded: (w: LessonWord) => void }) {
  const [lang, setLang] = useState<'english' | 'uzbek'>('english');
  const [text, setText] = useState('');
  const [other, setOther] = useState('');
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<LessonWord | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, [done]);

  const submit = async () => {
    const typed = text.trim();
    if (!typed) {
      setError(lang === 'english' ? "Inglizcha so'z yozing" : "O'zbekcha so'z yozing");
      return;
    }
    setBusy(true);
    setError('');
    try {
      let english = lang === 'english' ? typed : other.trim();
      let uzbek = lang === 'uzbek' ? typed : other.trim();
      let definition = '';
      if (!other.trim()) {
        const s = await wordsApi.suggest(lang === 'english' ? { english: typed } : { uzbek: typed });
        if (lang === 'english') uzbek = s.uzbek?.trim() ?? '';
        else english = s.english?.trim() ?? '';
        definition = s.definition ?? '';
      }
      if (!english || !uzbek) {
        setManual(true);
        setError(`Tarjima topilmadi. ${lang === 'english' ? "O'zbekcha" : 'Inglizcha'} tarjimasini o'zingiz yozing.`);
        return;
      }
      // Reuse the word when it is already in the dictionary instead of creating a duplicate.
      const existing = (await wordsApi.list()).find((w) => w.english.toLowerCase() === english.toLowerCase());
      const word = existing ?? (await wordsApi.add({ english, uzbek, definition: definition || undefined }));
      const added = { english: word.english, uzbek: word.uzbek };
      onAdded(added);
      setDone(added);
      setText('');
      setOther('');
      setManual(false);
    } catch (e) {
      setError(errorMessage(e, "So'zni qo'shib bo'lmadi. Internetni tekshiring."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="So'z qo'shish" onClose={onClose}>
      <div className="lw-form" onKeyDown={(e) => e.key === 'Enter' && !busy && submit()}>
        <div className="lw-lang" role="tablist">
          <button role="tab" aria-selected={lang === 'english'} className={lang === 'english' ? 'on' : ''} onClick={() => { setLang('english'); setManual(false); setOther(''); setError(''); }}>Inglizcha</button>
          <button role="tab" aria-selected={lang === 'uzbek'} className={lang === 'uzbek' ? 'on' : ''} onClick={() => { setLang('uzbek'); setManual(false); setOther(''); setError(''); }}>O'zbekcha</button>
        </div>
        <input
          ref={input}
          className="lw-input"
          value={text}
          onChange={(e) => { setText(e.target.value); setDone(null); }}
          placeholder={lang === 'english' ? 'Masalan: borrow' : 'Masalan: qarz olmoq'}
          autoComplete="off"
          spellCheck={false}
        />
        {manual && (
          <input
            className="lw-input"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder={lang === 'english' ? "O'zbekcha tarjimasi" : 'Inglizcha tarjimasi'}
            autoComplete="off"
          />
        )}
        {error && <p className="lw-err">{error}</p>}
        {done && !error && (
          <p className="lw-ok">✓ <b>{done.english}</b> — {done.uzbek} qo'shildi</p>
        )}
        <p className="lw-hint">Bitta tilda yozing, tarjimasi o'zi topiladi va so'z lug'atingizga ham qo'shiladi.</p>
        <div className="lw-actions">
          <Button variant="outline" onClick={onClose}>Yopish</Button>
          <Button onClick={submit} loading={busy} disabled={!text.trim()}>Qo'shish</Button>
        </div>
      </div>
    </Modal>
  );
}
