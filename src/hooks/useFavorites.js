import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { isSamePlace } from '../utils/cityQuery';

const isValidFavorite = (entry) =>
  typeof entry?.name === 'string' &&
  entry.name.trim() !== '' &&
  Number.isFinite(entry?.coords?.lat) &&
  Number.isFinite(entry?.coords?.lon);

// Ignores anything malformed, e.g. storage edited by hand.
const sanitize = (stored) => (Array.isArray(stored) ? stored.filter(isValidFavorite) : []);

// Only the fields needed to show the chip and reload the place.
const toFavorite = ({ name, region = '', country = '', countryCode = '', coords }) => ({
  name,
  region,
  country,
  countryCode,
  coords: { lat: coords.lat, lon: coords.lon },
});

// Adds the place if it isn't saved, removes it if it is. Order is kept
// (oldest first) so chips don't jump around as favorites change.
export function toggleFavoriteIn(list, location) {
  const favorites = sanitize(list);
  if (!isValidFavorite(location)) return favorites;
  return favorites.some((f) => isSamePlace(f, location))
    ? favorites.filter((f) => !isSamePlace(f, location))
    : [...favorites, toFavorite(location)];
}

/**
 * Favorite places, persisted to localStorage. Stored with coordinates, so a
 * favorite reloads directly without a geocoding request.
 */
export function useFavorites() {
  const [stored, setStored] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  const favorites = useMemo(() => sanitize(stored), [stored]);

  const isFavorite = useCallback((location) => favorites.some((f) => isSamePlace(f, location)), [favorites]);

  const toggleFavorite = useCallback((location) => setStored((prev) => toggleFavoriteIn(prev, location)), [setStored]);

  const removeFavorite = useCallback(
    (location) => setStored((prev) => sanitize(prev).filter((f) => !isSamePlace(f, location))),
    [setStored]
  );

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
