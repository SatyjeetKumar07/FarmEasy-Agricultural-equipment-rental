import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

// 🟢 PaymentForm Component
const PaymentForm = ({ bookingId, amount, onClose }) => {
  const [transactionId, setTransactionId] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/api/booking/payment`,
        { bookingId, transactionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Payment submitted successfully! Waiting for owner verification.');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-center mb-4">Make Payment</h2>
      <p className="text-center text-gray-600 mb-2">Amount: ₹{amount}</p>
      <img src="/qr-code.jpg" alt="QR Code" className="w-40 mx-auto mb-4" />
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Enter Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg font-semibold"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

const ProductCard = ({ machine }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [currentUser, setCurrentUser] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clientModal, setClientModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const [bookingId, setBookingId] = useState(null);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [startMeridiem, setStartMeridiem] = useState('AM');
  const [endTime, setEndTime] = useState('');
  const [endMeridiem, setEndMeridiem] = useState('AM');

  // 🟢 Client Details states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${BASE_URL}/api/user/`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setCurrentUser(res.data.user))
        .catch((err) => console.error('Failed to fetch user', err));
    }
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const convertTo24Hour = (time, meridiem) => {
    if (!time) return '';
    let [hour, minute] = time.split(':').map(Number);
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book');
        return;
      }

      if (!selectedDate || !startTime || !endTime) {
        alert('Please select date, start and end time');
        return;
      }

      const start24 = convertTo24Hour(startTime, startMeridiem);
      const end24 = convertTo24Hour(endTime, endMeridiem);

      const startDateObj = new Date(`${selectedDate}T${start24}`);
      const endDateObj = new Date(`${selectedDate}T${end24}`);

      if (endDateObj <= startDateObj) {
        alert('End time must be after start time');
        return;
      }

      const diffMs = endDateObj - startDateObj;
      const totalHours = diffMs / (1000 * 60 * 60);
      const totalAmount = machine.rentalPrice * totalHours;

      setCalculatedAmount(totalAmount);

      const payload = {
        ownerId: machine.ownerId,
        machineId: machine._id,
        date: selectedDate,
        startTime: start24,
        endTime: end24,
        amount: totalAmount.toFixed(2)
      };

      const res = await axios.post(`${BASE_URL}/api/booking`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newBooking = res.data;
      setBookingId(newBooking._id);

      alert(`Booking created successfully for ₹${totalAmount.toFixed(2)}!`);
      closeModal();
      setClientModal(true);
    } catch (err) {
      console.error('Booking failed', err.response ? err.response.data : err);
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleSubmitClientDetails = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/api/clients`,
        {
          bookingId,
          name: clientName,
          mobile: clientPhone,        // ✅ correct field name
          address: clientAddress,
          farmer: currentUser?._id,    // ✅ correct field name
          farmerCode: currentUser?.userCode
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      alert('Client details saved');
      setClientModal(false);
      setPaymentModal(true);
    } catch (err) {
      console.error('Saving client failed', err);
      alert('Failed to save client details');
    }
  };

  return (
    <div className="w-full h-fit pb-5 bg-white shadow-md hover:shadow-xl hover:scale-[1.02] duration-300 rounded-xl overflow-hidden">
      <Link to={`/products/${machine._id}`}>
        <div className="bg-gray-100 w-full h-[15rem] overflow-hidden">
          {machine.img?.length > 0 && (
            <img
              src={`data:${machine.img[0].contentType};base64,${btoa(
                new Uint8Array(machine.img[0].data.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              )}`}
              className="w-full h-full object-cover hover:scale-110 duration-500"
              alt={machine.img[0].filename}
            />
          )}
        </div>
      </Link>

      <div className="flex flex-col justify-between px-5 pt-4">
        <div>
          <p className="text-xl font-bold mb-1 truncate">{machine.name}</p>
          <p className="text-gray-600 mb-2">Availability: {machine.availability}</p>
          <p className="text-green-600 font-semibold mb-4">₹{machine.rentalPrice} / Hour</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow"
            onClick={openModal}
          >
            Book Now
          </button>
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
            <i className="ri-heart-line text-xl text-gray-600"></i>
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-2xl shadow-xl max-w-md mx-auto mt-24 p-6 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Confirm Booking</h2>
        <p className="text-center text-gray-600 mb-4">Book <b>{machine.name}</b></p>

        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Select Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Start Time</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <select
                  className="border border-gray-300 rounded px-2"
                  value={startMeridiem}
                  onChange={(e) => setStartMeridiem(e.target.value)}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">End Time</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                <select
                  className="border border-gray-300 rounded px-2"
                  value={endMeridiem}
                  onChange={(e) => setEndMeridiem(e.target.value)}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleConfirmBooking}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg"
          >
            Confirm
          </button>
          <button
            onClick={closeModal}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Client Details Modal */}
      <Modal
        isOpen={clientModal}
        onRequestClose={() => setClientModal(false)}
        className="bg-white rounded-2xl shadow-xl max-w-md mx-auto mt-24 p-6 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-center mb-4">Enter Your Details</h2>
        <form onSubmit={handleSubmitClientDetails} className="space-y-3">
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Full Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Phone Number"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
          <textarea
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Address"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg font-semibold"
          >
            Continue to Payment
          </button>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentModal}
        onRequestClose={() => setPaymentModal(false)}
        className="bg-white rounded-2xl shadow-xl max-w-md mx-auto mt-24 p-6 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {bookingId && (
          <PaymentForm
            bookingId={bookingId}
            amount={calculatedAmount.toFixed(2)}
            onClose={() => setPaymentModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductCard;
