# Chatbot - Code Examples & Integration Guide

## 🔧 Backend Integration Examples

### 1. Using the Chatbot API

**cURL:**
```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What services do you offer?",
    "sessionId": "session-123",
    "name": "John Doe",
    "phone": "+91-9876543210"
  }'
```

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/chatbot/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'How do I book a consultation?',
    sessionId: 'session-123'
  })
});

const data = await response.json();
console.log(data.message); // Bot's response
```

**Python/Requests:**
```python
import requests

response = requests.post(
    'http://localhost:5000/api/chatbot/chat',
    json={
        'message': 'Tell me about your doctors',
        'sessionId': 'session-123'
    }
)

print(response.json()['message'])
```

---

## 📱 Frontend Integration Examples

### 1. Adding Chatbot to a New Page

```tsx
import Layout from '@/components/layout/Layout';

export default function MyPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        {/* Your content here */}
      </div>
      {/* Chatbot automatically appears via Layout */}
    </Layout>
  );
}
```

### 2. Standalone Chatbot Integration

If you want to use just the chatbot component:

```tsx
import MarketingChatbot from '@/components/MarketingChatbot';

export default function MyComponent() {
  return (
    <>
      <div>Your content</div>
      <MarketingChatbot />
    </>
  );
}
```

### 3. Custom Button to Open Chatbot

Create a ref to control chatbot:

```tsx
import { useRef } from 'react';
import MarketingChatbot from '@/components/MarketingChatbot';

export default function Page() {
  const chatbotRef = useRef<any>(null);

  return (
    <>
      <button onClick={() => {
        // Add trigger to open chatbot
        chatbotRef.current?.open();
      }}>
        Open Chat
      </button>
      <MarketingChatbot ref={chatbotRef} />
    </>
  );
}
```

---

## 🧠 Adding Custom Intent

### Step 1: Define Intent Keywords

Edit `backend/services/chatbotService.js`:

```javascript
const INTENT_KEYWORDS = {
  // ... existing intents ...
  INSURANCE: {
    keywords: ['insurance', 'coverage', 'policy', 'reimbursement', 'claim'],
    priority: 2
  }
};
```

### Step 2: Add Response

```javascript
const responses = {
  // ... existing responses ...
  INSURANCE: {
    message: `🏥 **Insurance & Coverage:**

We accept most major insurance plans:
✓ HDFC ErgoHealth
✓ Apollo Munich
✓ Bajaj Allianz
✓ ICICI Lombard
✓ National Insurance
✓ And more...

**For coverage details:**
📞 Call: +91 98765 43210
📧 Email: insurance@kanthealth.com

You'll receive:
✅ Invoice with policy number reference
✅ Itemized bill for insurance claim
✅ Direct billing support (for some plans)`,
    buttons: [
      { text: 'Book Consultation', action: 'NAVIGATE_CONSULTATION' },
      { text: 'Contact Insurance Team', action: 'CONTACT' }
    ],
    suggestions: ['Which plans do you accept?', 'Direct billing available?']
  }
};
```

### Step 3: Test

Type in chatbot: "Do you accept insurance?"

---

## 💾 Database Operations

### 1. Get All Leads (JavaScript)

```javascript
// In your API route or service
const leads = await prisma.lead.findMany({
  orderBy: { createdAt: 'desc' },
  take: 100
});

console.log(leads);
```

### 2. Get Uncontacted Leads

```javascript
const uncontacted = await prisma.lead.findMany({
  where: { contacted: false },
  orderBy: { createdAt: 'desc' }
});
```

### 3. Update Lead Status

```javascript
await prisma.lead.update({
  where: { id: 'lead-id' },
  data: { 
    contacted: true,
    notes: 'Called on 2026-02-16, interested in video consultation'
  }
});
```

### 4. Get Leads by Intent

```javascript
const bookingLeads = await prisma.lead.findMany({
  where: { intent: 'BOOKING' },
  orderBy: { createdAt: 'desc' }
});
```

---

## 📊 Creating a Lead Dashboard

### Create a New Admin Route

`backend/routes/admin.js`:

```javascript
// Add to existing admin routes
router.get('/chatbot-leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const stats = {
      total: leads.length,
      uncontacted: leads.filter(l => !l.contacted).length,
      byIntent: {},
      byDate: {}
    };

    // Count by intent
    leads.forEach(lead => {
      stats.byIntent[lead.intent] = (stats.byIntent[lead.intent] || 0) + 1;
    });

    res.json({ success: true, stats, leads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Create Frontend Dashboard Component

`src/pages/admin/LeadsDashboard.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Lead {
  id: string;
  name: string;
  phone: string;
  intent: string;
  message: string;
  contacted: boolean;
  createdAt: string;
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/chatbot-leads');
      const data = await response.json();
      setLeads(data.leads);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Chatbot Leads</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uncontacted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{stats.uncontacted}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {stats.total > 0 
                ? ((stats.uncontacted / stats.total) * 100).toFixed(1) + '%'
                : '0%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Phone</th>
                  <th className="text-left py-2">Intent</th>
                  <th className="text-left py-2">Message</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{lead.name}</td>
                    <td className="py-2">{lead.phone}</td>
                    <td className="py-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {lead.intent}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600 truncate">{lead.message}</td>
                    <td className="py-2">
                      <span className={lead.contacted ? 'text-green-600' : 'text-red-600'}>
                        {lead.contacted ? '✓ Contacted' : '⚠ Pending'}
                      </span>
                    </td>
                    <td className="py-2 text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔌 Webhook Integration

### Send Lead to External Service

Add to `backend/routes/chatbot.js`:

```javascript
// After creating lead
if (leadId) {
  // Send to external CRM/service
  try {
    await fetch('https://your-crm.com/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        phone: phone,
        intent: intent,
        message: trimmedMessage,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Webhook error:', error);
  }
}
```

---

## 📧 Email Notification

### Send Lead Alert to Admin

Add to `backend/services/chatbotService.js`:

```javascript
const nodemailer = require('nodemailer');

async function notifyAdminAboutLead(lead) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'admin@kanthealth.com',
    subject: `New Lead from Chatbot - ${lead.intent}`,
    html: `
      <h2>New Chatbot Lead</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Intent:</strong> ${lead.intent}</p>
      <p><strong>Message:</strong> ${lead.message}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `
  });
}
```

---

## 🧪 Testing Examples

### Unit Test for Intent Detection

```javascript
// test.js
const chatbotService = require('./services/chatbotService');

console.log('Testing Intent Detection:');

const testCases = [
  { message: 'What services do you offer?', expected: 'SERVICES' },
  { message: 'How do I book?', expected: 'BOOKING' },
  { message: 'Who are the doctors?', expected: 'DOCTORS' },
  { message: 'What is the price?', expected: 'PRICING' },
  { message: 'Emergency!', expected: 'EMERGENCY' },
  { message: 'Thanks!', expected: 'THANK_YOU' }
];

testCases.forEach(test => {
  const intent = chatbotService.detectIntent(test.message);
  const pass = intent === test.expected;
  console.log(`${pass ? '✓' : '✗'} "${test.message}" → ${intent} (expected: ${test.expected})`);
});
```

Run:
```bash
node test.js
```

---

## 📱 WhatsApp Integration (Optional)

Add WhatsApp notifications when lead is captured:

```javascript
const twilio = require('twilio');

async function sendWhatsAppNotification(phoneNumber, message) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${phoneNumber}`,
    body: message
  });
}

// In chatbot route after creating lead
await sendWhatsAppNotification(phone, 'Thanks for contacting KANT Healthcare!');
```

---

## 🎯 Performance Optimization

### Add Caching (Redis optional)

```javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedResponse(intent) {
  const cached = await client.get(`response:${intent}`);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database or generate
  const response = generateResponse(intent);
  await client.setex(`response:${intent}`, 3600, JSON.stringify(response));
  return response;
}
```

---

## ✅ Checklist for Production

- [ ] Update responses with real clinic info
- [ ] Test all intents thoroughly
- [ ] Set up lead notifications (email/WhatsApp)
- [ ] Create admin dashboard for leads
- [ ] Add rate limiting to API
- [ ] Set up database backups
- [ ] Configure CORS for production domain
- [ ] Test on mobile devices
- [ ] Monitor API performance
- [ ] Set up error logging (Sentry)

---

**Happy chatting!** 🚀
