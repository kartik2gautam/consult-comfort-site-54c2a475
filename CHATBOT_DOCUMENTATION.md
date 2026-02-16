# Marketing Chatbot - Complete Documentation

## 📋 Overview

A free marketing chatbot for KANT Healthcare website built with:
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Frontend:** React + TypeScript
- **AI:** Pure keyword-based intent detection (No API calls)

---

## 🎯 Features

✅ **Keyword-Based Intent Detection**
- Automatically detects user intent from messages
- 9 intent categories: Services, Booking, Doctors, Pricing, Location, Contact, Emergency, Greeting, Thank You

✅ **Smart Responses**
- Context-aware responses with relevant information
- Interactive buttons for quick actions
- Suggested follow-up questions

✅ **Lead Capture**
- Automatically stores user name and phone
- Tracks chatbot sessions
- Stores intent and message history

✅ **No API Dependencies**
- Pure backend logic
- No OpenAI, Gemini, or other AI services
- Lightweight and scalable
- No API costs

✅ **Mobile Responsive**
- Fixed chatbot widget on bottom-right
- Mobile-friendly UI
- Smooth animations

---

## 📁 File Structure

```
backend/
├── routes/
│   └── chatbot.js              # Chatbot API endpoint
├── services/
│   └── chatbotService.js       # Intent detection & response generation
├── prisma/
│   └── schema.prisma           # Lead model definition
├── migrations/
│   └── 20260216082457_add_lead_model/  # Database migration
└── index.js                    # Router registration

frontend/
├── src/components/
│   ├── MarketingChatbot.tsx    # Chatbot UI component
│   └── layout/
│       └── Layout.tsx          # Chatbot integrated in layout
```

---

## 🚀 API Endpoint

### POST `/api/chatbot/chat`

**Request:**
```json
{
  "message": "What services do you offer?",
  "sessionId": "optional-session-id",
  "name": "optional-name",
  "phone": "optional-phone"
}
```

**Response:**
```json
{
  "success": true,
  "intent": "SERVICES",
  "message": "We offer a wide range of healthcare services...",
  "buttons": [
    { "text": "Book Consultation", "action": "BOOKING" }
  ],
  "suggestions": ["Tell me about consultation", "How much does it cost?"],
  "leadId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-02-16T08:30:00Z"
}
```

---

## 🧠 Intent Detection Logic

### Supported Intents:

| Intent | Keywords | Response |
|--------|----------|----------|
| **SERVICES** | services, what do you offer, treatments, care | List of all healthcare services |
| **BOOKING** | book, appointment, consultation, schedule | Booking instructions with links |
| **DOCTORS** | doctor, specialist, cardiologist, team | List of doctors with details |
| **PRICING** | price, cost, fee, charges | Pricing table for all services |
| **LOCATION** | location, address, where, clinic | Clinic location and hours |
| **CONTACT** | contact, phone, email, reach | Contact information |
| **EMERGENCY** | emergency, urgent, critical, SOS | Emergency instructions |
| **GREETING** | hello, hi, welcome, namaste | Welcome message |
| **THANK_YOU** | thank, thanks, grateful | Appreciation response |
| **UNKNOWN** | *no matches* | Ask for clarification |

**Priority System:**
- Higher priority intents detected first
- Prevents ambiguous matches
- Example: "Book a doctor appointment" matches BOOKING (priority 1) before DOCTORS (priority 1)

---

## 💾 Database Schema

### Lead Model

```prisma
model Lead {
  id        String   @id @default(uuid())
  name      String
  phone     String
  email     String?
  message   String?
  intent    String?
  sessionId String?
  source    String   @default("chatbot")
  contacted Boolean  @default(false)
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([phone])
  @@index([source])
  @@index([contacted])
  @@index([createdAt])
}
```

### Lead Retrieval Endpoint

```
GET /api/chatbot/leads
```

Returns all leads from chatbot (optional, for admin use)

---

## 🎨 Frontend Implementation

### Component Props

The `MarketingChatbot` component requires:
- Built-in state management (no props needed)
- Integrated into Layout component
- Fixed position on page
- Accessible on all routes

### Usage

Simply add to Layout.tsx:
```tsx
import MarketingChatbot from "../MarketingChatbot";

// In Layout component:
<MarketingChatbot />
```

### Features:

- **Chat Toggle:** Click floating button to open/close
- **Auto-scroll:** Messages scroll to bottom automatically
- **Typing Indicator:** Shows bot is thinking
- **Interactive Buttons:** Quick-action buttons in responses
- **Suggestions:** Clickable suggestion chips
- **Lead Form:** Optional name/phone capture
- **Mobile Responsive:** Works on all screen sizes

---

## 🔧 Customization Guide

### 1. Add New Intent

Edit `backend/services/chatbotService.js`:

```javascript
const INTENT_KEYWORDS = {
  YOUR_INTENT: {
    keywords: ['keyword1', 'keyword2', 'phrase'],
    priority: 1
  }
};

// Add response
const responses = {
  YOUR_INTENT: {
    message: "Your response here",
    buttons: [
      { text: "Button Text", action: "ACTION_NAME" }
    ],
    suggestions: ["Suggestion 1", "Suggestion 2"]
  }
};
```

### 2. Change Response Messages

Edit `backend/services/chatbotService.js` → `responses` object

### 3. Add Custom Buttons

Each response can include buttons:
```javascript
buttons: [
  { text: "Book Now", action: "NAVIGATE_CONSULTATION" },
  { text: "Learn More", action: "SERVICES" }
]
```

### 4. Customize Styling

Edit `src/components/MarketingChatbot.tsx`:
- Change colors (bg-gold, primary, etc.)
- Adjust window size (w-96, max-h-[600px])
- Modify animations (duration, effects)

---

## 📊 Lead Management

### Accessing Leads

**Via API:**
```bash
curl http://localhost:5000/api/chatbot/leads
```

**Via Prisma Studio:**
```bash
cd backend
npx prisma studio
```

### Lead Fields:

- **name** - Customer name
- **phone** - Phone number (indexed for quick lookup)
- **email** - Optional email
- **message** - Last message sent
- **intent** - Detected intent
- **sessionId** - Chat session ID
- **source** - Always "chatbot"
- **contacted** - Boolean flag (set to true when team contacts customer)
- **notes** - Admin notes (add via studio)
- **createdAt** - Timestamp of lead creation

### SQL Queries:

```sql
-- Get all uncontacted leads
SELECT * FROM "Lead" WHERE contacted = false ORDER BY "createdAt" DESC;

-- Get leads from specific intent
SELECT * FROM "Lead" WHERE intent = 'BOOKING' ORDER BY "createdAt" DESC;

-- Get leads from last 7 days
SELECT * FROM "Lead" WHERE "createdAt" > NOW() - INTERVAL '7 days' ORDER BY "createdAt" DESC;

-- Count leads by intent
SELECT intent, COUNT(*) as count FROM "Lead" GROUP BY intent;
```

---

## 🚀 Deployment Steps

### 1. Database
```bash
cd backend
npx prisma migrate deploy
```

### 2. Backend
```bash
npm install
npm run dev
# or
npm start
```

### 3. Frontend
```bash
npm install
npm run build
npm run preview
```

### 4. Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@host:5432/db
FRONTEND_URL=http://yourdomain.com
PORT=5000
```

**Frontend (.env):**
```
VITE_BACKEND_URL=http://yourdomain.com/api
```

---

## 📈 Analytics & Monitoring

### Key Metrics:

```sql
-- Total conversations
SELECT COUNT(DISTINCT sessionId) as total_conversations FROM "Lead";

-- Conversion rate (leads with phone)
SELECT COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as conversion_rate FROM "Lead";

-- Top intents
SELECT intent, COUNT(*) as count FROM "Lead" GROUP BY intent ORDER BY count DESC;

-- Response time (if tracking)
SELECT AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt"))) as avg_response_time FROM "Lead";
```

---

## 🐛 Troubleshooting

### Chatbot not appearing
- Check if `MarketingChatbot` is imported in Layout
- Verify z-index CSS (should be z-40)
- Check browser console for errors

### Messages not sending
- Verify backend is running on correct port
- Check CORS settings in `backend/index.js`
- Verify `VITE_BACKEND_URL` in frontend .env

### Leads not saving
- Check database connection
- Verify Prisma migration ran successfully: `npx prisma migrate status`
- Check Lead table exists: `npx prisma studio`

### Wrong responses
- Check intent keywords in `chatbotService.js`
- Verify message content in responses object
- Test with exact keywords

---

## 🔐 Security Considerations

1. **Input Validation:** Messages validated (non-empty, string type)
2. **Database:** Indexes on frequently queried fields (phone, source, createdAt)
3. **Rate Limiting:** Consider adding rate limiting for production
4. **CORS:** Configured for allowed origins only
5. **Phone Storage:** Consider encrypting phone numbers for GDPR compliance

---

## 📝 Future Enhancements

- [ ] Sentiment analysis (happy/angry/confused)
- [ ] Intent confidence scoring
- [ ] Context-aware responses (remember previous messages)
- [ ] Multi-language support
- [ ] WhatsApp integration
- [ ] Email notification to sales team
- [ ] AI enhancement (optional OpenAI integration)
- [ ] Conversation analytics dashboard
- [ ] A/B testing responses
- [ ] Transfer to human agent

---

## 💡 Example Conversations

### Example 1: Service Inquiry
```
User: What services do you offer?
Bot: [Shows full services list with buttons]
User: How do I book consultation?
Bot: [Shows booking instructions with links]
```

### Example 2: Lead Capture
```
User: I'm interested in a consultation
Bot: [Shows booking details]
User: Hi, my name is John and my phone is +91-9876543210
Bot: [Saves as lead]
```

### Example 3: Emergency
```
User: This is emergency
Bot: [Shows emergency instructions with immediate action]
```

---

## 📞 Support

For issues or questions:
1. Check backend logs: `npm run dev`
2. Check browser console: F12 → Console
3. View database: `npx prisma studio`
4. Check API response: Use Postman/Thunder Client

---

**Last Updated:** February 16, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
