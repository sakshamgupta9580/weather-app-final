import './ThemeToggle.css';

function ThemeToggle({ isDark, onToggle }) {
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'is-dark' : ''}`}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {/* Both icons stay mounted so they can rotate and fade into each other. */}
      <svg className="theme-toggle__icon theme-toggle__icon--sun" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <path
          d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <svg className="theme-toggle__icon theme-toggle__icon--moon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default ThemeToggle;
