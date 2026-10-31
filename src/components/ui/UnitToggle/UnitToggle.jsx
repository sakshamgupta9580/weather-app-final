import { useRef } from 'react';
import { UNITS } from '../../../constants/units';
import './UnitToggle.css';

const OPTIONS = Object.entries(UNITS).map(([value, unit]) => ({
  value,
  label: `°${unit.temperatureSymbol}`,
  name: unit.temperatureName,
}));

function UnitToggle({ value, onChange }) {
  const buttonsRef = useRef([]);
  const activeIndex = Math.max(0, OPTIONS.findIndex((opt) => opt.value === value));

  // Radio-group keyboard pattern: arrow keys move and select.
  const handleKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (activeIndex + step + OPTIONS.length) % OPTIONS.length;
    onChange(OPTIONS[next].value);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div
      className="unit-toggle"
      role="radiogroup"
      aria-label="Temperature unit"
      style={{ '--active-index': activeIndex }}
      onKeyDown={handleKeyDown}
    >
      <span className="unit-toggle__thumb" aria-hidden="true" />
      {OPTIONS.map((opt, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={opt.value}
            ref={(el) => (buttonsRef.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.name}
            tabIndex={isActive ? 0 : -1}
            className={`unit-toggle__btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default UnitToggle;
