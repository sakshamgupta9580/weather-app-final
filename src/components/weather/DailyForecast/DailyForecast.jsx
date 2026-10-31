import { memo } from 'react';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import Temperature from '../Temperature/Temperature';
import { formatDay } from '../../../utils/formatters';
import { describeWeather } from '../../../utils/weatherConditions';
import './DailyForecast.css';

function DailyForecast({ days, currentTemp }) {
  const weekMin = Math.min(...days.map((d) => d.min));
  const weekMax = Math.max(...days.map((d) => d.max));
  const span = weekMax - weekMin || 1;
  const pct = (v) => ((v - weekMin) / span) * 100;

  return (
    <section className="daily-forecast glass-card" aria-labelledby="daily-title">
      <h2 id="daily-title" className="section-title">{days.length}-day forecast</h2>
      <ul className="daily-forecast__list">
        {days.map((day, i) => {
          const { label } = describeWeather(day.weatherCode);
          return (
            <li key={day.date} className="daily-forecast__row">
              <span className="daily-forecast__day">{formatDay(day.date, i)}</span>
              {/* Rare long labels may be cut off with an ellipsis; the title shows the full text. */}
              <span className="daily-forecast__desc" title={label}>
                {label}
              </span>
              <span className="daily-forecast__icon">
                <WeatherIcon code={day.weatherCode} size={32} />
                {day.precipitationChance >= 20 && (
                  <span className="daily-forecast__precip">{day.precipitationChance}%</span>
                )}
              </span>
              <Temperature className="daily-forecast__min" celsius={day.min} />
              <span className="daily-forecast__bar" aria-hidden="true">
                <span
                  className="daily-forecast__bar-fill"
                  style={{ left: `${pct(day.min)}%`, right: `${100 - pct(day.max)}%` }}
                />
                {i === 0 && currentTemp != null && (
                  <span
                    className="daily-forecast__bar-dot"
                    style={{ left: `${Math.min(100, Math.max(0, pct(currentTemp)))}%` }}
                  />
                )}
              </span>
              <Temperature className="daily-forecast__max" celsius={day.max} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default memo(DailyForecast);
