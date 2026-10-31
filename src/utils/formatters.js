import { UNITS, UNIT_SYSTEMS } from '../constants/units';

// API times are already in the location's local time (timezone=auto) with no
// offset, so parsing them as browser-local preserves the wall-clock values.

export const celsiusToFahrenheit = (c) => (c * 9) / 5 + 32;

// Temperatures are stored in °C and converted for display.
export function formatTemp(celsius, unitSystem = UNIT_SYSTEMS.METRIC) {
  if (celsius == null) return '--';
  const value = unitSystem === UNIT_SYSTEMS.IMPERIAL ? celsiusToFahrenheit(celsius) : celsius;
  // Avoid showing "-0°" for values like -0.3.
  return `${Math.round(value) || 0}°`;
}

// Wind is stored in km/h.
export function formatWind(kmh, unitSystem = UNIT_SYSTEMS.METRIC) {
  if (kmh == null) return '--';
  const { speed, kmhPerSpeedUnit } = UNITS[unitSystem];
  return `${Math.round(kmh / kmhPerSpeedUnit)} ${speed}`;
}

export const formatHour = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric' });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export function formatDay(isoDate, index) {
  if (index === 0) return 'Today';
  return new Date(`${isoDate}T12:00`).toLocaleDateString([], { weekday: 'short' });
}

export const formatFullDate = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

export function windDirection(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

export function uvLevel(uv) {
  if (uv == null) return '--';
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very high';
  return 'Extreme';
}

// Visibility is stored in metres.
export function formatVisibility(metres, unitSystem = UNIT_SYSTEMS.METRIC) {
  if (metres == null) return '--';
  const { distance, metresPerDistanceUnit } = UNITS[unitSystem];
  return `${(metres / metresPerDistanceUnit).toFixed(1)} ${distance}`;
}

export const formatLocation = ({ name, region, country }) =>
  [name, region && region !== name ? region : null, country].filter(Boolean).join(', ');
