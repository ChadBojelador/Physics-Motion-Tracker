import { useState, useEffect } from 'react';
import './Home.css';

const featureDetails = {
  tracking: {
    title: "Real-Time Tracking",
    icon: "📍",
    shortDesc: "Stream your live GPS coordinates with high-accuracy mode enabled",
    details: [
      "🔍 High-accuracy GPS mode enabled by default",
      "📡 Continuous position updates via watchPosition API",
      "🎯 UTM (Universal Transverse Mercator) coordinate system for precise calculations",
      "⚡ Maximum location age: 0ms (always fresh data)",
      "⏱️ 15-second timeout for optimal battery/accuracy balance",
      "📊 Live latitude, longitude, speed, distance, and timestamp"
    ],
    formula: "Uses WGS84 ellipsoid constants for coordinate conversion"
  },
  physics: {
    title: "Physics Calculations",
    icon: "📊",
    shortDesc: "Automatic calculation of speed, velocity, acceleration, and displacement using standard formulas",
    details: [
      "📏 Distance: Euclidean calculation √[(x₂-x₁)² + (y₂-y₁)²]",
      "🚀 Speed: Direct GPS velocity in m/s",
      "📍 Displacement: Total accumulated distance traveled",
      "🎯 Segment filtering: Ignores jumps >100m (GPS errors)",
      "🔄 Movement detection: Speed threshold at 0.05 m/s",
      "📐 Coordinate projection: Lat/lon → UTM for metric calculations"
    ],
    formula: "Distance in meters using UTM projection, preserving sub-meter accuracy"
  },
  map: {
    title: "Live Map View",
    icon: "🗺️",
    shortDesc: "Interactive Leaflet map with destination pinning and road-following",
    details: [
      "🌍 OpenStreetMap + OSRM routing for realistic paths",
      "📍 Pin any destination to auto-generate a route",
      "🛣️ Path visualization that follows actual road geometry",
      "⚙️ Speed, progress, and ETA stats update in real-time",
      "🔄 Movement controls for start, stop, and reset",
      "📱 Responsive layout optimized for touch devices"
    ],
    formula: "Powered by Leaflet.js with OSRM road-network routing"
  }
};

function Home({ onNavigate }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Intersection Observer for scroll-based animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const animateElements = document.querySelectorAll('.home-animate');
    animateElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      animateElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  useEffect(() => {
    const container = document.querySelector('.physics-background');
    if (!container) return;


    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 400}px`);
      particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 400}px`);
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      container.appendChild(particle);
    }


    for (let i = 0; i < 8; i++) {
      const line = document.createElement('div');
      line.className = 'velocity-line';
      line.style.top = `${10 + i * 12}%`;
      line.style.left = `${-20}%`;
      line.style.width = `${40 + Math.random() * 60}px`;
      line.style.animationDelay = `${i * 1}s`;
      container.appendChild(line);
    }


    for (let i = 0; i < 4; i++) {
      const wave = document.createElement('div');
      wave.className = 'wave-line';
      wave.style.top = `${20 + i * 20}%`;
      wave.style.animationDuration = `${12 + i * 3}s`;
      wave.style.animationDelay = `${i * -3}s`;
      container.appendChild(wave);
    }


    for (let i = 0; i < 3; i++) {
      const orbit = document.createElement('div');
      orbit.className = 'orbit';
      const size = 100 + i * 80;
      orbit.style.width = `${size}px`;
      orbit.style.height = `${size}px`;
      orbit.style.left = `${20 + i * 25}%`;
      orbit.style.top = `${30 + i * 15}%`;
      orbit.style.animationDuration = `${20 + i * 10}s`;
      orbit.style.animationDirection = i % 2 === 0 ? 'normal' : 'reverse';
      
      const orbitParticle = document.createElement('div');
      orbitParticle.className = 'orbit-particle';
      orbitParticle.style.setProperty('--orbit-radius', `${size / 2}px`);
      orbitParticle.style.animationDuration = `${5 + i * 2}s`;
      orbit.appendChild(orbitParticle);
      
      container.appendChild(orbit);
    }


    for (let i = 0; i < 6; i++) {
      const arrow = document.createElement('div');
      arrow.className = 'acceleration-arrow';
      arrow.style.left = `${5 + i * 15}%`;
      arrow.style.top = `${60 + (i % 3) * 10}%`;
      arrow.style.animationDelay = `${i * 0.7}s`;
      container.appendChild(arrow);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  const handleCardClick = (page) => {
    onNavigate(page);
  };

  return (
    <div className="home-container">
      <div className="physics-background">
        <div className="physics-grid"></div>
      </div>
      <div className="home-content">
        <div className="hero-section home-animate" style={{ opacity: 0, transform: 'translateY(-20px)', transition: 'all 0.8s ease' }}>
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Track Your Motion with Precision</h1>
              <p className="hero-subtitle">
                Real-time GPS tracking with advanced physics calculations. Measure distance, velocity, and acceleration through your smartphone with laboratory-grade accuracy.
              </p>
              <div className="hero-cta">
                <button 
                  className="cta-primary-btn"
                  onClick={() => handleCardClick('tracker')}
                >
                  Start Tracking Now
                </button>
                <button 
                  className="cta-secondary-btn"
                  onClick={() => handleCardClick('map')}
                >
                  View Demo
                </button>
              </div>
              <div className="hero-features">
                <div className="hero-feature-item">
                  <span className="feature-icon-small">📍</span>
                  <span>High-Accuracy GPS</span>
                </div>
                <div className="hero-feature-item">
                  <span className="feature-icon-small">📊</span>
                  <span>Real-Time Physics</span>
                </div>
                <div className="hero-feature-item">
                  <span className="feature-icon-small">🗺️</span>
                  <span>Interactive Maps</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-placeholder">
                <div className="floating-card card-1">
                  <div className="stat-icon">🚀</div>
                  <div className="stat-label">Speed</div>
                  <div className="stat-value">15.3 m/s</div>
                </div>
                <div className="floating-card card-2">
                  <div className="stat-icon">📏</div>
                  <div className="stat-label">Distance</div>
                  <div className="stat-value">1,247 m</div>
                </div>
                <div className="floating-card card-3">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-label">Time</div>
                  <div className="stat-value">2:34</div>
                </div>
                <div className="hero-graphic">
                  <div className="graphic-circle circle-1"></div>
                  <div className="graphic-circle circle-2"></div>
                  <div className="graphic-circle circle-3"></div>
                  <div className="graphic-path"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="features-grid home-animate" style={{ opacity: 0, transform: 'translateY(-20px)', transition: 'all 0.8s ease' }}>
          <div 
            className="feature-card home-animate"
            style={{ opacity: 0, transform: 'translateY(-20px)', transition: 'all 0.6s ease' }}
            onClick={() => handleCardClick('tracker')}
            onMouseEnter={() => setHoveredCard('tracking')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="feature-icon">{featureDetails.tracking.icon}</div>
            <h3>{featureDetails.tracking.title}</h3>
            <p>{featureDetails.tracking.shortDesc}</p>
            <div className="card-click-hint">Click to open tracker →</div>
            {hoveredCard === 'tracking' && (
              <div className="hover-tooltip">
                <div className="tooltip-content">
                  {featureDetails.tracking.details.slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="tooltip-item">{detail}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div 
            className="feature-card"
            onClick={() => handleCardClick('physics')}
            onMouseEnter={() => setHoveredCard('physics')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="feature-icon">{featureDetails.physics.icon}</div>
            <h3>{featureDetails.physics.title}</h3>
            <p>Explore the advanced calculations and formulas powering accurate motion tracking</p>
            <div className="card-click-hint">Learn more →</div>
            {hoveredCard === 'physics' && (
              <div className="hover-tooltip">
                <div className="tooltip-content">
                  <div className="tooltip-item">📐 Euclidean Distance Calculations</div>
                  <div className="tooltip-item">🌍 UTM Projection System</div>
                  <div className="tooltip-item">🚀 Velocity & Acceleration Formulas</div>
                </div>
              </div>
            )}
          </div>

          <div 
            className="feature-card"
            onClick={() => handleCardClick('map')}
            onMouseEnter={() => setHoveredCard('map')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="feature-icon">{featureDetails.map.icon}</div>
            <h3>{featureDetails.map.title}</h3>
            <p>{featureDetails.map.shortDesc}</p>
            <div className="card-click-hint">Click to view map →</div>
            {hoveredCard === 'map' && (
              <div className="hover-tooltip">
                <div className="tooltip-content">
                  {featureDetails.map.details.slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="tooltip-item">{detail}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        <div
          className="info-section home-animate"
          style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s ease' }}
        >
          <h3>How It Works</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div>
                <h4>Allow Location</h4>
                <p>Grant GPS permission when prompted. The app requests high-accuracy mode for precise tracking within meters.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div>
                <h4>Start Tracking</h4>
                <p>Press Start to begin recording your movement. The app uses watchPosition for continuous real-time updates (~1-2 seconds).</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div>
                <h4>View Data</h4>
                <p>See real-time distance, speed, and location data. All calculations use UTM projection for metric accuracy.</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="tech-specs home-animate"
          style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s ease' }}
        >
          <h3>Technical Specifications</h3>
          <div className="specs-grid">
            <div className="spec-card">
              <div className="spec-icon">🎯</div>
              <h4>GPS Accuracy</h4>
              <p>High-accuracy mode enabled</p>
              <div className="spec-value">±5-10 meters typical</div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">⚡</div>
              <h4>Update Rate</h4>
              <p>Continuous position streaming</p>
              <div className="spec-value">~1-2 seconds</div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">📏</div>
              <h4>Distance Method</h4>
              <p>UTM coordinate projection</p>
              <div className="spec-value">Sub-meter precision</div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">🚀</div>
              <h4>Speed Detection</h4>
              <p>GPS-derived velocity</p>
              <div className="spec-value">0.05 m/s threshold</div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-title">Physics Motion Tracker</h4>
              <p className="footer-description">
                Real-time GPS tracking with advanced physics calculations for precision motion analysis.
              </p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">Developed By</h4>
              <div className="team-members">
                <div className="team-member">Chad Bojelador</div>
                <div className="team-member">Martin Yambao</div>
                <div className="team-member">Carel Tabor</div>
                <div className="team-member">Czantelle Villena</div>
                <div className="team-member">Ashley Castillo</div>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-subtitle">Quick Links</h4>
              <div className="footer-links">
                <button onClick={() => handleCardClick('tracker')} className="footer-link">Start Tracking</button>
                <button onClick={() => handleCardClick('map')} className="footer-link">Live Map Demo</button>
                <button onClick={() => handleCardClick('physics')} className="footer-link">Physics & Formulas</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Physics Motion Tracker. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
