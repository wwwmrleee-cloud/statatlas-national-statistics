// Small SVG chart builders for StatAtlas. No chart library is vendored:
// every chart is a hand-rolled SVG bar chart, so the first load stays tiny
// and every pixel on screen comes from this file's code.

// Horizontal bars: rows of {label, value, display, highlight}.
// value is the raw number (null skips the bar), display is the text shown.
export function hbarChart(rows, options = {}) {
  const width = options.width || 640;
  const rowH = options.rowH || 30;
  const labelW = options.labelW || 150;
  const barMax = width - labelW - 90;
  const max = Math.max(0, ...rows.map((r) => (r.value ?? 0)));
  const height = rows.length * rowH + 8;
  const parts = [`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.aria || 'Bar chart'}" class="chart">`];
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const w = max > 0 && r.value !== null && r.value !== undefined ? Math.max(2, (r.value / max) * barMax) : 0;
    const fill = r.highlight ? 'var(--accent)' : 'var(--bar)';
    parts.push(
      `<text x="0" y="${y + 15}" class="chart-label">${r.label}</text>`,
      `<rect x="${labelW}" y="${y + 4}" width="${w}" height="16" rx="3" fill="${fill}"/>`,
      `<text x="${labelW + w + 8}" y="${y + 17}" class="chart-value">${r.display}</text>`,
    );
  });
  parts.push('</svg>');
  return parts.join('');
}

// Grouped bars: one indicator across a few countries, for the compare page.
// groups: [{label, value, display, highlight}].
export function groupedBars(groups, options = {}) {
  return hbarChart(groups, { ...options, aria: options.aria || 'Country comparison chart' });
}

// A single-value gauge: a bar from 0 to max with a marker for the value,
// used on country pages to show where one country sits on an indicator.
export function gauge(value, max, display, options = {}) {
  const width = options.width || 320;
  const w = max > 0 && value !== null && value !== undefined ? Math.max(2, (value / max) * width) : 0;
  return `<svg viewBox="0 0 ${width + 90} 26" role="img" aria-label="Value ${display}" class="chart gauge">
    <rect x="0" y="5" width="${width}" height="12" rx="6" fill="var(--track)"/>
    <rect x="0" y="5" width="${w}" height="12" rx="6" fill="var(--accent)"/>
    <text x="${width + 8}" y="17" class="chart-value">${display}</text>
  </svg>`;
}
