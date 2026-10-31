// Open-Meteo: free, no API key, CORS-enabled, so the browser calls it directly.
// https://open-meteo.com/en/docs
export const API_CONFIG = {
  geocodingUrl: 'https://geocoding-api.open-meteo.com/v1/search',
  forecastUrl: 'https://api.open-meteo.com/v1/forecast',
  defaultCity: import.meta.env.VITE_DEFAULT_CITY || 'London',
  requestTimeoutMs: 10000,
};

export const FORECAST_DAYS = 7;
export const HOURLY_FORECAST_HOURS = 24;
