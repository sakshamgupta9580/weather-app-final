# Skycast

A fast, accessible weather app built with **React** and **Vite**. Search any city or use your
location to see current conditions, the next 24 hours and a 7-day forecast, on animated
backgrounds that match the weather.

**No API key or sign-up required**: weather data comes from the free
[Open-Meteo](https://open-meteo.com/) API.

<!-- Add a live demo link once deployed:
**[Live demo →](https://your-username.github.io/weather-app/)**
-->

---

## Screenshots

> Screenshots coming soon. See [`docs/screenshots/`](docs/screenshots/) for the expected
> file names and how to capture them.

<!-- Uncomment once the images are in docs/screenshots/:
| Desktop | Mobile | Dark mode |
| --- | --- | --- |
| ![Desktop view](docs/screenshots/desktop.png) | ![Mobile view](docs/screenshots/mobile.png) | ![Dark mode](docs/screenshots/dark-mode.png) |

| Rain | Snow | Night |
| --- | --- | --- |
| ![Rain background](docs/screenshots/rain.png) | ![Snow background](docs/screenshots/snow.png) | ![Clear night](docs/screenshots/night.png) |
-->

---

## Features

**Weather**
- Current conditions with feels-like, humidity, wind, pressure, cloud cover, UV index,
  visibility, sunrise and sunset
- Hour-by-hour forecast for the next 24 hours (scrollable, keyboard accessible)
- 7-day forecast with weather descriptions and min/max temperature ranges
- Times shown in the searched city's local time

**Search**
- City search with validation and clear feedback (`Paris`, `Paris, FR` and `Paris, France` all work)
- "Use my location" via the browser Geolocation API
- **Favorites**: star a city to pin it; one click reloads its latest weather
- **Recent searches**: the last 5 cities, without duplicates

**Personalisation**
- °C / °F toggle that switches instantly, without reloading data
- Light and dark mode, following the system setting until you choose
- Preferences, favorites and history are saved in your browser (localStorage)

**Experience**
- Animated weather backgrounds (sun, stars, clouds, fog, rain, snow, lightning), drawn
  entirely in CSS with no images, cross-fading as the weather changes
- Body text meets WCAG AA contrast (4.5:1) on every background, in both themes
- Loading skeleton shaped like the real layout; a progress bar for later updates
- Friendly error messages with retry for unknown cities, network failures, timeouts and
  offline mode, plus automatic retry when the connection returns
- Responsive from 320px phones to wide desktops

**Under the hood**
- Requests are cached (5 minutes) and de-duplicated; returning visitors load with a single request
- Memoised components keep re-renders to what actually changed
- Keyboard and screen-reader friendly; respects "reduce motion"

---

## Tech stack

| | |
| --- | --- |
| UI | [React 18](https://react.dev/) (function components and hooks) |
| Build tool | [Vite 6](https://vite.dev/) |
| Styling | Plain CSS with custom properties (no CSS framework) |
| Data | [Open-Meteo](https://open-meteo.com/): forecast and geocoding APIs |
| Language | JavaScript (ES2022) |

No runtime dependencies beyond React.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) **18 or newer** (20 LTS recommended)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/weather-app.git
cd weather-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app opens at **http://localhost:5173**. That's it: no API key or `.env` file is needed.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimised production build in `dist/` |
| `npm run preview` | Serve the production build locally to test it |

> Open the app through `npm run dev` or `npm run preview`. Opening `index.html` directly
> from the file system (or with a plain static server such as Live Server) won't work for a
> Vite project.

---

## Configuration

All settings are optional. To change them, copy the example file and edit it:

```bash
cp .env.example .env
```

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_DEFAULT_CITY` | `London` | City shown on a visitor's first visit |

`VITE_` variables are embedded in the browser bundle, so never put secrets in them. The app
doesn't need any.

---

## Deployment

`npm run build` outputs a static site in `dist/` that can be hosted anywhere: Netlify,
Vercel, Cloudflare Pages, GitHub Pages and so on. There is no backend: the browser calls
Open-Meteo directly.

- **Netlify / Vercel / Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **GitHub Pages:** project pages are served from a sub-path (`/weather-app/`), so set Vite's
  [`base`](https://vite.dev/guide/static-deploy.html#github-pages) option in `vite.config.js`
  to `'/weather-app/'` before building.
- **HTTPS:** "Use my location" only works over HTTPS (or `localhost`), as browsers require.
  All of the hosts above serve HTTPS by default.

---

## Project structure

```
src/
├── components/
│   ├── layout/      # Header, Footer
│   ├── search/      # Search bar, favorites/recent chips, popular cities
│   ├── weather/     # Weather cards, icons, backgrounds, loading skeleton
│   └── ui/          # Shared pieces: toggles, spinner, error states, icons
├── hooks/           # useWeather, useTheme, useFavorites, useGeolocation, …
├── services/        # HTTP client, Open-Meteo API and response mapping
├── context/         # Selected temperature unit
├── utils/           # Formatting, validation and other pure helpers
├── constants/       # API settings, units, error messages, storage keys
├── assets/          # Global styles, design tokens, logo
├── App.jsx          # Page layout and top-level state
└── main.jsx         # Entry point
```

For how the pieces fit together (data flow, caching, theming, accessibility), see
**[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## Browser support

Current versions of Chrome, Edge, Firefox and Safari (desktop and mobile). Background colour
fades use CSS `@property`; older browsers switch backgrounds instantly instead.

---

## Privacy

Skycast has no backend and no analytics. Searches go straight from your browser to
Open-Meteo. Favorites, recent searches and preferences are stored only in your browser's
localStorage, and your location is only requested when you click "Use my location".

---

## Acknowledgements

- Weather and geocoding data: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0)
- Font: [Inter](https://rsms.me/inter/) via Google Fonts

## License

<!-- Choose a license (https://choosealicense.com/), add a LICENSE file, and update this section. -->
No license has been chosen yet. Until one is added, all rights are reserved by the author.
