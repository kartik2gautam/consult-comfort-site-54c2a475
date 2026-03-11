const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// POST /api/document-upload
// Simple document upload endpoint used by Board Review flow.
router.post(
  '/',
  upload.array('documents', 10),
  async (req, res) => {
    try {
      const { type, description } = req.body;
      const files = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);

      if (!files.length) {
        return res.status(400).json({ message: 'At least one document required' });
      }

      // For now we don't persist a separate DB record; just return a generated ID
      // that can be used as refId for payments.
      const uploadId = uuidv4();

      res.json({
        success: true,
        id: uploadId,
        type: type || 'document-upload',
        description: description || '',
        files
      });
    } catch (err) {
      console.error('Document upload error:', err);
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);

module.exports = router;



