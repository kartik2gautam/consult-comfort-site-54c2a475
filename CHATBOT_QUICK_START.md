# Chatbot Quick Start Guide

## ✅ What Was Created

Your healthcare marketing chatbot is now fully built and integrated!

### Backend Components:
1. **chatbot.js** - API endpoint for chat messages
2. **chatbotService.js** - Intent detection & response engine
3. **Lead model** - Database for capturing customer info
4. **Migration** - Database table created

### Frontend Components:
1. **MarketingChatbot.tsx** - React chatbot widget
2. **Integrated in Layout** - Shows on all pages

---

## 🚀 Running the Chatbot

### Step 1: Start Backend
```powershell
cd backend
npm run dev
```
✅ You should see:
```
✓ Connected to PostgreSQL
✓ Backend running on http://localhost:5000
```

### Step 2: Start Frontend
```powershell
# In another terminal
npm run dev
```
✅ Frontend will run on http://localhost:8080

### Step 3: Test the Chatbot
1. Open http://localhost:8080 in browser
2. Look for 💬 blue button in bottom-right corner
3. Click to open chatbot
4. Type a message like:
   - "What services do you offer?"
   - "How do I book a consultation?"
   - "Who are your doctors?"

---

## 💬 How the Chatbot Works

### Intent Detection (No AI API Needed!)

The chatbot detects user intent based on keywords:

| What You Say | Intent Detected | Bot Responds With |
|---|---|---|
| "What services do you offer?" | SERVICES | Full services list |
| "Book appointment" | BOOKING | Booking instructions |
| "Who are your doctors?" | DOCTORS | Doctor list |
| "How much does it cost?" | PRICING | Pricing table |
| "Where are you located?" | LOCATION | Address & hours |
| "Contact info?" | CONTACT | Phone & email |
| "This is an emergency" | EMERGENCY | Emergency instructions |
| "Hi there!" | GREETING | Welcome message |
| "Thank you" | THANK_YOU | Appreciation response |

---

## 📊 Capturing Leads

When users share their **name** and **phone**, they're automatically saved!

### Example:
```
User: Hi, my name is John and my phone is +91-9876543210
Bot: Saves to database automatically
```

### View Captured Leads:

**Method 1: Prisma Studio (Visual)**
```powershell
cd backend
npx prisma studio
```
Then open http://localhost:5555 in browser

**Method 2: API Request**
```
GET http://localhost:5000/api/chatbot/leads
```

**Method 3: SQL (PostgreSQL)**
```sql
SELECT * FROM "Lead" ORDER BY "createdAt" DESC LIMIT 10;
```

---

## 🎨 Customizing the Chatbot

### Change Bot's Name
Edit `src/components/MarketingChatbot.tsx`:
```tsx
<h3 className="font-semibold">KANT Healthcare</h3>
```
Change to your clinic name

### Change Colors
In `MarketingChatbot.tsx`:
- `bg-gold` → Change to any color
- `from-primary` → Change header color
- `bg-gray-100` → Change bot message background

### Add New Intent or Responses
Edit `backend/services/chatbotService.js`:

```javascript
const INTENT_KEYWORDS = {
  APPOINTMENT_RESCHEDULE: {
    keywords: ['reschedule', 'change appointment', 'move appointment'],
    priority: 1
  }
};

// Add response
const responses = {
  APPOINTMENT_RESCHEDULE: {
    message: "To reschedule your appointment, please...",
    buttons: [...],
    suggestions: [...]
  }
};
```

---

## 📱 Mobile Testing

The chatbot is fully responsive:

1. Open http://localhost:8080 on mobile
2. The 💬 button appears in bottom-right
3. Click to open full-screen chatbot on mobile
4. All interactions work perfectly

---

## 🔧 Troubleshooting

### Issue: Chatbot not appearing
**Solution:**
1. Check if you're on a page that uses `Layout` component
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh page (Ctrl+R)

### Issue: "Failed to load doctors" error
**Solution:**
1. Check backend is running: `npm run dev` in backend folder
2. Check CORS settings in `backend/index.js`
3. Verify `VITE_BACKEND_URL` in frontend

### Issue: Leads not saving
**Solution:**
1. Check database connection: `cd backend && npx prisma studio`
2. Verify Lead table exists in database
3. Check backend console for errors

---

## 📊 Viewing Analytics

### Basic Queries:

**Total conversations:**
```sql
SELECT COUNT(DISTINCT sessionId) as total FROM "Lead";
```

**Conversations by intent:**
```sql
SELECT intent, COUNT(*) as count FROM "Lead" GROUP BY intent;
```

**Today's leads:**
```sql
SELECT * FROM "Lead" WHERE "createdAt" > CURRENT_DATE;
```

---

## 🎯 Key Features Summary

✅ **9 Intent Categories**
- Services, Booking, Doctors, Pricing, Location, Contact, Emergency, Greeting, Thank You

✅ **Smart Responses**
- Interactive buttons for quick actions
- Suggested follow-up questions
- Contextual information

✅ **Lead Capture**
- Automatically saves name & phone
- Tracks session ID and intent
- No manual data entry needed

✅ **No API Costs**
- Pure keyword-based detection
- No OpenAI, Gemini, or other AI services
- Lightweight and fast

✅ **Mobile Responsive**
- Works on all devices
- Touch-friendly interface
- Smooth animations

✅ **Production Ready**
- Clean, scalable code
- Error handling
- Database optimized with indexes

---

## 🚀 Next Steps

1. **Customize responses** for your clinic
2. **Add your actual services** and pricing
3. **Update doctor list** with real doctors
4. **Test with different messages** to improve intent detection
5. **Monitor leads** daily and follow up
6. **Add more intents** for your specific use cases

---

## 📞 Example Questions to Test

Try these in the chatbot:

1. "What services do you offer?"
2. "How do I book a consultation?"
3. "Who are your doctors?"
4. "What is the price for a video call?"
5. "Where is your clinic located?"
6. "How can I contact you?"
7. "I have an emergency"
8. "Hello!"
9. "Thank you for the information"
10. "Tell me about cardiology"

---

## ✨ You're All Set!

Your marketing chatbot is ready to:
- Answer customer questions 24/7
- Capture leads automatically
- Provide instant responses
- Reduce support workload
- Increase conversions

**Start using it now!** 🎉
