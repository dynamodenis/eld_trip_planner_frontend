import React, { useState } from 'react';
import { submitTripDetails } from '../services/api';

const Form = ({ onSubmit, setLoading, setError }) => {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'current_cycle_used' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await submitTripDetails(formData);
      onSubmit(response);
    } catch (err) {
      setError('Failed to calculate trip. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="trip-form-container">
      <h2>Trip Details</h2>
      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-group">
          <label htmlFor="current_location">Current Location</label>
          <input
            type="text"
            id="current_location"
            name="current_location"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="City, State or Address"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pickup_location">Pickup Location</label>
          <input
            type="text"
            id="pickup_location"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="City, State or Address"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dropoff_location">Dropoff Location</label>
          <input
            type="text"
            id="dropoff_location"
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
            placeholder="City, State or Address"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="current_cycle_used">Current Cycle Used (Hours)</label>
          <input
            type="number"
            id="current_cycle_used"
            name="current_cycle_used"
            value={formData.current_cycle_used}
            onChange={handleChange}
            min="0"
            max="11"
            step="0.5"
            required
          />
          <small>Hours already used in your current driving cycle (0-11)</small>
        </div>
        
        <button type="submit" className="submit-button">
          Calculate Trip
        </button>
      </form>
    </div>
  );
};

export default React.memo(Form);