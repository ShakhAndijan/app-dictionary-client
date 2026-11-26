import { useMemo, useState } from 'react';
import { DevLab, devApi, errorMessage } from '../api';
import { Button, Notice } from '../ui';
import { LabRun, labProgram, runLab } from './devLab';
import { cssDocument, runCssLab } from './cssLab';
import { reactDocument, runReactLab } from './reactLab';
import { completeCss, htmlSelectors } from './cssComplete';
import { BrowserPreview, CodeEditor, TaskText, highlight } from './labViews';

/** Coding labs of a lesson: write the code (JavaScript, CSS or terminal commands), run it against the tests. */
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
  const isShell = lab.kind === 'git' || lab.kind === 'npm';
  const isCss = lab.kind === 'css';
  const isReact = lab.kind === 'react';
  const doneCount = useMemo(() => labs.filter((l) => done.has(l.id)).length, [labs, done]);
  const lang = isCss ? 'css' : 'plain';
  const fileName = isCss ? 'style.css' : isShell ? 'terminal' : isReact ? 'App.jsx' : 'script.js';
  /** the page without the lab's own scaffold styles, as the learner reads it */
  const html = isCss ? (lab.setup ?? '').replace(/<style>[\s\S]*?<\/style>\n?/g, '').trim() : '';
  const selectors = htmlSelectors(html);
  /** widths the tests resize to, so the learner can look at the same ones */
  const widths = useMemo(() => {
    const asked = lab.tests.flatMap((t) => [...t.call.matchAll(/\bat\((\d+)\)/g)].map((m) => Number(m[1])));
    return [...new Set([600, ...asked])].sort((a, b) => a - b);
  }, [lab]);

  const setCode = (value: string) => setCodes((p) => ({ ...p, [lab.id]: value }));

  const execute = async () => {
    if (running) return;
    setRunning(true);
    setError('');
    const result = isCss ? await runCssLab(lab.setup ?? '', code, lab.tests)
      : isReact ? await runReactLab(lab.setup ?? '', code, lab.tests)
        : await runLab(labProgram(lab, code), lab.tests);
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
    if (e.key === 'Tab' && !e.shiftKey) {
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
    <div className={`dv dv-lab ${isCss ? 'dv-lab-wide' : ''}`}>
      <header className="qx-top">
        <button className="gp-back" onClick={onBack} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>Laboratoriya</small>
          <b>{title}</b>
        </div>
        <div className="qx-pills"><span className={`qx-pill ${doneCount === labs.length ? 'ok' : ''}`}>{doneCount} / {labs.length}</span></div>
      </header>

      <nav className="dl-steps" aria-label="Topshiriqlar">
        {labs.map((l, i) => (
          <button
            key={l.id}
            className={`${i === index ? 'on' : ''} ${done.has(l.id) ? 'ok' : ''}`}
            aria-current={i === index ? 'step' : undefined}
            aria-label={`${i + 1}-topshiriq${done.has(l.id) ? ', bajarilgan' : ''}`}
            onClick={() => go(i)}
          >
            {done.has(l.id) ? '✓' : i + 1}
          </button>
        ))}
      </nav>

      {error && <Notice>{error}</Notice>}

      <section className={`dl-task ${isDone ? 'ok' : ''}`}>
        <span className="dl-no" aria-hidden="true">{isDone ? '✓' : index + 1}</span>
        <div>
          <h3>{lab.title}</h3>
          {isCss || isReact ? <TaskText text={lab.task} /> : <p>{lab.task}</p>}
        </div>
      </section>

      <div className={`dl-bench ${isCss ? 'split' : ''}`}>
        <div className="dl-col">
          <section className="dl-win dl-editor">
            <header className="dl-winbar">
              <span className="dl-dots" aria-hidden="true"><i /><i /><i /></span>
              <b>{fileName}</b>
              <button className="dl-tool" onClick={() => setCode(lab.starter ?? '')}>Boshiga qaytarish</button>
            </header>
            <CodeEditor
              key={lab.id}
              complete={isCss ? (text, caret, forced) => completeCss(text, caret, selectors, forced) : undefined}
              value={code}
              lang={lang}
              label={isShell ? 'Terminal buyruqlari' : isCss ? 'CSS kodi' : isReact ? 'React (JSX) kodi' : 'JavaScript kodi'}
              placeholder={isShell ? `Har qatorga bitta buyruq yozing, masalan: ${lab.kind === 'git' ? 'git add .' : 'npm install dayjs'}` : undefined}
              onChange={setCode}
              onKeyDown={onKey}
            />
            <footer className="dl-bar">
              <Button onClick={execute} disabled={running}>{running ? 'Tekshirilyapti…' : '▶ Tekshirish'}</Button>
              <kbd>Ctrl + Enter</kbd>
              {lab.hint && <button className="dl-tool push" onClick={() => setHints((p) => new Set(p).add(lab.id))}>💡 Maslahat</button>}
              <button className={`dl-tool ${lab.hint ? '' : 'push'}`} onClick={showSolution}>Yechimni ko'rish</button>
            </footer>
          </section>

          {hints.has(lab.id) && lab.hint && <div className="dl-hint">💡 {lab.hint}</div>}

          <div aria-live="polite">
            {running && isReact && <p className="muted">React ishga tushyapti…</p>}
            {run?.preview && (
              <section className="dl-win dl-react">
                <header className="dl-winbar"><span className="dl-dots" aria-hidden="true"><i /><i /><i /></span><b>Natija (boshlang'ich holat)</b></header>
                <iframe title="Natija" sandbox="" srcDoc={reactDocument(run.preview)} />
              </section>
            )}

            {run?.error && <div className="dl-error">⚠ {run.error}</div>}

            {run && !run.error && (
              <section className={`dl-results ${allPassed ? 'good' : ''}`}>
                <div className="dl-verdict">
                  <b>{allPassed ? "To'g'ri! Barcha testlar o'tdi" : 'Hali tayyor emas, davom eting'}</b>
                  <span>{passedCount} / {run.tests.length}</span>
                </div>
                <div className="dl-meter" aria-hidden="true">
                  {run.tests.map((t, i) => <i key={i} className={t.ok ? 'ok' : ''} />)}
                </div>
                <ul>
                  {run.tests.map((t, i) => (
                    <li key={i} className={t.ok ? 'ok' : 'bad'}>
                      <span className="dl-mark">{t.ok ? '✓' : '✗'}</span>
                      <div>
                        <code>{lab.tests[i].call}</code>
                        {!t.ok && (
                          <dl>
                            <dt>kutilgan</dt><dd>{t.expected}</dd>
                            <dt>{t.error ? 'xato' : 'sizniki'}</dt><dd className="got">{t.error || t.got}</dd>
                          </dl>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {run.logs.length > 0 && <pre className="dl-logs">{run.logs.join('\n')}</pre>}
              </section>
            )}
          </div>

          {solutions[lab.id] && (
            <section className="dl-win dl-solution">
              <header className="dl-winbar"><b>Namunaviy yechim</b></header>
              <pre>{highlight(solutions[lab.id], lang)}</pre>
            </section>
          )}
        </div>

        {isCss && (
          <div className="dl-col dl-side">
            <BrowserPreview key={lab.id} doc={cssDocument(lab.setup ?? '', code)} widths={widths} />
            <section className="dl-win dl-html">
              <header className="dl-winbar"><b>index.html</b><span className="dl-size">o'zgarmaydi</span></header>
              <pre>{highlight(html, 'html')}</pre>
            </section>
          </div>
        )}
      </div>

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
