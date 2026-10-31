import { memo } from 'react';
import { useUnitSystem } from '../../../context/UnitContext';
import { UNITS } from '../../../constants/units';
import { formatTemp } from '../../../utils/formatters';
import './Temperature.css';

/**
 * Renders a temperature stored in °C in the selected unit. The key changes
 * with the unit, so the number fades in when the user switches °C/°F.
 */
function Temperature({ celsius, showUnit = false, className = '' }) {
  const unitSystem = useUnitSystem();

  return (
    <span key={unitSystem} className={`temperature ${className}`}>
      {formatTemp(celsius, unitSystem)}
      {showUnit && celsius != null && (
        <span className="temperature__unit">{UNITS[unitSystem].temperatureSymbol}</span>
      )}
    </span>
  );
}

export default memo(Temperature);
