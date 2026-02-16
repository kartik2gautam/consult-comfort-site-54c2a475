/**
 * Chatbot Service - Intent Detection & Response Generation
 * 
 * This service handles:
 * 1. Intent detection using keyword matching
 * 2. Response generation based on intent
 * 3. Contextual suggestions and buttons
 */

// Intent keywords mapping
const INTENT_KEYWORDS = {
  SERVICES: {
    keywords: ['services', 'what do you offer', 'treatments', 'care', 'medical services', 'specialties', 'departments', 'help with'],
    priority: 1
  },
  BOOKING: {
    keywords: ['book', 'appointment', 'consultation', 'schedule', 'reserve', 'when can i', 'how to book', 'visit', 'meet doctor'],
    priority: 1
  },
  DOCTORS: {
    keywords: ['doctor', 'doctors', 'specialist', 'cardiologist', 'physician', 'consultant', 'who are', 'team', 'staff'],
    priority: 1
  },
  PRICING: {
    keywords: ['price', 'cost', 'fee', 'charges', 'how much', 'expensive', 'affordable', 'rates'],
    priority: 2
  },
  LOCATION: {
    keywords: ['location', 'address', 'where', 'visit', 'clinic', 'hospital', 'office'],
    priority: 2
  },
  CONTACT: {
    keywords: ['contact', 'phone', 'email', 'call', 'reach', 'get in touch', 'support'],
    priority: 2
  },
  EMERGENCY: {
    keywords: ['emergency', 'urgent', 'immediate', 'critical', 'urgent care', 'sos'],
    priority: 3
  },
  GREETING: {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'namaste', 'welcome', 'good morning', 'good afternoon'],
    priority: 4
  },
  THANK_YOU: {
    keywords: ['thank', 'thanks', 'thank you', 'appreciate', 'grateful'],
    priority: 4
  },
  UNKNOWN: {
    keywords: [],
    priority: 5
  }
};

/**
 * Detect user intent from message
 * @param {string} message - User message
 * @returns {string} - Detected intent
 */
function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  let detectedIntent = 'UNKNOWN';
  let highestPriority = Infinity;

  // Check each intent's keywords
  for (const [intent, config] of Object.entries(INTENT_KEYWORDS)) {
    if (intent === 'UNKNOWN') continue;

    // Check if any keyword matches
    const matches = config.keywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (matches && config.priority < highestPriority) {
      detectedIntent = intent;
      highestPriority = config.priority;
    }
  }

  return detectedIntent;
}

/**
 * Generate response based on intent
 * @param {string} intent - Detected intent
 * @param {string} message - Original user message
 * @returns {object} - Response object with message, buttons, suggestions
 */
function generateResponse(intent, message) {
  const responses = {
    SERVICES: {
      message: `We offer a wide range of healthcare services including:

🏥 **Our Services:**
• **Consultations** - Video & Voice calls with experienced doctors
• **Second Opinion** - Expert medical review of your documents
• **Document Upload** - Secure storage of medical records

Our specialists cover:
✓ Cardiology
✓ Neurology
✓ Orthopedics
✓ General Medicine
✓ Pediatrics
✓ And more...

Would you like to know more about any specific service?`,
      buttons: [
        { text: 'Book Consultation', action: 'BOOKING' },
        { text: 'View Doctors', action: 'DOCTORS' },
        { text: 'Check Pricing', action: 'PRICING' }
      ],
      suggestions: ['Tell me about consultation', 'How much does it cost?', 'Who are your doctors?']
    },

    BOOKING: {
      message: `Great! You can book an appointment in two ways:

📱 **Option 1: Video/Voice Consultation**
• Direct online consultation with our doctors
• Choose preferred time slot
• Pay securely via Stripe
→ **Click: Consultation**

📄 **Option 2: Second Opinion**
• Upload your medical documents
• Expert review by specialists
• Secure and confidential
→ **Click: Second Opinion**

Both services are available 24/7. Would you like to proceed with booking?`,
      buttons: [
        { text: 'Book Consultation Now', action: 'NAVIGATE_CONSULTATION' },
        { text: 'Request Second Opinion', action: 'NAVIGATE_SECOND_OPINION' },
        { text: 'View Doctors First', action: 'DOCTORS' }
      ],
      suggestions: ['Show me available doctors', 'What time slots are available?', 'How long is consultation?']
    },

    DOCTORS: {
      message: `👨‍⚕️ **Our Expert Doctors:**

**Dr. James Whitmore**
• Consultant Cardiologist
• 25+ years experience
• MBBS, MD, FRCP

**Dr. Priya Sharma**
• Senior Gynecologist
• 20+ years experience
• MBBS, DNB

**Dr. Rajesh Kumar**
• Orthopedic Surgeon
• 18+ years experience
• MBBS, MS

**Dr. Aisha Patel**
• General Practitioner
• 15+ years experience
• MBBS, PGDM

Want to consult with any of them? Click "Book Consultation" to choose your preferred doctor and time slot!`,
      buttons: [
        { text: 'Book with a Doctor', action: 'NAVIGATE_CONSULTATION' },
        { text: 'Learn More About Services', action: 'SERVICES' }
      ],
      suggestions: ['Book consultation', 'What does cardiology cover?', 'Check pricing']
    },

    PRICING: {
      message: `💰 **Our Transparent Pricing:**

**Consultations:**
• 📞 Voice Call: ₹500 (20-30 minutes)
• 📹 Video Call: ₹800 (30 minutes)

**Second Opinion:**
• 📄 Expert Review: ₹800 per request

**Document Upload:**
• 📋 Prescription: ₹100
• 📊 Medical Report: ₹200
• 🧪 Lab Tests: ₹150
• 🖼️ Imaging (CT/X-Ray/MRI): ₹300
• 📋 Discharge Summary: ₹200
• 📝 Other Documents: ₹150

✅ **What's Included:**
• Secure payment via Stripe
• Professional consultation
• Follow-up support
• Digital records access

Ready to book? Our prices are among the most affordable in the market!`,
      buttons: [
        { text: 'Book Now', action: 'NAVIGATE_CONSULTATION' },
        { text: 'Learn About Services', action: 'SERVICES' }
      ],
      suggestions: ['Book consultation', 'What does video call include?', 'Second opinion details']
    },

    LOCATION: {
      message: `📍 **KANT Healthcare Locations:**

**Main Clinic:**
📍 123 Medical Plaza, Healthcare District
🏙️ Your City, State 123456

**Contact:**
📞 +91 98765 43210
📧 contact@kanthealth.com

**Hours:**
🕐 Monday - Friday: 9:00 AM - 6:00 PM
🕐 Saturday: 10:00 AM - 4:00 PM
🕐 Sunday: Closed (Emergency services available)

💡 **Pro Tip:** You can also consult with our doctors online anytime!`,
      buttons: [
        { text: 'Book Online Consultation', action: 'NAVIGATE_CONSULTATION' },
        { text: 'Call Us Now', action: 'CONTACT' }
      ],
      suggestions: ['Get directions', 'Emergency services', 'Online booking']
    },

    CONTACT: {
      message: `📞 **Contact KANT Healthcare:**

**Phone:** +91 98765 43210
📧 **Email:** contact@kanthealth.com
🌐 **Website:** kanthealth.com

**Customer Support:**
💬 WhatsApp: +91 98765 43210
📞 Landline: Available during business hours

**Hours:**
📅 Monday - Friday: 9:00 AM - 6:00 PM IST
📅 Saturday: 10:00 AM - 4:00 PM IST
📅 Sunday: Closed

**For Emergencies:**
Call us immediately or visit nearest hospital. We provide emergency consultation support 24/7.

How can we help you today?`,
      buttons: [
        { text: 'Book Consultation', action: 'NAVIGATE_CONSULTATION' },
        { text: 'Get Second Opinion', action: 'NAVIGATE_SECOND_OPINION' }
      ],
      suggestions: ['Emergency support', 'Business hours', 'Book appointment']
    },

    EMERGENCY: {
      message: `🚨 **EMERGENCY ALERT**

If you're experiencing a medical emergency:

1️⃣ **Call Emergency Services:** 
   📞 Dial 911 (USA) or 108 (India)
   
2️⃣ **Visit Nearest Hospital** immediately

3️⃣ **Our Support:**
   📞 +91 98765 43210 (24/7 available)
   
⚠️ **Note:** Online consultation is NOT suitable for emergencies. Please seek immediate medical attention!

We're here to support you once you're safe. Please let us know your name and contact info, and we'll follow up.`,
      buttons: [
        { text: 'Call Emergency', action: 'EMERGENCY_CALL' }
      ],
      suggestions: ['Emergency contacts', 'After-emergency support']
    },

    GREETING: {
      message: `👋 Hello! Welcome to **KANT Healthcare** - Your trusted online medical consultation platform.

I'm your healthcare assistant. I can help you with:

✅ **Learn about our services** - Consultations, Second Opinion, Document Upload
✅ **Book an appointment** - Video/Voice call with experienced doctors
✅ **Check pricing** - Transparent and affordable rates
✅ **Meet our doctors** - View our specialist team
✅ **Get contact information** - Reach us anytime

What would you like to know?`,
      buttons: [
        { text: 'View Services', action: 'SERVICES' },
        { text: 'Book Consultation', action: 'BOOKING' },
        { text: 'Check Pricing', action: 'PRICING' }
      ],
      suggestions: ['What services?', 'How to book?', 'Who are doctors?']
    },

    THANK_YOU: {
      message: `😊 You're welcome! We're happy to help.

Is there anything else you'd like to know about our services? Feel free to ask about:
• Booking a consultation
• Our doctors and specialties
• Pricing and packages
• Emergency support`,
      buttons: [
        { text: 'Book Now', action: 'NAVIGATE_CONSULTATION' },
        { text: 'View Services', action: 'SERVICES' }
      ],
      suggestions: ['Book consultation', 'See doctors', 'Ask question']
    },

    UNKNOWN: {
      message: `I'm not sure I understand. Could you rephrase that?

I can help you with:
• 📋 **Services** - What we offer
• 📅 **Booking** - Schedule a consultation
• 👨‍⚕️ **Doctors** - Meet our team
• 💰 **Pricing** - View our rates
• 📍 **Location** - Where to find us
• 📞 **Contact** - Get in touch

What can I help you with?`,
      buttons: [
        { text: 'Our Services', action: 'SERVICES' },
        { text: 'Book Consultation', action: 'BOOKING' },
        { text: 'Contact Us', action: 'CONTACT' }
      ],
      suggestions: ['Tell me about services', 'How to book?', 'Contact information']
    }
  };

  return responses[intent] || responses['UNKNOWN'];
}

/**
 * Get all intents (for frontend reference)
 */
function getAllIntents() {
  return Object.keys(INTENT_KEYWORDS).filter(intent => intent !== 'UNKNOWN');
}

module.exports = {
  detectIntent,
  generateResponse,
  getAllIntents,
  INTENT_KEYWORDS
};
