import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon for tracking
const createTrackingIcon = (isMoving) => {
  const color = isMoving ? '#1B998B' : '#E84855';
  return L.divIcon({
    className: 'tracking-marker',
    html: `
      <div style="
        background: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Convert lat/lon to UTM coordinates
function latLonToUTM(lat, lon) {
  // WGS84 ellipsoid constants
  const a = 6378137; // semi-major axis (meters)
  const e = 0.0818192; // eccentricity
  const e2 = e * e;
  const k0 = 0.9996; // scale factor

  // Calculate UTM zone
  const zone = Math.floor((lon + 180) / 6) + 1;
  const lonOrigin = (zone - 1) * 6 - 180 + 3; // central meridian

  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const lonOriginRad = (lonOrigin * Math.PI) / 180;

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) ** 2);
  const T = Math.tan(latRad) ** 2;
  const C = (e2 / (1 - e2)) * Math.cos(latRad) ** 2;
  const A = Math.cos(latRad) * (lonRad - lonOriginRad);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 ** 3) / 3072) * Math.sin(6 * latRad));

  const easting =
    k0 * N * (A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T ** 2 + 72 * C - 58 * (e2 / (1 - e2))) * A ** 5) / 120) + 500000;

  const northing =
    k0 *
    (M +
      N * Math.tan(latRad) *
        (A ** 2 / 2 + ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 + ((61 - 58 * T + T ** 2 + 600 * C - 330 * (e2 / (1 - e2))) * A ** 6) / 720));

  return { easting, northing, zone };
}

// Calculate Euclidean distance between two UTM points
function calculateUTMDistance(utm1, utm2) {
  const dx = utm2.easting - utm1.easting;
  const dy = utm2.northing - utm1.northing;
  return Math.sqrt(dx * dx + dy * dy);
}

function Tracker() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Ready to track');
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [lastSegmentDistance, setLastSegmentDistance] = useState(null);
  const [trackingPath, setTrackingPath] = useState([]);
  const lastLocationRef = useRef(null);

  const handlePosition = (position) => {
    const newLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };

    // Calculate distance using UTM immediately
    let segmentDistance = 0;
    if (lastLocationRef.current) {
      const lastUTM = latLonToUTM(lastLocationRef.current.latitude, lastLocationRef.current.longitude);
      const currentUTM = latLonToUTM(newLocation.latitude, newLocation.longitude);
      
      if (lastUTM.zone === currentUTM.zone) {
        segmentDistance = calculateUTMDistance(lastUTM, currentUTM);
        
        // Accumulate distance if moving (speed > 0) and reasonable segment
        const isMoving = newLocation.speed !== null && newLocation.speed > 0;
        if (isMoving && segmentDistance < 100) {
          setTotalDistance(prev => prev + segmentDistance);
        }
      }
    }

    // Update last location reference
    lastLocationRef.current = newLocation;
    
    // Add to tracking path
    setTrackingPath(prev => [...prev, [newLocation.latitude, newLocation.longitude]]);
    
    // Update all state together for immediate display
    setLocation(newLocation);
    setLastSegmentDistance(segmentDistance);
    setStatus('Tracking... ' + new Date().toLocaleTimeString());
    setError(null);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    setError(null);
    setStatus('Tracking started...');

    const id = navigator.geolocation.watchPosition(
      handlePosition,
      (err) => {
        setError('Error getting location: ' + err.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      }
    );

    watchIdRef.current = id;
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setStatus('Tracking stopped');
    setLastSegmentDistance(null);
  };

  const resetTracker = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLocation(null);
    setError(null);
    setStatus('Ready to track');
    setTotalDistance(0);
    setLastSegmentDistance(null);
    setTrackingPath([]);
    lastLocationRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="sender-root">
      <h2 className="section-title">GPS Tracker</h2>

      <div style={{ marginBottom: '18px' }}>
        <button 
          onClick={startTracking} 
          disabled={isTracking}
          className="btn btn-primary"
          style={{ marginRight: 10 }}
        >
          Start Tracking
        </button>
        <button 
          onClick={stopTracking} 
          disabled={!isTracking}
          className="btn btn-ghost"
        >
          Stop Tracking
        </button>
        <button
          onClick={resetTracker}
          className="btn btn-secondary"
          style={{ marginLeft: 10 }}
        >
          Reset
        </button>
      </div>

      <div className="status small">Status: {status}</div>

      {error && (
        <div className="error"><strong>Error:</strong> {error}</div>
      )}

      {location && (
        <div className="card" style={{ background: 'linear-gradient(90deg,#e6fbff,#f0fff8)' }}>
          <h3 style={{ marginTop: 0 }}>Current Location</h3>
          <div className="location-grid">
            <div className="location-item"><strong>Latitude</strong><div className="small">{location.latitude.toFixed(6)}</div></div>
            <div className="location-item"><strong>Longitude</strong><div className="small">{location.longitude.toFixed(6)}</div></div>
            <div className="location-item"><strong>Speed</strong><div className="small">{location.speed !== null && location.speed !== undefined ? (location.speed < 0.05 ? '0.00 m/s' : `${location.speed.toFixed(2)} m/s`) : 'N/A'}</div></div>
            <div className="location-item"><strong>Distance</strong><div className="small">{totalDistance.toFixed(2)} m</div></div>
            <div className="location-item"><strong>Last Movement</strong><div className="small">{lastSegmentDistance !== null ? `${lastSegmentDistance.toFixed(2)} m` : 'N/A'}</div></div>
            <div className="location-item"><strong>Timestamp</strong><div className="small">{new Date(location.timestamp).toLocaleString()}</div></div>
          </div>
        </div>
      )}

      {location && (
        <div style={{ marginTop: '20px', height: '400px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(27, 153, 139, 0.3)' }}>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Current position marker */}
            <Marker 
              position={[location.latitude, location.longitude]} 
              icon={createTrackingIcon(location.speed > 0.05)}
            />

            {/* Accuracy circle */}
            <Circle
              center={[location.latitude, location.longitude]}
              radius={10}
              pathOptions={{
                color: '#1B998B',
                fillColor: '#1B998B',
                fillOpacity: 0.15,
                weight: 2
              }}
            />

            {/* Tracking path */}
            {trackingPath.length > 1 && (
              <Polyline
                positions={trackingPath}
                pathOptions={{
                  color: '#1B998B',
                  weight: 4,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            )}

            {/* Start point marker */}
            {trackingPath.length > 1 && (
              <Circle
                center={trackingPath[0]}
                radius={5}
                pathOptions={{
                  color: '#E84855',
                  fillColor: '#E84855',
                  fillOpacity: 0.8,
                  weight: 2
                }}
              />
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default Tracker;