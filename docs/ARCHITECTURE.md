# Architecture

How Skycast is put together. For setup and features, see the [README](../README.md).

## Overview

Skycast is a client-only React app. There is no backend: the browser talks to two
Open-Meteo APIs directly, and all user data lives in localStorage.

```
                    ┌──────────────────────── Browser ────────────────────────┐
 user ── search ──▶ │ SearchBar ─▶ App ─▶ useWeather ─▶ openMeteoApi ─▶ httpClient │ ──▶ Open-Meteo
                    │                 ◀── normalized weather ◀── openMeteoMapper    │
                    │ App ─▶ WeatherCardContainer / WeatherDetails / WeatherBackdrop│
                    └──────────────────────────────────────────────────────────┘
```

A city search is two requests: **geocoding** (`geocoding-api.open-meteo.com`, name to
coordinates) and **forecast** (`api.open-meteo.com/v1/forecast`, current, hourly and daily data
in the city's time zone). Favorites, refresh and returning visits already know the
coordinates, so they skip geocoding.

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Components | `src/components/` | Rendering only. Receive data and callbacks as props. |
| Hooks | `src/hooks/` | State and side effects: loading weather, theme, favorites, geolocation, storage. |
| Services | `src/services/` | Network access and turning API responses into the app's data shape. |
| Utils | `src/utils/` | Pure functions: formatting, validation, city-query parsing, condition lookup. |
| Constants | `src/constants/` | Configuration and fixed values, one topic per file. |

`App.jsx` is the coordinator: it composes the hooks and passes their state down. Components
don't call services directly.

### Components

```
components/
├── layout/   Header (theme + unit toggles), Footer
├── search/   SearchSection → SearchBar, CityChips (Favorites, Recent), PopularCities
├── weather/  WeatherCardContainer → CurrentWeather, HourlyForecast, DailyForecast
│             WeatherDetails, WeatherIcon, Temperature, WeatherBackdrop, WeatherSkeleton
└── ui/       ThemeToggle, UnitToggle, Spinner, ProgressBar, ErrorMessage,
              ErrorBoundary, OfflineBanner, Icons
```

Each component has its own folder holding the `.jsx` file and its scoped `.css` file, which
uses BEM-style class names (`block__element`, `is-state`).

## Data

### The normalized weather object

`services/openMeteoMapper.js` converts API responses into one shape that every component
uses. Values are always metric (°C, km/h, metres) and converted only for display.

```js
{
  location: { name, region, country, countryCode, coords: { lat, lon }, isCurrentLocation? },
  current:  { time, temperature, feelsLike, humidity, pressure, windSpeed, windDirection,
              precipitation, cloudCover, visibility, weatherCode, isDay },
  hourly:   [{ time, temperature, weatherCode, precipitationChance, isDay }],   // 24 entries
  daily:    [{ date, weatherCode, min, max, precipitationChance,
               sunrise, sunset, uvIndex }],                                    // 7 entries
}
```

Weather conditions are [WMO codes](https://open-meteo.com/en/docs#weathervariables).
`constants/weatherCodes.js` maps each one to a label and a group (`clear`, `partly`, `cloudy`,
`fog`, `rain`, `snow`, `storm`), which drives the icon, palette and background effect.

**Changing provider:** write a new service and mapper that return this same shape and point
`hooks/useWeather.js` at it. No component needs to change.

### Loading (`useWeather`)

- Tracks `status` (`idle`, `loading`, `success` or `error`), `weather` and `error`.
- A new request aborts the previous one (`AbortController`), so a slow old response can never
  replace newer data. Asking for what is already loading reuses that request.
- Previous weather stays on screen, dimmed, while a new search loads or after one fails.

### Network (`httpClient`)

- A `fetch` wrapper with a 10-second timeout. Every failure becomes an `ApiError` with a code
  (`constants/apiErrors.js`) and a user-facing message.
- Network blips and server errors (5xx) are retried once automatically. Timeouts, unknown
  cities and bad requests are not.

### Caching

| What | Where | Lifetime |
| --- | --- | --- |
| Forecast per location | Memory (`openMeteoApi.js`) | 5 minutes (Open-Meteo updates every 15) |
| City name → coordinates | Memory | Page session |
| Last place shown | localStorage | Persistent: the next visit loads by coordinates, one request |

The refresh button and favorite chips always bypass the forecast cache.

### Persisted state (localStorage)

| Key | Contents |
| --- | --- |
| `skycast:city` | Last place shown (location object) |
| `skycast:units` | `"metric"` or `"imperial"` |
| `skycast:theme` | `"light"`, `"dark"` or `null` (follow the system) |
| `skycast:recent-searches` | Up to 5 `{ name, countryCode }` |
| `skycast:favorites` | Saved locations with coordinates |

All reads go through `useLocalStorage`, which validates stored values and falls back to
defaults if they're missing or corrupted. If storage is unavailable (private mode), the app
still works, but without remembering anything.

## Theming

- **Design tokens** live in `assets/styles/variables.css` as CSS custom properties. Dark mode
  overrides them under `:root[data-theme='dark']`. Components only use tokens, never fixed colours.
- **Theme selection:** `useTheme` sets `data-theme` on `<html>`. A small inline script in
  `index.html` applies the saved theme before React loads, so the page never flashes the
  wrong theme.
- **Weather palettes:** `App.css` sets the gradient colours per condition. They're registered
  with `@property`, so changing weather animates between skies.
- **Contrast:** palettes and glass tints were chosen so body text keeps at least 4.5:1
  contrast on every background, including the brightest point of each animated effect.
  Muted labels keep at least 3:1.

## Performance

- React is built into its own chunk (`vite.config.js`), so it stays cached across app deploys.
- Expensive or pure components are wrapped in `React.memo`. Callbacks passed to them are
  stable (`useCallback`).
- Backgrounds and icons are CSS and inline SVG: no image downloads. Animations only change
  `transform` and `opacity`, and hidden backgrounds are paused.
- `index.html` preconnects to the API hosts and loads the web font without blocking the
  first paint.

## Accessibility

- Semantic landmarks and headings; every icon-only button has an `aria-label`.
- Keyboard: every control is reachable. The hourly list is focusable for arrow-key
  scrolling, and the unit toggle follows the radio-group pattern.
- Live regions announce loading and errors. Decorative layers are `aria-hidden`.
- `prefers-reduced-motion` turns off non-essential animation.
- `ErrorBoundary` replaces a blank page with a recovery screen if rendering fails.
