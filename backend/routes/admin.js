const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// POST /api/admin/login
router.post('/login',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }
);

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// GET /api/admin/second-opinions (protected)
router.get('/second-opinions', authMiddleware, async (req, res) => {
  try {
    const items = await prisma.secondOpinion.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch second opinions' });
  }
});

// GET /api/admin/consultations (protected)
router.get('/consultations', authMiddleware, async (req, res) => {
  try {
    const items = await prisma.consultation.findMany({
      include: { doctor: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch consultations' });
  }
});

// POST /api/admin/second-opinions/:id/status (protected)
router.post('/second-opinions/:id/status',
  authMiddleware,
  body('status').isIn(['pending', 'reviewed', 'completed']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { id } = req.params;
      const { status } = req.body;
      const item = await prisma.secondOpinion.update({
        where: { id },
        data: { status }
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update status' });
    }
  }
);

// POST /api/admin/consultations/:id/status (protected)
router.post('/consultations/:id/status',
  authMiddleware,
  body('status').isIn(['pending', 'booked', 'completed', 'cancelled']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { id } = req.params;
      const { status } = req.body;
      const item = await prisma.consultation.update({
        where: { id },
        data: { status }
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update status' });
    }
  }
);

module.exports = router;

