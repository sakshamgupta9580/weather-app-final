import './Spinner.css';

// Decorative by default; pass `label` when the spinner is the only loading cue.
function Spinner({ size = 'md', tone = 'light', label }) {
  return (
    <span
      className={`spinner spinner--${size} spinner--${tone}`}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <span className="visually-hidden">{label}</span>}
    </span>
  );
}

export default Spinner;
