import { useState, useEffect, useRef } from 'react';

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
  const [watchId, setWatchId] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const lastLocationRef = useRef(null);

  const handlePosition = (position) => {
    const newLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };

    // Calculate distance using UTM
    if (lastLocationRef.current) {
      const lastUTM = latLonToUTM(lastLocationRef.current.latitude, lastLocationRef.current.longitude);
      const currentUTM = latLonToUTM(newLocation.latitude, newLocation.longitude);
      
      // Only add distance if in same UTM zone and distance is reasonable (< 100m per update to filter GPS jumps)
      if (lastUTM.zone === currentUTM.zone) {
        const segmentDistance = calculateUTMDistance(lastUTM, currentUTM);
        if (segmentDistance < 100) {
          setTotalDistance(prev => prev + segmentDistance);
        }
      }
    }

    lastLocationRef.current = newLocation;
    setLocation(newLocation);
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

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setStatus('Tracking stopped');
  };

  const resetTracker = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setLocation(null);
    setError(null);
    setStatus('Ready to track');
    setTotalDistance(0);
    lastLocationRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

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
            <div className="location-item"><strong>Speed</strong><div className="small">{location.speed !== null && location.speed !== undefined ? `${location.speed.toFixed(2)} m/s` : 'N/A'}</div></div>
            <div className="location-item"><strong>Distance</strong><div className="small">{totalDistance.toFixed(2)} m</div></div>
            <div className="location-item"><strong>Timestamp</strong><div className="small">{new Date(location.timestamp).toLocaleString()}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracker;
