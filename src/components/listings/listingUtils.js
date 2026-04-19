// Shared utility used across listings components
export function formatPrice(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  return `₹${(p / 100000).toFixed(2)} Lac`;
}

export function getBadgeClass(p) {
  if (p.is_new_launch) return 'launch';
  if (p.listing_type === 'Sell Property') return 'sale';
  return 'rent';
}

export function getBadgeLabel(p) {
  if (p.is_new_launch) return 'New Launch';
  if (p.listing_type === 'Sell Property') return 'For Sale';
  return 'For Rent';
}
