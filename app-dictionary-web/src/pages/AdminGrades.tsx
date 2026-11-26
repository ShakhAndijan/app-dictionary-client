import { useEffect, useState } from 'react';
import { adminApi, AdminGrade, errorMessage } from '../api';
import { Spinner } from '../ui';
import { AREAS } from './Activity';

const AREA_OF = { WORDS: AREAS[0], ENGLISH: AREAS[1], DEV: AREAS[2] };
const PART_LABEL: Record<string, string> = {
  READING: "O'qish", LISTENING: 'Eshitish', WRITING: 'Yozish', GRAMMAR: 'Grammatika', SPEAKING: 'Gapirish',
  internet: 'Internet', html: 'HTML', css: 'CSS', javascript: 'JavaScript', git: 'Git', npm: 'Paket menejerlar',
  TYPED: 'Yozma', CHOICE: 'Tanlov', FLASHCARD: 'Flesh-karta', MATCHING: 'Juftlash', SPEED: 'Tez raund',
};
const KIND_LABEL: Record<AdminGrade['kind'], string> = { LESSON: 'Dars', EXAM: 'Imtihon', QUIZ: "So'z testi" };

const when = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Every mark of one learner, filtered by direction. */
export function Grades({ userId }: { userId: number }) {
  const [list, setList] = useState<AdminGrade[] | null>(null);
  const [error, setError] = useState('');
  const [area, setArea] = useState<AdminGrade['area'] | 'ALL'>('ALL');

  useEffect(() => {
    adminApi.userGrades(userId).then(setList).catch((e) => setError(errorMessage(e, "Baholarni yuklab bo'lmadi")));
  }, [userId]);

  if (!list) return error ? <div className="notice notice-error">{error}</div> : <Spinner />;

  const average = (rows: AdminGrade[]) => {
    const total = rows.reduce((n, g) => n + g.total, 0);
    return total ? `${Math.round((rows.reduce((n, g) => n + g.correct, 0) / total) * 100)}%` : '—';
  };
  const filters: { key: AdminGrade['area'] | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'Hammasi' },
    ...(Object.keys(AREA_OF) as AdminGrade['area'][]).map((key) => ({ key, label: AREA_OF[key].label })),
  ];
  const shown = area === 'ALL' ? list : list.filter((g) => g.area === area);

  return (
    <div className="ad-grades">
      <div className="ad-grade-filters" role="group" aria-label="Yo'nalish">
        {filters.map((f) => {
          const rows = f.key === 'ALL' ? list : list.filter((g) => g.area === f.key);
          return (
            <button key={f.key} className={area === f.key ? 'on' : ''} aria-pressed={area === f.key} onClick={() => setArea(f.key)}>
              {f.label}
              <em>{rows.length} ta, o'rtacha {average(rows)}</em>
            </button>
          );
        })}
      </div>

      <section className="b ad-card">
        {shown.length === 0 ? (
          <div className="muted center" style={{ padding: 24 }}>Hali baho yo'q.</div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Yo'nalish</th><th>Nima</th><th className="num">To'g'ri</th><th className="num">Baho</th><th>Natija</th><th>Qachon</th></tr></thead>
              <tbody>
                {shown.map((g, i) => (
                  <tr key={`${g.at}-${i}`}>
                    <td><span className={`ad-grade-area ${AREA_OF[g.area].key}`}><i />{AREA_OF[g.area].label}</span></td>
                    <td>
                      <span className="ad-name">{g.title ?? (g.kind === 'EXAM' ? `${g.level} imtihoni` : KIND_LABEL[g.kind])}</span>
                      <span className="muted ad-sub">
                        {[KIND_LABEL[g.kind], g.level, g.part && (PART_LABEL[g.part] ?? g.part)].filter(Boolean).join(', ')}
                      </span>
                    </td>
                    <td className="num">{g.correct} / {g.total}</td>
                    <td className="num"><b>{g.percent}%</b></td>
                    <td><span className={`ad-res ${g.passed ? 'ok' : 'bad'}`}>{g.passed ? "✓ O'tdi" : "✗ O'tmadi"}</span></td>
                    <td className="muted">{when(g.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
