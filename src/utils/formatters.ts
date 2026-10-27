/**
 * Format price in Algerian Dinars (DZD).
 * Requirement: formatted like "12 500 DA" (or "12 500 د.ج" in Arabic).
 */
export function formatPrice(amount: number, lang: string = 'fr'): string {
  // Format with space as thousands separator
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (lang === 'ar') {
    return `${formatted} د.ج`;
  }
  return `${formatted} DA`;
}

/**
 * Format date in Algerian locale
 */
export function formatDate(dateString: string | Date, lang: string = 'fr'): string {
  const date = new Date(dateString);
  const locale = lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-DZ' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Helper to get localized field from an object with fr/ar/en fields
 */
export function getLocalized<T extends Record<string, any>>(
  item: T,
  field: string,
  lang: string = 'fr'
): string {
  if (!item) return '';
  const langKey = lang === 'ar' ? 'Ar' : lang === 'en' ? 'En' : 'Fr';
  const localizedVal = item[`${field}${langKey}`];
  if (localizedVal) return localizedVal;
  // Fallbacks: Fr -> En -> Ar
  return item[`${field}Fr`] || item[`${field}En`] || item[`${field}Ar`] || item[field] || '';
}
