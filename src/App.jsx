import { useCallback, useEffect } from 'react';
import Header from './components/layout/Header/Header';
import SearchSection from './components/search/SearchSection/SearchSection';
import WeatherCardContainer from './components/weather/WeatherCardContainer/WeatherCardContainer';
import WeatherDetails from './components/weather/WeatherDetails/WeatherDetails';
import WeatherSkeleton from './components/weather/WeatherSkeleton/WeatherSkeleton';
import WeatherBackdrop from './components/weather/WeatherBackdrop/WeatherBackdrop';
import ProgressBar from './components/ui/ProgressBar/ProgressBar';
import ErrorMessage from './components/ui/ErrorMessage/ErrorMessage';
import OfflineBanner from './components/ui/OfflineBanner/OfflineBanner';
import Footer from './components/layout/Footer/Footer';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useTheme } from './hooks/useTheme';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useGeolocation } from './hooks/useGeolocation';
import { useFavorites } from './hooks/useFavorites';
import { UnitProvider } from './context/UnitContext';
import { API_CONFIG } from './constants/api';
import { API_ERROR_CODES, CONNECTIVITY_ERROR_CODES, NON_RETRYABLE_ERROR_CODES } from './constants/apiErrors';
import { POPULAR_CITIES } from './constants/popularCities';
import { STORAGE_KEYS } from './constants/storageKeys';
import { DEFAULT_UNIT_SYSTEM, UNIT_SYSTEMS } from './constants/units';
import { getThemeClass, getWeatherEffect } from './utils/weatherConditions';
import './App.css';

const isUnitSystem = (v) => Object.values(UNIT_SYSTEMS).includes(v);
// The last place shown: a location object (current format) or a "City,CC"
// string saved by older versions.
const isSavedPlace = (v) =>
  (typeof v === 'string' && v.trim() !== '') ||
  (typeof v?.name === 'string' && Number.isFinite(v?.coords?.lat) && Number.isFinite(v?.coords?.lon));

function App() {
  const [unitSystem, setUnitSystem] = useLocalStorage(STORAGE_KEYS.UNITS, DEFAULT_UNIT_SYSTEM, isUnitSystem);
  const [savedPlace, setSavedPlace] = useLocalStorage(STORAGE_KEYS.CITY, API_CONFIG.defaultCity, isSavedPlace);
  const isOnline = useOnlineStatus();
  const { isDark, toggleTheme } = useTheme();
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const { weather, status, error, isLoading, searchCity, searchCoords, showLocation, refresh, retry, clearError } =
    // A saved location loads by coordinates directly: one request instead of two.
    useWeather({ initialTarget: typeof savedPlace === 'string' ? { city: savedPlace } : { location: savedPlace } });
  const { geoError, isLocating, locate, cancel: cancelLocate, clearGeoError } = useGeolocation(searchCoords);

  // When the connection comes back, retry a request that failed because of it.
  useEffect(() => {
    if (isOnline && status === 'error' && CONNECTIVITY_ERROR_CODES.includes(error?.code)) {
      retry();
    }
    // Only react to reconnecting, not to every status change.
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  // Remember the last successfully loaded place for the next visit. Keeping
  // the previous object when it's the same place avoids a pointless re-render.
  useEffect(() => {
    if (weather && !weather.location.isCurrentLocation) {
      const { name, region, country, countryCode, coords } = weather.location;
      setSavedPlace((prev) =>
        prev?.coords?.lat === coords.lat && prev?.coords?.lon === coords.lon
          ? prev
          : { name, region, country, countryCode, coords }
      );
    }
  }, [weather, setSavedPlace]);

  // Search bar, recent and popular chips all land here. Only searches that
  // load successfully are remembered, so typos never enter the history.
  const handleSearch = useCallback(
    async (city) => {
      // A city search wins over a location lookup that hasn't finished yet.
      cancelLocate();
      clearGeoError();
      const data = await searchCity(city);
      if (data) addRecentSearch(data.location);
    },
    [searchCity, addRecentSearch, clearGeoError, cancelLocate]
  );

  // A favorite reloads by its saved coordinates, always with fresh data.
  const handleSelectFavorite = useCallback(
    (place) => {
      cancelLocate();
      clearGeoError();
      showLocation(place);
    },
    [showLocation, cancelLocate, clearGeoError]
  );

  // "Your location" isn't a named place, so it can't be a favorite.
  const canFavorite = Boolean(weather) && !weather.location.isCurrentLocation;
  const handleToggleFavorite = useCallback(() => toggleFavorite(weather.location), [weather, toggleFavorite]);

  // Runs on every keystroke, so it only updates state when an error is
  // actually showing; otherwise typing would re-render the whole page.
  const hasInlineError = Boolean(geoError || (error && weather));
  const handleInputChange = useCallback(() => {
    if (!hasInlineError) return;
    clearGeoError();
    if (weather) clearError();
  }, [hasInlineError, weather, clearError, clearGeoError]);

  const hasError = status === 'error' && error;
  // With weather on screen, errors show inline under the search bar;
  // without it (first load failed), they take over the content area.
  // The offline banner already covers offline errors, so don't repeat them inline.
  const showOfflineBanner = !isOnline && weather;
  const isCoveredByBanner = showOfflineBanner && error?.code === API_ERROR_CODES.OFFLINE;
  const showInlineApiError = hasError && weather && !isCoveredByBanner;
  const inlineError = geoError || (showInlineApiError ? error.message : null);
  const canRetry = hasError && !NON_RETRYABLE_ERROR_CODES.includes(error.code);
  // Geolocation errors are retried with the location button itself.
  const inlineRetry = !geoError && showInlineApiError && canRetry ? retry : null;
  const themeClass = weather ? getThemeClass(weather.current.weatherCode, weather.current.isDay) : '';
  const weatherEffect = weather ? getWeatherEffect(weather.current.weatherCode, weather.current.isDay) : null;

  return (
    <UnitProvider value={unitSystem}>
      <div className={`app ${themeClass}`}>
        <WeatherBackdrop effect={weatherEffect} />
        {(isLocating || (isLoading && weather)) && (
          <ProgressBar label={isLocating ? 'Finding your location' : 'Updating weather'} />
        )}
        <Header
          unitSystem={unitSystem}
          onUnitChange={setUnitSystem}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <main className="app__main">
          <SearchSection
            onSearch={handleSearch}
            onUseMyLocation={locate}
            isLocating={isLocating}
            isLoading={isLoading}
            error={inlineError}
            onRetry={inlineRetry}
            onInputChange={handleInputChange}
            popularCities={POPULAR_CITIES}
            recentSearches={recentSearches}
            onRemoveRecent={removeRecentSearch}
            onClearRecent={clearRecentSearches}
            favorites={favorites}
            onSelectFavorite={handleSelectFavorite}
            onRemoveFavorite={removeFavorite}
            activeLocation={weather?.location}
          />

          {showOfflineBanner && <OfflineBanner />}

          {!weather && hasError && (
            <ErrorMessage message={error.message} code={error.code} onRetry={canRetry ? retry : null} />
          )}

          {!weather && !hasError && <WeatherSkeleton />}

          {weather && (
            <div className={`app__content ${isLoading ? 'is-updating' : ''}`} aria-busy={isLoading}>
              <WeatherCardContainer
                weather={weather}
                onRefresh={refresh}
                isRefreshing={isLoading}
                isFavorite={canFavorite && isFavorite(weather.location)}
                onToggleFavorite={canFavorite ? handleToggleFavorite : null}
              />
              <WeatherDetails current={weather.current} today={weather.daily[0]} />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </UnitProvider>
  );
}

export default App;
