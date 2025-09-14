import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [totalMachines, setTotalMachines] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    axios
      .get(`${BASE_URL}/api/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.user.role !== "owner") {
          window.location.href = "/login";
          alert("Access denied. Please login as owner.");
        } else {
          setCurrentUser(res.data.user);

          axios
            .get(`${BASE_URL}/api/owner/stats`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setTotalMachines(res.data.totalMachines))
            .catch((err) => console.error("Failed to fetch stats", err));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        alert("Access denied. Please login as owner.");
        window.location.href = "/login";
      });
  }, []);

  if (!currentUser)
    return <div className="text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 font-sans">
      {/* ---------- Left Sidebar ---------- */}
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-lg flex flex-col p-6 border-r border-green-100">
        <div className="flex flex-col items-center text-center mb-10">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=User"
            alt="profile"
            className="w-20 h-20 rounded-full mb-3 shadow-lg bg-gray-200"
          />
          <h2 className="text-lg font-bold text-gray-800">{currentUser.name}</h2>
          <p className="text-sm text-gray-500">{currentUser.mobile}</p>
        </div>

        <nav className="space-y-3">
          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-green-50 hover:text-green-600 font-medium"
          >
            👤 My Profile
          </button>

          <button
            onClick={() => navigate("/add_tools")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-green-50 hover:text-green-600 font-medium"
          >
            ⚙️ Add Tools
          </button>

          <button
            onClick={() => navigate("/owner/notifications")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-green-50 hover:text-green-600 font-medium"
          >
            🔔 Notifications
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-green-50 hover:text-green-600 font-medium"
          >
            💬 Contact Us
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 font-medium mt-10"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* ---------- Right Main Panel ---------- */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Welcome back, <span className="text-green-700">{currentUser.name}</span> 👋
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="text-sm opacity-90 mb-2">Total Machines</h3>
            <p className="text-4xl font-bold">{totalMachines}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-green-100 transition">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Your Machines
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              View, update and delete your listed machines
            </p>
            <button
              onClick={() => navigate("/machines")}
              className="text-green-600 font-semibold hover:underline"
            >
              Manage →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-green-100 transition">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Booking Requests
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Accept or reject farmer bookings
            </p>
            <button
              onClick={() => navigate("/bookings")}
              className="text-green-600 font-semibold hover:underline"
            >
              View →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-green-100 transition">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              AgriRoute Info
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Track your farm's booking locations
            </p>
            <button
              onClick={() => navigate("/booking-clients")}
              className="text-green-600 font-semibold hover:underline"
            >
              Check →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
