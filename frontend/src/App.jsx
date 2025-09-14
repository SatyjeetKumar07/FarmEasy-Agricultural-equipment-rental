// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingsModule from './pages/BookingsModule';

import Home from './pages/Home';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import About from './pages/About';
import ProductDetailPage from './components/Product/ProductDetailPage';
import ProductRegistrationPage from './pages/ProductRegistrationPage';
import Image from './pages/Image';
import ProductInfoCard from './components/ProductInfoCard/ProductInfoCard';
import BookingClients from "./pages/BookingClients";

// Owner Dashboard related imports
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerMachines from './pages/OwnerMachines';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/products' element={<Products />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path="/products/:machineId" element={<ProductDetailPage />} />
        <Route path='/add_tools' element={<ProductRegistrationPage />} />
        <Route path='/info_card' element={<ProductInfoCard />} />
        <Route path='/trial' element={<Image />} />
        <Route path="/bookings" element={<BookingsModule />} />
        <Route path="/booking-clients" element={<BookingClients />} />
        <Route path="/machines" element={<OwnerMachines />} />
        {/* Owner Dashboard as nested routes */}
        <Route path='/owner-dashboard/*' element={<OwnerDashboard />}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
