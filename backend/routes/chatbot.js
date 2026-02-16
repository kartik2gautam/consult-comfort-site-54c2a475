const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const chatbotService = require('../services/chatbotService');

const prisma = new PrismaClient();

/**
 * POST /api/chatbot/chat
 * Healthcare marketing chatbot endpoint
 * 
 * Request body:
 * {
 *   "message": "What services do you offer?",
 *   "sessionId": "optional-session-id",
 *   "name": "optional-name",
 *   "phone": "optional-phone"
 * }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, name, phone } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty'
      });
    }

    // Detect user intent
    const intent = chatbotService.detectIntent(trimmedMessage);
    
    // Generate response based on intent
    let response = chatbotService.generateResponse(intent, trimmedMessage);

    // Store lead if name and phone are provided
    let leadId = null;
    if (name && phone) {
      try {
        const lead = await prisma.lead.create({
          data: {
            name: name.trim(),
            phone: phone.trim(),
            message: trimmedMessage,
            intent: intent,
            sessionId: sessionId || null,
            source: 'chatbot'
          }
        });
        leadId = lead.id;
      } catch (leadError) {
        console.error('Lead creation error:', leadError);
        // Continue without saving lead if it fails
      }
    }

    // Return response
    return res.status(200).json({
      success: true,
      intent: intent,
      message: response.message,
      buttons: response.buttons || null,
      suggestions: response.suggestions || null,
      leadId: leadId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your message',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/chatbot/leads
 * Get all leads (admin only) - optional endpoint
 */
router.get('/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch leads'
    });
  }
});

module.exports = router;
