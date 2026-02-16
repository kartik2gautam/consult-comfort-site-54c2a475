const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  specialty: String,
  department: String,
  image: String,
  experience: String,
  qualifications: String,
  bio: String,
  specialisms: [String]
});

module.exports = mongoose.model('Doctor', DoctorSchema);
