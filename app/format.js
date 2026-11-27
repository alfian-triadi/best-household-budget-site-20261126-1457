// Rupiah formatting helpers. All money on the site is shown in Indonesian
// rupiah with dot thousands separators, e.g. Rp 3.500.000.

export function idr(amount) {
  const value = Math.round(Number(amount) || 0);
  return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function idrShort(amount) {
  const value = Number(amount) || 0;
  if (value >= 1000000) return 'Rp ' + (value / 1000000).toFixed(1).replace(/\.0$/, '') + ' jt';
  if (value >= 1000) return 'Rp ' + Math.round(value / 1000) + ' rb';
  return idr(value);
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Format a YYYY-MM-DD date as e.g. "2 Nov 2026".
export function prettyDate(iso) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${months[month - 1]} ${year}`;
}
