import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Login() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' }); // message reset on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, formData);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user._id);

      setMessage({ type: 'success', text: 'Login successful ✅ Redirecting...' });

      setTimeout(() => {
        if (user.role === 'owner') {
          navigate('/owner-dashboard');
        } else {
          navigate('/products');
        }
      }, 1500);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setMessage({ 
        type: 'error', 
        text: 'Invalid mobile or password ❌ — Please register if you are a new user.'
      });
    }
  };

  return (
    <div className='w-full h-screen bg-[#f7f7f8]' style={{ fontFamily: "'Exo 2', sans-serif" }}>
      <Navbar />

      <div className='flex justify-around mt-[64px] p-10 '>
        {/* Login form */}
        <div className='w-1/4 flex-col p-4 pt-32 rounded-lg'>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label htmlFor="mobile" className="text-md mb-[-10px] "></label>
            <TextField 
              id="mobile" 
              name='mobile' 
              label="Mobile" 
              variant="standard" 
              value={formData.mobile} 
              onChange={handleChange} 
            />
            <label htmlFor="password" className="text-md mb-[-10px] "></label>
            <TextField 
              id="password" 
              name="password" 
              label="Password" 
              type="password" 
              autoComplete="current-password" 
              variant='standard' 
              value={formData.password} 
              onChange={handleChange} 
            />

            {/* Message box */}
            {message.text && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {message.text}
              </p>
            )}

            <button 
              type="submit" 
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Submit
            </button>

            {/* Registration suggestion */}
            <p className="text-sm mt-2 text-gray-600">
              New user?{' '}
              <Link to="/register" className="text-green-600 underline">
                Register here
              </Link>
            </p>
          </form>
        </div>

        {/* Right side image */}
        <div className='w-1/3 flex-col p-4 rounded-lg '>
          <img src="../src/assets/hero.png" alt="Big Image" className="w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default Login;
