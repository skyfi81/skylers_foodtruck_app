import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FoodTruckList() {
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/foodtrucks`)
      .then(response => setFoodTrucks(response.data))
      .catch(error => console.error('Error fetching food trucks:', error));
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredTrucks = foodTrucks.filter(truck =>
    (truck.applicant && truck.applicant.toLowerCase().includes(search.toLowerCase())) ||
    (truck.fooditems && truck.fooditems.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h1>Food Trucks</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />
      <ul>
        {filteredTrucks.length > 0 ? (
          filteredTrucks.map(foodTruck => (
            <li key={foodTruck.objectid}>
              <Link to={`/foodtruck/${foodTruck.objectid}`}>{foodTruck.applicant}</Link>
            </li>
          ))
        ) : (
          <p>No food trucks available.</p>
        )}
      </ul>
    </div>
  );
}

export default FoodTruckList;
