import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon not being loaded properly in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
// });

function FoodTruckMap() {
  const [foodTrucks, setFoodTrucks] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/foodtrucks`)
      .then(response => setFoodTrucks(response.data))
      .catch(error => console.error('Error fetching food trucks:', error));
  }, []);

  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {foodTrucks.map(foodTruck => (
        <Marker 
          key={foodTruck.objectid} 
          position={[foodTruck.latitude || 37.7749, foodTruck.longitude || -122.4194]}
        >
          <Popup>
            <strong>{foodTruck.applicant}</strong><br />
                  {foodTruck.address}
                  {foodTruck.fooditems}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default FoodTruckMap;
