const API_BASE_URL = 'http://localhost:8000'; // Replace with your deployed backend URL

export const submitTripDetails = async (tripData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trip-planner/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
