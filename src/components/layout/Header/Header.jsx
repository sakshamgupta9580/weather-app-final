import { memo } from 'react';
import UnitToggle from '../../ui/UnitToggle/UnitToggle';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';
import logo from '../../../assets/icons/logo.svg';
import './Header.css';

function Header({ unitSystem, onUnitChange, isDark, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__brand" href="/" aria-label="Skycast home">
          <img src={logo} width="32" height="32" alt="" />
          <span className="header__title">Skycast</span>
        </a>
        <div className="header__actions">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          <UnitToggle value={unitSystem} onChange={onUnitChange} />
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
