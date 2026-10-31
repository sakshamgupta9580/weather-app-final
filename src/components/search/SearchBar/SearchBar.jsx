import { useId, useRef, useState } from 'react';
import { validateCityQuery } from '../../../utils/validation';
import Spinner from '../../ui/Spinner/Spinner';
import './SearchBar.css';

function SearchBar({
  onSearch,
  onUseMyLocation,
  isLocating = false,
  isLoading = false,
  serverError = null,
  onRetry,
  onInputChange,
  placeholder = 'Search for a city...',
  label = 'City name',
}) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  // Errors only appear after the first submit attempt, then update as the user types.
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const inputRef = useRef(null);
  const inputId = useId();
  const errorId = useId();

  const handleChange = (e) => {
    const next = e.target.value;
    setQuery(next);
    onInputChange?.();
    if (hasSubmitted) setError(validateCityQuery(next).error);
  };

  const reset = () => {
    setQuery('');
    setError(null);
    setHasSubmitted(false);
    onInputChange?.();
  };

  // A native <form> submits on Enter, so keyboard and button share one path.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const { isValid, value, error: validationError } = validateCityQuery(query);
    setHasSubmitted(true);
    setError(validationError);

    if (!isValid) {
      inputRef.current?.focus();
      return;
    }
    onSearch(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      reset();
    }
  };

  const handleClear = () => {
    reset();
    inputRef.current?.focus();
  };

  const message = error || serverError;

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search" noValidate>
      <div className="search-bar__row">
        <div className={`search-bar__field ${message ? 'has-error' : ''}`}>
          <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <label htmlFor={inputId} className="visually-hidden">{label}</label>
          <input
            ref={inputRef}
            id={inputId}
            className="search-bar__input"
            type="text"
            inputMode="search"
            enterKeyHint="search"
            placeholder={placeholder}
            autoComplete="off"
            spellCheck="false"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-invalid={Boolean(message)}
            aria-describedby={message ? errorId : undefined}
          />

          {query && (
            <button
              type="button"
              className="search-bar__icon-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {onUseMyLocation && (
            <button
              type="button"
              className="search-bar__icon-btn"
              onClick={onUseMyLocation}
              disabled={isLoading || isLocating}
              aria-label={isLocating ? 'Finding your location' : 'Use my location'}
              aria-busy={isLocating || undefined}
              title="Use my location"
            >
              {isLocating ? (
                <Spinner size="sm" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
        </div>

        <button type="submit" className="search-bar__submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading && <Spinner size="sm" tone="dark" />}
          <span>{isLoading ? 'Searching' : 'Search'}</span>
        </button>
      </div>

      <p id={errorId} className="search-bar__error" role="alert" aria-live="assertive">
        {message}
        {/* Retry only applies to a failed request, not to input validation. */}
        {!error && serverError && onRetry && (
          <button type="button" className="search-bar__retry" onClick={onRetry} disabled={isLoading}>
            Try again
          </button>
        )}
      </p>
    </form>
  );
}

export default SearchBar;
