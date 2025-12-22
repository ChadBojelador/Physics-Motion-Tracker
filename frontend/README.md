
# Physics Motion Tracker — Frontend

## Overview
This folder contains the React + Vite frontend for the Physics Motion Tracker. The app collects GPS readings from the browser and displays live latitude, longitude, speed, timestamp, and cumulative distance.

## Quick Start
From this folder:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. For production use, serve over HTTPS to enable Geolocation on mobile browsers.

## Scripts
- `npm run dev` — start the dev server (Vite)
- `npm run build` — build production assets
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Usage
1. Click **Start Tracking** in the UI and grant location permission.
2. The app shows live `latitude`, `longitude`, `speed` (m/s), `timestamp`, and cumulative `distance` (meters).
3. Use **Stop Tracking** to pause and **Reset** to clear data.

## Project Structure
```
frontend/
├── src/
│   ├── components/  # Home, Tracker, MapDemo, Physics, Sender
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── index.html
```

## Geolocation & Algorithm Notes
- `navigator.geolocation.watchPosition` with `enableHighAccuracy: true`, `maximumAge: 0`, `timeout: 15000`.
- Distance is computed client-side by converting lat/lon to UTM and using Euclidean distance between successive points; segments > ~100 m are filtered as GPS jumps.

## Contributing
Open issues or PRs against this repository. See the root `README.md` for high-level project info.

## License
See the repository `LICENSE` file.
