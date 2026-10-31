import { memo } from 'react';
import Temperature from '../Temperature/Temperature';
import { useUnitSystem } from '../../../context/UnitContext';
import { formatTime, formatVisibility, formatWind, uvLevel, windDirection } from '../../../utils/formatters';
import './WeatherDetails.css';

function WeatherDetails({ current, today }) {
  const unitSystem = useUnitSystem();

  const items = [
    {
      label: 'Feels like',
      value: <Temperature celsius={current.feelsLike} />,
      hint: current.feelsLike < current.temperature ? 'Wind makes it feel cooler' : 'Similar to actual',
    },
    { label: 'Humidity', value: `${current.humidity}%` },
    {
      label: 'Wind',
      value: formatWind(current.windSpeed, unitSystem),
      hint: `From ${windDirection(current.windDirection)}`,
    },
    { label: 'Pressure', value: `${Math.round(current.pressure)} hPa` },
    current.cloudCover != null && { label: 'Cloud cover', value: `${current.cloudCover}%` },
    today?.uvIndex != null && { label: 'UV index', value: Math.round(today.uvIndex), hint: uvLevel(today.uvIndex) },
    { label: 'Visibility', value: formatVisibility(current.visibility, unitSystem) },
    { label: 'Sunrise', value: today?.sunrise ? formatTime(today.sunrise) : '--' },
    { label: 'Sunset', value: today?.sunset ? formatTime(today.sunset) : '--' },
  ].filter(Boolean);

  return (
    <section className="weather-details glass-card" aria-labelledby="details-title">
      <h2 id="details-title" className="section-title">Today's details</h2>
      <dl className="weather-details__grid">
        {items.map((item) => (
          <div key={item.label} className="weather-details__item">
            <dt className="weather-details__label">{item.label}</dt>
            <dd className="weather-details__value">{item.value}</dd>
            {item.hint && <dd className="weather-details__hint">{item.hint}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}

export default memo(WeatherDetails);
