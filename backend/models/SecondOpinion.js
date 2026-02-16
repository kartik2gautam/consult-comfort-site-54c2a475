const mongoose = require('mongoose');

const SecondOpinionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  age: { type: Number },
  gender: { type: String },
  remarks: { type: String, required: true },
  preferredContact: { type: String, enum: ['WhatsApp','Call','Email'], default: 'WhatsApp' },
  documents: [{ type: String }], // URLs
  paymentId: { type: String },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  status: { type: String, enum: ['pending','reviewed','completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SecondOpinion', SecondOpinionSchema);
