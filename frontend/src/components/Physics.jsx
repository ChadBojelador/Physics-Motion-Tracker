import './Home.css';

function Physics({ onNavigate }) {
  return (
    <div className="home-container">
      <div className="home-content">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(27, 153, 139, 0.3)'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
            color: '#1B998B' 
          }}>
            Physics & Calculations
          </h1>
          <button 
            onClick={() => onNavigate('home')}
            className="btn btn-ghost"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)'
            }}
          >
            <span className="material-icons">home</span>
            Home
          </button>
        </div>

        {/* Introduction */}
        <div className="info-section" style={{ marginBottom: '40px' }}>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            lineHeight: '1.8',
            color: '#ccc',
            marginBottom: '20px'
          }}>
            Our GPS tracker uses advanced physics formulas and coordinate transformations to provide 
            accurate real-time motion analysis. Below are the key calculations and methodologies used 
            in the system.
          </p>
        </div>

        {/* Physics Formulas Section */}
        <div className="physics-info">
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '30px' }}>
            Core Physics Formulas
          </h3>
          <div className="formula-cards">
            <div className="formula-card">
              <h4 style={{ color: '#fff' }}>📐 Euclidean Distance</h4>
              <div className="formula-math">d = √[(x₂ - x₁)² + (y₂ - y₁)²]</div>
              <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
                <strong>Purpose:</strong> Calculates the straight-line distance between two points in a Cartesian coordinate system.
              </p>
              <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                <strong>Application:</strong> After converting GPS coordinates (latitude/longitude) to UTM coordinates, 
                we use this formula to calculate the precise distance traveled in meters between any two positions.
              </p>
              <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                <strong>Why it matters:</strong> Unlike simple lat/lon differences, this provides accurate metric 
                measurements that account for Earth's curvature through the UTM projection system.
              </p>
            </div>

            <div className="formula-card">
              <h4 style={{ color: '#fff' }}>🌍 UTM Projection System</h4>
              <div className="formula-math" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                WGS84 Ellipsoid → UTM Zone → Easting/Northing (meters)
              </div>
              <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
                <strong>Purpose:</strong> Converts spherical Earth coordinates (latitude/longitude) into a flat, 
                Cartesian coordinate system measured in meters.
              </p>
              <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                <strong>Key Components:</strong>
              </p>
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>WGS84 Ellipsoid:</strong> Earth model with semi-major axis a = 6,378,137m</li>
                <li><strong>Eccentricity:</strong> e = 0.0818192 (accounts for Earth's oblate shape)</li>
                <li><strong>UTM Zones:</strong> Earth divided into 60 zones, each 6° of longitude wide</li>
                <li><strong>Scale Factor:</strong> k₀ = 0.9996 (minimizes distortion)</li>
              </ul>
              <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                <strong>Why it matters:</strong> Enables accurate distance calculations in meters, essential for 
                speed and acceleration measurements in real-world units.
              </p>
            </div>

            <div className="formula-card">
              <h4 style={{ color: '#fff' }}>🚀 Velocity (Speed) Calculation</h4>
              <div className="formula-math">v = Δd / Δt</div>
              <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
                <strong>Formula Breakdown:</strong>
              </p>
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>v:</strong> Velocity in meters per second (m/s)</li>
                <li><strong>Δd:</strong> Change in distance (meters) between two positions</li>
                <li><strong>Δt:</strong> Time elapsed (seconds) between measurements</li>
              </ul>
              <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                <strong>Primary Source:</strong> GPS sensors provide direct velocity measurements using Doppler 
                shift analysis of satellite signals, which is more accurate than position-based calculations.
              </p>
              <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                <strong>Backup Method:</strong> When GPS velocity is unavailable, we calculate speed using 
                UTM distance changes divided by time intervals.
              </p>
            </div>

            <div className="formula-card">
              <h4 style={{ color: '#fff' }}>⚡ Acceleration</h4>
              <div className="formula-math">a = Δv / Δt</div>
              <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
                <strong>Formula Breakdown:</strong>
              </p>
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>a:</strong> Acceleration in meters per second squared (m/s²)</li>
                <li><strong>Δv:</strong> Change in velocity (m/s)</li>
                <li><strong>Δt:</strong> Time interval (seconds)</li>
              </ul>
              <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                <strong>Application:</strong> Measures how quickly your speed is changing, useful for analyzing 
                motion patterns, detecting stops/starts, and understanding movement dynamics.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="tech-specs" style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '30px' }}>
            Technical Specifications
          </h3>
          <div className="formula-cards">
            <div className="formula-card">
              <h4 style={{ color: '#fff' }}>🎯 GPS Accuracy</h4>
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>Typical Accuracy:</strong> 5-10 meters (civilian GPS)</li>
                <li><strong>High Accuracy Mode:</strong> 3-5 meters with clear sky view</li>
                <li><strong>Update Rate:</strong> 1 Hz (one position per second)</li>
                <li><strong>Velocity Precision:</strong> ±0.1 m/s with Doppler measurements</li>
              </ul>
            </div>

            <div className="formula-card">
              <h4 style={{ color: '#fff' }}>📊 Data Processing</h4>
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>Coordinate System:</strong> WGS84 (World Geodetic System 1984)</li>
                <li><strong>Distance Precision:</strong> Sub-meter accuracy with UTM</li>
                <li><strong>Time Synchronization:</strong> GPS atomic clock (nanosecond precision)</li>
                <li><strong>Calculation Method:</strong> Real-time computation in browser</li>
              </ul>
            </div>

            <div className="formula-card">
              <h4 style={{ color: '#fff' }}>⚙️ System Requirements</h4>
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>Device:</strong> GPS-enabled smartphone or tablet</li>
                <li><strong>Browser:</strong> Modern browser with Geolocation API support</li>
                <li><strong>Permissions:</strong> Location access required</li>
                <li><strong>Internet:</strong> Required for map tiles only, tracking works offline</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="info-section" style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '30px' }}>
            Practical Applications
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            <div className="formula-card">
              <h4 style={{ color: '#FFFD82' }}>🏃 Sports & Fitness</h4>
              <p>Track running routes, cycling distances, hiking trails. Analyze speed patterns and performance metrics.</p>
            </div>
            <div className="formula-card">
              <h4 style={{ color: '#FF9B71' }}>🚗 Vehicle Tracking</h4>
              <p>Monitor vehicle movement, calculate trip distances, analyze driving patterns and speeds.</p>
            </div>
            <div className="formula-card">
              <h4 style={{ color: '#1B998B' }}>📚 Educational</h4>
              <p>Demonstrate physics concepts, teach coordinate systems, visualize real-world kinematics.</p>
            </div>
            <div className="formula-card">
              <h4 style={{ color: '#E84855' }}>🔬 Research</h4>
              <p>Collect motion data, validate physics models, conduct field experiments with GPS data.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ 
          marginTop: '60px', 
          padding: '30px 0',
          borderTop: '2px solid rgba(27, 153, 139, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => onNavigate('tracker')}
            className="btn btn-primary"
            style={{ minWidth: '180px' }}
          >
            Start Tracking
          </button>
          <button 
            onClick={() => onNavigate('map')}
            className="btn btn-secondary"
            style={{ minWidth: '180px' }}
          >
            View Map Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Physics;
