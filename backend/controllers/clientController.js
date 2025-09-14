const Client = require('../models/clientModel');
const Booking = require('../models/booking');
const User = require('../models/user'); // 👈 to get farmer userCode

// 📍 Create Client
const createClient = async (req, res) => {
  try {
    const { bookingId, name, mobile, address, farmer } = req.body;

    console.log("📩 Received client data:", req.body);

    // find farmer to get farmerCode
    const farmerUser = await User.findById(farmer);
    if (!farmerUser) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const client = await Client.create({
      bookingId,
      name,
      mobile,
      address,
      farmer,
      farmerCode: farmerUser.farmerCode // ✅ correct field used
    });

    res.status(201).json(client);
  } catch (err) {
    console.error("❌ Client create error:", err);
    res.status(500).json({ message: "Failed to save client details" });
  }
};

// 📍 Get Clients by Owner
const getClientsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const bookings = await Booking.find().populate('machineId');
    const ownerBookings = bookings.filter(
      b => b.machineId && b.machineId.ownerId.toString() === ownerId
    );
    const bookingIds = ownerBookings.map(b => b._id);

    const clients = await Client.find({ bookingId: { $in: bookingIds } })
      .populate('farmer', 'name')
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (err) {
    console.error("❌ getClientsByOwner error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📍 Get Clients by Farmer
const getClientsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const clients = await Client.find({ farmer: farmerId })
      .populate('farmer', 'name')
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (err) {
    console.error("❌ getClientsByFarmer error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📍 Update Client Status
const updateClientStatus = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status } = req.body;

    const updated = await Client.findByIdAndUpdate(
      clientId,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ updateClientStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createClient,
  getClientsByOwner,
  getClientsByFarmer,
  updateClientStatus
};
