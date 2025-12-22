import { useEffect } from 'react';
import './Home.css';

function Physics({ onNavigate }) {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
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

    const elements = document.querySelectorAll('.physics-animate');
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="home-container" style={{ background: 'linear-gradient(135deg, #1a1d2e 0%, #2D3047 100%)' }}>
      <div className="home-content">
        {/* Header with gradient background */}
        <div className="physics-animate" style={{ 
          opacity: 0,
          transform: 'translateY(-20px)',
          transition: 'all 0.6s ease',
          background: 'linear-gradient(135deg, rgba(27, 153, 139, 0.1), rgba(255, 253, 130, 0.1))',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '40px',
          border: '1px solid rgba(27, 153, 139, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(27, 153, 139, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h1 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: 'clamp(2rem, 6vw, 3rem)', 
                  background: 'linear-gradient(135deg, #1B998B 0%, #FFFD82 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Physics & Calculations
                </h1>
                <p style={{ 
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
                  color: '#aaa',
                  margin: 0
                }}>
                  Advanced formulas powering precision motion tracking
                </p>
              </div>
              <button 
                onClick={() => onNavigate('home')}
                className="btn btn-ghost"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  padding: '12px 24px',
                  background: 'rgba(27, 153, 139, 0.1)',
                  border: '2px solid rgba(27, 153, 139, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(27, 153, 139, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(27, 153, 139, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span className="material-icons">home</span>
                Home
              </button>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="physics-animate" style={{ 
          opacity: 0,
          transform: 'translateY(-20px)',
          transition: 'all 0.6s ease',
          marginBottom: '60px',
          padding: '30px',
          background: 'rgba(27, 153, 139, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(27, 153, 139, 0.2)',
          borderLeft: '4px solid #1B998B'
        }}>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            lineHeight: '1.8',
            color: '#ccc',
            margin: 0,
            textAlign: 'center'
          }}>
            Our GPS tracker uses advanced physics formulas and coordinate transformations to provide 
            accurate real-time motion analysis. Below are the key calculations and methodologies used 
            in the system.
          </p>
        </div>

        {/* Core Physics Formulas Section */}
        <div className="physics-animate" style={{ 
          opacity: 0,
          transform: 'translateY(-20px)',
          transition: 'all 0.6s ease',
          marginBottom: '60px'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
            marginBottom: '40px',
            textAlign: 'center',
            color: '#1B998B',
            position: 'relative',
            paddingBottom: '20px'
          }}>
            <span style={{
              position: 'relative',
              display: 'inline-block'
            }}>
              Core Physics Formulas
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #1B998B, transparent)',
                borderRadius: '2px'
              }}></div>
            </span>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gap: '30px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
          }}>
            {/* Euclidean Distance Card */}
            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(27, 153, 139, 0.1), rgba(27, 153, 139, 0.05))',
              borderRadius: '16px',
              border: '1px solid rgba(27, 153, 139, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(27, 153, 139, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px'
              }}>📐</div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Euclidean Distance</h3>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                color: '#FFFD82',
                textAlign: 'center',
                border: '1px solid rgba(255, 253, 130, 0.2)'
              }}>
                d = √[(x₂ - x₁)² + (y₂ - y₁)²]
              </div>
              <div style={{ lineHeight: '1.8', color: '#ccc' }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#1B998B' }}>Purpose:</strong> Calculates the straight-line distance between two points in a Cartesian coordinate system.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#1B998B' }}>Application:</strong> After converting GPS coordinates to UTM coordinates, we use this formula to calculate precise distance traveled in meters.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#1B998B' }}>Why it matters:</strong> Provides accurate metric measurements that account for Earth's curvature through the UTM projection system.
                </p>
              </div>
            </div>

            {/* UTM Projection Card */}
            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(255, 155, 113, 0.1), rgba(255, 155, 113, 0.05))',
              borderRadius: '16px',
              border: '1px solid rgba(255, 155, 113, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 155, 113, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px'
              }}>🌍</div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>UTM Projection System</h3>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                color: '#FF9B71',
                textAlign: 'center',
                border: '1px solid rgba(255, 155, 113, 0.2)'
              }}>
                WGS84 → UTM Zone → Easting/Northing
              </div>
              <div style={{ lineHeight: '1.8', color: '#ccc' }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#FF9B71' }}>Purpose:</strong> Converts spherical Earth coordinates (lat/lon) into a flat Cartesian coordinate system measured in meters.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#FF9B71' }}>Key Components:</strong>
                </p>
                <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                  <li><strong>WGS84:</strong> Semi-major axis a = 6,378,137m</li>
                  <li><strong>Eccentricity:</strong> e = 0.0818192</li>
                  <li><strong>UTM Zones:</strong> 60 zones, 6° each</li>
                  <li><strong>Scale Factor:</strong> k₀ = 0.9996</li>
                </ul>
              </div>
            </div>

            {/* Velocity Card */}
            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(255, 253, 130, 0.1), rgba(255, 253, 130, 0.05))',
              borderRadius: '16px',
              border: '1px solid rgba(255, 253, 130, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 253, 130, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px'
              }}>🚀</div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Velocity Calculation</h3>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                color: '#FFFD82',
                textAlign: 'center',
                border: '1px solid rgba(255, 253, 130, 0.2)'
              }}>
                v = Δd / Δt
              </div>
              <div style={{ lineHeight: '1.8', color: '#ccc' }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#FFFD82' }}>Formula Breakdown:</strong>
                </p>
                <ul style={{ marginLeft: '20px', lineHeight: '1.8', marginBottom: '15px' }}>
                  <li><strong>v:</strong> Velocity (m/s)</li>
                  <li><strong>Δd:</strong> Distance change (meters)</li>
                  <li><strong>Δt:</strong> Time elapsed (seconds)</li>
                </ul>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#FFFD82' }}>Primary Source:</strong> GPS Doppler shift analysis provides direct velocity measurements with high accuracy.
                </p>
              </div>
            </div>

            {/* Acceleration Card */}
            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(232, 72, 85, 0.1), rgba(232, 72, 85, 0.05))',
              borderRadius: '16px',
              border: '1px solid rgba(232, 72, 85, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(232, 72, 85, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px'
              }}>⚡</div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Acceleration</h3>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                color: '#E84855',
                textAlign: 'center',
                border: '1px solid rgba(232, 72, 85, 0.2)'
              }}>
                a = Δv / Δt
              </div>
              <div style={{ lineHeight: '1.8', color: '#ccc' }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#E84855' }}>Formula Breakdown:</strong>
                </p>
                <ul style={{ marginLeft: '20px', lineHeight: '1.8', marginBottom: '15px' }}>
                  <li><strong>a:</strong> Acceleration (m/s²)</li>
                  <li><strong>Δv:</strong> Velocity change (m/s)</li>
                  <li><strong>Δt:</strong> Time interval (seconds)</li>
                </ul>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#E84855' }}>Application:</strong> Measures speed change rate, useful for analyzing motion patterns and movement dynamics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="physics-animate" style={{ 
          opacity: 0,
          transform: 'translateY(-20px)',
          transition: 'all 0.6s ease',
          marginTop: '80px',
          marginBottom: '60px'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
            marginBottom: '40px',
            textAlign: 'center',
            color: '#FF9B71',
            position: 'relative',
            paddingBottom: '20px'
          }}>
            <span style={{
              position: 'relative',
              display: 'inline-block'
            }}>
              Technical Specifications
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #FF9B71, transparent)',
                borderRadius: '2px'
              }}></div>
            </span>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gap: '30px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '30px',
              background: 'rgba(27, 153, 139, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(27, 153, 139, 0.2)',
              borderTop: '4px solid #1B998B'
            }}>
              <h3 style={{ color: '#1B998B', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>🎯</span> GPS Accuracy
              </h3>
              <ul style={{ marginLeft: '20px', lineHeight: '2', color: '#ccc' }}>
                <li><strong style={{ color: '#fff' }}>Typical:</strong> 5-10 meters</li>
                <li><strong style={{ color: '#fff' }}>High Accuracy:</strong> 3-5 meters</li>
                <li><strong style={{ color: '#fff' }}>Update Rate:</strong> 1 Hz</li>
                <li><strong style={{ color: '#fff' }}>Velocity:</strong> ±0.1 m/s</li>
              </ul>
            </div>

            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '30px',
              background: 'rgba(255, 155, 113, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 155, 113, 0.2)',
              borderTop: '4px solid #FF9B71'
            }}>
              <h3 style={{ color: '#FF9B71', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>📊</span> Data Processing
              </h3>
              <ul style={{ marginLeft: '20px', lineHeight: '2', color: '#ccc' }}>
                <li><strong style={{ color: '#fff' }}>System:</strong> WGS84</li>
                <li><strong style={{ color: '#fff' }}>Precision:</strong> Sub-meter</li>
                <li><strong style={{ color: '#fff' }}>Time Sync:</strong> GPS atomic clock</li>
                <li><strong style={{ color: '#fff' }}>Method:</strong> Real-time browser</li>
              </ul>
            </div>

            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '30px',
              background: 'rgba(232, 72, 85, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(232, 72, 85, 0.2)',
              borderTop: '4px solid #E84855'
            }}>
              <h3 style={{ color: '#E84855', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>⚙️</span> Requirements
              </h3>
              <ul style={{ marginLeft: '20px', lineHeight: '2', color: '#ccc' }}>
                <li><strong style={{ color: '#fff' }}>Device:</strong> GPS-enabled</li>
                <li><strong style={{ color: '#fff' }}>Browser:</strong> Modern with Geolocation API</li>
                <li><strong style={{ color: '#fff' }}>Permissions:</strong> Location access</li>
                <li><strong style={{ color: '#fff' }}>Internet:</strong> For map tiles only</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="physics-animate" style={{ 
          opacity: 0,
          transform: 'translateY(-20px)',
          transition: 'all 0.6s ease',
          marginTop: '80px',
          marginBottom: '60px'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
            marginBottom: '40px',
            textAlign: 'center',
            color: '#FFFD82',
            position: 'relative',
            paddingBottom: '20px'
          }}>
            <span style={{
              position: 'relative',
              display: 'inline-block'
            }}>
              Practical Applications
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #FFFD82, transparent)',
                borderRadius: '2px'
              }}></div>
            </span>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gap: '25px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '25px',
              background: 'linear-gradient(135deg, rgba(255, 253, 130, 0.1), rgba(255, 253, 130, 0.05))',
              borderRadius: '12px',
              border: '1px solid rgba(255, 253, 130, 0.3)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏃</div>
              <h3 style={{ color: '#FFFD82', fontSize: '1.3rem', marginBottom: '15px' }}>Sports & Fitness</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>Track running routes, cycling distances, hiking trails. Analyze speed patterns and performance metrics.</p>
            </div>

            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '25px',
              background: 'linear-gradient(135deg, rgba(255, 155, 113, 0.1), rgba(255, 155, 113, 0.05))',
              borderRadius: '12px',
              border: '1px solid rgba(255, 155, 113, 0.3)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚗</div>
              <h3 style={{ color: '#FF9B71', fontSize: '1.3rem', marginBottom: '15px' }}>Vehicle Tracking</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>Monitor vehicle movement, calculate trip distances, analyze driving patterns and speeds.</p>
            </div>

            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '25px',
              background: 'linear-gradient(135deg, rgba(27, 153, 139, 0.1), rgba(27, 153, 139, 0.05))',
              borderRadius: '12px',
              border: '1px solid rgba(27, 153, 139, 0.3)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📚</div>
              <h3 style={{ color: '#1B998B', fontSize: '1.3rem', marginBottom: '15px' }}>Educational</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>Demonstrate physics concepts, teach coordinate systems, visualize real-world kinematics.</p>
            </div>

            <div className="physics-animate" style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'all 0.6s ease',
              padding: '25px',
              background: 'linear-gradient(135deg, rgba(232, 72, 85, 0.1), rgba(232, 72, 85, 0.05))',
              borderRadius: '12px',
              border: '1px solid rgba(232, 72, 85, 0.3)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔬</div>
              <h3 style={{ color: '#E84855', fontSize: '1.3rem', marginBottom: '15px' }}>Research</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>Collect motion data, validate physics models, conduct field experiments with GPS data.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="physics-animate" style={{ 
          opacity: 0,
          transform: 'translateY(-20px)',
          transition: 'all 0.6s ease',
          marginTop: '80px', 
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(27, 153, 139, 0.1), rgba(232, 72, 85, 0.1))',
          borderRadius: '16px',
          border: '1px solid rgba(27, 153, 139, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => onNavigate('tracker')}
            className="btn btn-primary"
            style={{ 
              minWidth: '180px',
              padding: '16px 32px',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #1B998B, #17a89a)',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 10px 25px rgba(27, 153, 139, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Start Tracking
          </button>
          <button 
            onClick={() => onNavigate('map')}
            className="btn btn-secondary"
            style={{ 
              minWidth: '180px',
              padding: '16px 32px',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #E84855, #d43d49)',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 10px 25px rgba(232, 72, 85, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            View Map Demo
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Physics;
