// The "City,CC" query format, used to save a city (last city, recent
// searches) and to load exactly that city again.

// { name: 'Paris', countryCode: 'FR' } -> "Paris,FR"
export const toCityQuery = ({ name, countryCode }) => (countryCode ? `${name},${countryCode}` : name);

// Accepts "Paris", "Paris, FR" or "Paris, France". A trailing two-letter part
// is treated as a country code.
export function parseCityQuery(query) {
  const parts = query.split(',').map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1];
  if (parts.length > 1 && /^[a-z]{2}$/i.test(last)) {
    return { name: parts.slice(0, -1).join(', '), countryCode: last.toUpperCase() };
  }
  return { name: parts.join(', '), countryCode: null };
}

export const isSameCityName = (a, b) => Boolean(a && b) && a.toLowerCase() === b.toLowerCase();

// Two locations are the same place when their coordinates match. Unlike
// names, this tells Paris, FR from Paris, US and ignores spelling.
export const isSamePlace = (a, b) =>
  Boolean(a?.coords && b?.coords) &&
  a.coords.lat.toFixed(4) === b.coords.lat.toFixed(4) &&
  a.coords.lon.toFixed(4) === b.coords.lon.toFixed(4);
