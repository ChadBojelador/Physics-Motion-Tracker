import { useState } from 'react';

function Sender() {
  const [status, setStatus] = useState('Ready to send');
  const [connectionId, setConnectionId] = useState('');

  return (
    <div className="sender-root">
      <h2 className="section-title">Wireless Sync - Sender</h2>
      
      <div className="info-box" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        background: 'rgba(27, 153, 139, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(27, 153, 139, 0.2)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1B998B' }}>📡 Wireless Sync</h3>
        <p style={{ color: '#aaa', lineHeight: '1.6', margin: 0 }}>
          Send your GPS location data from your smartphone to any other device in real-time. 
          Perfect for viewing your phone's location on a larger screen or sharing tracking data 
          across multiple devices simultaneously.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h4 style={{ marginTop: 0 }}>How It Works</h4>
        <div className="steps-list">
          <div className="step-item">
            <span className="step-badge">1</span>
            <div>
              <strong>Connect to Server</strong>
              <p>Establish WebSocket connection to the backend server</p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-badge">2</span>
            <div>
              <strong>Start Tracking</strong>
              <p>Begin GPS tracking on your smartphone</p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-badge">3</span>
            <div>
              <strong>Send Data</strong>
              <p>Location data is transmitted in real-time via WebSocket</p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-badge">4</span>
            <div>
              <strong>Receive Anywhere</strong>
              <p>View on laptop, tablet, or any connected device</p>
            </div>
          </div>
        </div>
      </div>

      <div className="status small" style={{ marginTop: '15px' }}>
        Status: {status}
      </div>

      <div className="card" style={{ 
        marginTop: '20px',
        background: 'rgba(13, 173, 125, 0.08)'
      }}>
        <h4 style={{ marginTop: 0, color: '#FF9B71' }}>Technical Details</h4>
        <ul style={{ color: '#aaa', lineHeight: '1.8', margin: 0 }}>
          <li>🔐 Secure WebSocket (Socket.io) connection</li>
          <li>⚡ Low latency transmission (&lt;100ms typical)</li>
          <li>🔄 Automatic reconnection on disconnect</li>
          <li>📱 Cross-platform support (any device with browser)</li>
          <li>🌐 Works on local network or over internet</li>
          <li>💾 Real-time bidirectional communication</li>
        </ul>
      </div>

      <div className="info-note" style={{
        marginTop: '20px',
        padding: '12px 16px',
        background: 'rgba(255, 253, 130, 0.1)',
        border: '1px solid rgba(255, 253, 130, 0.3)',
        borderRadius: '8px',
        color: '#FFFD82',
        fontSize: '0.9rem'
      }}>
        💡 <strong>Note:</strong> Backend server required for wireless sync functionality. 
        Start the Node.js server from the backend folder to enable this feature.
      </div>
    </div>
  );
}

export default Sender;
