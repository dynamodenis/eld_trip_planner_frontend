import React, { useState } from 'react';
import TripForm from './components/TripForm';
import RouteMap from './components/RouteMap';
import ELDLogs from './components/ELDLogs';
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
        <h1>ELD Trip Planner</h1>
        <p>Plan your commercial trips with HOS regulations in mind</p>
      </header>
      
      <main className="app-content">
        <div className="left-panel">
          <TripForm 
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
            <ELDLogs logSheets={tripData.log_sheets} />
          </div>
        ) : (
          <div className="right-panel empty-state">
            <p>Enter your trip details to get started</p>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 ELD Trip Planner</p>
      </footer>
    </div>
  );
}

export default App;