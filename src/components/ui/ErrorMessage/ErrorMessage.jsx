import { API_ERROR_TITLES } from '../../../constants/apiErrors';
import './ErrorMessage.css';

function ErrorMessage({ message, code, title, onRetry }) {
  const heading = title || API_ERROR_TITLES[code] || 'Something went wrong';

  return (
    <div className="error-message glass-card" role="alert">
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v6M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h2 className="error-message__title">{heading}</h2>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button type="button" className="error-message__btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
