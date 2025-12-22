# Physics Motion Tracker

## Overview
The Physics Motion Tracker is a client-side GPS tracking application built with React and Vite. It collects location readings from the browser's Geolocation API and displays live latitude, longitude, speed, timestamp, and cumulative distance. Distance is computed on the client using a UTM projection and Euclidean distance between successive positions.

## Features
- Real-time GPS tracking with live updates
- Cumulative distance calculation (meters) using UTM coordinates
- GPS jump filtering (ignores segments larger than ~100 m by default)
- Start / Stop / Reset controls and visual map (Leaflet)
- Mobile-friendly (requires HTTPS to use Geolocation on mobile)

## Architecture
This repository contains a single-page frontend application located in the `frontend/` folder. The app:
- Uses the browser Geolocation API (`navigator.geolocation.watchPosition`)
- Converts lat/lon to UTM to compute distances accurately over short segments
- Optionally displays positions on a Leaflet map

## Getting Started
From the repository root:

1. Enter the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Open the provided local URL in your browser (use HTTPS in production).

## Usage Guide
1. Open the app in a browser and click **Start Tracking**.
2. Grant location permission when prompted.
3. The UI shows live `latitude`, `longitude`, `speed` (m/s), `timestamp`, and cumulative `distance` (meters).
4. Click **Stop Tracking** to pause, or **Reset** to clear all tracking data and reset distance to 0.

## Project Structure
```
Physics-Motion-Tracker/
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Components: Home, Tracker, MapDemo, Physics, Sender
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── index.html
├── PROCEDURE.md             # Algorithm and implementation notes
├── LICENSE
└── README.md                # This file
```

## Geolocation Configuration
- `enableHighAccuracy: true`
- `maximumAge: 0`
- `timeout: 15000` (ms)

## Core Algorithm (summary)
1. Call `navigator.geolocation.watchPosition(handlePosition, handleError, options)`.
2. On each update, read `coords.latitude`, `coords.longitude`, `coords.speed`, and `timestamp`.
3. Convert lat/lon to UTM (easting, northing), compute segment distance using
	$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$. 
4. If segment distance is reasonable (e.g., < 100 m), add to cumulative distance.
5. Update UI state and map; store last position for the next segment.

## Display
- Latitude / Longitude: 6 decimal places
- Speed: meters per second (shows "N/A" if unavailable)
- Distance: cumulative meters (2 decimal places)

## Environment Requirements
- HTTPS origin is required for Geolocation on many browsers (deploy to Vercel, Netlify, etc.)
- User must grant location permission
- Best results outdoors or near a window (stronger GPS signal)

## Known Limitations
- Some devices do not supply `speed` in `position.coords`.
- Indoor positioning and weak GPS signal can reduce accuracy.

## Contributing
Contributions are welcome. Please open issues or create pull requests. See `frontend/` for the app code.

## License
See the `LICENSE` file in the repository root.