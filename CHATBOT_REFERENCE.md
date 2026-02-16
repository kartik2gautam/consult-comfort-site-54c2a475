# 🤖 Chatbot Quick Reference Card

## 🚀 Start Here (60 seconds)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2  
npm run dev

# Open http://localhost:8080
```

Click 💬 button → Done! 🎉

---

## 📂 Key Files

| File | Purpose | Location |
|------|---------|----------|
| **chatbot.js** | Chat API endpoint | backend/routes/ |
| **chatbotService.js** | Intent detection | backend/services/ |
| **MarketingChatbot.tsx** | UI component | src/components/ |
| **schema.prisma** | Database schema | backend/prisma/ |
| **Layout.tsx** | Integrated component | src/components/layout/ |

---

## 💬 Tested Phrases (Try These!)

- "What services do you offer?"
- "How do I book a consultation?"
- "Who are your doctors?"
- "What is the price for video call?"
- "Where is your clinic?"
- "Emergency help"
- "Thanks for the info"
- "How to contact you?"

---

## 🧠 Intent Keywords

| Intent | Say This | Get This |
|--------|----------|----------|
| SERVICES | "services", "what do you offer" | Service list |
| BOOKING | "book", "appointment" | Booking info |
| DOCTORS | "doctors", "specialists" | Doctor list |
| PRICING | "price", "cost" | Price table |
| LOCATION | "location", "where" | Address |
| CONTACT | "contact", "phone" | Contact info |
| EMERGENCY | "emergency" | Emergency help |
| GREETING | "hello", "hi" | Welcome |
| THANK_YOU | "thanks", "thank you" | Thanks message |

---

## 📊 View Leads

### Option 1: Visual Database
```bash
cd backend
npx prisma studio
# Opens http://localhost:5555
```

### Option 2: API Request
```bash
curl http://localhost:5000/api/chatbot/leads
```

### Option 3: SQL Query
```sql
SELECT name, phone, intent, createdAt FROM "Lead" 
ORDER BY createdAt DESC LIMIT 10;
```

---

## 🔧 Customize Response

Edit: `backend/services/chatbotService.js`

```javascript
// Find this section:
const responses = {
  SERVICES: {
    message: "Your custom message here",
    buttons: [...],
    suggestions: [...]
  }
}

// Change and save
// Restart backend: npm run dev
```

---

## ➕ Add New Intent

1. Edit `backend/services/chatbotService.js`
2. Add keywords:
```javascript
INSURANCE: {
  keywords: ['insurance', 'coverage'],
  priority: 2
}
```
3. Add response:
```javascript
INSURANCE: {
  message: "Your insurance message",
  buttons: [...],
  suggestions: [...]
}
```
4. Save & test

---

## 🎨 Change Colors

Edit: `src/components/MarketingChatbot.tsx`

- `bg-gold` → Change button color
- `from-primary` → Change header color
- `text-white` → Change text color

Save → Auto-refresh ✨

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Chatbot not showing | Clear cache (Ctrl+Shift+Delete) |
| Can't send message | Backend running? Check terminal |
| Leads not saving | DB connected? Check Prisma Studio |
| Wrong responses | Keywords match? Edit chatbotService.js |

---

## 📱 Test on Mobile

1. Open http://localhost:8080 on phone
2. Chatbot works fullscreen
3. All features functional
4. Touch-friendly interface

---

## 📈 Track Success

```sql
-- Total conversations
SELECT COUNT(DISTINCT sessionId) FROM "Lead";

-- Most common intent
SELECT intent, COUNT(*) FROM "Lead" GROUP BY intent;

-- Uncontacted leads
SELECT * FROM "Lead" WHERE contacted = false;
```

---

## 🔑 API Endpoint

```
POST http://localhost:5000/api/chatbot/chat

Headers: Content-Type: application/json

Body: {
  "message": "What services?",
  "name": "John",
  "phone": "+91-9876543210"
}
```

---

## 📚 Full Documentation

- **CHATBOT_DOCUMENTATION.md** - Complete guide
- **CHATBOT_QUICK_START.md** - Getting started
- **CHATBOT_CODE_EXAMPLES.md** - Code samples

---

## 🎯 Next Steps

1. ✅ Test chatbot thoroughly
2. ✅ Customize responses for your clinic
3. ✅ Monitor leads daily
4. ✅ Follow up with customers
5. ✅ Analyze intent patterns
6. ✅ Add new intents as needed

---

## 💡 Pro Tips

- Test with real patient questions
- Update responses with your specific info
- Add doctor names and specialties
- Include your actual prices
- Update your clinic location
- Set up lead notifications
- Create admin dashboard for leads

---

## 🎉 You're All Set!

Your marketing chatbot is:
✅ Fully functional
✅ Production ready
✅ Easy to customize
✅ No API costs
✅ Capturing leads

**Start converting visitors to patients!** 🚀

---

**Need Help?**
- Check documentation files
- Use Prisma Studio to debug
- Test API with Postman
- Check browser console (F12)

**Version:** 1.0.0 | **Status:** Ready ✅
