import React, { useState } from 'react';
import Form from './components/Form';
import RouteMap from './components/RouteMap';
import Logs from './components/Logs';
import './styles/App.css';

function App() {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTripSubmission = (data) => {
    setTripData(data);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trip Planner</h1>
        <p>Move with ease and confidence</p>
      </header>

      <main className="app-content">
        <div className="left-panel">
          <Form
            onSubmit={handleTripSubmission}
            setLoading={setLoading}
            setError={setError}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">
            <p>Calculating your trip...</p>
          </div>
        ) : tripData ? (
          <div className="right-panel">
            <RouteMap route={tripData.route} />
            <Logs logSheets={tripData.log_sheets} />
          </div>
        ) : (
          <div className="right-panel empty-state">
            <p>Enter your trip details to get started</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Trip Planner</p>
        <p>
          Created by 
          <a href="https://www.linkedin.com/in/dynamo-denis-mbugua-53304b197/" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '4px' }}>
              Dynamo Denis
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;