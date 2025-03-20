import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// Free to google maps, we sign up and get a token
// https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const RouteMap = ({ route }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  useEffect(() => {
    if (!route) return;
    
    if (map.current) return; // Only initialize once
    
    // Get route coordinates
    let coordinates = [];
    
    if (route.to_pickup && route.to_pickup.features && route.to_pickup.features[0]) {
      const toPickupCoords = route.to_pickup.features[0].geometry.coordinates;
      coordinates = coordinates.concat(toPickupCoords);
    }

    const currentCoord = coordinates[0]
    const pickupCoord = coordinates[coordinates.length -1]

    if (route.pickup_to_dropoff && route.pickup_to_dropoff.features && route.pickup_to_dropoff.features[0]) {
      const toDropoffCoords = route.pickup_to_dropoff.features[0].geometry.coordinates;
      coordinates = coordinates.concat(toDropoffCoords);
    }

    const dropoffCoord = coordinates[coordinates.length-1]

    // If we have no coordinates, don't try to initialize the map
    if (coordinates.length === 0) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates[0], // Center on the first point
      zoom: 9
    });
    
    // Add the route to the map once it loads
    map.current.on('load', () => {
      // Create a line feature for the route
      map.current.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates
          }
        }
      });
      
      map.current.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
      
      // Add current, pickup and dropoff coordinates
      addLocationMapper(currentCoord, pickupCoord, dropoffCoord)

      // Add markers for stops
      addStopsToMap(route.stops);
      
      // Fit the map to show the entire route
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
      
      map.current.fitBounds(bounds, {
        padding: 50
      });
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [route]);
  
  const addStopsToMap = (stops) => {
    if (!stops || !map.current) return;
    
    // For a real app, you would calculate actual stop locations along the route
    // For this starter code, we'll use some example logic
    
    // Add markers for each 10-hour break
    for (let i = 0; i < stops.ten_hour_breaks?.number_of_breaks; i++) {
      // This would need real coordinate calculations in a production app
      const el = document.createElement('div');
      el.className = 'stop-marker rest-stop';
      el.innerHTML = '<span>10hr</span>';
      
      new mapboxgl.Marker(el)
        .setLngLat(stops?.ten_hour_breaks?.location || [0,0]) 
        .setPopup(new mapboxgl.Popup().setHTML('<h3>10-Hour Rest Break</h3>'))
        .addTo(map.current);
    }
    
    // Add markers for each 30-minute break
    for (let i = 0; i < stops.thirty_min_breaks?.number_of_breaks; i++) {
      const el = document.createElement('div');
      el.className = 'stop-marker break-stop';
      el.innerHTML = '<span>30m</span>';
      
      new mapboxgl.Marker(el)
        .setLngLat( stops.thirty_min_breaks?.location || [0, 0]) 
        .setPopup(new mapboxgl.Popup().setHTML('<h3>30-Minute Break</h3>'))
        .addTo(map.current);
    }
    
    // Add markers for each fuel stop
    for (let i = 0; i < stops.fuel_stops?.number_of_fuel_stops; i++) {
      const el = document.createElement('div');
      el.className = 'stop-marker fuel-stop';
      el.innerHTML = '<span>⛽</span>';
      
      new mapboxgl.Marker(el)
        .setLngLat( stops.fuel_stops?.location || [0, 0])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Fuel Stop</h3>'))
        .addTo(map.current);
    }
  };

  const addLocationMapper = (currentCoord, pickupCoord, dropoffCoord) => {
    
    // Add markers for current location
    if (currentCoord && map.current) {
      // This would need real coordinate calculations in a production app
      
      new mapboxgl.Marker({
        color: '#2ecc71', // Green color
        scale: 0.6
      })
        .setLngLat(currentCoord)
        .setPopup(new mapboxgl.Popup().setHTML('<span>Current Location</span>'))
        .addTo(map.current);
    }
    
    // Add markers for pickup location
    if (pickupCoord && map.current) {
      // Use the Mapbox built-in marker with custom options
      new mapboxgl.Marker({
        color: '#3498db', // Blue color
        scale: 0.6
      })
        .setLngLat(pickupCoord)
        .setPopup(new mapboxgl.Popup().setHTML('<span>Pickup Location</span>'))
        .addTo(map.current);
    }

    // Add markers for dropoff location
    if (dropoffCoord && map.current) {
      // Use the Mapbox built-in marker with custom options
      new mapboxgl.Marker({
        color: '#e74c3c', // Red color
        scale: 0.6
      })
        .setLngLat(dropoffCoord)
        .setPopup(new mapboxgl.Popup().setHTML('<span>Dropoff Location</span>'))
        .addTo(map.current);
    }
  };
  
  return (
    <div className="map-container">
      <h2>Route Map</h2>
      <div ref={mapContainer} className="map" />
      
      {route && (
        <div className="route-info">
          <div className="route-summary">
            <div className="summary-item">
              <span className="label">Total Distance:</span>
              <span className="value">{route.total_distance.toFixed(1)} miles</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Duration:</span>
              <span className="value">{route.total_duration.toFixed(1)} hours</span>
            </div>
          </div>
          
          <div className="stops-summary">
            <h3>Required Stops:</h3>
            <ul>
              <li>{route.stops.ten_hour_breaks?.number_of_breaks} rest in 10-hour rest breaks</li>
              <li>{route.stops.thirty_min_breaks?.number_of_breaks} rest in 30-minute breaks</li>
              <li>{route.stops.fuel_stops?.number_of_fuel_stops} fuel stops</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(RouteMap);
