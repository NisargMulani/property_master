export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatCurrency(val) {
  const n = Number(val);
  if (isNaN(n)) return '₹ 0';
  if (n >= 10000000) return '₹ ' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000)   return '₹ ' + (n / 100000).toFixed(2) + ' L';
  return '₹ ' + n.toLocaleString('en-IN');
}

