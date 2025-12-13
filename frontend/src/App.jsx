import { useState } from 'react';
import Home from './components/Home.jsx';
import Tracker from './components/Tracker.jsx';
import MapDemo from './components/MapDemo.jsx';
import Physics from './components/Physics.jsx';
import './index.css';

export default function App() {
  const [view, setView] = useState('home');

  const renderView = () => {
    if (view === 'home') {
      return <Home onNavigate={setView} />;
    }

    if (view === 'map') {
      return (
        <div className="app">
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <MapDemo onNavigate={setView} />
          </div>
        </div>
      );
    }

    if (view === 'physics') {
      return <Physics onNavigate={setView} />;
    }

    return (
      <div className="app">
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <button 
            onClick={() => setView('home')}
            className="btn btn-ghost"
            style={{ marginBottom: '10px' }}
          >
            ← Back to Home
          </button>
          <Tracker />
        </div>
      </div>
    );
  };

  return renderView();
}
