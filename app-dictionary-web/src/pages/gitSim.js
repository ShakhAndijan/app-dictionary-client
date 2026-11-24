// A small in-memory Git simulator for the Frontend course "Git va GitHub" labs. It is plain JavaScript source that is
// prepended to the learner's text (see DevLabs.tsx / devLab.ts and content/lab-check.cjs), so it must stay self-contained
// and must not use import/export. Usage: const repo = gitRun(setupScript, learnerScript);
// The scripts are lines of shell/git commands; `echo "text" > file`, `touch`, `rm`, `mv` edit the working tree.
// Supported git: init add rm mv commit status diff log show branch checkout switch restore reset revert merge rebase
// cherry-pick stash tag remote push pull fetch reflog (HEAD@{n}), .gitignore. Anything else is reported as an error.
function gitRun(setup, script) {
  const S = {
    inited: false, objs: {}, n: 0, branches: {}, head: 'main', detached: null, work: {}, index: {}, tags: {},
    stash: [], remotes: {}, pushed: {}, pending: null, rebase: null, errors: [], reflog: [], cmds: 0,
  };
  let silent = true;
  const say = (l) => { if (!silent) console.log(l); };
  const fail = (m) => { S.errors.push(m); say('✗ ' + m); return false; };
  const copy = (o) => Object.assign({}, o);
  const keys = (o) => Object.keys(o).sort();
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-7); };
  const headId = () => (S.detached || S.branches[S.head] || null);
  const treeOf = (id) => (id ? S.objs[id].tree : {});
  const setHead = (id) => { if (S.detached || S.rebase) S.detached = id; else S.branches[S.head] = id; S.reflog.unshift(id); };
  const mkCommit = (msg, parents, tree) => {
    S.n += 1;
    const id = hash(S.n + '|' + msg + '|' + parents.join(','));
    S.objs[id] = { id, msg, parents, tree: copy(tree), n: S.n };
    return id;
  };
  const anc = (id) => { const seen = {}; const st = id ? [id] : []; while (st.length) { const x = st.pop(); if (seen[x]) continue; seen[x] = true; S.objs[x].parents.forEach((p) => st.push(p)); } return seen; };
  const isAnc = (a, b) => !!anc(b)[a];
  const mergeBase = (a, b) => { const A = anc(a); const B = anc(b); let best = null; Object.keys(A).forEach((k) => { if (B[k] && (!best || S.objs[k].n > S.objs[best].n)) best = k; }); return best; };
  const union = (...os) => { const m = {}; os.forEach((o) => Object.keys(o).forEach((k) => { m[k] = 1; })); return Object.keys(m).sort(); };

  function resolve(ref) {
    if (!ref) return null;
    let m = /^HEAD@\{(\d+)\}$/.exec(ref);
    if (m) return S.reflog[+m[1]] || null;
    m = /^(.*?)((?:[~^]\d*)*)$/.exec(ref);
    const base = m[1]; const suf = m[2];
    let id = null;
    if (base === 'HEAD' || base === '@') id = headId();
    else if (S.branches[base]) id = S.branches[base];
    else if (S.tags[base]) id = S.tags[base];
    else if (S.pushed[base]) id = S.pushed[base];
    else if (base.length >= 4) { const c = Object.keys(S.objs).filter((k) => k.indexOf(base) === 0); if (c.length === 1) id = c[0]; }
    if (!id) return null;
    const parts = suf.match(/[~^]\d*/g) || [];
    for (const p of parts) {
      const k = p.length > 1 ? +p.slice(1) : 1;
      if (p[0] === '~') { for (let i = 0; i < k && id; i++) id = S.objs[id].parents[0] || null; } else id = S.objs[id].parents[k - 1] || null;
      if (!id) return null;
    }
    return id;
  }

  const ignored = (p) => {
    const g = S.work['.gitignore'];
    if (g === undefined) return false;
    return g.split('\n').some((raw) => {
      const l = raw.trim();
      if (!l || l[0] === '#') return false;
      if (l.slice(-1) === '/') return p.indexOf(l) === 0 || p.indexOf('/' + l) >= 0;
      if (l.indexOf('*') >= 0) return new RegExp('(^|/)' + l.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*') + '$').test(p);
      return p === l || p.indexOf(l + '/') === 0 || p.slice(-(l.length + 1)) === '/' + l;
    });
  };
  const staged = () => { const h = treeOf(headId()); return union(h, S.index).filter((p) => h[p] !== S.index[p]).map((p) => (h[p] === undefined ? 'A ' : S.index[p] === undefined ? 'D ' : 'M ') + p); };
  const changes = () => union(S.index, S.work).filter((p) => S.index[p] !== undefined && S.index[p] !== S.work[p]).map((p) => (S.work[p] === undefined ? 'D ' : 'M ') + p);
  const untracked = () => keys(S.work).filter((p) => S.index[p] === undefined && !ignored(p));
  const dirty = () => staged().length > 0 || changes().length > 0;

  // Applies "their" side onto "our" side (3-way, whole-file). Returns false after reporting when local changes would be lost.
  function threeWay(base, theirs, label, pend) {
    const ours = treeOf(headId());
    const res = {}; const conf = [];
    union(base, ours, theirs).forEach((p) => {
      const b = base[p]; const o = ours[p]; const t = theirs[p];
      if (o === t) res[p] = o; else if (o === b) res[p] = t; else if (t === b) res[p] = o; else { conf.push(p); res[p] = o; }
    });
    const touched = union(ours, res).filter((p) => ours[p] !== res[p]).concat(conf);
    for (const p of touched) {
      if (S.index[p] !== ours[p] || S.work[p] !== ours[p]) { return fail('Your local changes would be overwritten: ' + p + ' (avval commit yoki stash qiling)'); }
    }
    union(ours, res).forEach((p) => { if (ours[p] !== res[p]) { S.index[p] = res[p]; S.work[p] = res[p]; if (res[p] === undefined) { delete S.index[p]; delete S.work[p]; } } });
    conf.forEach((p) => {
      const o = ours[p]; const t = theirs[p];
      if (o !== undefined && t !== undefined) S.work[p] = '<<<<<<< HEAD\n' + o + '\n=======\n' + t + '\n>>>>>>> ' + label;
      if (o === undefined) delete S.index[p];
      say('CONFLICT: ' + p);
    });
    pend.conflicts = conf;
    return pend;
  }
  const newTreeCommit = (msg, parents) => { const id = mkCommit(msg, parents, S.index); setHead(id); return id; };

  function finish(pend, okMsg) {
    S.pending = pend;
    if (pend.conflicts.length) { say('Avtomatik birlashtirib bo\'lmadi. Konfliktni hal qiling, `git add` va keyin `git commit` (rebase da: git rebase --continue).'); return true; }
    if (pend.kind === 'rebase') { return true; }
    const parents = [headId()]; if (pend.kind === 'merge') parents.push(pend.target);
    const id = newTreeCommit(pend.msg, parents); S.pending = null; say(okMsg + ' [' + id + ']'); return true;
  }

  function switchTree(target) {
    const head = treeOf(headId());
    for (const p of union(head, target)) {
      if (head[p] === target[p]) continue;
      if (S.index[p] !== head[p] || S.work[p] !== head[p]) return fail('Your local changes would be overwritten by checkout: ' + p + ' (avval commit yoki stash qiling)');
      if (head[p] === undefined && S.work[p] !== undefined) return fail('Untracked fayl ustiga yozilib ketadi: ' + p);
    }
    union(head, target).forEach((p) => { if (head[p] !== target[p]) { if (target[p] === undefined) { delete S.index[p]; delete S.work[p]; } else { S.index[p] = target[p]; S.work[p] = target[p]; } } });
    return true;
  }
  const nonFlags = (a) => a.filter((x) => x[0] !== '-');
  const hasFlag = (a, ...f) => a.some((x) => f.indexOf(x) >= 0);

  function replay() {
    const R = S.rebase;
    while (R.todo.length) {
      const id = R.todo.shift(); const c = S.objs[id];
      const r = threeWay(treeOf(c.parents[0]), c.tree, c.msg, { kind: 'rebase', msg: c.msg, conflicts: [] });
      if (!r) return false;
      if (r.conflicts.length) { S.pending = r; say('CONFLICT while applying: ' + c.msg); return true; }
      newTreeCommit(c.msg, [headId()]);
    }
    S.branches[R.branch] = headId(); S.head = R.branch; S.detached = null; S.rebase = null; S.pending = null;
    say('Successfully rebased and updated refs/heads/' + R.branch + '.');
    return true;
  }

  function git(a) {
    const cmd = a[0]; const rest = a.slice(1);
    if (cmd === 'init') {
      S.inited = true;
      const bi = rest.findIndex((x) => x === '-b' || x === '--initial-branch');
      if (bi >= 0 && rest[bi + 1]) S.head = rest[bi + 1];
      const eq = rest.find((x) => x.indexOf('--initial-branch=') === 0);
      if (eq) S.head = eq.split('=')[1];
      say('Initialized empty Git repository'); return true;
    }
    if (cmd === '--version' || cmd === 'help' || cmd === 'config' || cmd === 'blame' || cmd === 'reflog' || cmd === 'show' || cmd === 'diff' || cmd === 'log' || cmd === 'status' || cmd === 'ls-files' || cmd === 'cat-file' || cmd === 'rev-parse' || cmd === 'fetch' || cmd === 'pull' || cmd === 'clean' || cmd === 'gc') {
      if (!S.inited && cmd !== '--version' && cmd !== 'help' && cmd !== 'config') return fail('fatal: not a git repository (avval git init)');
    } else if (!S.inited) return fail('fatal: not a git repository (avval git init)');
    const pos = nonFlags(rest);
    switch (cmd) {
      case '--version': case 'help': case 'config': case 'blame': case 'cat-file': case 'rev-parse': case 'gc': return true;
      case 'ls-files': keys(S.index).forEach(say); return true;
      case 'reflog': S.reflog.forEach((id, i) => say('HEAD@{' + i + '} ' + id + ' ' + S.objs[id].msg)); return true;
      case 'show': { const id = resolve(pos[0] || 'HEAD'); if (!id) return fail('bad revision'); say(id + ' ' + S.objs[id].msg); keys(S.objs[id].tree).forEach((p) => say('  ' + p)); return true; }
      case 'diff': { (hasFlag(rest, '--staged', '--cached') ? staged() : changes()).forEach((l) => say(l)); return true; }
      case 'log': { const id = headId(); if (!id) return fail("fatal: your current branch has no commits yet"); Object.keys(anc(id)).sort((x, y) => S.objs[y].n - S.objs[x].n).forEach((k) => say(k + ' ' + S.objs[k].msg)); return true; }
      case 'status': {
        say(S.detached && !S.rebase ? 'HEAD detached at ' + S.detached : 'On branch ' + (S.rebase ? S.rebase.branch : S.head));
        if (S.pending && S.pending.conflicts.length) say('Unmerged paths: ' + S.pending.conflicts.join(', '));
        const s = staged(); if (s.length) { say('Changes to be committed:'); s.forEach((l) => say('  ' + l)); }
        const c = changes(); if (c.length) { say('Changes not staged for commit:'); c.forEach((l) => say('  ' + l)); }
        const u = untracked(); if (u.length) { say('Untracked files:'); u.forEach((l) => say('  ' + l)); }
        if (!s.length && !c.length && !u.length) say('nothing to commit, working tree clean');
        return true;
      }
      case 'add': {
        if (!rest.length) return fail("Nothing specified, nothing added.");
        const all = hasFlag(rest, '-A', '--all', '.') ; const upd = hasFlag(rest, '-u', '--update');
        if (all || upd) {
          keys(S.work).forEach((p) => { if (upd ? S.index[p] !== undefined : !ignored(p)) S.index[p] = S.work[p]; });
          keys(S.index).forEach((p) => { if (S.work[p] === undefined) delete S.index[p]; });
          if (S.pending) S.pending.conflicts = [];
          return true;
        }
        for (const spec of pos) {
          const dir = spec.replace(/\/$/, '') + '/';
          const hit = union(S.work, S.index).filter((p) => p === spec || p.indexOf(dir) === 0);
          if (!hit.length) return fail("fatal: pathspec '" + spec + "' did not match any files");
          if (hit.every((p) => ignored(p) && S.index[p] === undefined)) return fail('The following paths are ignored by one of your .gitignore files: ' + spec);
          hit.forEach((p) => { if (S.work[p] === undefined) delete S.index[p]; else S.index[p] = S.work[p]; if (S.pending) S.pending.conflicts = S.pending.conflicts.filter((x) => x !== p); });
        }
        return true;
      }
      case 'rm': {
        for (const p of pos) { if (S.index[p] === undefined) return fail("fatal: pathspec '" + p + "' did not match any files"); delete S.index[p]; if (!hasFlag(rest, '--cached')) delete S.work[p]; }
        return true;
      }
      case 'mv': {
        const [f, t] = pos; if (S.index[f] === undefined) return fail("fatal: not under version control, source=" + f);
        S.index[t] = S.index[f]; delete S.index[f]; S.work[t] = S.work[f]; delete S.work[f]; return true;
      }
      case 'commit': {
        const msgs = []; let all = false; let amend = false; let empty = false;
        for (let i = 0; i < rest.length; i++) {
          const x = rest[i];
          if (x === '-m' || x === '--message') { msgs.push(rest[++i]); } else if (x.indexOf('--message=') === 0) msgs.push(x.slice(10));
          else if (x === '-am' || x === '-ma') { all = true; msgs.push(rest[++i]); } else if (x === '-a' || x === '--all') all = true;
          else if (x === '--amend') amend = true; else if (x === '--allow-empty') empty = true;
        }
        const msg = msgs.filter((m) => m !== undefined).join('\n\n');
        if (all) { keys(S.index).forEach((p) => { if (S.work[p] === undefined) delete S.index[p]; else S.index[p] = S.work[p]; }); }
        if (S.pending && S.pending.conflicts.length) return fail('error: Committing is not possible because you have unmerged files.');
        const hid = headId();
        if (amend) {
          if (!hid) return fail('You have nothing to amend.');
          const o = S.objs[hid]; const id = mkCommit(msg || o.msg, o.parents, S.index); setHead(id); say('[' + id + '] ' + (msg || o.msg)); return true;
        }
        const pend = S.pending;
        if (!pend && !empty && !staged().length) return fail(changes().length || untracked().length ? 'no changes added to commit (avval git add)' : 'nothing to commit, working tree clean');
        if (!msg && !pend) return fail('Aborting commit due to empty commit message (-m "xabar" yozing).');
        const parents = hid ? [hid] : []; if (pend && pend.kind === 'merge') parents.push(pend.target);
        const m = msg || pend.msg; const id = newTreeCommit(m, parents); S.pending = null;
        say('[' + S.head + ' ' + id + '] ' + m); return true;
      }
      case 'branch': {
        if (hasFlag(rest, '-d', '-D', '--delete')) {
          for (const b of pos) {
            if (!S.branches[b]) return fail("error: branch '" + b + "' not found.");
            if (b === S.head && !S.detached) return fail("error: Cannot delete branch '" + b + "' checked out");
            if (!hasFlag(rest, '-D') && !isAnc(S.branches[b], headId())) return fail("error: The branch '" + b + "' is not fully merged. (majburlash: -D)");
            delete S.branches[b];
          }
          return true;
        }
        if (hasFlag(rest, '-m', '-M')) {
          const [o, n] = pos.length > 1 ? pos : [S.head, pos[0]];
          if (!S.branches[o] && o !== S.head) return fail("error: refname " + o + " not found");
          if (S.branches[o]) { S.branches[n] = S.branches[o]; delete S.branches[o]; }
          if (S.head === o) S.head = n; return true;
        }
        if (!pos.length) { keys(S.branches).forEach((b) => say((b === S.head ? '* ' : '  ') + b)); return true; }
        const start = pos[1] ? resolve(pos[1]) : headId();
        if (!start) return fail('fatal: not a valid object name (avval commit qiling)');
        if (S.branches[pos[0]]) return fail("fatal: a branch named '" + pos[0] + "' already exists");
        S.branches[pos[0]] = start; return true;
      }
      case 'checkout': case 'switch': {
        const nb = rest.findIndex((x) => x === '-b' || x === '-B' || x === '-c' || x === '-C' || x === '--create');
        if (nb >= 0) {
          const name = rest[nb + 1]; const start = rest[nb + 2] && rest[nb + 2][0] !== '-' ? resolve(rest[nb + 2]) : headId();
          if (!name) return fail('fatal: branch name required');
          if (S.branches[name] && rest[nb] !== '-B' && rest[nb] !== '-C') return fail("fatal: a branch named '" + name + "' already exists");
          if (!start) { S.head = name; S.detached = null; return true; }
          if (!switchTree(treeOf(start))) return false;
          S.branches[name] = start; S.head = name; S.detached = null; S.reflog.unshift(start); say("Switched to a new branch '" + name + "'"); return true;
        }
        const dd = rest.indexOf('--');
        if (cmd === 'checkout' && (dd >= 0 || (pos.length && !S.branches[pos[0]] && !resolve(pos[0])))) {
          const src = dd > 0 ? resolve(rest[0]) : null; const files = dd >= 0 ? rest.slice(dd + 1) : pos;
          for (const f of files) {
            const from = src ? treeOf(src) : S.index; const targets = f === '.' ? union(S.work, from) : [f];
            for (const p of targets) {
              if (from[p] === undefined && !(f === '.' && S.index[p] === undefined)) { if (f !== '.') return fail("error: pathspec '" + p + "' did not match any file(s) known to git"); }
              if (from[p] === undefined) { if (S.index[p] !== undefined) delete S.work[p]; } else { S.work[p] = from[p]; if (src) S.index[p] = from[p]; }
            }
          }
          return true;
        }
        const t = pos[0];
        if (!t) return fail('fatal: branch name required');
        const id = S.branches[t] ? S.branches[t] : (cmd === 'checkout' ? resolve(t) : null);
        if (!id) return fail("error: pathspec '" + t + "' did not match any branch" + (cmd === 'switch' ? ' (switch faqat branch uchun)' : ''));
        if (S.pending || S.rebase) return fail('error: avval davom etayotgan merge/rebase ni yakunlang yoki bekor qiling');
        if (S.branches[t] === headId() && S.head === t && !S.detached) { say("Already on '" + t + "'"); return true; }
        if (!switchTree(treeOf(id))) return false;
        if (S.branches[t]) { S.head = t; S.detached = null; } else { S.detached = id; }
        S.reflog.unshift(id); say(S.branches[t] ? "Switched to branch '" + t + "'" : 'HEAD is now at ' + id); return true;
      }
      case 'restore': {
        const st = hasFlag(rest, '--staged', '-S'); const wt = hasFlag(rest, '--worktree', '-W') || !st;
        const sa = rest.find((x) => x.indexOf('--source=') === 0); const srcId = sa ? resolve(sa.slice(9)) : null;
        if (sa && !srcId) return fail('fatal: could not resolve ' + sa.slice(9));
        const files = pos; if (!files.length) return fail('fatal: you must specify path(s) to restore');
        const headT = treeOf(headId());
        for (const f of files) {
          const base = f === '.' ? '' : f.replace(/\/$/, '');
          const from = st ? (srcId ? treeOf(srcId) : headT) : (srcId ? treeOf(srcId) : S.index);
          const ps = union(S.work, S.index, from).filter((p) => !base || p === base || p.indexOf(base + '/') === 0);
          if (!ps.length || (f !== '.' && !ps.some((p) => from[p] !== undefined || S.index[p] !== undefined))) return fail("error: pathspec '" + f + "' did not match any file(s) known to git");
          ps.forEach((p) => {
            if (st) { if (from[p] === undefined) delete S.index[p]; else S.index[p] = from[p]; }
            if (wt && (!st || hasFlag(rest, '--worktree', '-W'))) { if (from[p] === undefined) { if (S.index[p] !== undefined || srcId) delete S.work[p]; } else S.work[p] = from[p]; }
          });
        }
        return true;
      }
      case 'reset': {
        const mode = hasFlag(rest, '--soft') ? 'soft' : hasFlag(rest, '--hard') ? 'hard' : 'mixed';
        const first = pos[0]; const id = first ? resolve(first) : null;
        if (first && !id) {
          const headT = treeOf(headId());
          for (const p of pos) { if (headT[p] === undefined && S.index[p] === undefined) return fail("fatal: ambiguous argument '" + p + "'"); if (headT[p] === undefined) delete S.index[p]; else S.index[p] = headT[p]; }
          return true;
        }
        if (id && pos.length > 1) { const t = treeOf(id); for (const p of pos.slice(1)) { if (t[p] === undefined) delete S.index[p]; else S.index[p] = t[p]; } return true; }
        const target = id || headId(); if (!target) return fail('fatal: nothing to reset');
        const old = copy(S.index); setHead(target);
        const t = treeOf(target);
        if (mode !== 'soft') S.index = copy(t);
        if (mode === 'hard') { union(old, t).forEach((p) => { if (t[p] === undefined) delete S.work[p]; else S.work[p] = t[p]; }); S.pending = null; S.rebase = null; }
        say('HEAD is now at ' + target + ' ' + S.objs[target].msg); return true;
      }
      case 'revert': case 'cherry-pick': {
        if (hasFlag(rest, '--abort')) { const h = treeOf(headId()); union(S.work, S.index, h).forEach((p) => { if (h[p] === undefined) { delete S.work[p]; delete S.index[p]; } else { S.work[p] = h[p]; S.index[p] = h[p]; } }); S.pending = null; return true; }
        if (S.pending) return fail('error: avval davom etayotgan amalni yakunlang');
        const ids = pos.map((r) => resolve(r)); if (!ids.length || ids.some((x) => !x)) return fail('fatal: bad revision');
        for (const id of ids) {
          const c = S.objs[id]; if (!c.parents.length) return fail('error: commit ' + id + ' has no parent');
          const rev = cmd === 'revert';
          const msg = rev ? 'Revert "' + c.msg + '"' : c.msg;
          const r = threeWay(rev ? c.tree : treeOf(c.parents[0]), rev ? treeOf(c.parents[0]) : c.tree, (rev ? 'parent of ' : '') + id, { kind: cmd, msg, conflicts: [] });
          if (!r) return false;
          if (!finish(r, '[' + S.head + ']')) return false;
          if (S.pending) return true;
        }
        return true;
      }
      case 'merge': {
        if (hasFlag(rest, '--abort')) { if (!S.pending) return fail('fatal: There is no merge to abort'); return git(['reset', '--hard']); }
        const t = pos[0]; const id = resolve(t); if (!id) return fail('merge: ' + t + ' - not something we can merge');
        if (S.pending) return fail('error: avval davom etayotgan amalni yakunlang');
        const h = headId();
        if (isAnc(id, h)) { say('Already up to date.'); return true; }
        if (isAnc(h, id) && !hasFlag(rest, '--no-ff', '--squash')) { if (!switchTree(treeOf(id))) return false; setHead(id); say('Fast-forward'); return true; }
        const base = mergeBase(h, id);
        if (hasFlag(rest, '--squash')) { const r = threeWay(treeOf(base), treeOf(id), t, { kind: 'squash', conflicts: [] }); return !!r; }
        const mm = rest.find((x) => x === '-m'); const custom = mm ? rest[rest.indexOf('-m') + 1] : null;
        const r = threeWay(treeOf(base), treeOf(id), t, { kind: 'merge', target: id, msg: custom || "Merge branch '" + t + "'", conflicts: [] });
        if (!r) return false;
        return finish(r, "Merge made by the 'ort' strategy.");
      }
      case 'rebase': {
        if (hasFlag(rest, '-i', '--interactive')) return fail("Interaktiv rebase muharrir ochadi, simulyatorda yo'q (buning o'rniga reset --soft + commit ishlating)");
        if (hasFlag(rest, '--abort')) { if (!S.rebase) return fail('fatal: No rebase in progress?'); const R = S.rebase; S.rebase = null; S.detached = null; S.head = R.branch; S.branches[R.branch] = R.orig; S.pending = null; const t = treeOf(R.orig); union(S.work, S.index, t).forEach((p) => { if (t[p] === undefined) { delete S.work[p]; delete S.index[p]; } else { S.work[p] = t[p]; S.index[p] = t[p]; } }); return true; }
        if (hasFlag(rest, '--continue', '--skip')) {
          if (!S.rebase) return fail('fatal: No rebase in progress?');
          if (S.pending && S.pending.conflicts.length) return fail('error: konfliktli fayllar hali hal qilinmagan (tahrirlab, git add qiling)');
          if (S.pending && !hasFlag(rest, '--skip')) { newTreeCommit(S.pending.msg, [headId()]); }
          if (hasFlag(rest, '--skip')) { const h = treeOf(headId()); union(S.work, S.index, h).forEach((p) => { if (h[p] === undefined) { delete S.work[p]; delete S.index[p]; } else { S.work[p] = h[p]; S.index[p] = h[p]; } }); }
          S.pending = null; return replay();
        }
        if (S.pending || S.rebase) return fail('error: avval davom etayotgan amalni yakunlang');
        const up = resolve(pos[0]); if (!up) return fail('fatal: invalid upstream ' + pos[0]);
        const h = headId();
        if (isAnc(up, h)) { say('Current branch is up to date.'); return true; }
        if (isAnc(h, up)) { if (!switchTree(treeOf(up))) return false; setHead(up); say('Fast-forwarded'); return true; }
        if (dirty()) return fail('error: cannot rebase: You have unstaged/uncommitted changes (avval commit yoki stash).');
        const upA = anc(up);
        const todo = Object.keys(anc(h)).filter((k) => !upA[k] && S.objs[k].parents.length < 2).sort((x, y) => S.objs[x].n - S.objs[y].n);
        S.rebase = { branch: S.head, orig: h, todo };
        if (!switchTree(treeOf(up))) { S.rebase = null; return false; }
        S.detached = up; S.reflog.unshift(up);
        return replay();
      }
      case 'stash': {
        const sub = pos[0] || 'push';
        if (sub === 'list') { S.stash.forEach((e, i) => say('stash@{' + i + '}: ' + e.msg)); return true; }
        if (sub === 'clear') { S.stash = []; return true; }
        if (sub === 'drop') { if (!S.stash.length) return fail('No stash entries found.'); S.stash.shift(); return true; }
        if (sub === 'pop' || sub === 'apply') {
          if (!S.stash.length) return fail('No stash entries found.');
          const e = S.stash[0]; const h = treeOf(headId());
          for (const p of Object.keys(e.work)) if (S.work[p] !== h[p] || S.index[p] !== h[p]) return fail('error: local changes would be overwritten: ' + p);
          Object.keys(e.work).forEach((p) => { if (e.work[p] === null) delete S.work[p]; else S.work[p] = e.work[p]; if (h[p] === undefined && e.work[p] !== null) S.index[p] = e.work[p]; });
          Object.keys(e.untracked).forEach((p) => { S.work[p] = e.untracked[p]; });
          if (sub === 'pop') S.stash.shift(); return true;
        }
        if (sub !== 'push' && sub !== 'save') return fail("git stash " + sub + " simulyatorda yo'q");
        const incU = hasFlag(rest, '-u', '--include-untracked');
        const h = treeOf(headId()); const work = {}; const un = {};
        union(h, S.index, S.work).forEach((p) => { if (S.index[p] === undefined && h[p] === undefined) return; const cur = S.work[p]; if (cur !== h[p]) work[p] = cur === undefined ? null : cur; else if (S.index[p] !== h[p]) work[p] = S.index[p] === undefined ? null : S.index[p]; });
        if (incU) untracked().forEach((p) => { un[p] = S.work[p]; });
        if (!Object.keys(work).length && !Object.keys(un).length) return fail('No local changes to save');
        const mi = rest.indexOf('-m'); const m = mi >= 0 ? rest[mi + 1] : 'WIP on ' + S.head + ': ' + headId() + ' ' + S.objs[headId()].msg;
        S.stash.unshift({ msg: m, work, untracked: un });
        const oldIndex = S.index; S.index = copy(h); union(S.work, h).forEach((p) => { if (oldIndex[p] !== undefined || h[p] !== undefined) { if (h[p] === undefined) delete S.work[p]; else S.work[p] = h[p]; } });
        Object.keys(un).forEach((p) => { delete S.work[p]; });
        say('Saved working directory and index state'); return true;
      }
      case 'tag': {
        const tp = []; for (let i = 0; i < rest.length; i++) { if (rest[i] === '-m') i++; else if (rest[i][0] !== '-') tp.push(rest[i]); }
        if (hasFlag(rest, '-d', '--delete')) { for (const t of tp) { if (!S.tags[t]) return fail("error: tag '" + t + "' not found."); delete S.tags[t]; } return true; }
        if (!tp.length) { keys(S.tags).forEach(say); return true; }
        const name = tp[0]; const id = tp[1] ? resolve(tp[1]) : headId();
        if (!id) return fail('fatal: Failed to resolve');
        if (S.tags[name]) return fail("fatal: tag '" + name + "' already exists");
        S.tags[name] = id; return true;
      }
      case 'remote': {
        const sub = pos[0];
        if (sub === 'add') { if (!pos[1] || !pos[2]) return fail('usage: git remote add <name> <url>'); if (S.remotes[pos[1]]) return fail('error: remote ' + pos[1] + ' already exists.'); S.remotes[pos[1]] = pos[2]; return true; }
        if (sub === 'remove' || sub === 'rm') { if (!S.remotes[pos[1]]) return fail('error: No such remote: ' + pos[1]); delete S.remotes[pos[1]]; return true; }
        if (sub === 'set-url') { if (!S.remotes[pos[1]]) return fail('error: No such remote: ' + pos[1]); S.remotes[pos[1]] = pos[2]; return true; }
        keys(S.remotes).forEach((r) => say(r + (hasFlag(rest, '-v') ? '\t' + S.remotes[r] : ''))); return true;
      }
      case 'push': {
        const r = pos[0] || 'origin';
        if (!S.remotes[r]) return fail("fatal: '" + r + "' does not appear to be a git repository (avval git remote add)");
        const br = pos[1] || S.head; const id = S.branches[br];
        if (!id) return fail('error: src refspec ' + br + ' does not match any');
        const old = S.pushed[r + '/' + br];
        if (old && !isAnc(old, id) && !hasFlag(rest, '--force', '-f', '--force-with-lease')) return fail('! [rejected] ' + br + ' (non-fast-forward): avval pull qiling yoki --force-with-lease');
        S.pushed[r + '/' + br] = id;
        if (hasFlag(rest, '-u', '--set-upstream')) S.pushed['upstream:' + br] = r;
        say('To ' + S.remotes[r] + '  ' + br + ' -> ' + br); return true;
      }
      case 'fetch': case 'pull': {
        const r = pos[0] || 'origin';
        if (!S.remotes[r]) return fail("fatal: '" + r + "' does not appear to be a git repository");
        say('Already up to date.'); return true;
      }
      case 'clean': return fail("git clean simulyatorda yo'q (fayllarni rm bilan o'chiring)");
      default: return fail("git: '" + cmd + "' buyrug'i simulyatorda yo'q");
    }
  }

  function tokenize(line) {
    const out = []; let cur = ''; let q = null; let has = false;
    const flush = () => { if (has || cur) out.push(cur); cur = ''; has = false; };
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === q) q = null; else cur += c; continue; }
      if (c === '"' || c === "'") { q = c; has = true; continue; }
      if (c === '#' && !cur && !has) break;
      if (c === ' ' || c === '\t') { flush(); continue; }
      if (c === '>') { flush(); if (line[i + 1] === '>') { out.push('>>'); i++; } else out.push('>'); continue; }
      if (c === '&' && line[i + 1] === '&') { flush(); out.push('&&'); i++; continue; }
      if (c === ';') { flush(); out.push(';'); continue; }
      cur += c;
    }
    if (q) throw new Error('Qo\'shtirnoq yopilmagan');
    flush(); return out;
  }

  function shell(a) {
    const cmd = a[0];
    const ri = a.findIndex((x) => x === '>' || x === '>>');
    if (cmd === 'echo' || cmd === 'printf') {
      const text = (ri >= 0 ? a.slice(1, ri) : a.slice(1)).join(' ');
      if (ri < 0) { say(text); return true; }
      const f = a[ri + 1]; if (!f) return fail("fayl nomi yo'q");
      if (a[ri] === '>>' && S.work[f] !== undefined && S.work[f] !== '') S.work[f] += '\n' + text; else S.work[f] = text;
      return true;
    }
    if (cmd === 'touch') { a.slice(1).forEach((f) => { if (S.work[f] === undefined) S.work[f] = ''; }); return true; }
    if (cmd === 'rm') { for (const f of a.slice(1).filter((x) => x[0] !== '-')) { const d = f.replace(/\/$/, '') + '/'; const hit = keys(S.work).filter((p) => p === f || p.indexOf(d) === 0); if (!hit.length && a.indexOf('-f') < 0) return fail("rm: '" + f + "': fayl yo'q"); hit.forEach((p) => { delete S.work[p]; }); } return true; }
    if (cmd === 'mv' || cmd === 'cp') { const [f, t] = a.slice(1).filter((x) => x[0] !== '-'); if (S.work[f] === undefined) return fail(cmd + ": '" + f + "': fayl yo'q"); S.work[t] = S.work[f]; if (cmd === 'mv') delete S.work[f]; return true; }
    if (cmd === 'cat') { a.slice(1).forEach((f) => say(S.work[f] === undefined ? 'cat: ' + f + ': yo\'q' : S.work[f])); return true; }
    if (cmd === 'ls') { keys(S.work).forEach(say); return true; }
    if (cmd === 'mkdir' || cmd === 'cd' || cmd === 'pwd' || cmd === 'clear') return true;
    return fail("'" + cmd + "' buyrug'i tanilmadi (faqat git, echo, touch, rm, mv, cat, ls)");
  }

  function runLines(text) {
    String(text || '').split('\n').forEach((raw) => {
      const line = raw.replace(/^\s*\$\s+/, '').trim();
      if (!line || line[0] === '#') return;
      let toks;
      try { toks = tokenize(line); } catch (e) { fail(e.message); return; }
      let seg = []; const segs = [];
      toks.forEach((t) => { if (t === '&&' || t === ';') { segs.push([seg, t]); seg = []; } else seg.push(t); });
      segs.push([seg, '']);
      let ok = true; let prevOp = '';
      for (const [s, op] of segs) {
        if (!ok && prevOp === '&&') { prevOp = op; continue; }
        if (!s.length) { prevOp = op; continue; }
        S.cmds += 1; say('$ ' + s.join(' '));
        try { ok = s[0] === 'git' ? git(s.slice(1)) : shell(s); } catch (e) { ok = fail('ichki xato: ' + e.message); }
        prevOp = op;
      }
    });
  }

  runLines(setup);
  silent = false; S.errors = []; S.cmds = 0;
  runLines(script);

  return {
    branch: () => (S.rebase ? S.rebase.branch : S.detached ? null : S.head),
    detached: () => !!S.detached && !S.rebase,
    head: () => headId(),
    msg: (ref) => { const id = resolve(ref || 'HEAD'); return id ? S.objs[id].msg : null; },
    log: (ref) => { const id = resolve(ref || 'HEAD'); return Object.keys(anc(id)).sort((x, y) => S.objs[y].n - S.objs[x].n).map((k) => S.objs[k].msg); },
    count: (ref) => Object.keys(anc(resolve(ref || 'HEAD'))).length,
    parents: (ref) => { const id = resolve(ref || 'HEAD'); return id ? S.objs[id].parents.length : -1; },
    exists: (ref) => !!resolve(ref),
    same: (a, b) => !!resolve(a) && resolve(a) === resolve(b),
    isAncestor: (a, b) => !!resolve(a) && !!resolve(b) && isAnc(resolve(a), resolve(b)),
    branches: () => keys(S.branches),
    tip: (b) => (S.branches[b] ? S.objs[S.branches[b]].msg : null),
    files: () => keys(S.work),
    read: (p) => (S.work[p] === undefined ? null : S.work[p]),
    tree: (ref) => keys(treeOf(resolve(ref || 'HEAD'))),
    show: (ref, p) => { const t = treeOf(resolve(ref || 'HEAD')); return t[p] === undefined ? null : t[p]; },
    staged: staged, changes: changes, untracked: untracked,
    clean: () => !dirty() && untracked().length === 0,
    tags: () => keys(S.tags),
    stashCount: () => S.stash.length,
    merging: () => !!S.pending && S.pending.kind === 'merge',
    conflicts: () => (S.pending ? S.pending.conflicts.slice().sort() : []),
    rebasing: () => !!S.rebase,
    remotes: () => copy(S.remotes),
    pushed: () => keys(S.pushed).filter((k) => k.indexOf('upstream:') !== 0),
    upstream: (b) => S.pushed['upstream:' + b] || null,
    errors: S.errors,
    ok: () => S.errors.length === 0,
    cmds: S.cmds,
  };
}
