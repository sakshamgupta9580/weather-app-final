import { memo } from 'react';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import Temperature from '../Temperature/Temperature';
import { formatHour } from '../../../utils/formatters';
import './HourlyForecast.css';

function HourlyForecast({ hours }) {
  return (
    <section className="hourly-forecast glass-card" aria-labelledby="hourly-title">
      <h2 id="hourly-title" className="section-title">Next 24 hours</h2>
      {/* Focusable so keyboard users can scroll it with the arrow keys. */}
      <ol className="hourly-forecast__list" tabIndex={0} aria-label="Hourly forecast">
        {hours.map((hour, i) => (
          <li key={hour.time} className={`hourly-forecast__item ${i === 0 ? 'is-now' : ''}`}>
            <span className="hourly-forecast__time">{i === 0 ? 'Now' : formatHour(hour.time)}</span>
            <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size={36} />
            <Temperature className="hourly-forecast__temp" celsius={hour.temperature} />
            <span className="hourly-forecast__precip">
              {hour.precipitationChance > 0 ? (
                <>
                  {hour.precipitationChance}%<span className="visually-hidden"> chance of rain</span>
                </>
              ) : (
                ' ' // keeps the row height when there's no chance of rain
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default memo(HourlyForecast);
