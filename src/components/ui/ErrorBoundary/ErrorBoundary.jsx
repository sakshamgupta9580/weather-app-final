import { Component } from 'react';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import './ErrorBoundary.css';

// Wipes this app's saved settings (theme, units, city, recent searches).
function resetSavedData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage unavailable: nothing to reset.
  }
  window.location.reload();
}

/**
 * Last line of defence: a rendering error anywhere below shows this screen
 * instead of unmounting the whole app and leaving a blank page.
 */
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[Skycast] crashed while rendering:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="crash-screen" role="alert">
        <div className="crash-screen__card">
          <h1 className="crash-screen__title">Something went wrong</h1>
          <p className="crash-screen__text">
            Skycast hit an unexpected error. Reloading usually fixes it. If it keeps happening,
            resetting saved settings clears any stored data that might be causing it.
          </p>
          <div className="crash-screen__actions">
            <button type="button" className="crash-screen__btn" onClick={() => window.location.reload()}>
              Reload
            </button>
            <button type="button" className="crash-screen__btn crash-screen__btn--ghost" onClick={resetSavedData}>
              Reset saved settings
            </button>
          </div>
          <details className="crash-screen__details">
            <summary>Error details</summary>
            <pre>{String(error?.stack || error)}</pre>
          </details>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
