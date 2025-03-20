import React, { useEffect, useRef } from 'react';

const LogGrid = ({ logData }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!logData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);
    
    // Plot log data
    plotLogData(ctx, logData.events, canvas.width, canvas.height);
    
  }, [logData]);
  
  const drawGrid = (ctx, width, height) => {
    // Set grid colors and styles
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    
    // Draw vertical time lines (24 hours)
    for (let hour = 0; hour <= 24; hour++) {
      const x = (hour / 24) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      // Add hour labels
      if (hour < 24) {
        ctx.fillStyle = '#666666';
        ctx.font = '10px Arial';
        ctx.fillText(`${hour}:00`, x + 2, 10);
      }
    }
    
    // Draw horizontal duty status lines
    const statusPositions = {
      'OFF': height * 0.25, // 1/4 down - Off Duty
      'SB': height * 0.5,   // 1/2 down - Sleeper Berth
      'D': height * 0.75,   // 3/4 down - Driving
      'ON': height          // Bottom - On Duty (Not Driving)
    };
    
    Object.entries(statusPositions).forEach(([status, y]) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Add status labels
      ctx.fillStyle = '#666666';
      ctx.font = '10px Arial';
      ctx.fillText(status, 2, y - 3);
    });
  };
  
  const plotLogData = (ctx, events, width, height) => {
    if (!events || events.length === 0) return;
    
    // Define status heights
    const statusPositions = {
      'OFF': height * 0.25, // 1/4 down - Off Duty
      'SB': height * 0.5,   // 1/2 down - Sleeper Berth
      'D': height * 0.75,   // 3/4 down - Driving
      'ON': height          // Bottom - On Duty (Not Driving)
    };
    
    // Define status colors
    const statusColors = {
      'OFF': '#4CAF50', // Green for Off Duty
      'SB': '#2196F3',  // Blue for Sleeper Berth
      'D': '#FF9800',   // Orange for Driving
      'ON': '#F44336'   // Red for On Duty (Not Driving)
    };
    
    // Sort events by time
    const sortedEvents = [...events].sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      
      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      return timeA[1] - timeB[1];
    });
    
    // Plot lines connecting status changes
    ctx.lineWidth = 3;
    
    let prevX = 0;
    let prevY = statusPositions[sortedEvents[0].status];
    let prevStatus = sortedEvents[0].status;
    
    sortedEvents.forEach((event, index) => {
      // Skip the first event as it's our starting point
      if (index === 0) return;
      
      const [hours, minutes] = event.time.split(':').map(Number);
      const timeDecimal = hours + (minutes / 60);
      const x = (timeDecimal / 24) * width;
      const y = statusPositions[event.status];
      
      // Set line color based on previous status
      ctx.strokeStyle = statusColors[prevStatus];
      
      // Draw horizontal line from previous event to this time point
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, prevY);
      ctx.stroke();
      
      // Draw vertical line to the new status
      ctx.beginPath();
      ctx.moveTo(x, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Update previous position for next segment
      prevX = x;
      prevY = y;
      prevStatus = event.status;
    });
    
    // Draw final segment to the end of the day if not at end already
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    const [lastHours, lastMinutes] = lastEvent.time.split(':').map(Number);
    const lastTimeDecimal = lastHours + (lastMinutes / 60);
    
    if (lastTimeDecimal < 24) {
      ctx.strokeStyle = statusColors[lastEvent.status];
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(width, prevY);
      ctx.stroke();
    }
  };
  
  return (
    <div className="eld-grid-container">
      <h3>Driver's Daily Log</h3>
      <div className="grid-header">
        <div className="driver-info">
          <div className="info-row">
            <span className="label">Date:</span>
            <span className="value">{logData.date}</span>
          </div>
          <div className="info-row">
            <span className="label">Carrier:</span>
            <span className="value">DHL.</span>
          </div>
        </div>
        <div className="status-legend">
          <div className="legend-item">
            <span className="color-box off-duty"></span>
            <span>Off Duty</span>
          </div>
          <div className="legend-item">
            <span className="color-box sleeper"></span>
            <span>Sleeper Berth</span>
          </div>
          <div className="legend-item">
            <span className="color-box driving"></span>
            <span>Driving</span>
          </div>
          <div className="legend-item">
            <span className="color-box on-duty"></span>
            <span>On-Duty (Not Driving)</span>
          </div>
        </div>
      </div>
      
      <div className="grid-canvas-wrapper">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={200} 
          className="eld-grid-canvas"
        ></canvas>
      </div>
    </div>
  );
};

export default React.memo(LogGrid);
