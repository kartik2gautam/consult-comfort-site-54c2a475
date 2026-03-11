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

    if (count < 3) {
      const hashedPassword = await bcrypt.hash('doctor123', 10);

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
        },
        {
          doctorId: 'DR-ULHAS',
          name: 'Dr. Ulhas',
          specialty: 'Orthopedic Specialist',
          department: 'orthopedics',
          experience: '12+ years',
          qualifications: 'MBBS, MS Orthopedics',
          bio: 'Experienced orthopedic doctor specialising in bone and joint treatments, fracture management, and sports injuries.',
          email: 'dr.ulhas@kanthealth.com',
          password: hashedPassword,
          licenseNumber: 'LIC-KANT-0003',
          phone: '+91-9999990003'
        }
      ];

      await prisma.doctor.createMany({
        data: doctors,
        skipDuplicates: true
      });

      await prisma.doctor.create({
        data: {
          doctorId: "DR-ULHAS",
          name: "Dr. Ulhas",
          specialty: "Orthopedic Specialist",
          department: "orthopedics",
          experience: "12+ years",
          qualifications: "MBBS, MS Orthopedics",
          bio: "Experienced orthopedic specialist focusing on joint replacement and sports injuries.",
          email: "dr.ulhas@kanthealth.com",
          password: await bcrypt.hash("doctor123", 10),
          licenseNumber: "LIC-KANT-0003",
          phone: "+91-9999990003"
        }
      });
      console.log(`✓ Seeded ${doctors.length} doctors`);
      console.log('Test login examples:');
      console.log('dr.bharat@kanthealth.com / doctor123');
      console.log('dr.chandrakant@kanthealth.com / doctor123');
      console.log('dr.ulhas@kanthealth.com / doctor123');
    }

  } catch (err) {
    console.warn('⚠ Seeding failed:', err.message);
  }
}

let dbConnected = false;

async function start() {
  try {
    await prisma.$executeRaw`SELECT 1`;
    dbConnected = true;
    console.log('✓ Connected to PostgreSQL');

    await seedDoctors();
  } catch (err) {
    console.error('⚠ Unable to connect to PostgreSQL:', err.message);
    console.error('⚠ The backend will still start, but API endpoints requiring the database will fail until a valid DATABASE_URL is configured.');
  } finally {
    app.locals.dbConnected = dbConnected;

    app.listen(PORT, () => {
      console.log(`✓ Backend running on http://localhost:${PORT}`);
      if (!dbConnected) {
        console.log('⚠ WARNING: Database connection not available. Configure DATABASE_URL and restart to enable database-backed features.');
      }
    });

  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();