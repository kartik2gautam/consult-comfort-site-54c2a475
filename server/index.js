require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, 'db.json');

// CORS Configuration - allow your frontend origin
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:8080',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

function generateAppointmentId() {
  const prefix = 'KANT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

async function seedDoctorsIfEmpty() {
  try {
    const count = await prisma.doctor.count();
    if (count === 0) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.doctors) && data.doctors.length) {
          // Insert doctors with doctorId (from db.json "id" field)
          const doctors = data.doctors.map((d) => ({
            doctorId: d.id,
            name: d.name,
            specialty: d.specialty,
            department: d.department,
            image: d.image,
            experience: d.experience,
            qualifications: d.qualifications,
            bio: d.bio || '',
            specialisms: d.specialisms || []
          }));
          await prisma.doctor.createMany({ data: doctors });
          console.log(`✓ Seeded ${doctors.length} doctors from db.json`);
        }
      } catch (err) {
        console.warn('⚠ Seeding doctors failed:', err.message);
      }
    }
  } catch (err) {
    console.warn('⚠ Error checking doctor count:', err.message);
  }
}

// GET /api/doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const docs = await prisma.doctor.findMany();
    res.json(docs);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Failed to get doctors', error: err.message });
  }
});

// GET /api/bookings (admin endpoint)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { doctor: true }
    });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Failed to get bookings', error: err.message });
  }
});

// POST /api/bookings
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      doctorId,
      department,
      date,
      time,
      consultationType,
      patientInfo,
      paymentComplete
    } = req.body;

    if (!doctorId || !patientInfo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const appointmentId = generateAppointmentId();
    const booking = await prisma.booking.create({
      data: {
        appointmentId,
        doctorId,
        department,
        date,
        time,
        consultationType,
        patientFirstName: patientInfo.firstName,
        patientLastName: patientInfo.lastName,
        patientEmail: patientInfo.email,
        patientPhone: patientInfo.phone,
        patientDateOfBirth: patientInfo.dateOfBirth,
        patientGender: patientInfo.gender,
        patientMedicalHistory: patientInfo.medicalHistory,
        patientMedications: patientInfo.currentMedications,
        patientSymptoms: patientInfo.symptoms,
        paymentComplete: paymentComplete || false
      },
      include: { doctor: true }
    });

    res.json({ success: true, appointmentId, booking });
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ message: 'Failed to save booking', error: err.message });
  }
});

// POST /api/forms (generic form endpoint)
app.post('/api/forms', async (req, res) => {
  try {
    const payload = req.body;
    // Store form as booking with isForm flag
    const form = await prisma.booking.create({
      data: {
        appointmentId: generateAppointmentId(),
        doctorId: 'N/A',
        patientFirstName: payload.firstName,
        patientLastName: payload.lastName,
        patientEmail: payload.email,
        patientPhone: payload.phone,
        patientSymptoms: payload.message || JSON.stringify(payload),
        isForm: true
      }
    });
    res.json({ success: true, formId: form.id });
  } catch (err) {
    console.error('Error saving form:', err);
    res.status(500).json({ message: 'Failed to save form', error: err.message });
  }
});

async function start() {
  try {
    // Test database connection
    await prisma.$executeRaw`SELECT 1`;
    console.log('✓ Connected to PostgreSQL');

    // Seed doctors if needed
    await seedDoctorsIfEmpty();

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Booking backend running on http://localhost:${PORT}`);
      console.log(`  Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('✗ Server start failed:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
