import { useCallback, useEffect, useRef, useState } from 'react';
import { getWeatherByCity, getWeatherByCoords, getWeatherForLocation } from '../services/openMeteoApi';

/**
 * Loads weather for a city or coordinates and tracks request state.
 * status: 'idle' | 'loading' | 'success' | 'error'
 *
 * Previous results stay on screen while a new request loads or after it
 * fails, so a mistyped city doesn't blank the page. Search functions resolve
 * with the loaded data, or null if the request failed or was superseded.
 * Data is unit-independent (always metric), so changing °C/°F never triggers
 * a request.
 */
// A load target is one of: { city }, { coords }, or { location } (a place
// already loaded, reloaded by coordinates without losing its name).
function fetchWeather(target, options) {
  if (target.location) return getWeatherForLocation(target.location, { ...options, fresh: target.fresh });
  if (target.coords) return getWeatherByCoords(target.coords, options);
  return getWeatherByCity(target.city, options);
}

// Identifies what a target loads, so a repeat of the same load can be detected.
function targetKey(target) {
  if (target.city) return `city:${target.city.trim().toLowerCase()}`;
  const { lat, lon } = target.coords ?? target.location.coords;
  return `coords:${lat},${lon}:${target.fresh ? 'fresh' : ''}`;
}

export function useWeather({ initialTarget }) {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);
  const inFlightRef = useRef(null); // { key, promise, controller } of the running load
  const lastTargetRef = useRef(initialTarget);
  const locationRef = useRef(null); // last successfully loaded location

  const load = useCallback((target) => {
    // Asking for what is already loading (e.g. a double-click) reuses that
    // request instead of cancelling and repeating it.
    const key = targetKey(target);
    const inFlight = inFlightRef.current;
    if (inFlight?.key === key && !inFlight.controller.signal.aborted) return inFlight.promise;

    // A different request supersedes the running one, so a slow old response
    // can't overwrite a newer one.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastTargetRef.current = target;

    setStatus('loading');
    setError(null);

    const promise = (async () => {
      try {
        const data = await fetchWeather(target, { signal: controller.signal });
        if (controller.signal.aborted) return null;
        locationRef.current = data.location;
        setWeather(data);
        setStatus('success');
        return data;
      } catch (err) {
        if (controller.signal.aborted) return null;
        setError(err);
        setStatus('error');
        return null;
      } finally {
        if (inFlightRef.current?.promise === promise) inFlightRef.current = null;
      }
    })();
    inFlightRef.current = { key, promise, controller };
    return promise;
  }, []);

  // Initial load. initialTarget only seeds the first request.
  useEffect(() => {
    load(initialTarget);
    return () => controllerRef.current?.abort();
  }, [load]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchCity = useCallback((city) => load({ city }), [load]);

  const searchCoords = useCallback((coords) => load({ coords }), [load]);

  // Loads a saved place (e.g. a favorite) by its coordinates, always fresh.
  const showLocation = useCallback((location) => load({ location, fresh: true }), [load]);

  // Reloads the place on screen by its coordinates, keeping its name, and
  // always fetches new data rather than using the cache.
  const refresh = useCallback(() => {
    const loc = locationRef.current;
    load(loc ? { location: loc, fresh: true } : lastTargetRef.current);
  }, [load]);

  const retry = useCallback(() => load(lastTargetRef.current), [load]);

  const clearError = useCallback(() => {
    setError(null);
    setStatus((s) => (s === 'error' ? 'idle' : s));
  }, []);

  return {
    weather,
    status,
    error,
    isLoading: status === 'loading',
    searchCity,
    searchCoords,
    showLocation,
    refresh,
    retry,
    clearError,
  };
}
