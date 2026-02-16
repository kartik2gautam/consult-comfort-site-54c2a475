const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/consultation/doctors
router.get('/doctors', async (req, res) => {
  try {
    const docs = await prisma.doctor.findMany();
    res.json(docs);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});

// GET /api/consultation/slots?doctorId=&date=
router.get('/slots', 
  query('doctorId').notEmpty().withMessage('doctorId required'),
  query('date').notEmpty().withMessage('date required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { doctorId, date } = req.query;
      
      // Validate date format YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      // Check doctor exists
      const doc = await prisma.doctor.findUnique({ where: { doctorId } });
      if (!doc) return res.status(404).json({ message: 'Doctor not found' });

      // Get all slots for this doctor/date with booking status
      const slots = await prisma.timeSlot.findMany({
        where: { doctorId, date },
        select: { time: true, isBooked: true }
      });

      // If no slots exist, generate them
      if (slots.length === 0) {
        const defaultSlots = [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
        ];
        const slotsToCreate = defaultSlots.map(time => ({
          doctorId,
          date,
          time,
          isBooked: false
        }));
        await prisma.timeSlot.createMany({ data: slotsToCreate });
        return res.json({ slots: defaultSlots.map(t => ({ time: t, isBooked: false })) });
      }

      res.json({ slots });
    } catch (err) {
      console.error('Error fetching slots:', err);
      res.status(500).json({ message: 'Failed to fetch slots' });
    }
  }
);

// POST /api/consultation/book
router.post('/book',
  body('doctorId').notEmpty().withMessage('doctorId required'),
  body('patientName').notEmpty().withMessage('patientName required'),
  body('phone').notEmpty().withMessage('phone required'),
  body('date').notEmpty().withMessage('date required'),
  body('timeSlot').notEmpty().withMessage('timeSlot required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { doctorId, patientName, phone, email, symptoms, date, timeSlot } = req.body;

      // Check doctor exists
      const doc = await prisma.doctor.findUnique({ where: { doctorId } });
      if (!doc) return res.status(404).json({ message: 'Doctor not found' });

      // Use transaction to prevent race condition
      const result = await prisma.$transaction(async (tx) => {
        // Check and mark slot as booked atomically
        const slot = await tx.timeSlot.findUnique({
          where: { doctorId_date_time: { doctorId, date, time: timeSlot } }
        });

        if (!slot || slot.isBooked) {
          throw new Error('Slot not available');
        }

        // Mark slot as booked
        await tx.timeSlot.update({
          where: { doctorId_date_time: { doctorId, date, time: timeSlot } },
          data: { isBooked: true }
        });

        // Create consultation
        const consult = await tx.consultation.create({
          data: {
            doctorId,
            patientName,
            phone,
            email,
            symptoms,
            date,
            timeSlot,
            paymentStatus: 'pending',
            status: 'pending',
            amount: 500 // default consultation amount
          },
          include: { doctor: true }
        });

        return consult;
      });

      res.json({ success: true, id: result.id, consultation: result });
    } catch (err) {
      console.error('Consultation book error:', err);
      if (err.message === 'Slot not available') {
        return res.status(409).json({ message: 'Slot not available' });
      }
      res.status(500).json({ message: 'Failed to book consultation' });
    }
  }
);

module.exports = router;

