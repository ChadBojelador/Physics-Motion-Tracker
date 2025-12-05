import { useState } from 'react';
import Home from './components/Home.jsx';
import Tracker from './components/Tracker.jsx';
import './index.css';

export default function App() {
  const [view, setView] = useState('home');

  const renderView = () => {
    if (view === 'home') {
      return <Home onNavigate={setView} />;
    }

    return (
      <div className="app">
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <button 
            onClick={() => setView('home')}
            className="btn btn-ghost"
            style={{ marginBottom: '10px' }}
          >
            ← Back
          </button>
          <Tracker />
        </div>
      </div>
    );
  };

  return renderView();
}
