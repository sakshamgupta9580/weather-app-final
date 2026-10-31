import './ProgressBar.css';

// Thin indeterminate bar along the top of the page, for loads that keep the
// current content on screen.
function ProgressBar({ label = 'Loading' }) {
  return (
    <div className="progress-bar" role="progressbar" aria-label={label}>
      <span className="progress-bar__indicator" />
    </div>
  );
}

export default ProgressBar;
