import React, { useEffect, useState } from "react";
import axios from "axios";

const Tracking = () => {
  const [bookings, setBookings] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/booking/all?role=owner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/booking/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error.response?.data || error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Booking Tracking</h1>
      <div className="grid gap-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <p><strong>Farmer:</strong> {b.farmer?.name}</p>
            <p><strong>Machine:</strong> {b.machine?.name}</p>
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Time:</strong> {b.time}</p>
            <p><strong>Transaction ID:</strong> {b.transactionId || "Not Provided"}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`px-2 py-1 rounded text-white ${
                b.status === "accepted" ? "bg-green-600" :
                b.status === "rejected" ? "bg-red-600" : "bg-yellow-600"
              }`}>
                {b.status}
              </span>
              {b.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(b._id, "accepted")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tracking;
