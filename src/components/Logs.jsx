import React, { useState } from 'react';
import LogGrid from './LogGrid';
import '../styles/App.css';

const Logs = ({ logSheets }) => {
    const [selectedLogIndex, setSelectedLogIndex] = useState(0);
    
    if (!logSheets || logSheets.length === 0) {
      return <div className="eld-logs empty">No log sheets available</div>;
    }
    
    const selectedLog = logSheets[selectedLogIndex];
    
    const handlePrevious = () => {
      setSelectedLogIndex(Math.max(0, selectedLogIndex - 1));
    };
    
    const handleNext = () => {
      setSelectedLogIndex(Math.min(logSheets.length - 1, selectedLogIndex + 1));
    };
    
    return (
      <div className="eld-logs-container">
        <h2>ELD Log Sheets</h2>
        
        <div className="log-navigation">
          <button 
            className="nav-button"
            onClick={handlePrevious}
            disabled={selectedLogIndex === 0}
          >
            &larr; Previous Day
          </button>
          
          <div className="log-date">
            <span>{selectedLog.date}</span>
            <span className="log-counter">
              {selectedLogIndex + 1} of {logSheets.length}
            </span>
          </div>
          
          <button 
            className="nav-button"
            onClick={handleNext}
            disabled={selectedLogIndex === logSheets.length - 1}
          >
            Next Day &rarr;
          </button>
        </div>
        
        <LogGrid logData={selectedLog} />
        
        <div className="log-events">
          <h3>Events</h3>
          <table className="events-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Status</th>
                <th>Location</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {selectedLog.events.map((event, index) => (
                <tr key={index}>
                  <td>{event.time}</td>
                  <td>
                    <span className={`status-badge status-${event.status.toLowerCase()}`}>
                      {getStatusText(event.status)}
                    </span>
                  </td>
                  <td>{event.location}</td>
                  <td>{event.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Helper function to convert status codes to readable text
  const getStatusText = (status) => {
    const statusMap = {
      'OFF': 'Off Duty',
      'SB': 'Sleeper Berth',
      'D': 'Driving',
      'ON': 'On Duty (Not Driving)'
    };
    
    return statusMap[status] || status;
  };
  
  export default React.memo(Logs);