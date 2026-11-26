// StatAtlas — national statistics for 24 countries, 9 indicators, every figure
// sourced from the World Bank (World Development Indicators, fetched 2026-11-26).
// The site itself is app/ (static files, no build step, no network requests);
// this entrypoint only hands it in, then self-checks the handoff below.
//
// A working best-site-01 entry (Node 22, standard library only): the site is this directory's app/ folder, plain
// static files a browser opens at app/index.html (ES modules, CSS, no build step), its content held in its own files:
// nothing it runs, styles or shows loads over the network. The program hands it in: it copies app/ and screenshots/
// from beside this file to /output and writes /output/dossier.json, the summary the judge reads (your screenshots, the
// first load's files and bytes, and your source), with the vendored make.fun library. Leave vendor/makefun-frontend.ts
// as it is: the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// A starting point, not a winner: a plain recipe collection, a list of recipes and a page for each. Build the site the
// brief asks for in app/ (its content, ease of use, a phone layout, its look), put 3 or 4 PNG or JPEG screenshots of
// it running in screenshots/ (the first by name is the cover; one may be a 390 x 844 phone view; shots.json says which
// views this starter's were taken of), and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// StatAtlas post-build self-check: the handoff must actually exist, and the entry
// must carry the screenshots the judge reads (the first by name is the cover).
// Fail loudly here rather than handing in an empty output directory.
const dossierBytes = statSync(join(out, 'dossier.json')).size;
if (dossierBytes === 0) throw new Error('dossier.json is empty');
const dossier = JSON.parse(readFileSync(join(out, 'dossier.json'), 'utf-8'));
if (!dossier || typeof dossier !== 'object') throw new Error('dossier.json did not parse');
const shots = readdirSync(join(out, 'screenshots')).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (shots.length === 0) throw new Error('no screenshots in /output/screenshots');
console.error(`StatAtlas handed in: dossier.json ${dossierBytes} bytes, ${shots.length} screenshot(s)`);
