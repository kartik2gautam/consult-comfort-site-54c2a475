const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');
const sendWhatsApp = require('../services/twilio');

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe payment intent
router.post('/stripe/create-intent',
  body('amount').isFloat({ min: 100 }),
  body('type').isIn(['consultation', 'second-opinion', 'document-upload']),
  body('refId').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { amount, type, refId } = req.body;
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'inr',
        metadata: { type, refId }
      });
      res.json({ clientSecret: intent.client_secret });
    } catch (err) {
      console.error('Stripe error:', err);
      res.status(500).json({ message: 'Failed to create payment intent' });
    }
  }
);

// Verify Stripe payment
router.post('/stripe/verify',
  body('paymentIntentId').notEmpty(),
  body('type').isIn(['consultation', 'second-opinion', 'document-upload']),
  body('refId').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { paymentIntentId, type, refId } = req.body;
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (intent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not completed' });
      }

      // Update record based on type
      if (type === 'consultation') {
        await prisma.consultation.update({
          where: { id: refId },
          data: { paymentStatus: 'paid', paymentId: paymentIntentId, paymentMethod: 'stripe' }
        });
        const c = await prisma.consultation.findUnique({ where: { id: refId }, include: { doctor: true } });
        try {
          await sendWhatsApp({
            to: c.phone,
            body: `Hi ${c.patientName}, your booking for Dr. ${c.doctor.name} on ${c.date} at ${c.timeSlot} is confirmed. Reference: ${c.id}`
          });
        } catch (e) {}
      } else if (type === 'second-opinion') {
        await prisma.secondOpinion.update({
          where: { id: refId },
          data: { paymentStatus: 'paid', paymentId: paymentIntentId, paymentMethod: 'stripe' }
        });
        const s = await prisma.secondOpinion.findUnique({ where: { id: refId } });
        try {
          await sendWhatsApp({
            to: s.phone,
            body: `Your second opinion request has been successfully submitted. Our doctors will review your reports shortly. Reference: ${s.id}`
          });
        } catch (e) {}
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Stripe verify error:', err);
      res.status(500).json({ message: 'Verification failed' });
    }
  }
);

module.exports = router;
