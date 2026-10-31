import './OfflineBanner.css';

function OfflineBanner() {
  return (
    <div className="offline-banner" role="status">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M3 3l18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>You're offline. Showing the last loaded weather; it will refresh when you reconnect.</span>
    </div>
  );
}

export default OfflineBanner;
