import { useState } from 'react';

function Sender() {
  const [status] = useState('Prototype preview — backend not yet included');

  return (
    <div className="sender-root">
      <h2 className="section-title">Wireless Sync Preview</h2>
      
      <div className="info-box" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        background: 'rgba(27, 153, 139, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(27, 153, 139, 0.2)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1B998B' }}>📡 Wireless Sync Concept</h3>
        <p style={{ color: '#aaa', lineHeight: '1.6', margin: 0 }}>
          This page documents the upcoming wireless sync workflow. The production build you are using
          does not bundle a backend or live WebSocket bridge yet—so think of this as a design
          reference while the infrastructure is under development.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h4 style={{ marginTop: 0 }}>Planned Flow</h4>
        <div className="steps-list">
          <div className="step-item">
            <span className="step-badge">1</span>
            <div>
              <strong>Connect to Server</strong>
              <p>Future releases will expose a Socket.io bridge hosted alongside the tracker</p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-badge">2</span>
            <div>
              <strong>Start Tracking</strong>
              <p>Use the existing tracker page to collect GPS samples</p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-badge">3</span>
            <div>
              <strong>Send Data</strong>
              <p>Data will stream through the WebSocket channel once the backend ships</p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-badge">4</span>
            <div>
              <strong>Receive Anywhere</strong>
              <p>Any browser client will subscribe to the same channel for mirrored playback</p>
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
        <h4 style={{ marginTop: 0, color: '#FF9B71' }}>Technical Roadmap</h4>
        <ul style={{ color: '#aaa', lineHeight: '1.8', margin: 0 }}>
          <li>🔐 Planned: secure Socket.io channel hosted on Node.js</li>
          <li>⚡ Goal: sub-100ms latency on local networks</li>
          <li>🔄 Automatic reconnection + buffering on disconnect</li>
          <li>📱 Browser-based sender/receiver clients for every device</li>
          <li>🌐 Initial roll-out will target LAN usage before public relay support</li>
          <li>💾 All specs documented here will be updated as milestones ship</li>
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
        💡 <strong>Note:</strong> There is no backend folder or deployment in this repository yet.
        When the server is ready we will update this page with the exact setup steps.
      </div>
    </div>
  );
}

export default Sender;
