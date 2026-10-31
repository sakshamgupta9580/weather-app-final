import { memo } from 'react';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import DailyForecast from '../DailyForecast/DailyForecast';
import './WeatherCardContainer.css';

function WeatherCardContainer({ weather, onRefresh, isRefreshing, isFavorite, onToggleFavorite }) {
  const today = weather.daily[0];

  return (
    <div className="weather-cards">
      <div className="weather-cards__current">
        <CurrentWeather
          location={weather.location}
          current={weather.current}
          today={today}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
      <div className="weather-cards__hourly">
        <HourlyForecast hours={weather.hourly} />
      </div>
      <div className="weather-cards__daily">
        <DailyForecast days={weather.daily} currentTemp={weather.current.temperature} />
      </div>
    </div>
  );
}

export default memo(WeatherCardContainer);
