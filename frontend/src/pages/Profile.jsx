import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [username, setUsername] = useState('Username');
  const [avatar, setAvatar] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png'); 
  const [role, setRole] = useState('');
  const [farmerCode, setFarmerCode] = useState('');

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${BASE_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const user = response.data.user;
        setUsername(user.name || 'Username');
        setAvatar(user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
        setRole(user.role || '');
        setFarmerCode(user.farmerCode || '');
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
    }
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/api/client/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatar(res.data.avatar); // Update new image
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    }
  };

  const goToOwnerDashboard = () => navigate('/owner-dashboard');
  const goToTrackStatus = () => navigate('/bookings');
  const goToBookingHistory = () => navigate('/booking-clients');

  return (
    <div className='w-full h-screen mt-[64px] flex flex-col'>
      <Navbar />

      <div className="flex-grow flex flex-col justify-center items-center bg-[#f0f0f0]">

        <div className="relative">
          <img
            src={avatar}
            alt="User Avatar"
            className="rounded-full w-52 h-52 object-cover border border-gray-300"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-gray-800"
          >
            Change
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <h1 className="text-3xl font-bold mt-6">
          {username} {role === 'farmer' && farmerCode ? `(${farmerCode})` : ''}
        </h1>

        <span className="mt-1 text-sm text-gray-600 capitalize">
          {role}
        </span>

        <div className="mt-8 flex gap-4">
          {role === 'owner' && (
            <button
              onClick={goToOwnerDashboard}
              className="bg-[#2a7f62] hover:bg-[#3d9678] text-white font-semibold py-2 px-6 rounded-lg"
            >
              Owner Dashboard
            </button>
          )}

          {role === 'farmer' && (
            <>
              <button
                onClick={goToTrackStatus}
                className="bg-[#2a7f62] hover:bg-[#3d9678] text-white font-semibold py-2 px-6 rounded-lg"
              >
                Track Status
              </button>

              <button
                onClick={goToBookingHistory}
                className="bg-[#2a7f62] hover:bg-[#3d9678] text-white font-semibold py-2 px-6 rounded-lg"
              >
                Booking History
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
