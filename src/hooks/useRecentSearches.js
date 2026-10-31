import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { RECENT_SEARCHES_LIMIT } from '../constants/search';
import { isSameCityName, toCityQuery } from '../utils/cityQuery';

const isValidEntry = (entry) => typeof entry?.name === 'string' && entry.name.trim() !== '';
const sameCity = (a, b) => isSameCityName(toCityQuery(a), toCityQuery(b));

// Ignores anything malformed, e.g. storage edited by hand or an older format.
const sanitize = (stored) => (Array.isArray(stored) ? stored.filter(isValidEntry) : []);

// Puts the city first, drops any older copy of it, and caps the list.
export function withRecentSearch(list, { name, countryCode = '' }, limit = RECENT_SEARCHES_LIMIT) {
  const entry = { name, countryCode };
  if (!isValidEntry(entry)) return sanitize(list).slice(0, limit);
  return [entry, ...sanitize(list).filter((e) => !sameCity(e, entry))].slice(0, limit);
}

/**
 * Most-recent-first list of searched cities, persisted to localStorage.
 * Entries are { name, countryCode } from the API response, so "paris" and
 * "Paris" are stored once, under the city's canonical name.
 */
export function useRecentSearches(limit = RECENT_SEARCHES_LIMIT) {
  const [stored, setStored] = useLocalStorage(STORAGE_KEYS.RECENT_SEARCHES, []);
  const recentSearches = useMemo(() => sanitize(stored).slice(0, limit), [stored, limit]);

  const addRecentSearch = useCallback(
    (location) => setStored((prev) => withRecentSearch(prev, location, limit)),
    [setStored, limit]
  );

  const removeRecentSearch = useCallback(
    (entry) => setStored((prev) => sanitize(prev).filter((e) => !sameCity(e, entry))),
    [setStored]
  );

  const clearRecentSearches = useCallback(() => setStored([]), [setStored]);

  return { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches };
}
