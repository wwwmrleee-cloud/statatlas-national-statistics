// Router for StatAtlas: hash routes, no build step, no network.
//   #/                          home: ranked table, charts, search, region filter
//   #/country/<CODE>           one country's full profile
//   #/indicator/<id>           one indicator's definition and full ranking
//   #/compare?c=A&c=B&c=C      up to three countries side by side
//   #/about                    method, sources and limits
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { home, country, indicator, compare, about } from './views.js';

const app = document.getElementById('app');

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  const parts = path.split('/').filter(Boolean);
  return { parts, params };
}

function render() {
  window.__shotReady = false;
  const { parts, params } = parseHash();
  let html;
  let title = 'StatAtlas — National statistics, compared';
  if (parts[0] === 'country' && parts[1]) {
    html = country(parts[1].toUpperCase());
    title = `${parts[1].toUpperCase()} statistics | StatAtlas`;
  } else if (parts[0] === 'indicator' && parts[1]) {
    html = indicator(parts[1]);
    title = `${parts[1]} | StatAtlas`;
  } else if (parts[0] === 'compare') {
    html = compare({ c: params.getAll('c') });
    title = 'Compare countries | StatAtlas';
  } else if (parts[0] === 'about') {
    html = about();
    title = 'About the data | StatAtlas';
  } else {
    html = home({
      ind: params.get('ind') || undefined,
      q: params.get('q') || '',
      region: params.get('region') || undefined,
      sort: params.get('sort') || undefined,
      dir: params.get('dir') || undefined,
    });
  }
  document.title = title;
  app.innerHTML = html;
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Live search on the home table: filters the rows already on screen
// without a re-render, so the input keeps focus while you type.
window.__filter = function (q) {
  const needle = q.trim().toLowerCase();
  const rows = document.querySelectorAll('#app tbody tr');
  let shown = 0;
  rows.forEach((row) => {
    const hit = !needle || row.textContent.toLowerCase().includes(needle);
    row.style.display = hit ? '' : 'none';
    if (hit) shown += 1;
  });
  const count = document.getElementById('shown-count');
  if (count) count.textContent = shown;
  const note = document.getElementById('no-match');
  if (note) note.hidden = shown !== 0;
};

window.addEventListener('hashchange', render);
render();
