const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  symptoms: { type: String },
  date: { type: String },
  timeSlot: { type: String },
  paymentId: { type: String },
  paymentStatus: { type: String, enum: ['payment_pending','booked','failed'], default: 'payment_pending' },
  status: { type: String, enum: ['booked','completed','cancelled'], default: 'booked' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
