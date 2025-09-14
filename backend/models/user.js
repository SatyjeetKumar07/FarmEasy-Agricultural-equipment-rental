const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    role: { type: String, enum: ['farmer','owner'], required: true },
    registrationDate: { type: Date, default: Date.now },
    avatar: { type: Buffer, default: null },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: Number },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    isVerified: { type: Boolean, default: false },

    // ✅ New field for farmers
    farmerCode: {
        type: String,
        unique: true,
        sparse: true // only farmers will have this
    }
});

// ✅ Pre-save hook to auto-generate farmerCode
userSchema.pre('save', async function (next) {
    if (this.role === 'farmer' && !this.farmerCode) {
        let codeExists = true;
        let code;

        while (codeExists) {
            code = 'FRM' + Math.floor(10000 + Math.random() * 90000); // FRM12345
            const existing = await mongoose.model('User').findOne({ farmerCode: code });
            if (!existing) codeExists = false;
        }

        this.farmerCode = code;
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
