const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRY = '24h';

// Middleware to verify doctor JWT
const doctorAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.doctorId = decoded.doctorId;
    req.doctor = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// POST /api/doctor/register - Register a new doctor (admin only)
router.post(
  '/register',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('specialty').notEmpty().trim(),
    body('licenseNumber').notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, specialty, department, licenseNumber, phone } = req.body;

      // Check if doctor already exists
      const existing = await prisma.doctor.findFirst({
        where: { OR: [{ email }, { licenseNumber }] }
      });

      if (existing) {
        return res.status(400).json({ message: 'Email or license number already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create doctor
      const doctor = await prisma.doctor.create({
        data: {
          doctorId: `DR-${Date.now().toString(36).toUpperCase()}`,
          name,
          email,
          password: hashedPassword,
          specialty,
          department,
          licenseNumber,
          phone
        }
      });

      res.status(201).json({
        success: true,
        message: 'Doctor registered successfully',
        doctorId: doctor.doctorId
      });
    } catch (err) {
      console.error('Doctor registration error:', err);
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  }
);

// POST /api/doctor/login - Doctor login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find doctor by email
      const doctor = await prisma.doctor.findUnique({
        where: { email }
      });

      if (!doctor) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          doctorId: doctor.doctorId,
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          specialty: doctor.specialty
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      res.json({
        success: true,
        token,
        doctor: {
          doctorId: doctor.doctorId,
          name: doctor.name,
          email: doctor.email,
          specialty: doctor.specialty,
          image: doctor.image
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  }
);

// GET /api/doctor/profile - Get current doctor profile
router.get('/profile', doctorAuthMiddleware, async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { doctorId: req.doctorId },
      select: {
        doctorId: true,
        name: true,
        email: true,
        specialty: true,
        department: true,
        experience: true,
        image: true,
        phone: true,
        bio: true
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// GET /api/doctor/consultations - Get all consultations for this doctor
router.get('/consultations', doctorAuthMiddleware, async (req, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      where: { doctorId: req.doctorId },
      include: { doctor: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(consultations);
  } catch (err) {
    console.error('Consultations fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch consultations', error: err.message });
  }
});

// GET /api/doctor/consultations/stats - Get consultation statistics
router.get('/consultations/stats', doctorAuthMiddleware, async (req, res) => {
  try {
    const total = await prisma.consultation.count({
      where: { doctorId: req.doctorId }
    });

    const completed = await prisma.consultation.count({
      where: { doctorId: req.doctorId, status: 'completed' }
    });

    const pending = await prisma.consultation.count({
      where: { doctorId: req.doctorId, status: 'pending' }
    });

    const booked = await prisma.consultation.count({
      where: { doctorId: req.doctorId, status: 'booked' }
    });

    const paid = await prisma.consultation.count({
      where: { doctorId: req.doctorId, paymentStatus: 'paid' }
    });

    res.json({ total, completed, pending, booked, paid });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// POST /api/doctor/consultations/:id/status - Update consultation status
router.post(
  '/consultations/:id/status',
  doctorAuthMiddleware,
  [body('status').isIn(['pending', 'booked', 'completed', 'cancelled'])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Verify consultation belongs to this doctor
      const consultation = await prisma.consultation.findUnique({
        where: { id }
      });

      if (!consultation || consultation.doctorId !== req.doctorId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const updated = await prisma.consultation.update({
        where: { id },
        data: { status }
      });

      res.json({ success: true, consultation: updated });
    } catch (err) {
      console.error('Status update error:', err);
      res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
  }
);

// GET /api/doctor/schedule - Get doctor's availability schedule
router.get('/schedule', doctorAuthMiddleware, async (req, res) => {
  try {
    const { date } = req.query;

    let query = { doctorId: req.doctorId };
    if (date) {
      query.date = date;
    }

    const slots = await prisma.timeSlot.findMany({
      where: query,
      orderBy: { time: 'asc' }
    });

    res.json(slots);
  } catch (err) {
    console.error('Schedule fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch schedule', error: err.message });
  }
});

// POST /api/doctor/schedule - Create or update schedule
router.post(
  '/schedule',
  doctorAuthMiddleware,
  [
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/),
    body('times').isArray()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, times } = req.body;

      // Delete existing slots for this date
      await prisma.timeSlot.deleteMany({
        where: { doctorId: req.doctorId, date }
      });

      // Create new slots
      const slots = await prisma.timeSlot.createMany({
        data: times.map(time => ({
          doctorId: req.doctorId,
          date,
          time,
          isBooked: false
        }))
      });

      res.json({
        success: true,
        message: 'Schedule updated',
        slotsCreated: slots.count
      });
    } catch (err) {
      console.error('Schedule update error:', err);
      res.status(500).json({ message: 'Failed to update schedule', error: err.message });
    }
  }
);

module.exports = router;
