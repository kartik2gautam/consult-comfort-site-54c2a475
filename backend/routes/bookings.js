const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

function generateAppointmentId() {
  const prefix = 'KANT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const {
      doctorId,
      department,
      date,
      time,
      consultationType,
      patientInfo = {},
      paymentComplete = false
    } = req.body;

    if (!doctorId || !date || !time || !patientInfo || !patientInfo.firstName || !patientInfo.phone) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    const doc = await prisma.doctor.findUnique({ where: { doctorId } });
    if (!doc) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentId = generateAppointmentId();

    const result = await prisma.$transaction(async (tx) => {
      // Mark slot as booked if slot exists
      try {
        await tx.timeSlot.update({
          where: { doctorId_date_time: { doctorId, date, time } },
          data: { isBooked: true }
        });
      } catch (slotErr) {
        // ignore if slot is missing; booking can still proceed
      }

      const consult = await tx.consultation.create({
        data: {
          doctorId,
          patientName: `${patientInfo.firstName}${patientInfo.lastName ? ` ${patientInfo.lastName}` : ''}`,
          phone: patientInfo.phone,
          email: patientInfo.email || null,
          symptoms: patientInfo.symptoms || null,
          date,
          timeSlot: time,
          paymentStatus: paymentComplete ? 'paid' : 'pending',
          status: paymentComplete ? 'booked' : 'pending',
          amount: 500
        }
      });

      return consult;
    });

    res.json({ success: true, appointmentId, consultation: result });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
});

module.exports = router;
