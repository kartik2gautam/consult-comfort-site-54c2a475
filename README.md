# Consult Comfort - Healthcare Booking Platform

A modern, full-stack healthcare consultation and second opinion platform built with React, TypeScript, Node.js, PostgreSQL, and Stripe payment integration.

## 🚀 Features

- **Doctor Consultations**: Book appointments with experienced doctors (Voice & Video calls)
- **Second Opinion Service**: Submit medical documents for expert review
- **Document Upload**: Securely upload and store medical documents
- **Real-time Slot Management**: Dynamic availability with no double-booking
- **Stripe Payment Integration**: Secure payment processing
- **WhatsApp Notifications**: Automatic confirmation messages via Twilio
- **Admin Dashboard**: Manage consultations and second opinions
- **File Upload Validation**: Secure document submission with type/size checks
- **JWT Authentication**: Protected admin routes with token-based auth

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (fast build tool)
- TailwindCSS (styling)
- shadcn/ui (component library)
- React Router (navigation)

**Backend:**
- Node.js + Express
- PostgreSQL (database)
- Prisma ORM (type-safe queries)
- Stripe (payments)
- JWT (authentication)
- Multer (file uploads)
- Twilio (WhatsApp API)

## 📋 Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL v12+
- npm or bun

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd consult-comfort-site-54c2a475

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup PostgreSQL Database

See detailed instructions in [backend/SETUP.md](backend/SETUP.md)

Quick version:
```bash
# Windows/Mac/Linux - Create database
psql -U postgres

CREATE USER consult_app WITH PASSWORD 'secure_password_123';
CREATE DATABASE consult_comfort OWNER consult_app;
GRANT ALL PRIVILEGES ON DATABASE consult_comfort TO consult_app;
```

### 3. Configure Environment Variables

**Frontend (.env):**
```bash
cp .env.example .env

# Edit .env
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUB_KEY=pk_test_xxxxx  # Get from Stripe dashboard
```

**Backend (backend/.env):**
```bash
cd backend
cp .env.example .env

# Edit .env with:
DATABASE_URL="postgresql://consult_app:secure_password_123@localhost:5432/consult_comfort"
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="xxxxx"
TWILIO_PHONE_NUMBER="+1234567890"
ADMIN_EMAIL="admin@consult-comfort.com"
ADMIN_PASSWORD="admin123"
JWT_SECRET="your-secret-key-here"
FRONTEND_URL="http://localhost:5173"
PORT=5000
```

### 4. Setup & Run Prisma Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations and seed database
npx prisma migrate dev --name init
```

### 5. Start Both Servers

**Terminal 1 - Backend (port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (port 5173):**
```bash
npm run dev
```

### 6. Open in Browser

- **Frontend**: http://localhost:5173
- **Consultation Booking**: http://localhost:5173/consultation
- **Second Opinion**: http://localhost:5173/second-opinion
- **Doctor Portal**: http://localhost:5173/admin/login (Demo: james.whitmore@kanthealth.com / doctor123)
- **Backend Health**: http://localhost:5000/api/health

## 📝 Available Routes

### Frontend Pages
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/doctors` | Browse available doctors |
| `/services` | Healthcare services offered |
| `/about` | About clinic |
| `/contact` | Contact information |
| `/book` | Basic booking (legacy) |
| `/consultation` | Professional consultation booking |
| `/second-opinion` | Get second opinion |
| `/admin/login` | Doctor login portal |
| `/admin/dashboard` | Doctor consultation dashboard |

### Backend API Routes

**Consultations:**
```
GET  /api/consultation/doctors           # List all doctors
GET  /api/consultation/slots            # Get available slots
POST /api/consultation/book             # Book consultation
```

**Second Opinion:**
```
POST /api/second-opinion                # Submit second opinion
```

**Document Upload:**
```
POST /api/document-upload               # Upload medical documents
```

**Payments:**
```
POST /api/payment/stripe/create-intent  # Create Stripe payment
POST /api/payment/stripe/verify         # Verify Stripe payment
```

**Admin (Protected by JWT):**
```
POST /api/admin/login                          # Get JWT token
GET  /api/admin/consultations                  # List all consultations
GET  /api/admin/second-opinions                # List all second opinions
POST /api/admin/consultations/:id/status       # Update consultation status
POST /api/admin/second-opinions/:id/status     # Update second opinion status
```

**Doctor Portal (Protected by JWT):**
```
POST /api/doctor/login                         # Doctor login
GET  /api/doctor/profile                       # Get doctor profile
GET  /api/doctor/consultations                 # List doctor's consultations
GET  /api/doctor/consultations/stats           # Get consultation statistics
POST /api/doctor/consultations/:id/status      # Update consultation status
GET  /api/doctor/schedule                      # Get doctor's availability
POST /api/doctor/schedule                      # Update doctor's schedule
```

## 💳 Payment Testing

### Stripe Test Cards
| Card Number | Expiry | CVC |
|-------------|--------|-----|
| 4242 4242 4242 4242 | 12/25 | 123 |
| 4000 0000 0000 0002 | 12/25 | 123 |

### Razorpay Testing
- Use test keys (doesn't require real card)
- Any email/phone works

## 🏥 Doctor Portal Access

### Doctor Login
Test credentials (auto-seeded):
- Email: `james.whitmore@kanthealth.com`
- Password: `doctor123`

Other doctors:
- `priya.sharma@kanthealth.com`
- `michael.okonkwo@kanthealth.com`
- `elizabeth.hayes@kanthealth.com`

All use password: `doctor123`

### Features
- View all assigned consultations
- Real-time statistics dashboard
- Filter consultations by status
- Update appointment status
- Manage availability schedule
- Track payment status

For detailed Doctor Portal documentation, see [DOCTOR_PORTAL.md](DOCTOR_PORTAL.md)

## 📱 Admin Panel Access

### Login
- Email: `admin@consult-comfort.com` (configurable in .env)
- Password: `admin123` (configurable in .env)

### Token Usage
```bash
# Get token
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@consult-comfort.com","password":"admin123"}'

# Response:
# {"token":"eyJhbGc..."}

# Use in requests
curl http://localhost:5000/api/admin/consultations \
  -H "Authorization: Bearer eyJhbGc..."
```

## 🐛 Troubleshooting

### Backend connection refused
```
✗ Error: Cannot connect to database
✓ Solution: Ensure PostgreSQL is running and DATABASE_URL is correct
```

### CORS errors in browser
```
✗ Error: Access to XMLHttpRequest blocked by CORS
✓ Solution: Check VITE_BACKEND_URL in .env and ensure backend is running
```

### Stripe payment fails
```
✗ Error: Stripe key not configured
✓ Solution: Add VITE_STRIPE_PUB_KEY to frontend .env
✓ Solution: Add STRIPE_SECRET_KEY to backend .env
```

### Slots not appearing
```
✗ Error: No available slots
✓ Solution: Run migrations: npx prisma migrate dev
✓ Solution: Check database has doctors: npx prisma studio
```

For more detailed setup instructions, see [backend/SETUP.md](backend/SETUP.md)

## 📚 Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Index.tsx              # Home page
│   │   ├── Consultation.tsx       # Consultation booking (NEW)
│   │   ├── SecondOpinion.tsx      # Second opinion form (NEW)
│   │   ├── Doctors.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Book.tsx               # Legacy booking
│   ├── components/
│   │   ├── layout/
│   │   ├── booking/               # Booking form steps
│   │   └── ui/                    # shadcn/ui components
│   └── App.tsx                    # Main router
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (NEW)
│   ├── routes/
│   │   ├── consultation.js        # Consultation API (UPDATED)
│   │   ├── secondOpinion.js       # Second opinion API (UPDATED)
│   │   ├── payment.js             # Stripe & Razorpay (UPDATED)
│   │   └── admin.js               # Admin endpoints (UPDATED)
│   ├── index.js                   # Main server (UPDATED)
│   ├── SETUP.md                   # Detailed setup guide (NEW)
│   └── package.json               # Dependencies (UPDATED)
└── README.md                      # This file
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway/Heroku)
```bash
# Push to production branch
git push origin main

# Set production environment variables
# Deploy Node.js application
```

### Database (AWS RDS / DigitalOcean)
- Create PostgreSQL instance
- Update DATABASE_URL in production .env
- Run: `npx prisma migrate deploy`

## 📞 Support

For detailed setup guidance, payment integration help, or troubleshooting:
1. Check [backend/SETUP.md](backend/SETUP.md)
2. Review API documentation above
3. Check browser console for errors
4. Verify database connection: `npx prisma studio`

## 📄 License

This project is open source and available under the MIT License.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
