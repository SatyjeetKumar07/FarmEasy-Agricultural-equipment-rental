import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Login() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, formData);
      console.log(response.data);
      const { message, user, token } = response.data;
      localStorage.setItem('token', token);
      console.log('message', message, 'user', user, 'token', token);
      navigate('/products');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="w-full h-screen bg-[#f7f7f8]" style={{ fontFamily: "'Exo 2', sans-serif" }}>
      {/* Navbar already has Login link */}
      <Navbar />

      {/* form------------------- */}
      <div className="flex justify-around mt-[64px] p-10">
        <div className="w-1/4 flex-col p-4 pt-40 rounded-lg">
          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label htmlFor="mobile" className="text-md mb-[-10px]">Mobile Number:</label>
            <TextField
              id="mobile"
              name="mobile"
              label="Mobile"
              variant="standard"
              value={formData.mobile}
              onChange={handleChange}
            />

            <label htmlFor="password" className="text-md mb-[-10px]">Password:</label>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="standard"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </form>

          {/* Switch to Register */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 hover:underline">
              Register now
            </Link>
          </p>
        </div>

        {/* Big Image */}
        <div className="w-1/3 flex-col p-4 rounded-lg ">
          <img
            src="../src/assets/s logo.jpeg"
            alt="Big Image"
            className="rounded-full"
            width={"500px"}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
