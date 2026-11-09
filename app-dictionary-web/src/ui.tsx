import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { wordsApi } from './api';
import { speakEnglish } from './util';

export function Spinner({ center = true }: { center?: boolean }) {
  return (
    <div className={center ? 'spinner-wrap' : undefined}>
      <div className="spinner" role="status" aria-label="Yuklanmoqda" />
    </div>
  );
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`card ${onClick ? 'clickable' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  loading?: boolean;
  block?: boolean;
};

export function Button({ variant = 'primary', loading, block, children, disabled, className = '', ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${block ? 'btn-block' : ''} ${className}`}
    >
      {loading ? <span className="spinner small" /> : children}
    </button>
  );
}

export function Field({ label, error, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input {...rest} className="input" />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children, wide, className = '' }: { title?: string; onClose: () => void; children: ReactNode; wide?: boolean; className?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // The page behind must not scroll while the dialog is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Rendered straight into <body>: a transformed/animated ancestor would otherwise become the
  // containing block of the fixed backdrop and push the dialog to the middle of a long page.
  return createPortal(
    <div className="backdrop" onMouseDown={onClose}>
      <div className={`modal ${wide ? 'wide' : ''} ${className}`} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
}

export function Confirm({
  title,
  text,
  confirmLabel,
  danger,
  loading,
  onConfirm,
  onCancel,
}: {
  title: string;
  text: string;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="muted">{text}</p>
      <div className="row end gap">
        <Button variant="outline" onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function Notice({ kind = 'error', children }: { kind?: 'error' | 'ok' | 'info'; children: ReactNode }) {
  return <div className={`notice notice-${kind}`}>{children}</div>;
}

export function ProgressBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} />
    </div>
  );
}

export function PageHeader({ title, back, right }: { title: string; back?: () => void; right?: ReactNode }) {
  return (
    <div className="page-header">
      {back && (
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          ←
        </button>
      )}
      <h1>{title}</h1>
      <div className="grow" />
      {right}
    </div>
  );
}

export function SpeakButton({ text, slow }: { text: string; slow?: boolean }) {
  return (
    <button
      type="button"
      className="icon-btn"
      title={slow ? "Sekin o'qish" : "Talaffuzni eshitish"}
      aria-label="Talaffuz"
      onClick={(e) => {
        e.stopPropagation();
        speakEnglish(text, slow);
      }}
    >
      {slow ? '🐢' : '🔊'}
    </button>
  );
}

// Image data is fetched once per (word, version) and kept for the session.
const imageCache = new Map<string, string | null>();

export function WordImage({ wordId, version, className = '' }: { wordId: number; version: number | null; className?: string }) {
  const key = `${wordId}:${version}`;
  const [src, setSrc] = useState<string | null | undefined>(version == null ? null : imageCache.get(key));

  useEffect(() => {
    if (version == null) {
      setSrc(null);
      return;
    }
    if (imageCache.has(key)) {
      setSrc(imageCache.get(key));
      return;
    }
    let alive = true;
    wordsApi
      .getImage(wordId)
      .then((p) => {
        const url = `data:${p.contentType};base64,${p.data}`;
        imageCache.set(key, url);
        if (alive) setSrc(url);
      })
      .catch(() => {
        if (alive) setSrc(null);
      });
    return () => {
      alive = false;
    };
  }, [key, wordId, version]);

  if (!src) return null;
  return <img className={`word-image ${className}`} src={src} alt="" />;
}
