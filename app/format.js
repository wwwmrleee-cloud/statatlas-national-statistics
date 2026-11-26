// Number and text formatting helpers for StatAtlas.
// One job: turn raw indicator values into the strings a reader sees.

export function fmtNum(value, decimals = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPop(value) {
  // Population arrives as a head count; show it in millions with one decimal.
  if (value === null || value === undefined) return '—';
  return `${fmtNum(value / 1e6, 1)}M`;
}

export function fmtMoney(value) {
  if (value === null || value === undefined) return '—';
  return `$${fmtNum(value)}`;
}

export function fmtPct(value, decimals = 1) {
  if (value === null || value === undefined) return '—';
  return `${fmtNum(value, decimals)}%`;
}

export function fmtYears(value) {
  if (value === null || value === undefined) return '—';
  return `${fmtNum(value, 1)} yrs`;
}

export function fmtTonnes(value) {
  if (value === null || value === undefined) return '—';
  return `${fmtNum(value, 1)} t`;
}

// Rank of a value within a list of {code, value} rows, highest first.
// Ties share a rank; null values are unranked.
export function rankOf(rows, code, higherIsBetter = true) {
  const sorted = rows
    .filter((r) => r.value !== null && r.value !== undefined)
    .sort((a, b) => (higherIsBetter ? b.value - a.value : a.value - b.value));
  const index = sorted.findIndex((r) => r.code === code);
  if (index === -1) return null;
  let rank = index + 1;
  for (let i = index - 1; i >= 0 && sorted[i].value === sorted[index].value; i -= 1) rank = i + 1;
  return { rank, of: sorted.length };
}

export function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
