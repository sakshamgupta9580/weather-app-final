import { memo } from 'react';
import { describeWeather } from '../../../utils/weatherConditions';
import './WeatherIcon.css';

// Icons are picked from the WMO weather code (Open-Meteo returns these
// directly), grouped in src/constants/weatherCodes.js:
//   Clear (0–1)                   -> clear   sun / moon
//   Partly cloudy (2)             -> partly
//   Overcast (3)                  -> cloudy
//   Fog / mist (45, 48)           -> fog
//   Drizzle, rain, showers        -> rain
//   Snow (71–77, 85–86)           -> snow
//   Thunderstorm (95–99)          -> storm
// Animated parts are wrapped in <g> elements so CSS transforms don't
// override the shapes' own SVG transform attributes.

const delay = (s) => ({ animationDelay: `${s}s` });

const Sun = () => (
  <g className="wi-sun">
    <circle cx="32" cy="32" r="11" fill="#fbbf24" />
    {[...Array(8)].map((_, i) => (
      <line
        key={i}
        x1="32" y1="9" x2="32" y2="15"
        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"
        transform={`rotate(${i * 45} 32 32)`}
      />
    ))}
  </g>
);

const Moon = () => (
  <g className="wi-moon">
    <path d="M38 12a20 20 0 1 0 14 30A16 16 0 0 1 38 12z" fill="#e2e8f0" />
  </g>
);

const Cloud = ({ fill = '#f1f5f9', y = 0, back = false }) => (
  <g className={back ? 'wi-cloud wi-cloud--back' : 'wi-cloud'}>
    <path
      transform={`translate(0 ${y})`}
      d="M20 50h26a10 10 0 0 0 0-20 13 13 0 0 0-25 2.5A8.75 8.75 0 0 0 20 50z"
      fill={fill}
    />
  </g>
);

const Drops = () => (
  <g stroke="#60a5fa" strokeWidth="3" strokeLinecap="round">
    <line className="wi-drop" style={delay(0)} x1="24" y1="54" x2="22" y2="60" />
    <line className="wi-drop" style={delay(0.35)} x1="33" y1="54" x2="31" y2="60" />
    <line className="wi-drop" style={delay(0.7)} x1="42" y1="54" x2="40" y2="60" />
  </g>
);

const Flakes = () => (
  <g fill="#ffffff">
    <circle className="wi-flake" style={delay(0)} cx="23" cy="56" r="2.5" />
    <circle className="wi-flake" style={delay(0.8)} cx="33" cy="58" r="2.5" />
    <circle className="wi-flake" style={delay(1.6)} cx="43" cy="56" r="2.5" />
  </g>
);

const Bolt = () => <path className="wi-bolt" d="M34 48l-6 9h6l-3 7 9-11h-6l3-5z" fill="#facc15" />;

const Fog = () => (
  <g stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round">
    <line className="wi-fog" style={delay(0)} x1="14" y1="26" x2="50" y2="26" />
    <line className="wi-fog wi-fog--reverse" style={delay(0.6)} x1="10" y1="34" x2="54" y2="34" />
    <line className="wi-fog" style={delay(1.2)} x1="16" y1="42" x2="48" y2="42" />
  </g>
);

/**
 * `animated` turns on the looping motion (drifting clouds, falling rain…).
 * It defaults to on for large icons only, so rows of small forecast icons
 * stay calm. Every icon still fades in when its condition changes.
 */
function WeatherIcon({ code, isDay = true, size = 48, animated = size >= 64, className = '' }) {
  const { group, label } = describeWeather(code);
  const Celestial = isDay ? Sun : Moon;

  let content;
  switch (group) {
    case 'clear':
      content = <Celestial />;
      break;
    case 'partly':
      content = (
        <>
          <g transform="translate(-8 -8) scale(0.85)"><Celestial /></g>
          <Cloud y={4} />
        </>
      );
      break;
    case 'cloudy':
      content = (
        <>
          <g transform="translate(-6 -10) scale(0.8)"><Cloud fill="#cbd5e1" back /></g>
          <Cloud />
        </>
      );
      break;
    case 'fog':
      content = <Fog />;
      break;
    case 'rain':
      content = (<><Cloud y={-6} fill="#cbd5e1" /><Drops /></>);
      break;
    case 'snow':
      content = (<><Cloud y={-6} /><Flakes /></>);
      break;
    case 'storm':
      content = (<><Cloud y={-6} fill="#94a3b8" /><Bolt /></>);
      break;
    default:
      content = <Cloud />;
  }

  // A new key remounts the SVG when the condition changes, replaying the
  // enter transition instead of swapping shapes abruptly.
  return (
    <svg
      key={`${group}-${isDay ? 'day' : 'night'}`}
      className={`weather-icon weather-icon--${group} ${animated ? 'is-animated' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
    >
      {content}
    </svg>
  );
}

export default memo(WeatherIcon);
