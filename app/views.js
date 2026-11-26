// Page renderers for StatAtlas. Each function returns the HTML for one route;
// main.js wires them to the hash router. All figures come from data.js.

import { COUNTRIES, INDICATORS, SOURCE_NOTE } from './data.js';
import { fmtNum, fmtPop, fmtMoney, fmtPct, fmtYears, fmtTonnes, rankOf, esc } from './format.js';
import { hbarChart, gauge } from './charts.js';

export const fmtFor = {
  pop: (v) => fmtPop(v),
  money: (v) => fmtMoney(v),
  pct: (v) => fmtPct(v),
  years: (v) => fmtYears(v),
  tonnes: (v) => fmtTonnes(v),
  num: (v) => (v === null || v === undefined ? '—' : fmtNum(v, 2)),
};

export function indicatorById(id) {
  return INDICATORS.find((i) => i.id === id) || INDICATORS[0];
}

export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === code);
}

function rowsFor(ind) {
  return COUNTRIES.map((c) => ({ code: c.code, name: c.name, value: c[ind.id] }));
}

function regionOptions() {
  return [...new Set(COUNTRIES.map((c) => c.region))].sort();
}

function header(active) {
  const link = (href, label) =>
    `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<header class="site-head">
    <a class="brand" href="#/">StatAtlas</a>
    <nav aria-label="Main">
      ${link('#/', 'Countries')}
      ${link('#/indicator/gdppc', 'Indicators')}
      ${link('#/compare', 'Compare')}
      ${link('#/about', 'About the data')}
    </nav>
  </header>`;
}

function footer() {
  return `<footer class="site-foot">
    <p>All figures: ${esc(SOURCE_NOTE)}, retrieved 2026-11-26. Each figure is labelled with its year on its own page.
    StatAtlas is an independent reference site, not affiliated with the World Bank.</p>
    <p><a href="#/about">How the data was gathered</a> · <a href="#/compare">Compare countries</a></p>
  </footer>`;
}

function layout(active, main) {
  return `${header(active)}<main>${main}</main>${footer()}`;
}

// ---------------------------------------------------------------- home
export function home(state) {
  const ind = indicatorById(state.ind || 'gdppc');
  const q = (state.q || '').toLowerCase();
  const region = state.region || 'All regions';
  const sortKey = state.sort || ind.id;
  const sortDir = state.dir === 'asc' ? 1 : -1;

  let list = COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  if (region !== 'All regions') list = list.filter((c) => c.region === region);
  const sortVal = (c) => (sortKey === 'name' ? c.name : c[sortKey]);
  list = [...list].sort((a, b) => {
    const va = sortVal(a);
    const vb = sortVal(b);
    if (typeof va === 'string') return sortDir * va.localeCompare(vb);
    if (va === null || va === undefined) return 1;
    if (vb === null || vb === undefined) return -1;
    return sortDir * (va - vb);
  });

  const top = [...rowsFor(ind)]
    .filter((r) => r.value !== null && r.value !== undefined)
    .sort((a, b) => (ind.higherIsBetter ? b.value - a.value : a.value - b.value))
    .slice(0, 10)
    .map((r) => ({ label: r.name, value: r.value, display: fmtFor[ind.format](r.value) }));

  const th = (key, label) => {
    const arrow = sortKey === key ? (sortDir === 1 ? ' ▲' : ' ▼') : '';
    const nextDir = sortKey === key && sortDir === -1 ? 'asc' : 'desc';
    return `<th><a href="#/?ind=${ind.id}&sort=${key}&dir=${nextDir}&q=${encodeURIComponent(state.q || '')}&region=${encodeURIComponent(region)}">${label}${arrow}</a></th>`;
  };

  const rows = list.map((c) => {
    const r = rankOf(rowsFor(ind), c.code, ind.higherIsBetter);
    return `<tr>
      <td><a class="country-link" href="#/country/${c.code}">${esc(c.name)}</a></td>
      <td>${esc(c.region)}</td>
      <td class="num">${fmtPop(c.pop)}</td>
      <td class="num">${fmtMoney(c.gdppc)}</td>
      <td class="num">${fmtYears(c.life)}</td>
      <td class="num">${fmtPct(c.growth, 2)}</td>
      <td class="num">${fmtPct(c.unemp)}</td>
      <td class="num">${r ? `#${r.rank}` : '—'}</td>
    </tr>`;
  }).join('');

  const chips = ['All regions', ...regionOptions()].map((rg) =>
    `<a class="chip${rg === region ? ' on' : ''}" href="#/?ind=${ind.id}&region=${encodeURIComponent(rg)}&q=${encodeURIComponent(state.q || '')}">${esc(rg)}</a>`,
  ).join('');

  const pickers = INDICATORS.map((i) =>
    `<a class="chip${i.id === ind.id ? ' on' : ''}" href="#/?ind=${i.id}&region=${encodeURIComponent(region)}&q=${encodeURIComponent(state.q || '')}">${esc(i.label)}</a>`,
  ).join('');

  return layout('#/', `
  <section class="hero">
    <p class="kicker">24 countries · 9 indicators · every figure sourced</p>
    <h1>National statistics, compared properly.</h1>
    <p class="lede">Population, income, health, work and climate for 24 major economies — every figure sourced, ranked and comparable.</p>
    <form class="search" action="#/" method="get" onsubmit="return false;">
      <label for="q">Search a country</label>
      <input id="q" name="q" type="search" value="${esc(state.q || '')}" placeholder="Try “Japan” or “NGA”…"
        oninput="window.__filter(this.value)">
    </form>
    <div class="chips" role="group" aria-label="Filter by region">${chips}</div>
  </section>

  <section class="panel">
    <h2>Top 10 by ${esc(ind.label)} <span class="year">(${ind.year})</span></h2>
    <p class="hint">${esc(ind.about)} ${ind.higherIsBetter ? 'Higher is better.' : 'Lower is better.'}
    Source: ${esc(SOURCE_NOTE)} (${ind.code}, ${ind.year}).</p>
    <div class="pickers" role="group" aria-label="Choose an indicator">${pickers}</div>
    ${hbarChart(top, { rowH: 26, aria: `Top 10 countries by ${ind.label}` })}
  </section>

  <section class="panel">
    <h2>All countries <span class="count"><span id="shown-count">${list.length}</span> shown</span></h2>
    <p class="hint">Click a column heading to sort. Click a country for its full profile.</p>
    <div class="table-wrap"><table>
      <thead><tr>
        ${th('name', 'Country')}${th('region', 'Region')}${th('pop', 'Population')}
        ${th('gdppc', 'GDP per capita')}${th('life', 'Life expectancy')}${th('growth', 'GDP growth')}
        ${th('unemp', 'Unemployment')}<th>Rank: ${esc(ind.label)}</th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="8">No country matches that search.</td></tr>'}</tbody>
    </table></div>
    <p id="no-match" hidden>No country matches that search.</p>
    <p class="hint">Population, GDP per capita and life expectancy: ${esc(SOURCE_NOTE)}, 2023. GDP growth: 2023.
    Unemployment: 2023 (ILO modelled). See <a href="#/about">About the data</a> for every source and year.</p>
  </section>`);
}

// ---------------------------------------------------------------- country
export function country(code) {
  const c = countryByCode(code);
  if (!c) {
    return layout('#/', `<section class="panel"><h1>No such country</h1>
      <p>StatAtlas covers 24 countries. <a href="#/">See the full list</a>.</p></section>`);
  }
  const cards = INDICATORS.map((ind) => {
    const r = rankOf(rowsFor(ind), c.code, ind.higherIsBetter);
    const max = Math.max(...COUNTRIES.map((x) => x[ind.id] ?? 0));
    return `<article class="stat-card">
      <h3><a href="#/indicator/${ind.id}">${esc(ind.label)}</a></h3>
      <p class="big">${fmtFor[ind.format](c[ind.id])}</p>
      <p class="sub">${esc(ind.unit)} · ${ind.year}</p>
      ${gauge(c[ind.id], max, fmtFor[ind.format](c[ind.id]))}
      <p class="rank">${r ? `Ranked #${r.rank} of ${r.of} countries` : 'Not ranked'}</p>
      <p class="src">Source: ${esc(SOURCE_NOTE)}</p>
    </article>`;
  }).join('');

  const peers = COUNTRIES.filter((x) => x.region === c.region && x.code !== c.code);
  const peerRows = [c, ...peers]
    .map((x) => ({ label: x.name, value: x.gdppc, display: fmtMoney(x.gdppc), highlight: x.code === c.code }))
    .sort((a, b) => b.value - a.value);

  return layout('#/', `
  <section class="hero country-hero">
    <p class="kicker"><a href="#/">← All countries</a> · ${esc(c.region)}</p>
    <h1>${esc(c.name)}</h1>
    <p class="lede">Capital: ${esc(c.capital)} · ${esc(c.income)} economy · ${fmtPop(c.pop)} people (2023)</p>
    <p><a class="button" href="#/compare?c=${c.code}">Compare ${esc(c.name)} with others</a></p>
  </section>

  <section class="panel">
    <h2>At a glance <span class="year">— 9 indicators, each with source and year</span></h2>
    <div class="stat-grid">${cards}</div>
  </section>

  <section class="panel">
    <h2>GDP per capita in ${esc(c.region)} <span class="year">(2023, current US$)</span></h2>
    <p class="hint">How ${esc(c.name)} stands against the other countries in its region.</p>
    ${hbarChart(peerRows, { aria: `GDP per capita in ${c.region}` })}
    <p class="hint">Source: ${esc(SOURCE_NOTE)} (NY.GDP.PCAP.CD, 2023).</p>
  </section>`);
}

// ---------------------------------------------------------------- indicator
export function indicator(id) {
  const ind = indicatorById(id);
  const ranked = [...rowsFor(ind)]
    .filter((r) => r.value !== null && r.value !== undefined)
    .sort((a, b) => (ind.higherIsBetter ? b.value - a.value : a.value - b.value));
  const top = ranked.slice(0, 10).map((r) => ({
    label: r.name, value: r.value, display: fmtFor[ind.format](r.value),
  }));
  const rows = ranked.map((r, i) => {
    const c = countryByCode(r.code);
    return `<tr>
      <td class="num">#${i + 1}</td>
      <td><a class="country-link" href="#/country/${r.code}">${esc(r.name)}</a></td>
      <td>${esc(c.region)}</td>
      <td class="num"><strong>${fmtFor[ind.format](r.value)}</strong></td>
    </tr>`;
  }).join('');

  const links = INDICATORS.map((i) =>
    `<a class="chip${i.id === ind.id ? ' on' : ''}" href="#/indicator/${i.id}">${esc(i.label)}</a>`,
  ).join('');

  return layout('#/indicator/gdppc', `
  <section class="hero">
    <p class="kicker"><a href="#/">← All countries</a> · Indicator ${INDICATORS.indexOf(ind) + 1} of ${INDICATORS.length}</p>
    <h1>${esc(ind.label)}</h1>
    <p class="lede">${esc(ind.about)}</p>
    <p class="source-line">Source: ${esc(SOURCE_NOTE)} · Indicator ${ind.code} · Year ${ind.year} ·
    Unit: ${esc(ind.unit)} · ${ind.higherIsBetter ? 'Higher is better.' : 'Lower is better.'}</p>
    <div class="chips">${links}</div>
  </section>

  <section class="panel">
    <h2>Top 10 <span class="year">(${ind.year})</span></h2>
    ${hbarChart(top, { aria: `Top 10 countries by ${ind.label}` })}
  </section>

  <section class="panel">
    <h2>Full ranking <span class="count">${ranked.length} countries</span></h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Rank</th><th>Country</th><th>Region</th><th>${esc(ind.label)} (${ind.year})</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="hint">Figures as published by the World Bank, retrieved 2026-11-26. Values are rounded for display;
    rankings use the full published values. See <a href="#/about">About the data</a> for the method.</p>
  </section>`);
}

// ---------------------------------------------------------------- compare
export function compare(state) {
  const picked = (state.c || ['USA', 'CHN', 'IND'])
    .filter((code) => countryByCode(code))
    .slice(0, 3);
  while (picked.length < 3) {
    const next = COUNTRIES.find((c) => !picked.includes(c.code));
    picked.push(next.code);
  }
  const countries = picked.map(countryByCode);
  const options = (selected) => COUNTRIES.map((c) =>
    `<option value="${c.code}"${c.code === selected ? ' selected' : ''}>${esc(c.name)}</option>`,
  ).join('');

  const selects = countries.map((c, i) => `
    <label>Country ${i + 1}
      <select class="compare-select" onchange="const v=[...document.querySelectorAll('.compare-select')].map(s=>s.value);location.hash='#/compare?c='+v.join('&c=');">
        ${options(c.code)}
      </select>
    </label>`).join('');

  const charts = INDICATORS.map((ind) => {
    const groups = countries.map((c) => ({
      label: c.name, value: c[ind.id], display: fmtFor[ind.format](c[ind.id]),
    }));
    return `<article class="mini-chart">
      <h3><a href="#/indicator/${ind.id}">${esc(ind.label)}</a> <span class="year">(${ind.year})</span></h3>
      ${hbarChart(groups, { width: 420, labelW: 110, aria: `${ind.label} compared` })}
      <p class="sub">${esc(ind.unit)} · ${ind.higherIsBetter ? 'higher is better' : 'lower is better'}</p>
    </article>`;
  }).join('');

  const tableRows = INDICATORS.map((ind) => {
    const cells = countries.map((c) => {
      const r = rankOf(rowsFor(ind), c.code, ind.higherIsBetter);
      return `<td class="num">${fmtFor[ind.format](c[ind.id])}${r ? ` <span class="rank-inline">#${r.rank}</span>` : ''}</td>`;
    }).join('');
    return `<tr><td><a href="#/indicator/${ind.id}">${esc(ind.label)}</a> <span class="year">(${ind.year})</span></td>${cells}</tr>`;
  }).join('');

  return layout('#/compare', `
  <section class="hero">
    <p class="kicker">Side by side · up to 3 countries</p>
    <h1>Compare countries</h1>
    <p class="lede">Pick three countries and see all nine indicators next to each other — charts and a table,
    with each country's rank out of 24.</p>
    <div class="compare-selects">${selects}</div>
  </section>

  <section class="panel">
    <h2>${countries.map((c) => esc(c.name)).join(' vs ')}</h2>
    <div class="mini-grid">${charts}</div>
  </section>

  <section class="panel">
    <h2>All nine indicators, side by side</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator</th>${countries.map((c) => `<th><a href="#/country/${c.code}">${esc(c.name)}</a></th>`).join('')}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table></div>
    <p class="hint">Ranks are out of the 24 countries StatAtlas covers. Sources and years: ${esc(SOURCE_NOTE)} — see <a href="#/about">About the data</a>.</p>
  </section>`);
}

// ---------------------------------------------------------------- about
export function about() {
  const rows = INDICATORS.map((ind) => `<tr>
    <td><a href="#/indicator/${ind.id}">${esc(ind.label)}</a></td>
    <td>${ind.code}</td><td class="num">${ind.year}</td><td>${esc(ind.unit)}</td>
    <td>${esc(ind.about)}</td>
  </tr>`).join('');

  return layout('#/about', `
  <section class="hero">
    <p class="kicker">Method · sources · limits</p>
    <h1>About the data</h1>
    <p class="lede">StatAtlas shows 216 figures for 24 countries and 9 indicators. Every figure was fetched
    from the World Bank's World Development Indicators on 2026-11-26 and is shown with its source and year.
    Nothing on this site is estimated, modelled by us, or invented.</p>
  </section>

  <section class="panel">
    <h2>The nine indicators</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator</th><th>World Bank code</th><th>Year</th><th>Unit</th><th>What it measures</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="hint">CO2 per capita uses the Bank's greenhouse-gas series (EN.GHG.CO2.PC.CE.AR5); its latest
    published year for these countries is 2022, so it is labelled 2022 while the rest are 2023.
    Unemployment is the ILO modelled estimate the Bank publishes.</p>
  </section>

  <section class="panel">
    <h2>How to read the site</h2>
    <ul class="read-list">
      <li><strong>Ranks</strong> are out of the 24 countries covered, using the full published values; the display rounds them.</li>
      <li><strong>“Higher is better”</strong> applies to population size, income, growth, life expectancy and Internet use.
      For unemployment, inflation and CO2, lower is better — the rankings flip accordingly.</li>
      <li><strong>Figures change.</strong> The World Bank revises its series; a figure fetched later may differ slightly.
      The retrieval date (2026-11-26) is on every page's footer.</li>
      <li><strong>Coverage.</strong> The 24 countries are the world's largest economies and most populous nations,
      chosen so the rankings mean something — not every country on earth.</li>
    </ul>
  </section>

  <section class="panel">
    <h2>What StatAtlas is not</h2>
    <p>StatAtlas is an independent reference site built for readers who want a country's numbers quickly.
    It is not affiliated with the World Bank, the IMF or any national statistics office, and it does not
    collect any data from its visitors: the whole site is static files, and nothing leaves your browser.</p>
    <p><a class="button" href="#/">Browse the countries →</a></p>
  </section>`);
}
