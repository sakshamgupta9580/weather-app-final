/**
 * Open-Meteo weather service. No API key needed.
 *
 * A city search is two requests: the geocoding API turns the name into
 * coordinates, then the forecast API returns current, hourly and daily data.
 */
import { API_CONFIG, FORECAST_DAYS, HOURLY_FORECAST_HOURS } from '../constants/api';
import { API_ERROR_CODES } from '../constants/apiErrors';
import { ApiError, getJson } from './httpClient';
import { normalizeWeather, toLocation } from './openMeteoMapper';
import { parseCityQuery } from '../utils/cityQuery';

const CURRENT_FIELDS = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day', 'precipitation',
  'weather_code', 'cloud_cover', 'pressure_msl', 'wind_speed_10m', 'wind_direction_10m', 'visibility',
];
const HOURLY_FIELDS = ['temperature_2m', 'weather_code', 'precipitation_probability', 'is_day'];
const DAILY_FIELDS = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_probability_max',
  'sunrise', 'sunset', 'uv_index_max',
];

const withParams = (base, params) => `${base}?${new URLSearchParams(params)}`;

// Open-Meteo updates current conditions every 15 minutes, so a forecast up to
// 5 minutes old is as fresh as a new request. Refresh bypasses this cache.
const FORECAST_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHED_FORECASTS = 20;
const forecastCache = new Map(); // "lat,lon" -> { fetchedAt, forecast }
const geocodeCache = new Map(); // normalized query -> location (places don't move)

const coordsKey = ({ lat, lon }) => `${lat.toFixed(4)},${lon.toFixed(4)}`;

function cacheForecast(key, forecast) {
  forecastCache.delete(key);
  forecastCache.set(key, { fetchedAt: Date.now(), forecast });
  // Maps keep insertion order, so the first key is the oldest entry.
  if (forecastCache.size > MAX_CACHED_FORECASTS) forecastCache.delete(forecastCache.keys().next().value);
}

async function geocode(query, { signal } = {}) {
  const cacheKey = query.trim().toLowerCase();
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);

  const { name, countryCode } = parseCityQuery(query);
  const search = (term) =>
    getJson(
      withParams(API_CONFIG.geocodingUrl, {
        name: term,
        count: 1,
        language: 'en',
        format: 'json',
        ...(countryCode && { countryCode }),
      }),
      { signal }
    );

  let { results } = await search(name);
  // The geocoder matches place names only, so "Paris, France" finds nothing.
  // Retry with just the city part before giving up.
  if (!results?.length && name.includes(',')) {
    ({ results } = await search(name.split(',')[0].trim()));
  }
  if (!results?.length) {
    throw new ApiError(
      `We couldn't find "${query}". Check the spelling, or add a country code like "Paris, FR".`,
      { status: 404, code: API_ERROR_CODES.CITY_NOT_FOUND }
    );
  }
  const location = toLocation(results[0]);
  geocodeCache.set(cacheKey, location);
  return location;
}

async function fetchForecast(location, { signal, fresh = false } = {}) {
  const key = coordsKey(location.coords);
  const cached = forecastCache.get(key);
  if (!fresh && cached && Date.now() - cached.fetchedAt < FORECAST_CACHE_TTL_MS) {
    return normalizeWeather(location, cached.forecast);
  }

  const forecast = await getJson(
    withParams(API_CONFIG.forecastUrl, {
      latitude: location.coords.lat,
      longitude: location.coords.lon,
      current: CURRENT_FIELDS.join(','),
      hourly: HOURLY_FIELDS.join(','),
      daily: DAILY_FIELDS.join(','),
      timezone: 'auto', // times come back in the location's local time
      forecast_days: FORECAST_DAYS,
      // Hourly data starting at the current hour, only as many hours as we
      // show (otherwise 168 hours come back and 144 are thrown away).
      forecast_hours: HOURLY_FORECAST_HOURS,
    }),
    { signal }
  );
  cacheForecast(key, forecast);
  return normalizeWeather(location, forecast);
}

// Every public function goes through this, so callers only ever see
// user-friendly ApiErrors (or an untouched AbortError).
const withFriendlyErrors =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      throw toFriendlyError(err);
    }
  };

export const getWeatherByCity = withFriendlyErrors(async (city, options) => {
  const location = await geocode(city, options);
  return fetchForecast(location, options);
});

// Open-Meteo has no reverse geocoding, so a GPS position is shown as "Your location".
export const getWeatherByCoords = withFriendlyErrors(({ lat, lon }, options) =>
  fetchForecast(
    { name: 'Your location', region: '', country: '', countryCode: '', coords: { lat, lon }, isCurrentLocation: true },
    options
  )
);

// Reloads a place already on screen, keeping its name. Pass { fresh: true }
// to skip the cache (the refresh button).
export const getWeatherForLocation = withFriendlyErrors(fetchForecast);

const STATUS_ERROR_CODES = {
  400: API_ERROR_CODES.INVALID_REQUEST,
  429: API_ERROR_CODES.RATE_LIMITED,
};

function toFriendlyError(err) {
  if (err?.name === 'AbortError') return err;

  // Anything that isn't an ApiError is a bug or a malformed payload (e.g. the
  // mapper hitting a missing field). Log it and show a generic message.
  if (!(err instanceof ApiError)) {
    if (import.meta.env.DEV) console.error('[Open-Meteo] unexpected error:', err);
    return ApiError.fromCode(API_ERROR_CODES.INVALID_RESPONSE);
  }

  // Already user-friendly: network, timeout, offline, city not found.
  if (err.code) return err;

  const { status, body } = err;
  if (import.meta.env.DEV) {
    console.error(`[Open-Meteo] ${status}:`, body?.reason || err.message);
  }
  return ApiError.fromCode(STATUS_ERROR_CODES[status] ?? API_ERROR_CODES.SERVER_ERROR, { status, body });
}
