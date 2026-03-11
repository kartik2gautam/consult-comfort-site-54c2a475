const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendWhatsApp = require("../services/twilio");

const prisma = new PrismaClient();

/* -------------------- Razorpay Setup -------------------- */

const RAZORPAY_KEY_ID = (process.env.RAZORPAY_KEY_ID || "").replace(/^['"]|['"]$/g, "");
const RAZORPAY_KEY_SECRET = (process.env.RAZORPAY_KEY_SECRET || "").replace(/^['"]|['"]$/g, "");

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error(
    "❌ Razorpay keys missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env"
  );
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/* -------------------- Create Order -------------------- */

router.post(
  "/razorpay/order",
  body("amount").isFloat({ min: 50 }),
  body("type").isIn(["consultation", "second-opinion", "document-upload"]),
  body("refId").notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { amount, type, refId } = req.body;

      const shortRef = refId.replace(/-/g, "").slice(0, 12);
      const receipt = `${type}_${shortRef}`.slice(0, 40);

      const options = {
        amount: Math.round(amount * 100), // convert to paise
        currency: "INR",
        receipt: receipt,
        notes: {
          type,
          refId,
        },
      };

      const order = await razorpay.orders.create(options);

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err) {
      console.error("Razorpay order error:", err);

      res.status(500).json({
        message: "Failed to create payment order",
        error: err.message,
      });
    }
  }
);

/* -------------------- Verify Payment -------------------- */

router.post(
  "/razorpay/verify",
  body("orderId").notEmpty(),
  body("paymentId").notEmpty(),
  body("signature").notEmpty(),
  body("type").isIn(["consultation", "second-opinion", "document-upload"]),
  body("refId").notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { orderId, paymentId, signature, type, refId } = req.body;

      /* ---- Verify Razorpay Signature ---- */

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({
          message: "Invalid payment signature",
        });
      }

      /* -------------------- Handle Payment Types -------------------- */

      if (type === "consultation") {
        await prisma.consultation.update({
          where: { id: refId },
          data: {
            paymentStatus: "paid",
            paymentId: paymentId,
            paymentMethod: "razorpay",
          },
        });

        const consultation = await prisma.consultation.findUnique({
          where: { id: refId },
          include: { doctor: true },
        });

        if (consultation) {
          try {
            await sendWhatsApp({
              to: consultation.phone,
              body: `Hello ${consultation.patientName},

Your consultation booking is confirmed.

Doctor: Dr. ${consultation.doctor.name}
Date: ${consultation.date}
Time: ${consultation.timeSlot}

Thank you for choosing Consult Comfort.

Reference ID: ${consultation.id}`,
            });
          } catch (err) {
            console.log("WhatsApp sending failed:", err.message);
          }
        }
      }

      else if (type === "second-opinion") {
        await prisma.secondOpinion.update({
          where: { id: refId },
          data: {
            paymentStatus: "paid",
            paymentId: paymentId,
            paymentMethod: "razorpay",
          },
        });

        const s = await prisma.secondOpinion.findUnique({
          where: { id: refId },
        });

        if (s) {
          try {
            await sendWhatsApp({
              to: s.phone,
              body: `Your second opinion request has been submitted successfully.

Our doctors will review your reports shortly.

Reference ID: ${s.id}`,
            });
          } catch (err) {
            console.log("WhatsApp sending failed:", err.message);
          }
        }
      }

      else if (type === "document-upload") {
        await prisma.documentUpload.update({
          where: { id: refId },
          data: {
            paymentStatus: "paid",
            paymentId: paymentId,
            paymentMethod: "razorpay",
          },
        });
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
      });

    } catch (err) {
      console.error("Payment verification error:", err);

      res.status(500).json({
        message: "Verification failed",
      });
    }
  }
);

module.exports = router;