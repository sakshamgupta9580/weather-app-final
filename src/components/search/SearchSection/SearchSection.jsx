import { memo, useCallback } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import CityChips from '../CityChips/CityChips';
import PopularCities from '../PopularCities/PopularCities';
import { ClockIcon, StarIcon } from '../../ui/Icons/Icons';
import { isSamePlace, isSameCityName, toCityQuery } from '../../../utils/cityQuery';
import './SearchSection.css';

function SearchSection({
  onSearch,
  onUseMyLocation,
  isLocating = false,
  isLoading = false,
  error = null,
  onRetry,
  onInputChange,
  popularCities = [],
  recentSearches = [],
  onRemoveRecent,
  onClearRecent,
  favorites = [],
  onSelectFavorite,
  onRemoveFavorite,
  activeLocation,
}) {
  const activeCity = activeLocation?.name;
  // Recent entries are "City,CC" queries; favorites carry coordinates.
  const isActiveRecent = useCallback(
    (item) => Boolean(activeLocation) && isSameCityName(toCityQuery(item), toCityQuery(activeLocation)),
    [activeLocation]
  );
  const isActiveFavorite = useCallback((item) => isSamePlace(item, activeLocation), [activeLocation]);
  const searchRecent = useCallback((item) => onSearch(toCityQuery(item)), [onSearch]);

  return (
    <section className="search-section" aria-labelledby="search-heading">
      <h1 id="search-heading" className="search-section__heading">Check the weather anywhere</h1>
      <p className="search-section__subheading">
        Search for a city to see current conditions and the days ahead.
      </p>

      <div className="search-section__bar">
        <SearchBar
          onSearch={onSearch}
          onUseMyLocation={onUseMyLocation}
          isLocating={isLocating}
          isLoading={isLoading}
          serverError={error}
          onRetry={onRetry}
          onInputChange={onInputChange}
        />
      </div>

      <CityChips
        label="Favorites"
        icon={<StarIcon filled />}
        items={favorites}
        onSelect={onSelectFavorite}
        onRemove={onRemoveFavorite}
        isActive={isActiveFavorite}
        disabled={isLoading}
      />

      <CityChips
        label="Recent"
        icon={<ClockIcon />}
        items={recentSearches}
        onSelect={searchRecent}
        onRemove={onRemoveRecent}
        onClear={onClearRecent}
        isActive={isActiveRecent}
        disabled={isLoading}
      />

      <PopularCities cities={popularCities} onSelect={onSearch} activeCity={activeCity} disabled={isLoading} />
    </section>
  );
}

export default memo(SearchSection);
