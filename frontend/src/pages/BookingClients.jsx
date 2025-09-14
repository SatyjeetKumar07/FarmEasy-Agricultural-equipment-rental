import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";

function BookingClients() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      let res;
      if (role === "owner") {
        res = await axios.get(`${BASE_URL}/api/clients/owner/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await axios.get(`${BASE_URL}/api/clients/farmer/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setClients(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleApproval = async (clientId, status) => {
    try {
      await axios.put(
        `${BASE_URL}/api/clients/${clientId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchClients();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const goToProfile = () => {
    if (role === "owner") {
      navigate(`/owner-dashboard`);
    } else {
      navigate(`/profile`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-700 text-xl font-semibold animate-pulse">
          Loading clients...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-700">
          {role === "owner" ? "Booking Clients" : "Booking History"}
        </h1>
        <button
          onClick={goToProfile}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium shadow hover:bg-indigo-700 transition"
        >
          Go to Profile
        </button>
      </nav>

      <div className="p-8">
        {clients.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-xl mx-auto">
            <p className="text-gray-600 text-lg font-medium">
              No bookings yet
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100"
              >
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-indigo-800">
                      {c.name}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">📍 {c.address}</p>
                  <p className="text-sm text-gray-700">📞 {c.mobile}</p>
                  <p className="text-sm text-gray-500">
                    Farmer:{" "}
                    <span className="font-medium">{c.farmer?.name}</span> (
                    {c.farmerCode})
                  </p>

                  {role === "owner" ? (
                    <div className="pt-4">
                      {c.status === "pending" ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproval(c._id, "approved")}
                            className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(c._id, "rejected")}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            c.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.status === "approved" ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {c.status === "approved" ? "Approved" : "Rejected"}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pt-4">
                      {c.status === "pending" && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock size={16} /> Awaiting address verification
                        </div>
                      )}
                      {c.status === "approved" && (
                        <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                          <CheckCircle size={16} /> Address verified — machine
                          will be dispatched soon
                        </div>
                      )}
                      {c.status === "rejected" && (
                        <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                          <XCircle size={16} /> Location not available for
                          service
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingClients;
