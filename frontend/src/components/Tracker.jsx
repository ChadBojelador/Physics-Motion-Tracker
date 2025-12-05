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
  const [lastSegmentDistance, setLastSegmentDistance] = useState(null);
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
      
      // Only add distance if:
      // 1. User is actually moving (speed > 0.5 m/s, about 1.8 km/h walking pace)
      // 2. Same UTM zone
      // 3. Distance is reasonable (5m - 100m to filter drift and jumps)
      const isMoving = newLocation.speed !== null && newLocation.speed !== undefined && newLocation.speed > 0.5;
      
      if (lastUTM.zone === currentUTM.zone) {
        const segmentDistance = calculateUTMDistance(lastUTM, currentUTM);
        setLastSegmentDistance(segmentDistance);
        
        if (isMoving && segmentDistance >= 5 && segmentDistance < 100) {
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
    setLastSegmentDistance(null);
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
    setLastSegmentDistance(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">GPS Distance Tracker</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-3 mb-6">
            <button 
              onClick={startTracking} 
              disabled={isTracking}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Tracking
            </button>
            <button 
              onClick={stopTracking} 
              disabled={!isTracking}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Stop Tracking
            </button>
            <button
              onClick={resetTracker}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Status:</strong> {status}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {location && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Latitude</div>
                <div className="text-lg font-semibold text-gray-800">{location.latitude.toFixed(6)}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Longitude</div>
                <div className="text-lg font-semibold text-gray-800">{location.longitude.toFixed(6)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Speed</div>
                <div className="text-lg font-semibold text-gray-800">
                  {location.speed !== null && location.speed !== undefined ? `${location.speed.toFixed(2)} m/s` : 'N/A'}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Distance</div>
                <div className="text-lg font-semibold text-gray-800">{totalDistance.toFixed(2)} m</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Last Movement</div>
                <div className="text-lg font-semibold text-gray-800">
                  {lastSegmentDistance !== null ? `${lastSegmentDistance.toFixed(2)} m` : 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Timestamp</div>
                <div className="text-sm font-semibold text-gray-800">{new Date(location.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tracker;