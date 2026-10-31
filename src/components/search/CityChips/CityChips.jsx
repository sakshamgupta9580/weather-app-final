import { memo } from 'react';
import { toCityQuery } from '../../../utils/cityQuery';
import './CityChips.css';

/**
 * A labelled row of city chips (used for Favorites and Recent). Each chip
 * loads its city and has a remove (×) button; `onClear` adds a "Clear" link.
 * Renders nothing when there are no items.
 */
function CityChips({ label, icon, items, onSelect, onRemove, onClear, isActive, disabled = false }) {
  if (items.length === 0) return null;

  return (
    <div className="city-chips">
      <span className="city-chips__label">
        {icon}
        {label}:
      </span>

      <ul className="city-chips__list" aria-label={label}>
        {items.map((item) => {
          const active = isActive(item);
          return (
            <li key={toCityQuery(item)} className={`city-chips__item ${active ? 'is-active' : ''}`}>
              <button
                type="button"
                className="city-chips__city"
                onClick={() => onSelect(item)}
                disabled={disabled}
                aria-current={active || undefined}
              >
                {item.name}
                {item.countryCode && <span className="city-chips__country">{item.countryCode}</span>}
              </button>
              <button
                type="button"
                className="city-chips__remove"
                onClick={() => onRemove(item)}
                aria-label={`Remove ${item.name} from ${label.toLowerCase()}`}
                title="Remove"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      {onClear && (
        <button type="button" className="city-chips__clear" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}

export default memo(CityChips);
