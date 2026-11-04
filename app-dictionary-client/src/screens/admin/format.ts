export function day(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function ago(iso: string | null | undefined): string {
  if (!iso) return '—';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'hozir';
  if (s < 3600) return `${Math.floor(s / 60)} daq oldin`;
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} kun oldin`;
  return day(iso);
}

export const nf = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const FORMAT_LABEL: Record<string, string> = {
  TYPED: 'Yozma',
  CHOICE: 'Tanlov',
  LISTENING: 'Eshitish',
  FLASHCARD: 'Flesh-karta',
};

export const ACTION_LABEL: Record<string, string> = {
  RENAME: "ismini o'zgartirdi",
  BLOCK: 'bloklandi',
  UNBLOCK: 'blokdan chiqarildi',
  GRANT_ADMIN: 'admin qilindi',
  REVOKE_ADMIN: 'adminlikdan olindi',
  DELETE_USER: "o'chirildi",
  ANNOUNCE: "e'lon yubordi",
  ANNOUNCE_DELETE: "e'lonni o'chirdi",
};
