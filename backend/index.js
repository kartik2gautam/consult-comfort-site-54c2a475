require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({ 
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:8080'
  ], 
  credentials: true 
}));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/second-opinion', require('./routes/secondOpinion'));
app.use('/api/consultation', require('./routes/consultation'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/document-upload', require('./routes/documentUpload'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/prescription', require('./routes/prescription'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function seedDoctors() {
  try {
    const count = await prisma.doctor.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      // Seed with the same core doctors that are shown on the marketing site
      // (see src/data/clinic-data.ts) so the experience is consistent everywhere.
      const doctors = [
        {
          doctorId: 'DR-BHARAT',
          name: 'Dr. Bharat',
          specialty: 'Non Interventional Cardiologist',
          department: 'cardiology',
          experience: '15+ years',
          qualifications: 'MBBS, DM Cardiology, FACC',
          bio: 'Experienced non-interventional cardiologist specialising in cardiac diagnostics, heart failure management, and preventive cardiology.',
          email: 'dr.bharat@kanthealth.com',
          password: hashedPassword,
          licenseNumber: 'LIC-KANT-0001',
          phone: '+91-9999990001'
        },
        {
          doctorId: 'DR-CHANDRAKANT',
          name: 'Dr. Chandrakant',
          specialty: 'Surgeon',
          department: 'surgery',
          experience: '20+ years',
          qualifications: 'MBBS, MS General Surgery, FICS',
          bio: 'Highly skilled surgeon with extensive expertise in general and specialised surgical procedures, focused on optimal patient outcomes.',
          email: 'dr.chandrakant@kanthealth.com',
          password: hashedPassword,
          licenseNumber: 'LIC-KANT-0002',
          phone: '+91-9999990002'
        }
      ];
      await prisma.doctor.createMany({ data: doctors });
      console.log(`✓ Seeded ${doctors.length} doctors`);
      console.log('  Test login (example): dr.bharat@kanthealth.com / doctor123');
    }
  } catch (err) {
    console.warn('⚠ Seeding failed:', err.message);
  }
}

async function start() {
  try {
    await prisma.$executeRaw`SELECT 1`;
    console.log('✓ Connected to PostgreSQL');
    await seedDoctors();
    app.listen(PORT, () => {
      console.log(`✓ Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Startup failed:', err.message);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();

