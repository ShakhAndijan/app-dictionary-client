// A small in-memory package manager simulator for the Frontend course "Paket menejerlar" labs. It is plain JavaScript
// source that is prepended to the learner's text (see devLab.ts and content/lab-check.cjs), so it must stay
// self-contained and must not use import/export. Usage: const proj = npmRun(setupScript, learnerScript);
// Shell: echo "text" > file, cat, ls, mkdir, cd, touch, rm [-rf].
// Managers: npm (init install uninstall ci update outdated ls view version pkg run test start exec link publish),
// npx, pnpm and yarn and bun (add install remove run exec). Workspaces: -w / --workspaces / --filter / -r.
// The registry is a small fixed list of packages: nothing is downloaded.
function npmRun(setup, script) {
  // name -> versions, oldest first; each version may have deps, peer and bin
  const v = (list, extra) => list.split(' ').map((x) => Object.assign({ v: x }, extra));
  const REGISTRY = {
    lodash: v('3.10.1 4.17.20 4.17.21'),
    dayjs: v('1.10.8 1.11.13'),
    zod: v('3.22.4 3.23.8 3.24.1'),
    chalk: v('4.1.2 5.3.0'),
    ms: v('2.0.0 2.1.3'),
    debug: [{ v: '2.6.9', deps: { ms: '2.0.0' } }, { v: '4.3.7', deps: { ms: '^2.1.3' } }, { v: '4.4.0', deps: { ms: '^2.1.3' } }],
    express: [{ v: '4.18.2', deps: { debug: '2.6.9' } }, { v: '4.21.2', deps: { debug: '2.6.9' } }, { v: '5.0.1', deps: { debug: '^4.3.6' } }],
    'follow-redirects': v('1.15.9'),
    axios: [{ v: '0.27.2', deps: { 'follow-redirects': '^1.14.9' } }, { v: '1.6.0', deps: { 'follow-redirects': '^1.15.0' } }, { v: '1.7.9', deps: { 'follow-redirects': '^1.15.6' } }],
    react: v('17.0.2 18.2.0 18.3.1 19.0.0'),
    'react-dom': [{ v: '18.2.0', peer: { react: '^18.2.0' } }, { v: '18.3.1', peer: { react: '^18.3.1' } }, { v: '19.0.0', peer: { react: '^19.0.0' } }],
    'react-datepicker-lite': [{ v: '1.0.0', peer: { react: '^17.0.0' } }, { v: '2.0.0', peer: { react: '^18.0.0' } }],
    esbuild: v('0.21.5 0.24.0', { bin: 'esbuild' }),
    vite: [{ v: '5.4.11', deps: { esbuild: '^0.21.3' }, bin: 'vite' }, { v: '6.0.3', deps: { esbuild: '^0.24.0' }, bin: 'vite' }],
    vitest: v('2.1.8', { bin: 'vitest' }),
    typescript: v('5.6.3 5.7.2', { bin: 'tsc' }),
    eslint: v('8.57.1 9.17.0', { bin: 'eslint' }),
    prettier: v('2.8.8 3.4.2', { bin: 'prettier' }),
    rimraf: v('6.0.1', { bin: 'rimraf' }),
    nodemon: v('3.1.9', { bin: 'nodemon' }),
    cowsay: v('1.6.0', { bin: 'cowsay' }),
    'create-vite': v('6.0.1', { bin: 'create-vite' }),
    serve: v('14.2.4', { bin: 'serve' }),
  };
  const LOCKS = { npm: 'package-lock.json', pnpm: 'pnpm-lock.yaml', yarn: 'yarn.lock', bun: 'bun.lock' };

  const S = { files: {}, dirs: { '': true }, cwd: '', modules: {}, links: {}, ran: [], out: [], errors: [], published: [], globalLinks: {}, cmds: 0 };
  let silent = true;
  const say = (l) => { if (!silent) { S.out.push(String(l)); console.log(l); } };
  const fail = (m) => { S.errors.push(m); if (!silent) console.log('✗ ' + m); return false; };
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const keys = (o) => Object.keys(o).sort();

  /* ------------------------------------------------------------ paths and files */
  const norm = (p, base) => {
    let parts = (p.charAt(0) === '/' ? p : (base === undefined ? S.cwd : base) + '/' + p).split('/');
    const out = [];
    parts.forEach((x) => { if (!x || x === '.') return; if (x === '..') out.pop(); else out.push(x); });
    return out.join('/');
  };
  const join = (a, b) => (a ? a + '/' + b : b);
  const parent = (p) => p.split('/').slice(0, -1).join('/');
  const mkdirs = (d) => { let cur = ''; d.split('/').forEach((x) => { if (!x) return; cur = join(cur, x); S.dirs[cur] = true; }); };
  const write = (p, text) => { mkdirs(parent(p)); S.files[p] = text; };
  const readJson = (p) => { if (!own(S.files, p)) return null; try { return JSON.parse(S.files[p]); } catch (e) { return undefined; } };
  const pkgPath = (dir) => join(dir, 'package.json');
  const pkgOf = (dir) => readJson(pkgPath(dir));
  const savePkg = (dir, pkg) => {
    ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach((f) => {
      if (!pkg[f]) return;
      if (!keys(pkg[f]).length) { delete pkg[f]; return; }
      const sorted = {}; keys(pkg[f]).forEach((k) => { sorted[k] = pkg[f][k]; }); pkg[f] = sorted;
    });
    write(pkgPath(dir), JSON.stringify(pkg, null, 2));
  };
  const need = (dir) => {
    const p = pkgOf(dir);
    if (p === null) { fail('package.json topilmadi (' + (dir || 'loyiha ildizi') + '). Avval npm init -y'); return null; }
    if (p === undefined) { fail('package.json buzilgan: JSON xato'); return null; }
    return p;
  };

  /* ------------------------------------------------------------ semver */
  const parse = (x) => { const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(x); return m ? [+m[1], +m[2], +m[3]] : null; };
  const cmp = (a, b) => { const x = parse(a); const y = parse(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1; return 0; };
  const one = (ver, c) => {
    if (!c || c === '*' || c === 'x' || c === 'latest') return true;
    const m = /^(\^|~|>=|<=|>|<|=)?\s*v?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?$/.exec(c);
    if (!m) return false;
    const op = m[1] || '';
    const num = (s) => (s === undefined || s === 'x' || s === '*' ? null : +s);
    const major = +m[2]; const minor = num(m[3]); const patch = num(m[4]);
    const low = major + '.' + (minor || 0) + '.' + (patch || 0);
    const t = parse(ver);
    if (op === '>=') return cmp(ver, low) >= 0;
    if (op === '>') return cmp(ver, low) > 0;
    if (op === '<=') return cmp(ver, low) <= 0;
    if (op === '<') return cmp(ver, low) < 0;
    if (op === '^') {
      if (cmp(ver, low) < 0) return false;
      if (major > 0 || minor === null) return t[0] === major;
      if (minor > 0 || patch === null) return t[0] === 0 && t[1] === minor;
      return t[0] === 0 && t[1] === 0 && t[2] === patch;
    }
    if (op === '~') {
      if (cmp(ver, low) < 0) return false;
      return t[0] === major && (minor === null || t[1] === minor);
    }
    return t[0] === major && (minor === null || t[1] === minor) && (patch === null || t[2] === patch);
  };
  const satisfies = (ver, range) => String(range).split('||').some((alt) => {
    const parts = alt.trim().replace(/(>=|<=|>|<)\s+/g, '$1').split(/\s+/).filter(Boolean);
    return !parts.length || parts.every((c) => one(ver, c));
  });
  const entry = (name, range) => {
    const list = REGISTRY[name];
    if (!list) return null;
    for (let i = list.length - 1; i >= 0; i--) if (satisfies(list[i].v, range)) return list[i];
    return null;
  };
  const latest = (name) => REGISTRY[name][REGISTRY[name].length - 1].v;

  /* ------------------------------------------------------------ workspaces */
  const globDirs = (pattern) => {
    const p = pattern.replace(/\/$/, '');
    if (p.slice(-2) !== '/*') return own(S.files, pkgPath(p)) ? [p] : [];
    const base = p.slice(0, -2);
    return keys(S.files).filter((f) => f.slice(-13) === '/package.json' && parent(parent(f)) === base).map(parent);
  };
  const workspaceDirs = (manager) => {
    let patterns = [];
    if (manager === 'pnpm') {
      const y = S.files['pnpm-workspace.yaml'];
      if (y) y.split('\n').forEach((l) => { const m = /^\s*-\s*['"]?([^'"]+?)['"]?\s*$/.exec(l); if (m) patterns.push(m[1]); });
    } else {
      const root = pkgOf('');
      if (root && root.workspaces) patterns = Array.isArray(root.workspaces) ? root.workspaces : root.workspaces.packages || [];
    }
    const out = [];
    patterns.forEach((p) => globDirs(p).forEach((d) => { if (out.indexOf(d) < 0) out.push(d); }));
    return out;
  };
  const wsName = (dir) => { const p = pkgOf(dir); return p && p.name; };
  const findWs = (manager, name) => workspaceDirs(manager).filter((d) => wsName(d) === name || d === name.replace(/^\.\//, ''))[0];

  /* ------------------------------------------------------------ node_modules */
  const modPath = (dir, name) => join(dir, 'node_modules/' + name);
  const clearModules = () => { S.modules = {}; S.links = {}; };

  // Node resolution: the nearest node_modules walking up from `dir`
  const resolveFrom = (dir, name) => {
    let d = dir;
    for (;;) {
      const key = modPath(d, name);
      if (own(S.modules, key)) return S.modules[key];
      if (own(S.links, key)) { const p = pkgOf(S.links[key]); return (p && p.version) || '0.0.0'; }
      if (!d) return null;
      d = parent(d);
    }
  };

  // Where each package goes. flat (npm, yarn, bun): hoist to the root, nest under the dependant on a version conflict.
  // pnpm: only direct dependencies are visible, everything else lives in the hidden .pnpm store.
  const place = (manager, from, name, ver, seen) => {
    const e = REGISTRY[name].filter((x) => x.v === ver)[0];
    let at;
    if (manager === 'pnpm') {
      at = modPath('node_modules/.pnpm/' + name + '@' + ver, name);
      S.modules[at] = ver;
    } else {
      const rootKey = modPath('', name);
      if (!own(S.modules, rootKey)) S.modules[rootKey] = ver;
      if (S.modules[rootKey] !== ver) { S.modules[modPath(from, name)] = ver; at = modPath(from, name); } else at = rootKey;
    }
    if (seen[name + '@' + ver]) return;
    seen[name + '@' + ver] = true;
    Object.keys(e.deps || {}).forEach((d) => { const x = entry(d, e.deps[d]); if (x) place(manager, at, d, x.v, seen); });
  };

  const readLock = (manager) => { const l = readJson(LOCKS[manager]); return l && l.packages ? l : null; };
  const writeLock = (manager, lock) => {
    const sorted = { lockfileVersion: 3, packages: {}, workspaces: lock.workspaces };
    keys(lock.packages).forEach((k) => { sorted.packages[k] = lock.packages[k]; });
    write(LOCKS[manager], JSON.stringify(sorted, null, 2));
  };
  const allDeps = (pkg) => Object.assign({}, pkg.optionalDependencies, pkg.dependencies, pkg.devDependencies);

  /** Installs everything the manifests ask for. opts: {prod, latestFor: [names], pin: {name: version}, legacy} */
  function reify(manager, opts) {
    const root = need('');
    if (!root) return false;
    const spaces = workspaceDirs(manager);
    const dirs = [''].concat(spaces);
    const lock = readLock(manager) || { packages: {} };
    const next = { packages: {}, workspaces: {} };
    const plan = [];
    for (const dir of dirs) {
      const pkg = need(dir);
      if (!pkg) return false;
      const wanted = opts.prod ? Object.assign({}, pkg.optionalDependencies, pkg.dependencies) : allDeps(pkg);
      const peers = Object.assign({}, pkg.peerDependencies);
      next.workspaces[dir] = allDeps(pkg);
      for (const name of keys(wanted)) {
        const range = wanted[name];
        const ws = spaces.filter((d) => wsName(d) === name)[0];
        if (ws !== undefined) { plan.push({ dir: dir, name: name, link: ws }); continue; }
        if (range.indexOf('workspace:') === 0) return fail("workspace paketi topilmadi: " + name);
        if (range.indexOf('file:') === 0 || range.indexOf('link:') === 0) {
          const target = norm(range.slice(5), dir);
          if (!own(S.files, pkgPath(target))) return fail('Lokal paket topilmadi: ' + range);
          plan.push({ dir: dir, name: name, link: target });
          continue;
        }
        if (!REGISTRY[name]) return fail("404: '" + name + "' registry da yo'q");
        let locked = (opts.pin || {})[name] || lock.packages[name];
        if ((opts.latestFor || []).indexOf(name) >= 0 || !locked || !satisfies(locked, range)) {
          const e = entry(name, range);
          if (!e) return fail("ETARGET: " + name + "@" + range + " versiyasi yo'q");
          locked = e.v;
        }
        plan.push({ dir: dir, name: name, ver: locked });
      }
      // peer dependencies of the direct dependencies must be satisfied by this project
      for (const item of plan.filter((x) => x.dir === dir && x.ver)) {
        const e = REGISTRY[item.name].filter((x) => x.v === item.ver)[0];
        for (const peer of Object.keys(e.peer || {})) {
          const have = plan.filter((x) => (x.dir === dir || x.dir === '') && x.name === peer && x.ver)[0];
          if (have && !satisfies(have.ver, e.peer[peer])) {
            const msg = 'ERESOLVE: ' + item.name + '@' + item.ver + ' uchun peer ' + peer + '@' + e.peer[peer] + ' kerak, lekin loyihada ' + peer + '@' + have.ver;
            if (manager === 'npm' && !opts.legacy) return fail(msg);
            say('warn peer: ' + msg);
          } else if (!have) {
            const x = entry(peer, e.peer[peer]);
            if (manager === 'npm' && !opts.legacy && x) plan.push({ dir: '', name: peer, ver: x.v, peerOnly: true });
            else if (manager !== 'npm') say('warn: ' + item.name + ' peer ' + peer + '@' + e.peer[peer] + " o'rnatilmagan");
          }
        }
      }
      keys(peers).forEach((n) => { if (!own(wanted, n) && REGISTRY[n] && manager === 'npm' && dir === '') { const x = entry(n, peers[n]); if (x) plan.push({ dir: '', name: n, ver: x.v, peerOnly: true }); } });
    }
    clearModules();
    const seen = {};
    // root dependencies first: they win the top-level slot
    plan.sort((a, b) => (a.dir === '' ? 0 : 1) - (b.dir === '' ? 0 : 1));
    const brought = [];
    for (const item of plan) {
      if (item.link !== undefined) {
        S.links[modPath(manager === 'pnpm' ? item.dir : '', item.name)] = item.link;
        continue;
      }
      next.packages[item.name] = next.packages[item.name] || item.ver;
      const rootKey = modPath('', item.name);
      let at;
      if (manager === 'pnpm') {
        S.modules[modPath(item.dir, item.name)] = item.ver;
        at = modPath('node_modules/.pnpm/' + item.name + '@' + item.ver, item.name);
        S.modules[at] = item.ver;
      } else {
        at = !own(S.modules, rootKey) || S.modules[rootKey] === item.ver ? rootKey : modPath(item.dir, item.name);
        S.modules[at] = item.ver;
      }
      brought.push({ at: at, name: item.name, ver: item.ver });
    }
    for (const b of brought) {
      const deps = REGISTRY[b.name].filter((x) => x.v === b.ver)[0].deps || {};
      Object.keys(deps).forEach((d) => { const x = entry(d, deps[d]); if (x) place(manager, b.at, d, x.v, seen); });
    }
    // workspace packages are always linked into the root node_modules by npm, yarn and bun
    if (manager !== 'pnpm') spaces.forEach((d) => { if (wsName(d)) S.links[modPath('', wsName(d))] = d; });
    writeLock(manager, next);
    say("o'rnatildi: " + Object.keys(S.modules).length + ' ta paket');
    return true;
  }

  /* ------------------------------------------------------------ commands */
  const SHORT = { '-D': 'dev', '--save-dev': 'dev', '--dev': 'dev', '-d': 'dev', '-E': 'exact', '--save-exact': 'exact', '--save-peer': 'peer', '-P': 'prod', '--save-prod': 'prod', '--peer': 'peer', '-O': 'optional', '--save-optional': 'optional', '--no-save': 'nosave', '--legacy-peer-deps': 'legacy', '--force': 'legacy', '-f': 'legacy', '--omit=dev': 'omitdev', '--production': 'omitdev', '--prod': 'omitdev', '-y': 'yes', '--yes': 'yes', '-g': 'global', '--global': 'global', '--workspaces': 'allws', '-ws': 'allws', '-r': 'allws', '--recursive': 'allws', '--if-present': 'ifpresent', '--frozen-lockfile': 'frozen', '--immutable': 'frozen', '--dry-run': 'dry', '--access=public': 'public' };

  function flags(args, manager) {
    const o = { rest: [], ws: [], extra: [] };
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '--') { o.extra = args.slice(i + 1); break; }
      if (a === '--workspace' && manager === 'pnpm') continue; // `pnpm add ui --workspace`
      if (a === '-w' || a === '--workspace') {
        if (manager === 'pnpm') o.atRoot = true; else o.ws.push(args[++i]);
      } else if (a.indexOf('--workspace=') === 0) o.ws.push(a.slice(12));
      else if (a === '--filter' || a === '-F') o.ws.push(args[++i]);
      else if (a.indexOf('--filter=') === 0) o.ws.push(a.slice(9));
      else if (a === '--workspace-root') o.atRoot = true;
      else if (SHORT[a]) o[SHORT[a]] = true;
      else if (a.charAt(0) === '-') { fail("noma'lum bayroq: " + a); o.bad = true; } else o.rest.push(a);
    }
    return o;
  }

  const targets = (manager, o) => {
    if (!o.ws.length) return [S.cwd];
    const out = [];
    for (const name of o.ws) {
      const d = findWs(manager, name);
      if (d === undefined) { fail("workspace topilmadi: " + name); return null; }
      out.push(d);
    }
    return out;
  };
  const rootOf = (manager) => { const spaces = workspaceDirs(manager); return spaces.indexOf(S.cwd) >= 0 ? '' : null; };
  // inside a workspace folder the installation still happens at the monorepo root
  const atProjectRoot = (manager, fn) => {
    if (rootOf(manager) === null) {
      if (!S.cwd) return fn();
      const saved = {}; const prefix = S.cwd + '/';
      const take = (o) => { const m = {}; keys(o).forEach((k) => { if (k.indexOf(prefix) === 0) m[k.slice(prefix.length)] = o[k]; }); return m; };
      // a stand-alone project in a subfolder: run it as its own root
      const files = S.files; const modules = S.modules; const links = S.links;
      saved.cwd = S.cwd;
      S.files = take(files); S.modules = take(modules); S.links = take(links);
      Object.keys(files).forEach((k) => { if (k.indexOf(prefix) !== 0) S.files['../' + k] = files[k]; });
      S.cwd = '';
      const ok = fn();
      const back = (o, keepOutside) => { const m = {}; keys(keepOutside).forEach((k) => { if (k.indexOf(prefix) !== 0) m[k] = keepOutside[k]; }); keys(o).forEach((k) => { if (k.indexOf('../') !== 0) m[prefix + k] = o[k]; }); return m; };
      S.files = back(S.files, files); S.modules = back(S.modules, modules); S.links = back(S.links, links);
      S.cwd = saved.cwd;
      return ok;
    }
    const cwd = S.cwd; S.cwd = ''; const ok = fn(); S.cwd = cwd; return ok;
  };

  function splitSpec(spec) {
    const at = spec.lastIndexOf('@');
    return at > 0 ? { name: spec.slice(0, at), range: spec.slice(at + 1) } : { name: spec, range: null };
  }

  function add(manager, o) {
    const dirs = targets(manager, o);
    if (!dirs) return false;
    if (manager === 'pnpm' && !o.ws.length && S.cwd === '' && workspaceDirs('pnpm').length && !o.atRoot) return fail("pnpm: workspace ildiziga qo'shish uchun -w bayrog'ini yozing (yoki --filter <paket>)");
    const field = o.dev ? 'devDependencies' : o.peer ? 'peerDependencies' : o.optional ? 'optionalDependencies' : 'dependencies';
    const backup = Object.assign({}, S.files);
    const pin = {};
    for (const dir of dirs) {
      const pkg = need(dir);
      if (!pkg) return false;
      for (const spec of o.rest) {
        let name; let saved;
        if (/^(file:|link:|\.\.?\/|\/)/.test(spec)) {
          const target = norm(spec.replace(/^(file:|link:)/, ''), dir);
          const t = pkgOf(target);
          if (!t) return fail('Lokal paket topilmadi: ' + spec);
          name = t.name;
          let rel = target;
          const from = dir ? dir.split('/') : [];
          const to = target.split('/');
          let i = 0; while (i < from.length && from[i] === to[i]) i++;
          rel = from.slice(i).map(() => '..').concat(to.slice(i)).join('/');
          saved = 'file:' + (rel.charAt(0) === '.' ? rel : './' + rel);
        } else {
          const s = splitSpec(spec);
          name = s.name;
          const ws = workspaceDirs(manager).filter((d) => wsName(d) === name)[0];
          if (ws !== undefined) {
            const ver = pkgOf(ws).version || '1.0.0';
            saved = s.range && s.range.indexOf('workspace:') === 0 ? s.range : manager === 'pnpm' ? 'workspace:^' : '^' + ver;
          } else {
            if (!REGISTRY[name]) return fail("404: '" + name + "' registry da yo'q");
            const e = entry(name, s.range || 'latest');
            if (!e) return fail('ETARGET: ' + spec + " versiyasi yo'q");
            if (s.range && s.range !== 'latest' && !parse(s.range)) saved = s.range;
            else saved = (o.exact ? '' : '^') + e.v;
            pin[name] = e.v;
          }
        }
        if (!o.nosave) {
          const had = ['dependencies', 'devDependencies', 'optionalDependencies'].filter((f) => pkg[f] && own(pkg[f], name))[0];
          if (had && had !== field && field !== 'peerDependencies') delete pkg[had][name];
          pkg[field] = Object.assign({}, pkg[field]);
          pkg[field][name] = saved;
        }
      }
      savePkg(dir, pkg);
    }
    const run = () => reify(manager, { legacy: o.legacy, pin: pin });
    const ok = atProjectRoot(manager, run);
    if (!ok) S.files = backup;
    return ok;
  }

  function remove(manager, o) {
    const dirs = targets(manager, o);
    if (!dirs) return false;
    if (!o.rest.length) return fail("o'chiriladigan paket nomini yozing");
    for (const dir of dirs) {
      const pkg = need(dir);
      if (!pkg) return false;
      for (const name of o.rest) {
        let found = false;
        ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'].forEach((f) => { if (pkg[f] && own(pkg[f], name)) { delete pkg[f][name]; found = true; } });
        if (!found) return fail("'" + name + "' package.json da yo'q");
      }
      savePkg(dir, pkg);
    }
    return atProjectRoot(manager, () => reify(manager, { legacy: o.legacy }));
  }

  function install(manager, o) {
    if (o.global) { o.rest.forEach((r) => say("global o'rnatildi: " + r)); return true; }
    if (o.rest.length) return manager === 'npm' ? add(manager, o) : manager === 'yarn' || manager === 'pnpm' ? fail(manager + ' da paket qo\'shish: ' + manager + ' add <paket>') : add(manager, o);
    return atProjectRoot(manager, () => {
      if (o.frozen) return frozen(manager, o);
      return reify(manager, { prod: o.omitdev, legacy: o.legacy });
    });
  }

  // npm ci and --frozen-lockfile: install exactly what the lock file says, never change it
  function frozen(manager, o) {
    const root = need('');
    if (!root) return false;
    const lock = readLock(manager);
    if (!lock) return fail(LOCKS[manager] + " yo'q: bu buyruq lock faylsiz ishlamaydi");
    for (const dir of [''].concat(workspaceDirs(manager))) {
      const now = allDeps(pkgOf(dir) || {});
      const then = (lock.workspaces || {})[dir] || {};
      if (JSON.stringify(keys(now).map((k) => [k, now[k]])) !== JSON.stringify(keys(then).map((k) => [k, then[k]]))) return fail('package.json va ' + LOCKS[manager] + " mos emas: lock faylni npm install bilan yangilang");
    }
    const text = S.files[LOCKS[manager]];
    const ok = reify(manager, { prod: o.omitdev, legacy: o.legacy });
    S.files[LOCKS[manager]] = text;
    return ok;
  }

  const BUILTIN = ['echo', 'node', 'true'];
  const binOwner = (bin) => keys(REGISTRY).filter((n) => REGISTRY[n].some((e) => e.bin === bin))[0];
  const hasBin = (dir, bin) => { const n = binOwner(bin); return !!n && !!resolveFrom(dir, n); };

  // one command of a package.json script or of npx
  function exec(dir, words) {
    const cmd = words[0];
    if (cmd === 'echo') { say(words.slice(1).join(' ')); return true; }
    if (cmd === 'true') return true;
    if (cmd === 'exit') return fail('skript ' + (words[1] || 0) + ' kodi bilan tugadi');
    if (cmd === 'node') {
      if (words[1] && !own(S.files, norm(words[1], dir))) return fail("node: '" + words[1] + "' topilmadi");
      say('node ' + words.slice(1).join(' ')); return true;
    }
    if (cmd === 'npm' || cmd === 'pnpm' || cmd === 'yarn' || cmd === 'bun' || cmd === 'npx') {
      const cwd = S.cwd; S.cwd = dir; const ok = command(words); S.cwd = cwd; return ok;
    }
    if (!hasBin(dir, cmd)) return fail(cmd + ": command not found (paket o'rnatilmagan)");
    say('> ' + words.join(' '));
    return true;
  }

  function runScript(dir, name, extra, ifPresent) {
    const pkg = need(dir);
    if (!pkg) return false;
    const scripts = pkg.scripts || {};
    if (!own(scripts, name)) return ifPresent ? true : fail("Missing script: \"" + name + "\"");
    for (const step of ['pre' + name, name, 'post' + name]) {
      if (!own(scripts, step)) continue;
      const line = step === name && extra.length ? scripts[step] + ' ' + extra.join(' ') : scripts[step];
      S.ran.push((dir ? wsName(dir) + ':' : '') + step);
      say('> ' + step + ': ' + line);
      let seg = [];
      for (const t of tokenize(line).concat('&&')) {
        if (t === '&&' || t === ';') {
          if (seg.length && !exec(dir, seg)) return false;
          seg = [];
        } else seg.push(t);
      }
    }
    return true;
  }

  function run(manager, name, o) {
    if (!name) { const p = need(S.cwd); if (!p) return false; keys(p.scripts || {}).forEach((k) => say(k + ': ' + p.scripts[k])); return true; }
    let dirs;
    if (o.allws) {
      dirs = workspaceDirs(manager);
      if (!dirs.length) return fail("workspace sozlanmagan");
    } else dirs = targets(manager, o);
    if (!dirs) return false;
    for (const d of dirs) if (!runScript(d, name, o.extra, o.ifpresent)) return false;
    return true;
  }

  // npx / pnpm dlx / yarn dlx / bunx: use the local binary, otherwise download it temporarily
  function npx(words, alwaysDownload) {
    const args = words.filter((w) => w !== '-y' && w !== '--yes');
    if (!args.length) return fail('npx dan keyin buyruq yozing');
    const s = splitSpec(args[0]);
    const local = !s.range && hasBin(S.cwd, s.name);
    if (!local) {
      const pkgName = REGISTRY[s.name] ? s.name : binOwner(s.name);
      if (!pkgName || !entry(pkgName, s.range || 'latest')) return fail("404: '" + args[0] + "' topilmadi");
      if (!alwaysDownload) say('vaqtincha yuklab olindi: ' + pkgName + '@' + entry(pkgName, s.range || 'latest').v);
    }
    S.ran.push('npx ' + args.join(' '));
    say('> ' + args.join(' '));
    return true;
  }

  function init(o, manager) {
    if (!o.yes && manager === 'npm') return fail('interaktiv savollarsiz ishlash uchun -y yozing: npm init -y');
    const name = (S.cwd.split('/').pop() || 'my-app').toLowerCase();
    if (o.ws.length) {
      const root = need('');
      if (!root) return false;
      const patterns = root.workspaces || [];
      for (const w of o.ws) {
        const dir = norm(w, '');
        if (!own(S.files, pkgPath(dir))) savePkg(dir, { name: dir.split('/').pop(), version: '1.0.0' });
        if (!patterns.some((p) => globDirs(p).indexOf(dir) >= 0)) patterns.push(dir);
      }
      root.workspaces = patterns;
      savePkg('', root);
      return true;
    }
    const old = pkgOf(S.cwd) || {};
    savePkg(S.cwd, Object.assign({ name: name, version: '1.0.0', main: 'index.js', scripts: { test: 'echo "Error: no test specified" && exit 1' } }, old));
    say('package.json yaratildi');
    return true;
  }

  function version(kind) {
    const pkg = need(S.cwd);
    if (!pkg) return false;
    const t = parse(pkg.version || '');
    if (!t) return fail('package.json da version yo\'q');
    if (kind === 'major') pkg.version = (t[0] + 1) + '.0.0';
    else if (kind === 'minor') pkg.version = t[0] + '.' + (t[1] + 1) + '.0';
    else if (kind === 'patch') pkg.version = t[0] + '.' + t[1] + '.' + (t[2] + 1);
    else if (parse(kind || '')) pkg.version = kind;
    else return fail('npm version patch | minor | major');
    savePkg(S.cwd, pkg);
    say('v' + pkg.version);
    return true;
  }

  function pkgCmd(args) {
    const pkg = need(S.cwd);
    if (!pkg) return false;
    const op = args[0];
    const path = (k) => k.replace(/\[\]$/, '').split('.');
    for (const a of args.slice(1)) {
      const eq = a.indexOf('=');
      const key = eq < 0 ? a : a.slice(0, eq);
      const parts = path(key);
      let obj = pkg;
      for (let i = 0; i < parts.length - 1; i++) { if (typeof obj[parts[i]] !== 'object') obj[parts[i]] = {}; obj = obj[parts[i]]; }
      const last = parts[parts.length - 1];
      if (op === 'set') {
        if (eq < 0) return fail('npm pkg set kalit=qiymat');
        let val = a.slice(eq + 1);
        if (val === 'true' || val === 'false') val = val === 'true';
        if (/\[\]$/.test(key)) obj[last] = (obj[last] || []).concat(val); else obj[last] = val;
      } else if (op === 'delete') delete obj[last];
      else if (op === 'get') say(JSON.stringify(obj[last]));
      else return fail('npm pkg get | set | delete');
    }
    savePkg(S.cwd, pkg);
    return true;
  }

  function publish(o) {
    const dirs = o.allws ? workspaceDirs('npm') : targets('npm', o);
    if (!dirs) return false;
    for (const d of dirs) {
      const p = need(d);
      if (!p) return false;
      if (p.private) return fail('EPRIVATE: "private": true bo\'lgan paket nashr qilinmaydi');
      if (!p.name || !parse(p.version || '')) return fail('name va version majburiy');
      if (p.name.charAt(0) === '@' && !o.public && !(p.publishConfig && p.publishConfig.access === 'public')) return fail('402: scope li paket uchun --access=public yozing');
      const id = p.name + '@' + p.version;
      if (S.published.indexOf(id) >= 0 || (REGISTRY[p.name] && REGISTRY[p.name].some((e) => e.v === p.version))) return fail('403: ' + id + ' allaqachon nashr qilingan, versiyani oshiring');
      if (o.dry) { say('(dry run) ' + id); continue; }
      S.published.push(id);
      say('+ ' + id);
    }
    return true;
  }

  function link(o) {
    if (!o.rest.length) {
      const p = need(S.cwd);
      if (!p) return false;
      S.globalLinks[p.name] = S.cwd;
      say('global havola: ' + p.name);
      return true;
    }
    for (const spec of o.rest) {
      let target = S.globalLinks[spec];
      if (target === undefined && own(S.files, pkgPath(norm(spec)))) target = norm(spec);
      if (target === undefined) return fail("'" + spec + "' uchun global havola yo'q: avval paket papkasida npm link");
      S.links[modPath(S.cwd, pkgOf(target).name)] = target;
      say('ulandi: ' + pkgOf(target).name);
    }
    return true;
  }

  const direct = (dir) => allDeps(pkgOf(dir) || {});
  function outdated() {
    if (!need(S.cwd)) return false;
    keys(direct(S.cwd)).forEach((n) => { const have = resolveFrom(S.cwd, n); if (REGISTRY[n] && have !== latest(n)) say(n + '  current ' + have + '  wanted ' + entry(n, direct(S.cwd)[n]).v + '  latest ' + latest(n)); });
    return true;
  }
  function update(manager, o) {
    if (!need('')) return false;
    const names = o.rest.length ? o.rest : keys(direct(S.cwd));
    return atProjectRoot(manager, () => {
      const ok = reify(manager, { latestFor: names, legacy: o.legacy });
      if (!ok) return false;
      // npm update also raises the minimum written in package.json
      const pkg = pkgOf(''); const lock = readLock(manager);
      ['dependencies', 'devDependencies'].forEach((f) => keys(pkg[f] || {}).forEach((n) => {
        const m = /^([\^~])/.exec(pkg[f][n]);
        if (m && names.indexOf(n) >= 0 && lock.packages[n]) { pkg[f][n] = m[1] + lock.packages[n]; lock.workspaces[''][n] = pkg[f][n]; }
      }));
      savePkg('', pkg);
      writeLock(manager, lock);
      return true;
    });
  }

  function command(a) {
    const manager = a[0];
    if (manager === 'npx' || manager === 'bunx') return npx(a.slice(1));
    let sub = a[1];
    if (!sub) return manager === 'yarn' ? install('yarn', flags([], 'yarn')) : fail(manager + " dan keyin buyruq yozing");
    if (manager === 'pnpm' && (sub === '--filter' || sub === '-F' || sub === '-r' || sub === '--recursive')) {
      // pnpm --filter web add zod  ->  pnpm add --filter web zod
      const head = sub === '-r' || sub === '--recursive' ? [sub] : [sub, a[2]];
      const tail = a.slice(1 + head.length);
      if (!tail.length) return fail('pnpm dan keyin buyruq yozing');
      sub = tail[0];
      a = [manager, sub].concat(head, tail.slice(1));
    }
    if (manager === 'yarn' && sub === 'workspace') {
      if (!a[3]) return fail('yarn workspace <nom> <buyruq>');
      sub = a[3];
      a = [manager, sub, '--filter', a[2]].concat(a.slice(4));
    }
    const args = a.slice(2);
    if (sub === 'dlx' || sub === 'create') return npx(sub === 'create' ? ['create-' + args[0]].concat(args.slice(1)) : args, true);
    if (sub === 'exec' || (manager === 'bun' && sub === 'x')) return npx(args.filter((x) => x !== '--'));
    if (sub === 'pkg') return pkgCmd(args);
    if (sub === 'version' && manager === 'npm') return version(args[0]);
    const o = flags(args, manager);
    if (o.bad) return false;
    if (sub === 'init') return init(o, manager);
    if (sub === 'install' || sub === 'i') return install(manager, o);
    if (sub === 'add') return manager === 'npm' ? fail("npm da: npm install <paket>") : o.rest.length ? add(manager, o) : fail('paket nomini yozing');
    if (sub === 'uninstall' || sub === 'un' || sub === 'remove' || sub === 'rm') return remove(manager, o);
    if (sub === 'ci') return manager === 'npm' ? atProjectRoot('npm', () => { clearModules(); return frozen('npm', o); }) : fail(manager + ' da: ' + manager + ' install --frozen-lockfile');
    if (sub === 'update' || sub === 'up' || sub === 'upgrade') return update(manager, o);
    if (sub === 'outdated') return outdated();
    if (sub === 'ls' || sub === 'list') { if (!need(S.cwd)) return false; keys(direct(S.cwd)).forEach((n) => say(n + '@' + resolveFrom(S.cwd, n))); return true; }
    if (sub === 'view' || sub === 'info') {
      const n = o.rest[0];
      if (!REGISTRY[n]) return fail("404: '" + n + "'");
      say(o.rest[1] === 'versions' ? REGISTRY[n].map((e) => e.v).join(', ') : n + '@' + latest(n) + (REGISTRY[n][REGISTRY[n].length - 1].peer ? ' peer: ' + JSON.stringify(REGISTRY[n][REGISTRY[n].length - 1].peer) : ''));
      return true;
    }
    if (sub === 'run' || sub === 'run-script') return run(manager, o.rest[0], Object.assign(o, { extra: o.extra.concat(o.rest.slice(1)) }));
    if (sub === 'test' || sub === 't') return run(manager, 'test', o);
    if (sub === 'start') return run(manager, 'start', o);
    if (sub === 'link') return link(o);
    if (sub === 'publish') return publish(o);
    // pnpm, yarn and bun allow "pnpm build" for a script
    if (manager !== 'npm') {
      const p = pkgOf(S.cwd);
      if ((p && p.scripts && p.scripts[sub]) || o.ws.length || o.allws) return run(manager, sub, o);
    }
    return fail("noma'lum buyruq: " + manager + ' ' + sub);
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
    if (q) throw new Error("Qo'shtirnoq yopilmagan");
    flush(); return out;
  }

  const removePath = (p) => {
    let hit = false;
    const under = (k) => k === p || k.indexOf(p + '/') === 0;
    [S.files, S.dirs, S.modules, S.links].forEach((o) => Object.keys(o).forEach((k) => { if (k && under(k)) { delete o[k]; hit = true; } }));
    return hit;
  };

  function shell(a) {
    const cmd = a[0];
    const ri = a.findIndex((x) => x === '>' || x === '>>');
    if (cmd === 'echo') {
      const text = (ri >= 0 ? a.slice(1, ri) : a.slice(1)).join(' ');
      if (ri < 0) { say(text); return true; }
      const f = a[ri + 1];
      if (!f) return fail("fayl nomi yo'q");
      const p = norm(f);
      if (a[ri] === '>>' && own(S.files, p) && S.files[p] !== '') write(p, S.files[p] + '\n' + text); else write(p, text);
      return true;
    }
    if (cmd === 'touch') { a.slice(1).forEach((f) => { const p = norm(f); if (!own(S.files, p)) write(p, ''); }); return true; }
    if (cmd === 'mkdir') { a.slice(1).filter((x) => x[0] !== '-').forEach((f) => mkdirs(norm(f))); return true; }
    if (cmd === 'cd') {
      const d = a[1] ? norm(a[1]) : '';
      if (!S.dirs[d]) return fail("cd: '" + a[1] + "': bunday papka yo'q");
      S.cwd = d; return true;
    }
    if (cmd === 'rm') {
      for (const f of a.slice(1).filter((x) => x[0] !== '-')) if (!removePath(norm(f)) && !a.some((x) => /^-\w*f/.test(x))) return fail("rm: '" + f + "' yo'q");
      return true;
    }
    if (cmd === 'cat') { for (const f of a.slice(1)) { const p = norm(f); if (!own(S.files, p)) return fail('cat: ' + f + " yo'q"); say(S.files[p]); } return true; }
    if (cmd === 'ls') {
      const d = a[1] && a[1][0] !== '-' ? norm(a[1]) : S.cwd;
      const prefix = d ? d + '/' : '';
      const seen = {};
      [S.files, S.dirs, S.modules, S.links].forEach((o) => Object.keys(o).forEach((k) => { if (k && k.indexOf(prefix) === 0 && k !== d) seen[k.slice(prefix.length).split('/')[0]] = true; }));
      keys(seen).forEach(say); return true;
    }
    if (cmd === 'pwd') { say('/' + S.cwd); return true; }
    if (cmd === 'node') return exec(S.cwd, a);
    if (cmd === 'clear') return true;
    return fail("'" + cmd + "' buyrug'i tanilmadi");
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
        try { ok = /^(npm|npx|pnpm|yarn|bun|bunx)$/.test(s[0]) ? command(s) : shell(s); } catch (e) { ok = fail('ichki xato: ' + e.message); }
        prevOp = op;
      }
    });
  }

  runLines(setup);
  silent = false; S.errors = []; S.cmds = 0; S.ran = []; S.cwd = ''; S.out = []; S.published = [];
  runLines(script);

  const field = (f) => (dir) => Object.assign({}, (pkgOf(dir || '') || {})[f]);
  return {
    json: (dir) => pkgOf(dir || '') || null,
    deps: field('dependencies'),
    devDeps: field('devDependencies'),
    peerDeps: field('peerDependencies'),
    version: (dir) => (pkgOf(dir || '') || {}).version || null,
    script: (name, dir) => ((pkgOf(dir || '') || {}).scripts || {})[name] || null,
    // the version `require` would find from that folder, or null
    installed: (name, dir) => resolveFrom(dir || '', name),
    // package names that sit directly in the root node_modules
    topLevel: () => keys(S.modules).concat(keys(S.links)).filter((k) => /^node_modules\/(@[^/]+\/)?[^/]+$/.test(k) && k !== 'node_modules/.pnpm').map((k) => k.slice(13)).sort(),
    at: (path) => (own(S.modules, path) ? S.modules[path] : null),
    linked: (name, dir) => own(S.links, modPath(dir || '', name)),
    locked: (name) => { for (const m of Object.keys(LOCKS)) { const l = readLock(m); if (l && l.packages[name]) return l.packages[name]; } return null; },
    lockfiles: () => Object.keys(LOCKS).map((m) => LOCKS[m]).filter((f) => own(S.files, f)).sort(),
    exists: (p) => own(S.files, norm(p, '')) || !!S.dirs[norm(p, '')],
    read: (p) => (own(S.files, norm(p, '')) ? S.files[norm(p, '')] : null),
    workspaces: (manager) => workspaceDirs(manager || (own(S.files, 'pnpm-workspace.yaml') ? 'pnpm' : 'npm')).map(wsName).sort(),
    ran: () => S.ran.slice(),
    out: () => S.out.slice(),
    printed: (text) => S.out.some((l) => l.indexOf(text) >= 0 && l.indexOf('$ ') !== 0),
    published: () => S.published.slice(),
    errors: S.errors,
    ok: () => S.errors.length === 0,
    cmds: S.cmds,
  };
}
