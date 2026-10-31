import { useCallback, useEffect, useRef, useState } from 'react';

const GEOLOCATION_OPTIONS = {
  timeout: 10000,
  // A position from the last 5 minutes is good enough for weather and makes a
  // repeat click near-instant instead of re-running GPS.
  maximumAge: 5 * 60 * 1000,
};

// GeolocationPositionError codes: 1 denied, 2 unavailable, 3 timeout.
const GEOLOCATION_MESSAGES = {
  1: 'Location access was denied. Allow it in your browser settings, or search for a city instead.',
  2: "We couldn't determine your location. Search for a city instead.",
  3: 'Finding your location took too long. Try again, or search for a city instead.',
};
const UNSUPPORTED_MESSAGE = 'Location is not supported by your browser.';
// Browsers only allow geolocation on HTTPS (or localhost); elsewhere it fails
// as "denied", which would be misleading.
const INSECURE_MESSAGE = 'Your location is only available when the site is opened over HTTPS.';

/**
 * Asks the browser for the user's position and passes it to `onPosition`.
 * Exposes whether a lookup is running and a user-facing error message.
 * `cancel` ignores a pending lookup, e.g. when the user searches a city
 * before their position arrives.
 */
export function useGeolocation(onPosition) {
  const [geoError, setGeoError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const requestIdRef = useRef(0);

  // Late callbacks after unmount are ignored.
  useEffect(() => () => {
    requestIdRef.current += 1;
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError(UNSUPPORTED_MESSAGE);
      return;
    }
    if (window.isSecureContext === false) {
      setGeoError(INSECURE_MESSAGE);
      return;
    }

    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestId === requestIdRef.current;
    setGeoError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!isCurrent()) return;
        setIsLocating(false);
        onPosition({ lat: coords.latitude, lon: coords.longitude });
      },
      (err) => {
        if (!isCurrent()) return;
        setIsLocating(false);
        setGeoError(GEOLOCATION_MESSAGES[err.code] ?? GEOLOCATION_MESSAGES[2]);
      },
      GEOLOCATION_OPTIONS
    );
  }, [onPosition]);

  const cancel = useCallback(() => {
    requestIdRef.current += 1;
    setIsLocating(false);
  }, []);

  const clearGeoError = useCallback(() => setGeoError(null), []);

  return { geoError, isLocating, locate, cancel, clearGeoError };
}
