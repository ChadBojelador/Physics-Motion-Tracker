import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom moving marker icon
const createMovingIcon = (speed) => {
  const color = speed > 5 ? '#E84855' : speed > 2 ? '#FF9B71' : '#1B998B';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 20px ${color};
        animation: pulse 1.5s infinite;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to auto-center map on current position
function MapController({ position, zoom, isMoving }) {
  const map = useMap();
  
  // Don't auto-center - let user control the map freely
  return null;
}

// Component to handle map clicks for pinning
function MapClickHandler({ isPinningMode, onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    if (isPinningMode) {
      const handleClick = (e) => {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      };
      
      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }
  }, [isPinningMode, map, onMapClick]);
  
  return null;
}

function MapDemo({ onNavigate }) {
  const [speed, setSpeed] = useState(2);
  const [targetDistance, setTargetDistance] = useState(100);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [position, setPosition] = useState([14.5995, 120.9842]); // Default fallback
  const [path, setPath] = useState([[14.5995, 120.9842]]);
  const [isMoving, setIsMoving] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const routeIndexRef = useRef(0);
  const [destination, setDestination] = useState(null);
  const [isPinningMode, setIsPinningMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const timeIntervalRef = useRef(null);
  const speedRef = useRef(speed);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(userPos);
          setPosition(userPos);
          setPath([userPos]);
        },
        (error) => {
          console.warn('Location error:', error.message);
          // Keep default location
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000
        }
      );
    }
  }, []);

  const startMovement = async () => {
    if (isMoving) return;
    
    setIsMoving(true);
    setCurrentDistance(0);
    setElapsedTime(0);
    const startPos = [...position];
    setPath([startPos]);

    // Generate a route along roads (to destination if set)
    const route = await generateRoadRoute(startPos, targetDistance, destination);
    setRoutePoints(route);
    routeIndexRef.current = 0;

    let traveled = 0;
    
    // Update speedRef to current speed
    speedRef.current = speed;
    
    // Start time counter
    timeIntervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 0.1);
    }, 100);

    intervalRef.current = setInterval(() => {
      const distanceIncrement = speedRef.current * 0.1; // Use speedRef to get current speed
      
      if (traveled >= targetDistance || routeIndexRef.current >= route.length - 1) {
        clearInterval(intervalRef.current);
        clearInterval(timeIntervalRef.current);
        setIsMoving(false);
        return;
      }

      // Move along the route points
      const segmentDistance = distanceIncrement;
      traveled += segmentDistance;
      
      // Calculate which point on route we should be at
      const progressRatio = traveled / targetDistance;
      const targetIndex = Math.min(
        Math.floor(progressRatio * route.length),
        route.length - 1
      );
      
      if (targetIndex > routeIndexRef.current) {
        routeIndexRef.current = targetIndex;
        const newPos = route[targetIndex];
        setPosition(newPos);
        setPath(prev => [...prev, newPos]);
      }

      setCurrentDistance(traveled);
    }, 100);
  };

  // Generate a route that follows roads
  const generateRoadRoute = async (start, distance, destinationPoint) => {
    // If destination is set, navigate towards it
    if (destinationPoint) {
      return generateRouteToDestination(start, destinationPoint, distance);
    }
    
    // For demo: create a realistic road-like path
    // In production, you'd use a routing API like OSRM, MapBox, or Google Directions
    const points = [start];
    const numPoints = Math.ceil(distance / 10); // Point every ~10 meters
    
    // Simulate road segments with realistic turns
    let currentPos = [...start];
    const metersPerDegree = 111000;
    
    // Common road directions (N, NE, E, SE, S, SW, W, NW)
    const roadAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    let currentAngle = roadAngles[Math.floor(Math.random() * roadAngles.length)];
    
    for (let i = 0; i < numPoints; i++) {
      // Occasionally change direction (simulate turns at intersections)
      if (Math.random() < 0.15) { // 15% chance of turn
        const angleChange = [-90, -45, 45, 90][Math.floor(Math.random() * 4)];
        currentAngle = (currentAngle + angleChange + 360) % 360;
      }
      
      const segmentLength = 10; // 10 meters per segment
      const latChange = (Math.cos(currentAngle * Math.PI / 180) * segmentLength) / metersPerDegree;
      const lonChange = (Math.sin(currentAngle * Math.PI / 180) * segmentLength) / 
        (metersPerDegree * Math.cos(currentPos[0] * Math.PI / 180));
      
      currentPos = [
        currentPos[0] + latChange,
        currentPos[1] + lonChange
      ];
      
      points.push([...currentPos]);
    }
    
    return points;
  };

  // Generate route towards a specific destination
  const generateRouteToDestination = (start, end, maxDistance) => {
    const points = [start];
    const metersPerDegree = 111000;
    
    // Calculate total distance to destination
    const totalDistance = calculateDistance(start, end);
    const useDistance = Math.min(maxDistance, totalDistance);
    const numPoints = Math.ceil(useDistance / 10);
    
    // Calculate general direction to destination
    const latDiff = end[0] - start[0];
    const lonDiff = end[1] - start[1];
    const targetAngle = Math.atan2(lonDiff, latDiff) * 180 / Math.PI;
    
    let currentPos = [...start];
    let currentAngle = targetAngle;
    
    for (let i = 0; i < numPoints; i++) {
      // Slightly adjust angle towards destination with some randomness (simulate roads)
      const angleToDestination = Math.atan2(
        end[1] - currentPos[1],
        end[0] - currentPos[0]
      ) * 180 / Math.PI;
      
      // Gradually turn towards destination with some variation
      const angleDiff = ((angleToDestination - currentAngle + 180) % 360) - 180;
      currentAngle += angleDiff * 0.3; // 30% correction towards destination
      
      // Add some random variation to simulate roads
      if (Math.random() < 0.1) {
        currentAngle += (Math.random() - 0.5) * 30;
      }
      
      const segmentLength = 10;
      const latChange = (Math.cos(currentAngle * Math.PI / 180) * segmentLength) / metersPerDegree;
      const lonChange = (Math.sin(currentAngle * Math.PI / 180) * segmentLength) / 
        (metersPerDegree * Math.cos(currentPos[0] * Math.PI / 180));
      
      currentPos = [
        currentPos[0] + latChange,
        currentPos[1] + lonChange
      ];
      
      points.push([...currentPos]);
    }
    
    // If we're close enough, add the actual destination as final point
    if (useDistance >= totalDistance) {
      points.push(end);
    }
    
    return points;
  };

  // Calculate distance between two points in meters
  const calculateDistance = (point1, point2) => {
    const R = 6371000; // Earth's radius in meters
    const lat1 = point1[0] * Math.PI / 180;
    const lat2 = point2[0] * Math.PI / 180;
    const deltaLat = (point2[0] - point1[0]) * Math.PI / 180;
    const deltaLon = (point2[1] - point1[1]) * Math.PI / 180;
    
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  };

  // Handle map click for pinning destination
  const handleMapClick = (coords) => {
    if (isPinningMode && !isMoving) {
      setDestination(coords);
      
      // Calculate distance to destination
      const dist = calculateDistance(position, coords);
      setTargetDistance(Math.round(dist));
      
      setIsPinningMode(false);
    }
  };

  const stopMovement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
    setIsMoving(false);
  };

  const resetDemo = () => {
    stopMovement();
    const startPos = userLocation || [14.5995, 120.9842];
    setPosition(startPos);
    setPath([startPos]);
    setCurrentDistance(0);
    setElapsedTime(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Calculate zoom level based on distance
  const calculateZoom = () => {
    if (targetDistance < 50) return 18;
    if (targetDistance < 200) return 16;
    if (targetDistance < 500) return 15;
    if (targetDistance < 1000) return 14;
    return 13;
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      overflow: 'hidden',
      background: '#2D3047'
    }}>
      {/* Full-screen Map */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}>
        <MapContainer
          center={userLocation || position}
          zoom={calculateZoom()}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          key={userLocation ? `${userLocation[0]}-${userLocation[1]}` : 'default'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController position={position} zoom={calculateZoom()} isMoving={isMoving} />
          <MapClickHandler isPinningMode={isPinningMode} onMapClick={handleMapClick} />

          {/* Current position marker */}
          <Marker position={position} icon={createMovingIcon(speed)} />

          {/* Destination marker */}
          {destination && (
            <Marker
              position={destination}
              icon={L.divIcon({
                className: 'destination-marker',
                html: `
                  <div style="
                    background: #E84855;
                    width: 30px;
                    height: 30px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <span style="transform: rotate(45deg); color: white; font-size: 16px;">📍</span>
                  </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
              })}
            />
          )}

          {/* Speed-based accuracy circle */}
          <Circle
            center={position}
            radius={Math.max(5, speed * 2)}
            pathOptions={{
              color: speed > 5 ? '#E84855' : speed > 2 ? '#FF9B71' : '#1B998B',
              fillColor: speed > 5 ? '#E84855' : speed > 2 ? '#FF9B71' : '#1B998B',
              fillOpacity: 0.15,
              weight: 2
            }}
          />

          {/* Path traveled */}
          {path.length > 1 && (
            <Polyline
              positions={path}
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
          {path.length > 1 && (
            <Circle
              center={path[0]}
              radius={5}
              pathOptions={{
                color: '#1B998B',
                fillColor: '#1B998B',
                fillOpacity: 0.8,
                weight: 2
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Navigation Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(45, 48, 71, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(27, 153, 139, 0.3)',
        zIndex: 1000
      }}>
        <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: '#fff' }}>
          Map Demo
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate?.('home')}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid rgba(27, 153, 139, 0.5)',
              borderRadius: '8px',
              color: '#1B998B',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(27, 153, 139, 0.1)';
              e.target.style.borderColor = '#1B998B';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(27, 153, 139, 0.5)';
            }}
            title="Home"
          >
            <span className="material-icons">home</span>
          </button>
        </div>
      </div>

      {/* Stats Bar - Fixed Position */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '10px',
        right: '10px',
        background: 'rgba(45, 48, 71, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: 'clamp(8px, 2vw, 12px)',
        borderRadius: '12px',
        border: '1px solid rgba(27, 153, 139, 0.4)',
        zIndex: 999,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
        gap: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: '#888' }}>Speed</div>
          <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#1B998B', fontWeight: '600' }}>{speed.toFixed(1)} m/s</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: '#888' }}>Distance</div>
          <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#1B998B', fontWeight: '600' }}>{currentDistance.toFixed(1)} m</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: '#888' }}>Target</div>
          <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'white', fontWeight: '600' }}>{targetDistance} m</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: '#888' }}>Progress</div>
          <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#FFFD82', fontWeight: '600' }}>
            {((currentDistance / targetDistance) * 100).toFixed(0)}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: '#888' }}>Time</div>
          <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#FF9B71', fontWeight: '600' }}>
            {Math.floor(elapsedTime)}s
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: '#888' }}>Est. Total</div>
          <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#E84855', fontWeight: '600' }}>
            {speed > 0 ? (() => {
              const totalSeconds = Math.ceil(targetDistance / speed);
              if (totalSeconds >= 60) {
                const mins = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                return `${mins}m ${secs}s`;
              }
              return `${totalSeconds}s`;
            })() : '0s'}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(45, 48, 71, 0.98)',
        backdropFilter: 'blur(20px)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
        transition: 'transform 0.3s ease',
        transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 80px))',
        zIndex: 1000,
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Drag Handle */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '16px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            borderBottom: isExpanded ? '1px solid rgba(27, 153, 139, 0.3)' : 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '4px',
            background: 'rgba(27, 153, 139, 0.6)',
            borderRadius: '2px'
          }}></div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%',
            alignItems: 'center'
          }}>
            <span style={{ color: '#fff', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>
              Movement Controls
            </span>
            <span style={{ color: '#888', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>
              {isExpanded ? '▼ Tap to collapse' : '▲ Tap to expand'}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{
          overflowY: 'auto',
          padding: '16px',
          flex: 1
        }}>
          {/* Control Sliders */}
          <div style={{ display: 'grid', gap: '20px', marginBottom: '20px' }}>
            {/* Pin Location Button */}
            <div>
              <button
                onClick={() => {
                  if (!isMoving) {
                    setIsPinningMode(!isPinningMode);
                    if (isPinningMode) {
                      setDestination(null);
                    }
                  }
                }}
                disabled={isMoving}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isPinningMode ? 'rgba(232, 72, 85, 0.2)' : destination ? 'rgba(27, 153, 139, 0.2)' : 'transparent',
                  border: `2px solid ${isPinningMode ? '#E84855' : destination ? '#1B998B' : 'rgba(27, 153, 139, 0.5)'}`,
                  borderRadius: '8px',
                  color: isPinningMode ? '#E84855' : destination ? '#1B998B' : '#888',
                  cursor: isMoving ? 'not-allowed' : 'pointer',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  opacity: isMoving ? 0.5 : 1
                }}
              >
                <span className="material-icons">
                  {isPinningMode ? 'cancel' : destination ? 'location_on' : 'add_location'}
                </span>
                {isPinningMode ? 'Cancel Pin Mode' : destination ? 'Destination Set' : 'Pin Destination'}
              </button>
              {isPinningMode && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  background: 'rgba(232, 72, 85, 0.1)', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                  color: '#E84855',
                  textAlign: 'center'
                }}>
                  Click anywhere on the map to set destination
                </div>
              )}
              {destination && !isPinningMode && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  background: 'rgba(27, 153, 139, 0.1)', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                  color: '#1B998B',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Distance: {targetDistance}m</span>
                  <button
                    onClick={() => {
                      setDestination(null);
                      setTargetDistance(100);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#E84855',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '1rem' }}>close</span>
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                Speed: {speed.toFixed(1)} m/s
              </label>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={speed}
                onChange={(e) => {
                  const newSpeed = parseFloat(e.target.value);
                  setSpeed(newSpeed);
                  speedRef.current = newSpeed;
                }}
                style={{ width: '100%' }}
                className="custom-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '4px' }}>
                <span>0.5 m/s</span>
                <span>20 m/s</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                Distance: {targetDistance} m
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={targetDistance}
                onChange={(e) => setTargetDistance(parseInt(e.target.value))}
                disabled={isMoving}
                style={{ width: '100%' }}
                className="custom-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '4px' }}>
                <span>10 m</span>
                <span>2000 m</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={startMovement}
              disabled={isMoving}
              className="btn btn-primary"
              style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', padding: 'clamp(12px, 3vw, 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>{isMoving ? 'pause' : 'play_arrow'}</span>
              {isMoving ? 'Moving' : 'Start'}
            </button>
            <button 
              onClick={stopMovement}
              disabled={!isMoving}
              className="btn btn-ghost"
              style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', padding: 'clamp(12px, 3vw, 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>stop</span>
              Stop
            </button>
            <button
              onClick={resetDemo}
              className="btn btn-secondary"
              style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', padding: 'clamp(12px, 3vw, 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>refresh</span>
              Reset
            </button>
          </div>


        </div>
      </div>

      <style>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          background: rgba(27, 153, 139, 0.2);
          border-radius: 5px;
          outline: none;
          touch-action: none;
        }

        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #1B998B, #FF9B71);
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(27, 153, 139, 0.5);
        }

        .custom-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #1B998B, #FF9B71);
          cursor: pointer;
          border-radius: 50%;
          border: none;
          box-shadow: 0 2px 8px rgba(27, 153, 139, 0.5);
        }

        .custom-slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

export default MapDemo;
