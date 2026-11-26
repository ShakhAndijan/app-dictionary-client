// Bundles lab/react-runtime.js into src/pages/reactLab.gen.js (a self-contained Web Worker script). React is built in
// development mode on purpose: `act` and the warnings the labs check exist only there. Runs before `dev` and `build`.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = (p) => fileURLToPath(new URL('../' + p, import.meta.url));

// the result printer and deep comparison are shared with the JavaScript labs
const source = readFileSync(root('src/pages/devLab.ts'), 'utf8');
const from = source.indexOf('const show = ');
const to = source.indexOf('self.onmessage');
if (from < 0 || to < from) throw new Error('devLab.ts worker source not found');
const helpers = source.slice(from, to).replace(/\\\\/g, '\\');

await esbuild.build({
  entryPoints: [root('lab/react-runtime.js')],
  outfile: root('src/pages/reactLab.gen.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  keepNames: true,
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"development"' },
  banner: { js: helpers },
  logLevel: 'warning',
});
