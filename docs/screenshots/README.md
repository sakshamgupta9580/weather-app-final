# Screenshots

Images in this folder are shown in the main [README](../../README.md). Add them with these
exact file names, then uncomment the screenshot tables in the README.

| File | What to capture | Suggested size |
| --- | --- | --- |
| `desktop.png` | Full app in light mode with weather loaded | 1440 × 900 |
| `mobile.png` | Same city on a phone | 390 × 844 |
| `dark-mode.png` | Desktop view in dark mode | 1440 × 900 |
| `rain.png` | A city where it's raining (animated rain background) | 1440 × 900 |
| `snow.png` | A city where it's snowing | 1440 × 900 |
| `night.png` | A city where it's night with clear skies (stars) | 1440 × 900 |

## How to capture

1. Run `npm run dev` and open http://localhost:5173.
2. Open Chrome DevTools (⌥⌘I / Ctrl+Shift+I) and turn on the device toolbar (⌘⇧M / Ctrl+Shift+M).
3. Set the size from the table above and load the city you want.
4. Open the DevTools command menu (⌘⇧P / Ctrl+Shift+P), run **"Capture screenshot"**, and
   save the file here with the name from the table.

Keep images under about 500 KB each. Compress them with [Squoosh](https://squoosh.app/) or
`pngquant` if needed, so the repository stays small.
