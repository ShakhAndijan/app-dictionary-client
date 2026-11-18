import { ClipboardEvent, DragEvent, Fragment, KeyboardEvent, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { adminApi, AdminNote, API_BASE_URL, errorMessage } from '../api';
import { Confirm, Spinner } from '../ui';

const PAGE = 40;

function size(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(new Date()) - start(d)) / 86400000);
  if (diff === 0) return 'Bugun';
  if (diff === 1) return 'Kecha';
  return d.toLocaleDateString('en-GB').split('/').join('.');
}

/** Turns plain URLs in a message into links. */
function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s<]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer noopener">{part}</a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

const src = (n: AdminNote) => `${API_BASE_URL}${n.fileUrl}`;

/** A chat with nobody else in it: the admin saves text, photos, videos and files for themselves. */
export function AdminNotesPage() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [editing, setEditing] = useState<AdminNote | null>(null);
  const [editText, setEditText] = useState('');
  const [deleting, setDeleting] = useState<AdminNote | null>(null);
  const [zoom, setZoom] = useState<AdminNote | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pickRef = useRef<HTMLInputElement>(null);
  const stick = useRef(true);

  const preview = useMemo(() => (file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  useEffect(() => {
    adminApi.notes(undefined, PAGE)
      .then((list) => { setNotes([...list].reverse()); setMore(list.length === PAGE); })
      .catch((e) => setError(errorMessage(e, "Xabarlarni yuklab bo'lmadi")))
      .finally(() => setLoading(false));
  }, []);

  // Stay glued to the newest message unless the admin scrolled up to read older ones.
  useLayoutEffect(() => {
    if (stick.current) endRef.current?.scrollIntoView({ block: 'end' });
  }, [notes, loading]);

  const loadOlder = async () => {
    if (!notes.length || loadingMore) return;
    const feed = feedRef.current;
    const before = feed ? feed.scrollHeight - feed.scrollTop : 0;
    setLoadingMore(true);
    stick.current = false;
    try {
      const list = await adminApi.notes(notes[0].id, PAGE);
      setNotes((prev) => [...[...list].reverse(), ...prev]);
      setMore(list.length === PAGE);
      requestAnimationFrame(() => { if (feed) feed.scrollTop = feed.scrollHeight - before; });
    } catch (e) {
      setError(errorMessage(e, "Eski xabarlarni yuklab bo'lmadi"));
    } finally {
      setLoadingMore(false);
    }
  };

  const onScroll = () => {
    const f = feedRef.current;
    if (f) stick.current = f.scrollHeight - f.scrollTop - f.clientHeight < 120;
  };

  const autosize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, []);
  useEffect(autosize, [text, autosize]);

  const pick = (f: File | null | undefined) => {
    if (!f) return;
    setFile(f);
    inputRef.current?.focus();
  };

  const send = async () => {
    const body = text.trim();
    if ((!body && !file) || sending) return;
    setSending(true);
    setProgress(0);
    setError('');
    try {
      const made = await adminApi.addNote(body, file, setProgress);
      stick.current = true;
      setNotes((prev) => [...prev, made]);
      setText('');
      setFile(null);
    } catch (e) {
      setError(errorMessage(e, "Yuborib bo'lmadi"));
    } finally {
      setSending(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send();
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    const item = [...e.clipboardData.files][0];
    if (item) {
      e.preventDefault();
      pick(item);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const updated = await adminApi.editNote(editing.id, editText);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditing(null);
    } catch (e) {
      setError(errorMessage(e, "Saqlab bo'lmadi"));
    }
  };

  const remove = async () => {
    if (!deleting) return;
    try {
      await adminApi.deleteNote(deleting.id);
      setNotes((prev) => prev.filter((n) => n.id !== deleting.id));
      setDeleting(null);
    } catch (e) {
      setError(errorMessage(e, "O'chirib bo'lmadi"));
      setDeleting(null);
    }
  };

  const copy = (n: AdminNote) => { if (n.text) void navigator.clipboard?.writeText(n.text); };

  return (
    <div
      className={`sv ${dragging ? 'drag' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setDragging(false); }}
      onDrop={onDrop}
    >
      <header className="sv-head">
        <span className="sv-ava" aria-hidden>★</span>
        <div>
          <h1>Saqlangan xabarlar</h1>
          <p>Faqat siz ko'rasiz: matn, rasm, video va fayllarni shu yerga tashlab qo'ying</p>
        </div>
      </header>

      <div className="sv-feed" ref={feedRef} onScroll={onScroll}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {more && (
              <button type="button" className="sv-older" onClick={loadOlder} disabled={loadingMore}>
                {loadingMore ? 'Yuklanmoqda…' : 'Eskiroq xabarlar'}
              </button>
            )}
            {notes.length === 0 && (
              <div className="sv-empty">
                <span aria-hidden>📌</span>
                <strong>Hali hech narsa yo'q</strong>
                <p>Eslatma yozing, rasm yoki video tashlang. Hammasi shu yerda, faqat sizda saqlanadi.</p>
              </div>
            )}
            {notes.map((n, i) => (
              <Fragment key={n.id}>
                {(i === 0 || dayLabel(notes[i - 1].createdAt) !== dayLabel(n.createdAt)) && (
                  <div className="sv-day"><span>{dayLabel(n.createdAt)}</span></div>
                )}
                <article className="sv-msg">
                  <div className="sv-bubble">
                    {n.kind === 'IMAGE' && n.fileUrl && (
                      <button type="button" className="sv-img" onClick={() => setZoom(n)} aria-label="Rasmni ochish">
                        <img src={src(n)} alt={n.fileName ?? 'rasm'} loading="lazy" />
                      </button>
                    )}
                    {n.kind === 'VIDEO' && n.fileUrl && (
                      <video className="sv-video" src={src(n)} controls preload="metadata" playsInline />
                    )}
                    {n.kind === 'FILE' && n.fileUrl && (
                      <a className="sv-file" href={`${src(n)}&download=true`} download={n.fileName ?? undefined}>
                        <span className="sv-file-ico" aria-hidden>📄</span>
                        <span>
                          <b>{n.fileName}</b>
                          <small>{size(n.fileSize)}</small>
                        </span>
                      </a>
                    )}
                    {editing?.id === n.id ? (
                      <div className="sv-edit">
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} autoFocus />
                        <div>
                          <button type="button" onClick={() => setEditing(null)}>Bekor</button>
                          <button type="button" className="ok" onClick={saveEdit}>Saqlash</button>
                        </div>
                      </div>
                    ) : (
                      n.text && <p className="sv-text">{linkify(n.text)}</p>
                    )}
                    <footer>
                      {n.kind !== 'NONE' && n.kind !== 'FILE' && n.fileSize ? <span>{size(n.fileSize)}</span> : null}
                      {n.editedAt && <span>tahrirlangan</span>}
                      <time>{clock(n.createdAt)}</time>
                    </footer>
                  </div>
                  <div className="sv-acts">
                    {n.text && <button type="button" onClick={() => copy(n)} title="Nusxa olish">⧉</button>}
                    <button type="button" onClick={() => { setEditing(n); setEditText(n.text ?? ''); }} title="Tahrirlash">✎</button>
                    {n.kind !== 'NONE' && n.fileUrl && <a href={`${src(n)}&download=true`} download={n.fileName ?? undefined} title="Yuklab olish">⭳</a>}
                    <button type="button" className="del" onClick={() => setDeleting(n)} title="O'chirish">🗑</button>
                  </div>
                </article>
              </Fragment>
            ))}
            <div ref={endRef} />
          </>
        )}
      </div>

      {error && <div className="sv-error" role="alert">{error}<button type="button" onClick={() => setError('')} aria-label="Yopish">×</button></div>}

      {file && (
        <div className="sv-attach">
          {preview ? <img src={preview} alt="" /> : <span className="sv-file-ico" aria-hidden>{file.type.startsWith('video/') ? '🎬' : '📄'}</span>}
          <div>
            <b>{file.name}</b>
            <small>{size(file.size)}{sending ? ` · yuklanmoqda ${progress}%` : ''}</small>
            {sending && <i className="sv-bar"><u style={{ width: `${progress}%` }} /></i>}
          </div>
          {!sending && <button type="button" onClick={() => setFile(null)} aria-label="Olib tashlash">×</button>}
        </div>
      )}

      <div className="sv-composer">
        <input ref={pickRef} type="file" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
        <button type="button" className="sv-clip" onClick={() => pickRef.current?.click()} disabled={sending} title="Rasm, video yoki fayl biriktirish" aria-label="Fayl biriktirish">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5l-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l9-9a3.7 3.7 0 0 1 5.2 5.2l-9 9a1.8 1.8 0 0 1-2.6-2.6l8.2-8.2" /></svg>
        </button>
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          placeholder="Xabar yozing…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          onPaste={onPaste}
          disabled={sending}
          maxLength={8000}
        />
        <button type="button" className="sv-send" onClick={send} disabled={sending || (!text.trim() && !file)} aria-label="Yuborish">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.5-8.4L3.4 3.6 3.3 10l12 2-12 2z" /></svg>
        </button>
      </div>

      {dragging && <div className="sv-drop">Faylni shu yerga tashlang</div>}

      {zoom && zoom.fileUrl && (
        <div className="sv-zoom" role="dialog" aria-modal onClick={() => setZoom(null)}>
          <img src={src(zoom)} alt={zoom.fileName ?? ''} />
          <button type="button" aria-label="Yopish">×</button>
        </div>
      )}

      {deleting && (
        <Confirm
          title="Xabarni o'chirish"
          text={deleting.kind !== 'NONE' ? "Xabar va biriktirilgan fayl butunlay o'chadi. Bu amalni qaytarib bo'lmaydi." : "Xabar butunlay o'chadi. Bu amalni qaytarib bo'lmaydi."}
          confirmLabel="O'chirish"
          danger
          onConfirm={remove}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
