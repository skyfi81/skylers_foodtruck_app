import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styled from 'styled-components';

L.Icon.Default.mergeOptions({
  iconUrl: '/icons/foodtruck-default.png',
  iconRetinaUrl: '/icons/foodtruck-default.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 30],
  iconAnchor: [12, 30],
  popupAnchor: [1, -34],
  shadowSize: [30, 30]
});

const highlightedIcon = new L.Icon({
  iconUrl: '/icons/foodtruck-red.png',
  iconRetinaUrl: '/icons/foodtruck-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 35],
  iconAnchor: [12, 35],
  popupAnchor: [1, -34],
  shadowSize: [35, 35]
});

const favoriteIcon = new L.Icon({
  iconUrl: '/icons/foodtruck-gold.png',
  iconRetinaUrl: '/icons/foodtruck-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 35],
  iconAnchor: [12, 35],
  popupAnchor: [1, -34],
  shadowSize: [35, 35]
});

const Container = styled.div`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7); /* White background with transparency */
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.main};
  border-radius: 8px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
`;

const SearchInput = styled.input`
  width: 100%;
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 5px 0;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
`;

const ErrorMessage = styled.p`
  color: red;
`;

const HomePage = () => {
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [highlightedTruckId, setHighlightedTruckId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const userId = 'EsteeLauder';

  // Default markers in case the API is down
  const defaultMarkers = [
    {
      objectid: '1',
      applicant: 'Imaginary Food Truck',
      address: '123 Main St',
      latitude: 37.7749,
      longitude: -122.4194
    },
    {
      objectid: '2',
      applicant: 'Also Imaginary Food Truck',
      address: '456 Secondary St',
      latitude: 37.7849,
      longitude: -122.4094
    }
  ];

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/foodtrucks`)
      .then(response => {
        setFoodTrucks(response.data);
        setError('');
      })
      .catch(error => {
        setFoodTrucks(defaultMarkers); // Use default markers if API fails
        setError('Failed to fetch food truck data. Please check API status at https://data.sfgov.org/resource/rqzj-sfat.json or try again later.');
        console.error('Error fetching food trucks:', error);
      });

    axios.get(`${process.env.REACT_APP_API_URL}/favorites/${userId}`)
      .then(response => setFavorites(response.data))
      .catch(error => console.error('Error fetching favorites:', error));
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleMouseEnter = (id) => {
    setHighlightedTruckId(id);
  };

  const handleMouseLeave = () => {
    setHighlightedTruckId(null);
  };

  const filteredTrucks = foodTrucks.filter(truck =>
    (truck.applicant && truck.applicant.toLowerCase().includes(search.toLowerCase())) ||
    (truck.fooditems && truck.fooditems.toLowerCase().includes(search.toLowerCase()))
  );

  const isFavorite = (id) => {
    return favorites.some(favorite => favorite.objectid === id);
  };

  return (
    <Container>
      <Title>Food Trucks Of San Francisco</Title>
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
      <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredTrucks.map(foodTruck => (
          <Marker
            key={foodTruck.objectid}
            position={[foodTruck.latitude || 37.7749, foodTruck.longitude || -122.4194]}
            icon={isFavorite(foodTruck.objectid) ? favoriteIcon : (highlightedTruckId === foodTruck.objectid ? highlightedIcon : new L.Icon.Default())}
          >
            <Popup>
              <strong>{foodTruck.applicant}</strong><br />
              {foodTruck.address}<br />
              {foodTruck.fooditems}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <SearchInput
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />
      <SectionTitle>Favorite Food Trucks</SectionTitle>
      <List>
        {favorites.length > 0 ? (
          favorites.map(foodTruck => (
            <ListItem key={foodTruck.objectid}>
              <Link to={`/foodtruck/${foodTruck.objectid}`}
                onMouseEnter={() => handleMouseEnter(foodTruck.objectid)}
                onMouseLeave={handleMouseLeave}
              >
                {foodTruck.applicant}
              </Link>
            </ListItem>
          ))
        ) : (
          <p>No favorite food trucks available.</p>
        )}
      </List>
      <SectionTitle>Active Food Trucks</SectionTitle>
      <List>
        {filteredTrucks.length > 0 ? (
          filteredTrucks.map(foodTruck => (
            <ListItem key={foodTruck.objectid}>
              <Link to={`/foodtruck/${foodTruck.objectid}`}
                onMouseEnter={() => handleMouseEnter(foodTruck.objectid)}
                onMouseLeave={handleMouseLeave}
              >
                {foodTruck.applicant}
              </Link>
            </ListItem>
          ))
        ) : (
          <p>No food trucks available.</p>
        )}
      </List>
    </Container>
  );
};

export default HomePage;