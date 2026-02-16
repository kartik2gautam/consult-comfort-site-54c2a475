const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const sendWhatsApp = require('../services/twilio');

const prisma = new PrismaClient();

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and images allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// POST /api/second-opinion
router.post('/',
  upload.array('documents', 10),
  body('name').notEmpty().withMessage('Name required'),
  body('phone').notEmpty().isMobilePhone().withMessage('Valid phone required'),
  body('remarks').notEmpty().withMessage('Remarks required'),
  body('age').optional().isInt({ min: 1, max: 120 }),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('preferredContact').optional().isIn(['WhatsApp', 'Call', 'Email']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, phone, email, age, gender, remarks, preferredContact } = req.body;
      const files = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);

      if (!files.length) {
        return res.status(400).json({ message: 'At least one document required' });
      }

      const doc = await prisma.secondOpinion.create({
        data: {
          name,
          phone,
          email,
          age: age ? parseInt(age) : null,
          gender,
          remarks,
          preferredContact,
          documents: files,
          paymentStatus: 'pending',
          amount: 800 // second opinion amount
        }
      });

      // Send WhatsApp confirmation (async)
      try {
        await sendWhatsApp({
          to: phone,
          body: `Hi ${name}, your second opinion request has been submitted. Reference: ${doc.id}. Please proceed with payment to activate your request.`
        });
      } catch (twErr) {
        console.warn('WhatsApp send failed:', twErr.message);
      }

      res.json({ success: true, id: doc.id });
    } catch (err) {
      console.error('Second opinion error:', err);
      res.status(500).json({ message: 'Failed to submit request' });
    }
  }
);

module.exports = router;

