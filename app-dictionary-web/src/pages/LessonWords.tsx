import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { wordsApi, type Word } from '../api';
import { speakEnglish } from '../util';
import { WordForm } from './Words';

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
 * Side window of a lesson: shows the words added during this lesson (with translation) and opens the same "new word"
 * dialog as the dictionary page to add more.
 */
export function LessonWordsDock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [existing, setExisting] = useState<Word[]>([]);
  const [words, setWords] = useState<LessonWord[]>(() => load(code));

  useEffect(() => {
    setWords(load(code));
  }, [code]);

  // The dictionary is needed only to warn about duplicates, so it is loaded when the dialog opens.
  useEffect(() => {
    if (adding) wordsApi.list().then(setExisting).catch(() => setExisting([]));
  }, [adding]);

  const update = (next: LessonWord[]) => {
    setWords(next);
    save(code, next);
  };

  // Rendered into <body>: a transformed page ancestor would otherwise become the containing block of the fixed tab and panel.
  return createPortal(
    <>
      <button className={`lw-tab${open ? ' on' : ''}`} onClick={() => setOpen(true)} aria-expanded={open} aria-label="So'zlar oynasi">
        <span>📖</span>
        <b>So'zlar</b>
        {words.length > 0 && <i>{words.length}</i>}
      </button>
      {open && (
        <aside className="lw-panel" aria-label="Darsdagi so'zlar">
          <header>
            <span className="lw-badge" aria-hidden="true">📖</span>
            <div>
              <b>Darsdagi so'zlar</b>
              <small>{words.length > 0 ? `${words.length} ta so'z qo'shildi` : "Hali so'z qo'shilmagan"}</small>
            </div>
            <button className="lw-close" onClick={() => setOpen(false)} aria-label="Yopish">✕</button>
          </header>
          <div className="lw-body">
            <button className="lw-add" onClick={() => setAdding(true)}>＋ So'z qo'shish</button>
            {words.length === 0 ? (
              <div className="lw-empty">
                <span aria-hidden="true">✨</span>
                <b>Noma'lum so'z uchradimi?</b>
                <p>Uni shu yerdan qo'shing: lug'atingizga tushadi va tarjimasi shu yerda ko'rinib turadi.</p>
              </div>
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
          </div>
        </aside>
      )}
      {adding && (
        <WordForm
          word={null}
          existing={existing}
          onClose={() => setAdding(false)}
          onSaved={(w) => {
            update([...words.filter((x) => x.english.toLowerCase() !== w.english.toLowerCase()), { english: w.english, uzbek: w.uzbek }]);
            setAdding(false);
            setOpen(true);
          }}
        />
      )}
    </>,
    document.body
  );
}
