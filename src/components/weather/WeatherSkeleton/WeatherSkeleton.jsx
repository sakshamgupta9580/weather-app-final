import { FORECAST_DAYS } from '../../../constants/api';
import './WeatherSkeleton.css';

const HOURLY_PLACEHOLDERS = 8;
const DETAIL_PLACEHOLDERS = 9; // matches the usual number of detail tiles (3 × 3)

const Bone = ({ className = '' }) => <span className={`skeleton-bone ${className}`} />;

/**
 * First-load placeholder shaped like the real weather layout. It reuses the
 * weather-cards and weather-details grid classes, so content appears in the
 * same place and the page doesn't jump when data arrives.
 */
function WeatherSkeleton({ message = 'Loading weather…' }) {
  return (
    <div className="weather-skeleton" role="status" aria-live="polite">
      <span className="visually-hidden">{message}</span>

      <div className="weather-cards" aria-hidden="true">
        <div className="weather-cards__current">
          <div className="glass-card weather-skeleton__card">
            <Bone className="skeleton-bone--title" />
            <Bone className="skeleton-bone--text skeleton-bone--w40" />
            <Bone className="skeleton-bone--text skeleton-bone--w55" />
            <div className="weather-skeleton__hero">
              <Bone className="skeleton-bone--icon" />
              <div className="weather-skeleton__stack">
                <Bone className="skeleton-bone--temp" />
                <Bone className="skeleton-bone--text skeleton-bone--w70" />
                <Bone className="skeleton-bone--text" />
              </div>
            </div>
          </div>
        </div>

        <div className="weather-cards__hourly">
          <div className="glass-card weather-skeleton__card">
            <Bone className="skeleton-bone--label" />
            <div className="weather-skeleton__hours">
              {Array.from({ length: HOURLY_PLACEHOLDERS }, (_, i) => (
                <div key={i} className="weather-skeleton__hour">
                  <Bone className="skeleton-bone--small" />
                  <Bone className="skeleton-bone--dot" />
                  <Bone className="skeleton-bone--small" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="weather-cards__daily">
          <div className="glass-card weather-skeleton__card">
            <Bone className="skeleton-bone--label" />
            {Array.from({ length: FORECAST_DAYS }, (_, i) => (
              <div key={i} className="weather-skeleton__day">
                <div className="weather-skeleton__stack">
                  <Bone className="skeleton-bone--small skeleton-bone--w40" />
                  <Bone className="skeleton-bone--small" />
                </div>
                <Bone className="skeleton-bone--dot" />
                <Bone className="skeleton-bone--bar" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card weather-skeleton__card weather-skeleton__details" aria-hidden="true">
        <Bone className="skeleton-bone--label" />
        <div className="weather-details__grid">
          {Array.from({ length: DETAIL_PLACEHOLDERS }, (_, i) => (
            <div key={i} className="weather-skeleton__tile">
              <Bone className="skeleton-bone--small" />
              <Bone className="skeleton-bone--value" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;
