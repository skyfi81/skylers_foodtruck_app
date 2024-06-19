import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import FoodTruckDetails from './components/FoodTruckDetails';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/foodtruck/:id" element={<FoodTruckDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
