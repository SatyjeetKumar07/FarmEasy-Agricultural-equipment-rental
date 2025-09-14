import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OwnerMachines() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const ownerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🛡️ Role check — only owner allowed
  useEffect(() => {
    if (role !== "owner") {
      navigate("/products"); // 👈 redirect to products page
      return;
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/machine/owner/${ownerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMachines(res.data);
      } catch (error) {
        console.error("Error fetching owner machines:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ownerId && token && role === "owner") {
      fetchMachines();
    }
  }, [ownerId, token, role, BASE_URL]);

  const handleDelete = async (machineId) => {
    if (!window.confirm("Are you sure you want to delete this machine?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/machine/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { machineId },
      });
      setMachines((prev) => prev.filter((m) => m._id !== machineId));
      setToast({ type: "success", text: "Machine deleted successfully" });
    } catch (error) {
      console.error("Error deleting machine:", error);
      setToast({ type: "error", text: "Failed to delete machine" });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-200 bg-gradient-to-br from-green-400 to-green-600">
        Loading your machines...
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-200 bg-gradient-to-br from-green-400 to-green-600">
        No machines listed yet
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-100 to-green-300 p-8">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-lg text-white animate-fade-in-down
            ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}
          `}
        >
          {toast.text}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-green-800">
          Your Listed Machines
        </h2>
        <button
          onClick={() => navigate("/owner-dashboard")}
          className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          Go to Dashboard
        </button>
      </div>

      {/* Machines List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {machines.map((machine) => (
          <div
            key={machine._id}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 flex justify-between items-start border border-green-100 hover:shadow-xl transition"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-900">
                {machine.name}
              </h3>
              <p className="text-sm text-gray-500">{machine.company}</p>
              <p className="text-gray-700 text-sm mt-2 mb-3 leading-relaxed">
                {machine.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-green-700 font-bold text-lg">
                  ₹{machine.rentalPrice}/day
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    machine.availability
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {machine.availability ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(machine._id)}
              className="ml-6 px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 hover:shadow-md transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
