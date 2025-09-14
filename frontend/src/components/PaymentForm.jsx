import React, { useState } from "react";
import axios from "axios";

const PaymentForm = ({ bookingId, ownerId, amount }) => {
  const [transactionId, setTransactionId] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await axios.post(`${BASE_URL}/api/payment`, {
      bookingId,
      ownerId,
      amount,
      transactionId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Payment submitted! Owner will verify.");
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Pay Now</h3>
      <img src="/qr-code.png" alt="QR Code" className="w-40 mb-2" />
      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Enter Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default PaymentForm;
