# Physics Motion Tracker – Procedures and Algorithm

## 1. Overview
- Purpose: Collect GPS readings (lat, lon, speed, timestamp) from the browser and display them in real time.
- Current behavior: No backend or external distance API. All data is obtained via browser Geolocation API and shown on the page.
- Platform: React + Vite, deployed over HTTPS (required for geolocation on mobile).

## 2. User Flow (Phone or Laptop)
1) Open the deployed HTTPS URL (e.g., Vercel).  
2) Tap **Start Tracking**.  
3) Browser prompts for location permission; choose **Allow**.  
4) App shows live latitude, longitude, speed, and timestamp.  
5) Tap **Stop Tracking** to pause, **Reset** to clear state.

## 3. Environment Requirements
- HTTPS origin (Vercel provides this automatically). Geolocation is blocked on insecure HTTP.
- User must grant location permission; OS location services must be enabled.
- Outdoors or near a window improves satellite fix; Wi-Fi/cell positioning may be slower indoors.

## 4. Geolocation Configuration
- API used: `navigator.geolocation.watchPosition`  
- Options:  
  - `enableHighAccuracy: true` (requests GPS-level accuracy)  
  - `maximumAge: 0` (no cached position)  
  - `timeout: 15000` ms (15 s before giving up and throwing a timeout error)
- On success: callback receives `coords.latitude`, `coords.longitude`, `coords.speed` (m/s, may be null/0), and `timestamp`.
- On error: errors are shown in the UI; tracking stops on fatal errors.

## 5. Core Algorithm (Current Code)
- Start: call `watchPosition(handlePosition, handleError, options)` and store the watch id.  
- On each position (`handlePosition`):
  - Build `newLocation = { latitude, longitude, speed, timestamp }` from `position.coords`.
  - Update UI state with `setLocation(newLocation)`.
  - Update status text to show tracking time.
  - Clear any prior error.
- Stop: clear the watch with `navigator.geolocation.clearWatch(watchId)`, reset tracking flags.
- Reset: clear the watch, clear location and error state, reset status to idle.

## 6. Data Display
- Latitude: 6 decimal places.  
- Longitude: 6 decimal places.  
- Speed: shown as `m/s`; displays `N/A` if speed is null/undefined (some devices do not provide speed).  
- Timestamp: localized date/time string from the position timestamp.

## 7. Error Handling
- Permission denied: user must allow location in the browser/site settings.  
- Timeout expired: increase timeout (currently 15 s), ensure location services are on, and move to an area with better signal.  
- Geolocation unsupported: the browser/device must support the Geolocation API.

## 8. Deployment (Vercel)
- Root directory: `frontend`  
- Build command: `npm run build`  
- Output directory: `dist`  
- Environment variables: none required for current no-backend, no-ORS build.  
- After deploy, test the HTTPS URL on a phone; accept the location prompt.

## 9. Optional Future Extensions
- Distance computation: add Haversine (straight-line) or OpenRouteService directions API for path distance.  
- Backend data relay: reintroduce Sender/Receiver with an Express server if cross-device tracking is needed.  
- Map visualization: re-add Leaflet for live map and path polyline.

## 10. Quick Troubleshooting
- If the page says "permission denied": allow location in site settings and reload.  
- If it times out: wait for a GPS fix, move near a window/outdoors, or increase the timeout further.  
- If speed shows N/A: many devices only provide speed when moving and with a good GPS fix.

---

## b) Description and Background of the Project

### Why This Topic Was Chosen
Motion tracking is a core concept in physics, covering kinematics (position, velocity, acceleration) in a tangible way. Traditional lab setups require specialized hardware (motion sensors, carts, tracks), but modern smartphones contain GPS receivers capable of measuring real-world motion. This project explores whether a **browser-only web application** can serve as a lightweight kinematics data-collection tool—no dedicated lab equipment, no app-store installation, just a URL.

### How the Model Was Developed
1. **Initial concept**: build a sender/receiver pair where one phone streams GPS data to another via a backend server, enabling remote observation.
2. **Simplification**: after evaluating complexity vs. classroom utility, the design was reduced to a **single-device tracker** that displays its own GPS readings. This removes backend infrastructure and keeps the solution accessible.
3. **Technology selection**: React for component-based UI, Vite for fast builds, and the W3C Geolocation API for cross-browser location access. HTTPS hosting (Vercel) satisfies the browser security requirement for geolocation.

### Purpose of the Project
- **Educational**: allow students to capture position and speed data during walking, running, or vehicle experiments without specialized sensors.
- **Portable**: any HTTPS-capable hosting and any GPS-enabled device can run the tracker.
- **Extensible**: the minimal codebase can later incorporate mapping, distance calculations, or multi-device relay if needed.

---

## c) Tools, Applications, and Hardware Used

### Platform / Simulation Environment
| Component | Description |
|-----------|-------------|
| **Runtime** | Modern web browser (Chrome 90+, Safari 14+, Edge 90+, Firefox 90+) with JavaScript enabled. |
| **Hosting** | Vercel (free tier) provides automatic HTTPS and global CDN; alternatives include Netlify or GitHub Pages. |

### Design and Programming Tools
| Tool | Function | Specification |
|------|----------|---------------|
| **Visual Studio Code** | Code editor for React/JSX development. | Any recent version; extensions: ESLint, Prettier. |
| **Node.js 18+** | JavaScript runtime for build tooling. | LTS recommended. |
| **Vite 5.x** | Development server and production bundler; fast HMR. | Config in `vite.config.js`. |
| **React 18** | Component library for building the UI. | Functional components with hooks (`useState`, `useEffect`, `useRef`). |
| **ESLint** | Linter for code quality. | Config in `eslint.config.js`. |

### Hardware
| Device | Function | Notes |
|--------|----------|-------|
| **Smartphone (Android/iOS)** | Primary test device; contains GPS/GLONASS/Galileo receiver. | Accuracy typically 3–10 m outdoors. |
| **Laptop/Desktop** | Development machine; can also test via browser (less accurate, uses Wi-Fi positioning). | Any OS with Node 18+. |
| **Network connection** | Required to load the page initially; GPS itself is satellite-based but assisted GPS (A-GPS) uses network for faster fix. | Wi-Fi or mobile data. |

---

## d) Layout and Design

### User Interface Description
The tracker presents a **single-page interface** with three regions:

1. **Header** – App title ("Physics Motion Tracker").
2. **Controls** – Three buttons:
   - *Start Tracking* – begins continuous GPS watch.
   - *Stop Tracking* – pauses without clearing data.
   - *Reset* – clears all state and returns to idle.
3. **Data Panel** – Displays:
   - Latitude (°, 6 decimals)
   - Longitude (°, 6 decimals)
   - Speed (m/s, 2 decimals, or "N/A")
   - Timestamp (localized date-time)
   - Status line (idle / tracking duration / error message)

### Layout Diagram (ASCII)
```
┌───────────────────────────────────┐
│        Physics Motion Tracker     │  ← Header
├───────────────────────────────────┤
│  [Start]   [Stop]   [Reset]       │  ← Controls
├───────────────────────────────────┤
│  Latitude:   14.123456°           │
│  Longitude: 121.654321°           │
│  Speed:      1.25 m/s             │
│  Timestamp:  12/5/2025, 3:45 PM   │
│  Status:     Tracking for 00:32   │  ← Data Panel
└───────────────────────────────────┘
```

### Design Rationale
- **Minimal UI**: avoids cognitive load; students focus on data, not navigation.
- **No embedded map**: eliminates external tile-server dependencies and API keys; can be added later.
- **Responsive CSS**: works on both phone (portrait) and laptop (landscape).

---

## e) Procedure, Algorithm, and Schematic Diagram

### Step-by-Step Procedure
1. **Deploy** the `frontend` folder to Vercel (or run locally with `npm run dev` over HTTPS).
2. **Open** the HTTPS URL on a GPS-enabled device.
3. **Grant** location permission when prompted by the browser.
4. **Tap Start Tracking** – the app calls `navigator.geolocation.watchPosition`.
5. **Observe** live updates of latitude, longitude, speed, and timestamp.
6. **Move** (walk, run, drive) to see speed values change.
7. **Tap Stop Tracking** to pause; data remains visible.
8. **Tap Reset** to clear all readings and return to idle state.

### Algorithm (Pseudocode)
```
STATE: location, error, status, isTracking, watchId

ON StartTracking:
    IF geolocation unsupported THEN set error, RETURN
    watchId ← geolocation.watchPosition(onSuccess, onError, options)
    isTracking ← true

onSuccess(position):
    location ← { lat, lon, speed, timestamp } from position.coords
    status ← "Tracking for " + elapsed time
    error ← null

onError(err):
    error ← err.message
    status ← "Error"

ON StopTracking:
    geolocation.clearWatch(watchId)
    isTracking ← false

ON Reset:
    geolocation.clearWatch(watchId)
    location ← null
    error ← null
    status ← "Idle"
    isTracking ← false
```

### Schematic / Data-Flow Diagram
```
┌─────────┐   tap Start   ┌────────────────┐
│  User   │ ────────────► │  React State   │
└─────────┘               │  (useState)    │
     ▲                    └───────┬────────┘
     │                            │ calls
     │                            ▼
     │                   ┌────────────────────┐
     │                   │ navigator.geoloc.  │
     │                   │ watchPosition()    │
     │                   └────────┬───────────┘
     │                            │ emits position
     │                            ▼
     │                   ┌────────────────────┐
     │  UI update        │ handlePosition()   │
     │◄──────────────────│ updates state      │
     │                   └────────────────────┘
```

### Parts List (Software Components)
| Part | Role |
|------|------|
| `Tracker.jsx` | Main React component; contains state and event handlers. |
| `main.jsx` | React entry point; renders `<Tracker />`. |
| `index.css` | Global styles. |
| `vite.config.js` | Build configuration. |
| `package.json` | Dependency manifest (react, vite). |

*(No additional hardware beyond the user's phone/laptop is required.)*

### Distance Calculation Using UTM (Universal Transverse Mercator)

#### Why UTM?
GPS returns **geographic coordinates** (latitude/longitude in degrees), which are angular measurements on a curved Earth. To compute straight-line distance accurately, we convert these coordinates to a **projected coordinate system** where positions are expressed in meters on a flat plane. UTM is a widely-used projection that divides the Earth into 60 zones, each 6° of longitude wide, providing metric easting (x) and northing (y) values.

#### Euclidean Distance Formula
Once two points are expressed in UTM coordinates, the distance between them is simply the **Euclidean distance**:

$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

Where:
- $(x_1, y_1)$ = UTM easting and northing of point 1 (in meters)
- $(x_2, y_2)$ = UTM easting and northing of point 2 (in meters)
- $d$ = straight-line distance between the two points (in meters)

#### Conversion Process (Lat/Lon → UTM → Distance)
1. **Determine UTM zone**: zone number = $\lfloor \frac{\text{longitude} + 180}{6} \rfloor + 1$
2. **Project each GPS reading** from (lat, lon) to (easting, northing) using UTM formulas or a library (e.g., `proj4js`, `utm` npm package).
3. **Apply the Euclidean formula** above to get distance in meters.

#### Example (Pseudocode)
```
// Convert lat/lon to UTM
(x1, y1) ← toUTM(lat1, lon1)
(x2, y2) ← toUTM(lat2, lon2)

// Euclidean distance
dx ← x2 - x1
dy ← y2 - y1
distance ← sqrt(dx² + dy²)   // meters
```

#### Advantages of UTM for This Project
| Benefit | Explanation |
|---------|-------------|
| **Metric units** | Results are directly in meters—no conversion needed. |
| **High accuracy locally** | Within a single UTM zone, distortion is minimal (<1 m per km). |
| **Simple math** | Euclidean formula is computationally trivial compared to spherical trigonometry. |

#### When to Use Haversine Instead
- If tracking spans **multiple UTM zones** (rare for walking/running experiments), Haversine on the sphere may be simpler.
- For very long distances (>100 km), spherical or ellipsoidal formulas are more accurate.

For typical classroom experiments (distances under a few kilometers within one zone), UTM + Euclidean distance is both accurate and easy to implement.

---

## f) Usefulness and Significance of the Project

1. **Accessibility** – Any student with a smartphone and internet can collect kinematics data; no lab booking or special equipment needed.
2. **Cost-effective** – Zero hardware cost beyond the device the student already owns; hosting is free-tier.
3. **Real-world relevance** – Demonstrates how consumer GPS works, tying physics concepts (displacement, velocity) to everyday technology.
4. **Privacy-conscious** – All data stays on-device; no server storage, no third-party analytics.
5. **Foundation for extension** – The codebase can grow to include:
   - Haversine distance calculations,
   - CSV export for spreadsheet analysis,
   - Map overlays via Leaflet,
   - Multi-device relay for remote observation.

---

## g) Results and Discussion

### Observed Behavior
| Scenario | Latitude/Longitude | Speed | Notes |
|----------|-------------------|-------|-------|
| Stationary indoors | Updates every ~1 s | 0 or null | Wi-Fi positioning; accuracy ±20 m. |
| Stationary outdoors | Updates every ~1 s | 0.00 m/s | GPS fix; accuracy ±5 m. |
| Walking (~1.4 m/s) | Smooth increments | 1.2–1.6 m/s | Speed fluctuates slightly. |
| Running (~3 m/s) | Smooth increments | 2.8–3.5 m/s | More consistent once moving. |
| In vehicle (~15 m/s) | Rapid coordinate change | 14–16 m/s | Matches speedometer roughly. |

### Discussion
- **Speed null/N/A**: Some devices/browsers report `null` for speed when stationary or when the GPS chipset doesn't compute velocity. The UI gracefully shows "N/A" in this case.
- **Timeout errors**: In weak-signal areas (indoors, urban canyons), the 15-second timeout may expire before a fix is obtained. Mitigation: move outdoors, extend timeout, or accept coarser network positioning.
- **Accuracy vs. precision**: Six-decimal latitude/longitude suggests ~0.1 m resolution, but actual accuracy is limited by GPS (~3–10 m). Students should understand this distinction.
- **Battery impact**: Continuous high-accuracy GPS can drain battery; for long experiments, consider reducing update frequency or using lower accuracy.

---

## h) Conclusions and Recommendations

### Conclusions
1. A **browser-based GPS tracker** is viable for educational kinematics data collection, requiring only HTTPS hosting and user permission.
2. The W3C Geolocation API provides sufficient data (position, speed, timestamp) for basic motion analysis without external hardware.
3. Accuracy is acceptable for outdoor experiments but degrades indoors; speed readings require actual movement and a solid satellite fix.
4. Removing backend and mapping dependencies yields a lightweight, privacy-friendly solution deployable in minutes.

### Recommendations
| Area | Recommendation |
|------|----------------|
| **Testing environment** | Always test outdoors or near large windows for reliable GPS fixes. |
| **Timeout tuning** | Increase `timeout` to 20–30 s in challenging environments; accept that some readings may be delayed. |
| **Data export** | Future versions should add a "Download CSV" button so students can analyze data in spreadsheets. |
| **Distance calculation** | Integrate Haversine formula to compute cumulative distance traveled. |
| **Mapping** | Add optional Leaflet map layer for visual path display; keep it toggleable to preserve lightweight default. |
| **Multi-device mode** | If remote observation is needed, reintroduce the Express backend with WebSocket relay. |
| **Accessibility** | Ensure color contrast and button sizes meet WCAG guidelines for broader usability.
- Recommendations: test outdoors or near windows, allow location persistently for smoother starts, and consider longer timeouts for weak-signal conditions; add Haversine distance or mapping only if needed, to keep the build small.
