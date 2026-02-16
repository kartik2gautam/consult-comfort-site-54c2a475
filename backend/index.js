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
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/chatbot', require('./routes/chatbot'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function seedDoctors() {
  try {
    const count = await prisma.doctor.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const doctors = [
        {
          doctorId: '1',
          name: 'Dr. James Whitmore',
          specialty: 'Consultant Cardiologist',
          department: 'cardiology',
          experience: '25+ years',
          qualifications: 'MBBS, MD, FRCP',
          bio: 'Leading cardiologist with extensive interventional experience',
          email: 'james.whitmore@kanthealth.com',
          password: hashedPassword,
          licenseNumber: 'LIC-2024-001',
          phone: '+91-9876543210'
        },
        {
          doctorId: '2',
          name: 'Dr. Priya Sharma',
          specialty: 'Consultant Physician',
          department: 'general-medicine',
          experience: '18+ years',
          qualifications: 'MBBS, MRCP, PhD',
          email: 'priya.sharma@kanthealth.com',
          password: hashedPassword,
          licenseNumber: 'LIC-2024-002',
          phone: '+91-9876543211'
        },
        {
          doctorId: '3',
          name: 'Dr. Michael Okonkwo',
          specialty: 'Consultant Orthopaedic Surgeon',
          department: 'orthopedics',
          experience: '15+ years',
          qualifications: 'MBChB, FRCS (Orth)',
          email: 'michael.okonkwo@kanthealth.com',
          password: hashedPassword,
          licenseNumber: 'LIC-2024-003',
          phone: '+91-9876543212'
        },
        {
          doctorId: '4',
          name: 'Dr. Elizabeth Hayes',
          specialty: 'Consultant Dermatologist',
          department: 'dermatology',
          experience: '12+ years',
          qualifications: 'MBBS, MRCP (Derm)',
          email: 'elizabeth.hayes@kanthealth.com',
          password: hashedPassword,
          licenseNumber: 'LIC-2024-004',
          phone: '+91-9876543213'
        }
      ];
      await prisma.doctor.createMany({ data: doctors });
      console.log('✓ Seeded 4 doctors');
      console.log('  Test login: james.whitmore@kanthealth.com / doctor123');
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

