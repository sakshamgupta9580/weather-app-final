import { SEARCH_MAX_CHARS, SEARCH_MIN_CHARS } from '../constants/search';

// Letters from any language (São Paulo, Zürich, 東京), plus the punctuation
// real place names use: spaces, hyphens, apostrophes, periods and commas.
const CITY_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.,-]*$/u;

export const normalizeQuery = (raw) => raw.trim().replace(/\s+/g, ' ');

export function validateCityQuery(raw) {
  const value = normalizeQuery(raw);

  if (!value) {
    return { isValid: false, value, error: 'Please enter a city name.' };
  }
  if (value.length < SEARCH_MIN_CHARS) {
    return { isValid: false, value, error: `City name must be at least ${SEARCH_MIN_CHARS} characters.` };
  }
  if (value.length > SEARCH_MAX_CHARS) {
    return { isValid: false, value, error: `City name must be ${SEARCH_MAX_CHARS} characters or fewer.` };
  }
  if (!CITY_PATTERN.test(value)) {
    return {
      isValid: false,
      value,
      error: 'Use letters only, plus spaces, hyphens, apostrophes, periods or commas.',
    };
  }
  return { isValid: true, value, error: null };
}
