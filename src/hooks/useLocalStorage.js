import { useEffect, useState } from 'react';

// `isValid` guards against stale or hand-edited values (e.g. an old format)
// that would otherwise crash the components reading them.
export function useLocalStorage(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored == null) return initialValue;
      const parsed = JSON.parse(stored);
      return isValid(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable (private mode, quota) — keep in-memory state only.
    }
  }, [key, value]);

  return [value, setValue];
}
