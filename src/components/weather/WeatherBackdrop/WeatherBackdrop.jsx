import { memo } from 'react';
import './WeatherBackdrop.css';

// Deterministic pseudo-random numbers, so particles keep their positions
// across renders and reloads instead of jumping around.
const seeded = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const range = (i, salt, min, max) => min + seeded(i, salt) * (max - min);

const RAIN_DROPS = Array.from({ length: 40 }, (_, i) => ({
  '--x': `${range(i, 1, 0, 100)}%`,
  '--len': `${range(i, 2, 50, 95)}px`,
  '--dur': `${range(i, 3, 0.55, 0.95)}s`,
  '--delay': `${-range(i, 4, 0, 1)}s`, // negative: already falling on first paint
}));

const SNOWFLAKES = Array.from({ length: 40 }, (_, i) => ({
  '--x': `${range(i, 5, 0, 100)}%`,
  '--size': `${range(i, 6, 3, 6)}px`,
  '--dur': `${range(i, 7, 9, 18)}s`,
  '--delay': `${-range(i, 8, 0, 18)}s`,
  '--sway': `${range(i, 9, -40, 40)}px`,
}));

// Every layer stays mounted so a change of weather can cross-fade: the old
// layer fades out while the new one fades in. Inactive layers are paused.
const Layer = ({ name, active, children }) => (
  <div className={`weather-backdrop__layer weather-backdrop__${name} ${active ? 'is-active' : ''}`}>{children}</div>
);

/**
 * Animated weather effect behind the page (sun glow, stars, clouds, fog,
 * rain, snow, lightning). Pure CSS, no images. Decorative only.
 */
function WeatherBackdrop({ effect }) {
  const isRaining = effect === 'rain' || effect === 'storm';

  return (
    <div className="weather-backdrop" aria-hidden="true">
      <Layer name="sun" active={effect === 'sun'} />
      <Layer name="stars" active={effect === 'stars'} />
      <Layer name="clouds" active={effect === 'clouds'}>
        <span className="weather-backdrop__cloud" />
        <span className="weather-backdrop__cloud" />
        <span className="weather-backdrop__cloud" />
      </Layer>
      <Layer name="fog" active={effect === 'fog'}>
        <span className="weather-backdrop__haze" />
        <span className="weather-backdrop__haze" />
        <span className="weather-backdrop__haze" />
      </Layer>
      <Layer name="rain" active={isRaining}>
        {RAIN_DROPS.map((style, i) => (
          <span key={i} className="weather-backdrop__drop" style={style} />
        ))}
      </Layer>
      <Layer name="snow" active={effect === 'snow'}>
        {SNOWFLAKES.map((style, i) => (
          <span key={i} className="weather-backdrop__flake" style={style} />
        ))}
      </Layer>
      <Layer name="lightning" active={effect === 'storm'} />
    </div>
  );
}

export default memo(WeatherBackdrop);
