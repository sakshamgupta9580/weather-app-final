// WMO weather interpretation codes -> [label, icon/theme group].
// https://open-meteo.com/en/docs#weathervariables
export const WEATHER_GROUPS = {
  CLEAR: 'clear',
  PARTLY: 'partly',
  CLOUDY: 'cloudy',
  FOG: 'fog',
  RAIN: 'rain',
  SNOW: 'snow',
  STORM: 'storm',
};

const { CLEAR, PARTLY, CLOUDY, FOG, RAIN, SNOW, STORM } = WEATHER_GROUPS;

export const WEATHER_CODES = {
  0: ['Clear sky', CLEAR],
  1: ['Mainly clear', CLEAR],
  2: ['Partly cloudy', PARTLY],
  3: ['Overcast', CLOUDY],
  45: ['Fog', FOG],
  48: ['Depositing rime fog', FOG],
  51: ['Light drizzle', RAIN],
  53: ['Drizzle', RAIN],
  55: ['Dense drizzle', RAIN],
  56: ['Freezing drizzle', RAIN],
  57: ['Dense freezing drizzle', RAIN],
  61: ['Light rain', RAIN],
  63: ['Rain', RAIN],
  65: ['Heavy rain', RAIN],
  66: ['Freezing rain', RAIN],
  67: ['Heavy freezing rain', RAIN],
  71: ['Light snow', SNOW],
  73: ['Snow', SNOW],
  75: ['Heavy snow', SNOW],
  77: ['Snow grains', SNOW],
  80: ['Light showers', RAIN],
  81: ['Showers', RAIN],
  82: ['Violent showers', RAIN],
  85: ['Snow showers', SNOW],
  86: ['Heavy snow showers', SNOW],
  95: ['Thunderstorm', STORM],
  96: ['Thunderstorm with hail', STORM],
  99: ['Severe thunderstorm', STORM],
};

export const UNKNOWN_WEATHER = ['Unknown', CLOUDY];
