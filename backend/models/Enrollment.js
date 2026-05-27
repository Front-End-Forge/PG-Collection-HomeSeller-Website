// backend/models/Enrollment.js
const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    phone: { type: String, required: true },
    classType: { type: String, enum: ['Online', 'Offline'], required: true },
    totalFee: { type: Number, default: 3000 }, // Locked at ₹3,000 flat fee
    amountPaid: { type: Number, required: true }, // e.g., ₹500 advance or full ₹3,000
    paymentStatus: { 
        type: String, 
        enum: ['Unpaid', 'Advance_Paid', 'Fully_Paid'], 
        default: 'Unpaid' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
