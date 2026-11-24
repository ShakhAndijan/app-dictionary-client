import { useMemo, useState } from 'react';
import { DevLab, devApi, errorMessage } from '../api';
import { Button, Card, Notice } from '../ui';
import { LabRun, labProgram, runLab } from './devLab';

/** Coding labs of a lesson: write JavaScript, run it against the tests, see which pass. */
export function DevLabs({ lessonCode, title, labs, doneIds, onBack }: {
  lessonCode: string;
  title: string;
  labs: DevLab[];
  doneIds: string[];
  onBack: () => void;
}) {
  const [index, setIndex] = useState(() => {
    const first = labs.findIndex((l) => !doneIds.includes(l.id));
    return first < 0 ? 0 : first;
  });
  const [done, setDone] = useState<Set<string>>(() => new Set(doneIds));
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [runs, setRuns] = useState<Record<string, LabRun>>({});
  const [running, setRunning] = useState(false);
  const [hints, setHints] = useState<Set<string>>(new Set());
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const lab = labs[index];
  const code = codes[lab.id] ?? lab.starter ?? '';
  const run = runs[lab.id];
  const passedCount = run ? run.tests.filter((t) => t.ok).length : 0;
  const allPassed = !!run && !run.error && run.tests.length === lab.tests.length && passedCount === run.tests.length;
  const isDone = done.has(lab.id);
  const isGit = lab.kind === 'git';
  const doneCount = useMemo(() => labs.filter((l) => done.has(l.id)).length, [labs, done]);

  const setCode = (value: string) => setCodes((p) => ({ ...p, [lab.id]: value }));

  const execute = async () => {
    if (running) return;
    setRunning(true);
    setError('');
    const result = await runLab(labProgram(lab, code), lab.tests);
    setRuns((p) => ({ ...p, [lab.id]: result }));
    setRunning(false);
    const ok = !result.error && result.tests.length === lab.tests.length && result.tests.every((t) => t.ok);
    if (ok && !done.has(lab.id)) {
      try {
        await devApi.labDone(lessonCode, lab.id);
        setDone((p) => new Set(p).add(lab.id));
      } catch (e) {
        setError(errorMessage(e, "Natijani saqlab bo'lmadi"));
      }
    }
  };

  const showSolution = async () => {
    if (solutions[lab.id]) return;
    try {
      const s = await devApi.labSolution(lessonCode, lab.id);
      setSolutions((p) => ({ ...p, [lab.id]: s.solution }));
    } catch (e) {
      setError(errorMessage(e, "Yechimni yuklab bo'lmadi"));
    }
  };

  const go = (i: number) => {
    setIndex(i);
    setError('');
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      const next = code.slice(0, s) + '  ' + code.slice(el.selectionEnd);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void execute();
    }
  };

  return (
    <div className="dv dv-lab">
      <header className="qx-top">
        <button className="gp-back" onClick={onBack} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>🧪 Laboratoriya</small>
          <b>{title}</b>
        </div>
        <div className="qx-pills"><span className="qx-pill">{doneCount} / {labs.length}</span></div>
      </header>

      <div className="dl-chips">
        {labs.map((l, i) => (
          <button key={l.id} className={`dl-chip ${i === index ? 'on' : ''} ${done.has(l.id) ? 'ok' : ''}`} onClick={() => go(i)}>
            {done.has(l.id) ? '✓' : i + 1}
          </button>
        ))}
      </div>

      {error && <Notice>{error}</Notice>}

      <Card className="dl-task">
        <span className="dl-no">Topshiriq {index + 1} / {labs.length}{isDone ? ' · bajarilgan ✓' : ''}</span>
        <h3>{lab.title}</h3>
        <p>{lab.task}</p>
      </Card>

      <div className="dl-editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label={isGit ? 'Git buyruqlari' : 'JavaScript kodi'}
          placeholder={isGit ? 'Har qatorga bitta buyruq yozing, masalan: git add .' : undefined}
          rows={Math.min(22, Math.max(9, code.split('\n').length + 2))}
        />
        <div className="dl-bar">
          <Button onClick={execute} disabled={running}>{running ? 'Ishlayapti…' : '▶ Tekshirish'}</Button>
          <button className="dl-link" onClick={() => setCode(lab.starter ?? '')}>Boshiga qaytarish</button>
          {lab.hint && <button className="dl-link" onClick={() => setHints((p) => new Set(p).add(lab.id))}>💡 Maslahat</button>}
          <button className="dl-link" onClick={showSolution}>Yechimni ko'rish</button>
          <span className="dl-key">Ctrl + Enter</span>
        </div>
      </div>

      {hints.has(lab.id) && lab.hint && <div className="dl-hint">💡 {lab.hint}</div>}

      {run?.error && <div className="dl-error">⚠ {run.error}</div>}

      {run && !run.error && (
        <Card className={`dl-results ${allPassed ? 'good' : ''}`}>
          <div className="dl-verdict">
            {allPassed ? `✅ To'g'ri! Barcha ${run.tests.length} ta test o'tdi` : `❌ ${passedCount} / ${run.tests.length} ta test o'tdi. Davom eting!`}
          </div>
          <ul>
            {run.tests.map((t, i) => (
              <li key={i} className={t.ok ? 'ok' : 'bad'}>
                <span className="dl-mark">{t.ok ? '✓' : '✗'}</span>
                <div>
                  <code>{lab.tests[i].call}</code>
                  {!t.ok && (
                    <small>
                      kutilgan: <b>{t.expected}</b><br />
                      {t.error ? <>xato: <b>{t.error}</b></> : <>sizniki: <b>{t.got}</b></>}
                    </small>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {run.logs.length > 0 && <pre className="dl-logs">{run.logs.join('\n')}</pre>}
        </Card>
      )}

      {solutions[lab.id] && (
        <Card className="dl-solution">
          <b>Namunaviy yechim</b>
          <pre>{solutions[lab.id]}</pre>
        </Card>
      )}

      <div className="dl-nav">
        <Button variant="ghost" onClick={() => go(index - 1)} disabled={index === 0}>← Oldingi</Button>
        {index + 1 < labs.length ? (
          <Button onClick={() => go(index + 1)} disabled={!isDone && !allPassed}>Keyingisi →</Button>
        ) : (
          <Button onClick={onBack}>{doneCount === labs.length ? 'Yakunlash 🏆' : 'Darsga qaytish'}</Button>
        )}
      </div>
    </div>
  );
}
