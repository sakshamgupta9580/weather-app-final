// Display units. Weather data is always fetched and stored in metric
// (°C, km/h, metres) and converted for display.
export const UNIT_SYSTEMS = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
};

export const UNITS = {
  [UNIT_SYSTEMS.METRIC]: {
    temperatureName: 'Celsius',
    temperatureSymbol: 'C',
    speed: 'km/h',
    kmhPerSpeedUnit: 1,
    distance: 'km',
    metresPerDistanceUnit: 1000,
  },
  [UNIT_SYSTEMS.IMPERIAL]: {
    temperatureName: 'Fahrenheit',
    temperatureSymbol: 'F',
    speed: 'mph',
    kmhPerSpeedUnit: 1.609344,
    distance: 'mi',
    metresPerDistanceUnit: 1609.34,
  },
};

export const DEFAULT_UNIT_SYSTEM = UNIT_SYSTEMS.METRIC;
