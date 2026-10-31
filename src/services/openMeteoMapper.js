/**
 * Converts Open-Meteo responses into the app's normalized weather shape,
 * so components stay independent of the provider.
 *
 * Requested with timezone=auto, so all times are location-local wall-clock
 * strings ("2026-10-26T14:00") and display in the city's time, not the
 * viewer's. Weather codes are already WMO codes. Units: °C, km/h, mm.
 */
import { HOURLY_FORECAST_HOURS } from '../constants/api';

let regionNames;
function countryName(code) {
  if (!code) return '';
  try {
    regionNames ??= new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}

// A geocoding result -> the app's location shape.
export function toLocation(place) {
  const countryCode = place.country_code || '';
  return {
    name: place.name,
    region: place.admin1 || '',
    country: place.country || countryName(countryCode),
    countryCode,
    coords: { lat: place.latitude, lon: place.longitude },
  };
}

export function normalizeWeather(location, { current, hourly, daily }) {
  const normalizedCurrent = {
    time: current.time,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    pressure: current.pressure_msl,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    precipitation: current.precipitation ?? 0,
    cloudCover: current.cloud_cover ?? null,
    visibility: current.visibility ?? null,
    weatherCode: current.weather_code,
    description: null, // components fall back to the WMO label
    isDay: current.is_day === 1,
  };

  // Hourly data starts at midnight; begin at the current hour, shown as "Now".
  const currentHour = `${current.time.slice(0, 13)}:00`;
  const start = Math.max(0, hourly.time.findIndex((t) => t >= currentHour));
  const hours = hourly.time.slice(start, start + HOURLY_FORECAST_HOURS).map((time, i) => ({
    time,
    temperature: hourly.temperature_2m[start + i],
    weatherCode: hourly.weather_code[start + i],
    precipitationChance: hourly.precipitation_probability?.[start + i] ?? 0,
    isDay: hourly.is_day?.[start + i] === 1,
  }));
  if (hours.length) {
    hours[0] = {
      ...hours[0],
      temperature: normalizedCurrent.temperature,
      weatherCode: normalizedCurrent.weatherCode,
      isDay: normalizedCurrent.isDay,
    };
  }

  const days = daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    precipitationChance: daily.precipitation_probability_max?.[i] ?? 0,
    sunrise: daily.sunrise?.[i] ?? null,
    sunset: daily.sunset?.[i] ?? null,
    uvIndex: daily.uv_index_max?.[i] ?? null,
  }));

  return { location, current: normalizedCurrent, hourly: hours, daily: days };
}
