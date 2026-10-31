// Namespaced localStorage keys, kept in one place to avoid collisions.
export const STORAGE_KEYS = {
  CITY: 'skycast:city', // last place shown: a location object (or a "City,CC" string from older versions)
  UNITS: 'skycast:units',
  RECENT_SEARCHES: 'skycast:recent-searches',
  FAVORITES: 'skycast:favorites',
  THEME: 'skycast:theme', // must match the inline script in index.html
};
