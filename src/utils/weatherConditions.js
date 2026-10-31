import { UNKNOWN_WEATHER, WEATHER_CODES } from '../constants/weatherCodes';

export function describeWeather(code) {
  const [label, group] = WEATHER_CODES[code] || UNKNOWN_WEATHER;
  return { label, group };
}

// The animated layer drawn over the background. Unlike the palette, rain,
// snow, fog and storms show at night too.
const EFFECTS = { partly: 'clouds', cloudy: 'clouds', fog: 'fog', rain: 'rain', snow: 'snow', storm: 'storm' };

export function getWeatherEffect(code, isDay) {
  const { group } = describeWeather(code);
  if (group === 'clear') return isDay ? 'sun' : 'stars';
  return EFFECTS[group] ?? null;
}

export function getThemeClass(code, isDay) {
  const { group } = describeWeather(code);
  if (!isDay) return 'theme-night';
  return `theme-${group}`;
}
