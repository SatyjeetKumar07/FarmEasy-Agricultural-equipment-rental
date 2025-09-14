import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookingsModule() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/booking/all?role=${role}&id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data.bookings || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (bookingId, action) => {
    try {
      await axios.put(
        `${BASE_URL}/api/booking/${bookingId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <p className="text-gray-700 text-xl font-semibold animate-pulse">
          Loading bookings...
        </p>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-extrabold text-emerald-800">📑 Bookings</h2>

        <div className="flex gap-4">
          {role === "owner" && (
            <button
              onClick={() => navigate("/owner-dashboard")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
            >
              Go to Dashboard
            </button>
          )}

          <button
            onClick={() => navigate("/products")}
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-emerald-700 transition duration-200"
          >
            Go to Products
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-10 text-center max-w-xl mx-auto">
          <p className="text-gray-700 text-lg font-medium">No bookings found.</p>
          <p className="text-sm text-gray-500 mt-2">
            Try booking a machine from the products page.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl backdrop-blur-sm bg-white/70">
          <table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden">
            <thead className="bg-emerald-600 text-white uppercase text-sm">
              <tr>
                <th className="p-4 text-left">Machine</th>
                <th className="p-4 text-left">Farmer</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Amount</th>
                {role === "owner" && (
                  <th className="p-4 text-left">Transaction ID</th>
                )}
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr
                  key={b._id}
                  className={`transition hover:bg-emerald-50 ${
                    i % 2 === 0 ? "bg-white/80" : "bg-emerald-50/40"
                  }`}
                >
                  <td className="p-4 font-semibold text-emerald-900">
                    {b.machineId?.name}
                  </td>
                  <td className="p-4">
                    {b.userId?.name} {b.farmerCode && `(${b.farmerCode})`}
                  </td>
                  <td className="p-4">
                    {new Date(b.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {b.startTime} - {b.endTime}
                  </td>
                  <td className="p-4 font-semibold text-emerald-700">
                    ₹{b.amount}
                  </td>

                  {role === "owner" && (
                    <td className="p-4 text-sm text-gray-800">
                      {b.transactionId ? b.transactionId : "Not Paid"}
                    </td>
                  )}

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-semibold shadow-sm ${
                        b.status === "pending"
                          ? "bg-yellow-500"
                          : b.status === "accepted"
                          ? "bg-green-500"
                          : b.status === "cancelled"
                          ? "bg-gray-500"
                          : "bg-red-500"
                      }`}
                    >
                      {b.status === "cancelled"
                        ? role === "farmer"
                          ? "Return Initiated (within 7 days - If payment was made)"
                          : "Booking canceled by farmer"
                        : b.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {role === "owner" && b.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(b._id, "accepted")}
                          className="bg-green-500 text-white px-4 py-1 rounded-md shadow hover:bg-green-600 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(b._id, "rejected")}
                          className="bg-red-500 text-white px-4 py-1 rounded-md shadow hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : null}

                    {role === "farmer" && b.status === "pending" ? (
                      <button
                        onClick={() => handleAction(b._id, "cancelled")}
                        className="bg-orange-500 text-white px-4 py-1 rounded-md shadow hover:bg-orange-600 transition"
                      >
                        Cancel
                      </button>
                    ) : null}

                    {role === "farmer" && b.status !== "pending" ? (
                      <span className="text-gray-400">-</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingsModule;
