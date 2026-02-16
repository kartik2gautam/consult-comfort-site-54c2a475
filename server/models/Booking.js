const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  appointmentId: { type: String, index: true },
  department: String,
  doctorId: String,
  date: String,
  time: String,
  consultationType: String,
  patientInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: String,
    gender: String,
    medicalHistory: String,
    currentMedications: String,
    previousPrescriptions: [String],
    symptoms: String,
  },
  paymentComplete: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
