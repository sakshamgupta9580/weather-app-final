import { memo } from 'react';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import Temperature from '../Temperature/Temperature';
import { StarIcon } from '../../ui/Icons/Icons';
import { describeWeather } from '../../../utils/weatherConditions';
import { formatFullDate, formatLocation, formatTime } from '../../../utils/formatters';
import './CurrentWeather.css';

function CurrentWeather({ location, current, today, onRefresh, isRefreshing, isFavorite = false, onToggleFavorite }) {
  const label = current.description || describeWeather(current.weatherCode).label;

  return (
    <section className="current-weather glass-card" aria-labelledby="current-location">
      <div className="current-weather__top">
        <div>
          <h1 id="current-location" className="current-weather__location">
            {location.name}
          </h1>
          <p className="current-weather__sub">{formatLocation({ ...location, name: '' }).replace(/^,\s*/, '')}</p>
          <p className="current-weather__date">
            {/* Each part stays whole; a narrow screen breaks after the "·" only. */}
            <span className="nowrap">{formatFullDate(current.time)} ·</span>{' '}
            <span className="nowrap">{formatTime(current.time)}</span>
          </p>
        </div>
        <div className="current-weather__actions">
          {onToggleFavorite && (
            <button
              type="button"
              className={`current-weather__action current-weather__favorite ${isFavorite ? 'is-favorite' : ''}`}
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? `Remove ${location.name} from favorites` : `Add ${location.name} to favorites`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <StarIcon size={18} filled={isFavorite} />
            </button>
          )}
          {onRefresh && (
            <button
              type="button"
              className={`current-weather__action current-weather__refresh ${isRefreshing ? 'is-spinning' : ''}`}
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh weather"
              title="Refresh"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20 11a8 8 0 1 0-2.34 5.66M20 4v7h-7"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="current-weather__main">
        <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={120} />
        <div className="current-weather__reading">
          <div className="current-weather__temp">
            <Temperature celsius={current.temperature} showUnit />
          </div>
          <div className="current-weather__condition">{label}</div>
          {today && (
            <div className="current-weather__range">
              H: <Temperature celsius={today.max} /> · L: <Temperature celsius={today.min} /> · Feels
              like <Temperature celsius={current.feelsLike} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(CurrentWeather);
