import { useState, useEffect } from 'react';

function Tracker() {
  const [location, setLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [status, setStatus] = useState('Ready to track');
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [stats, setStats] = useState(null);

  // Haversine formula - calculates distance between two GPS points in meters
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handlePosition = (position) => {
    const newLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };

    // Calculate distance and stats if we have a previous location
    if (location) {
      const distance = getDistance(
        location.latitude,
        location.longitude,
        newLocation.latitude,
        newLocation.longitude
      );

      // Only count distance if moved more than 2 meters (filter GPS noise)
      if (distance > 2) {
        setTotalDistance(prev => prev + distance);
        setPreviousLocation(location);

        // Calculate speed and time
        const timeDiff = (newLocation.timestamp - location.timestamp) / 1000;
        if (timeDiff > 0) {
          const calculatedSpeed = distance / timeDiff;
          setStats({
            lastDistance: distance.toFixed(2),
            timeDiff: timeDiff.toFixed(2),
            calculatedSpeed: calculatedSpeed.toFixed(2)
          });
        }
      }
    }

    setLocation(newLocation);
    setStatus('Tracking... ' + new Date().toLocaleTimeString());
    setError(null);
  };

  const handleError = (err) => {
    setError('Error: ' + err.message);
    setIsTracking(false);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    setError(null);
    setStatus('Starting GPS...');

    const id = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
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
    stopTracking();
    setLocation(null);
    setPreviousLocation(null);
    setTotalDistance(0);
    setStats(null);
    setError(null);
    setStatus('Ready to track');
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>📍 GPS Tracker</h1>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button 
          onClick={startTracking} 
          disabled={isTracking}
          className="btn btn-primary"
        >
          ▶ Start
        </button>
        <button 
          onClick={stopTracking} 
          disabled={!isTracking}
          className="btn btn-ghost"
        >
          ⏹ Stop
        </button>
        <button 
          onClick={resetTracker}
          className="btn btn-secondary"
        >
          ↺ Reset
        </button>
      </div>

      {/* Status */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: isTracking ? '#e8f5e9' : '#f5f5f5', 
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <strong>{status}</strong>
      </div>

      {/* Error */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          borderRadius: '8px',
          color: '#c62828',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Total Distance - Large Display */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '14px', color: '#666' }}>Total Distance</div>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1565c0' }}>
          {totalDistance.toFixed(2)} m
        </div>
        <div style={{ fontSize: '18px', color: '#1976d2' }}>
          {(totalDistance / 1000).toFixed(3)} km
        </div>
      </div>

      {/* Current Location */}
      {location && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 style={{ marginTop: 0 }}>Current Location</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <strong>Latitude</strong>
              <div>{location.latitude.toFixed(6)}</div>
            </div>
            <div>
              <strong>Longitude</strong>
              <div>{location.longitude.toFixed(6)}</div>
            </div>
            <div>
              <strong>Speed (GPS)</strong>
              <div>{location.speed !== null ? `${location.speed.toFixed(2)} m/s` : 'N/A'}</div>
            </div>
            <div>
              <strong>Accuracy</strong>
              <div>{location.accuracy ? `±${location.accuracy.toFixed(1)} m` : 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Last Movement</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <strong>Distance</strong>
              <div>{stats.lastDistance} m</div>
            </div>
            <div>
              <strong>Time</strong>
              <div>{stats.timeDiff} s</div>
            </div>
            <div>
              <strong>Speed</strong>
              <div>{stats.calculatedSpeed} m/s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracker;
