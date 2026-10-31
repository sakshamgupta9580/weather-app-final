import { memo } from 'react';
import { isSameCityName } from '../../../utils/cityQuery';
import './PopularCities.css';

function PopularCities({ cities, onSelect, activeCity, disabled = false }) {
  if (cities.length === 0) return null;

  return (
    <div className="search-section__quick">
      <span className="search-section__quick-label">Popular:</span>
      <ul className="search-section__chips">
        {cities.map((city) => {
          const isActive = isSameCityName(city, activeCity);
          return (
            <li key={city}>
              <button
                type="button"
                className={`search-section__chip ${isActive ? 'is-active' : ''}`}
                aria-pressed={isActive}
                disabled={disabled}
                onClick={() => onSelect(city)}
              >
                {city}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default memo(PopularCities);
