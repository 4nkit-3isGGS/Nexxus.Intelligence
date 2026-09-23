/**
 * Standardized masking and formatting utilities
 */

/**
 * Masks a hash, UUID, or identifier by preserving only the trailing characters.
 * Example: 'P-076ac6bd-fac2-4716-ba18-b17d48778eb8' -> '...b17d48778eb8'
 * 
 * @param {string} str - Raw hash or UUID string
 * @param {number} visibleCount - Number of trailing characters to preserve (default: 10)
 * @returns {string} Truncated string prefixed with ellipsis
 */
export const maskHash = (str, visibleCount = 10) => {
  if (!str) return '';
  const clean = String(str).trim();
  if (clean.length <= visibleCount) return clean;
  return `...${clean.slice(-visibleCount)}`;
};
