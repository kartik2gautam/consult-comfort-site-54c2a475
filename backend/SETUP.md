# Backend Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or bun package manager

## 1. PostgreSQL Installation

### Windows
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Note the password you set for the `postgres` user
4. Keep default port 5432

### macOS
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Or download from https://www.postgresql.org/download/macosx/
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Docker (Alternative)
```bash
docker run --name consult-db \
  -e POSTGRES_USER=consult_app \
  -e POSTGRES_PASSWORD=secure_password_123 \
  -e POSTGRES_DB=consult_comfort \
  -p 5432:5432 \
  -d postgres:15-alpine
```

## 2. Create Database and User

### Via psql CLI
```bash
# Connect to PostgreSQL (Windows: use pgAdmin or psql from Start Menu)
psql -U postgres

# Execute these commands:
CREATE USER consult_app WITH PASSWORD 'secure_password_123';
CREATE DATABASE consult_comfort OWNER consult_app;
GRANT ALL PRIVILEGES ON DATABASE consult_comfort TO consult_app;

# Verify
\l  # List databases
\q  # Exit psql
```

### Via pgAdmin GUI (Easier for Windows users)
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `consult_comfort`
4. Right-click "Login/Group Roles" → Create → Login/Group Role
5. Name: `consult_app`, Password: `secure_password_123`, Role: superuser

## 3. Backend Setup

### Step 1: Navigate to backend folder
```bash
cd backend
```

### Step 2: Install dependencies
```bash
npm install
# or
bun install
```

### Step 3: Configure environment variables
```bash
# Copy example file
cp .env.example .env

# Edit .env with your values:
DATABASE_URL="postgresql://consult_app:secure_password_123@localhost:5432/consult_comfort"

# Payment gateway keys (get from Razorpay dashboard)
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="xxxxx"

# Twilio (for WhatsApp notifications)
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="xxxxx"
TWILIO_PHONE_NUMBER="+1234567890"

# Admin credentials
ADMIN_EMAIL="admin@consult-comfort.com"
ADMIN_PASSWORD="admin123"

# JWT secret
JWT_SECRET="your-secret-key-here"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Server port
PORT=5000
```

### Step 4: Run Prisma migrations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations and seed database with doctors
npx prisma migrate dev --name init

# (When prompted: "Enter a name for the new migration")
```

### Step 5: Start the backend server
```bash
npm run dev
# or
node index.js
```

**Expected output:**
```
✓ Database seeded with 4 doctors
✓ Server running on http://localhost:5000
✓ Health check: GET http://localhost:5000/api/health
```

## 4. Frontend Setup

### From project root:
```bash
# Install dependencies
npm install
# or
bun install

# Create frontend .env
cp .env.example .env  # if exists, or create .env

# Add this variable:
VITE_BACKEND_URL=http://localhost:5000

# Start dev server
npm run dev
# or
bun run dev
```

**Frontend runs on:** `http://localhost:5173`

## 5. Verify Everything Works

### Check backend health
```bash
curl http://localhost:5000/api/health
```

**Response should be:**
```json
{"status":"ok","message":"Server is healthy"}
```

### Check doctors API
```bash
curl http://localhost:5000/api/consultation/doctors
```

**Response should show 4 doctors:**
```json
[
  {
    "doctorId": 1,
    "name": "Dr. Sarah Johnson",
    "specialty": "Cardiology",
    ...
  },
  ...
]
```

### Visit frontend
Open browser and go to:
- Home: `http://localhost:5173`
- Consultation booking: `http://localhost:5173/consultation`
- Second opinion: `http://localhost:5173/second-opinion`

## 6. Database Management

### View database contents (using psql)
```bash
psql -U consult_app -d consult_comfort

# View tables
\dt

# View doctors
SELECT * FROM "Doctor";

# View consultations
SELECT * FROM "Consultation";

# Exit
\q
```

### Reset database (if needed)
```bash
# From backend folder:
npx prisma migrate reset

# Confirm with 'y' - this will:
# 1. Drop all tables
# 2. Re-run migrations
# 3. Re-seed with 4 doctors
```

## 7. Razorpay Setup

### Get Razorpay Test Keys
1. Go to https://dashboard.razorpay.com
2. Settings → API Keys
3. Copy Key ID and Key Secret
4. Add to `.env`

**Test details:**
- Use any email/phone
- Razorpay dashboard shows test transactions

## 8. Troubleshooting

### "Connection refused" error
```
Problem: Backend can't connect to database
Solution:
1. Verify PostgreSQL is running
   Windows: Check Services app
   Mac: brew services list
   Linux: sudo systemctl status postgresql

2. Check DATABASE_URL in .env
   Format: postgresql://username:password@localhost:5432/dbname

3. Verify credentials
   psql -U consult_app -d consult_comfort
```

### "CORS error" in browser console
```
Problem: Frontend can't reach backend
Solution:
1. Check both servers are running
   Backend: http://localhost:5000/api/health
   Frontend: http://localhost:5173

2. Verify VITE_BACKEND_URL in .env
   Should be: http://localhost:5000

3. Ensure backend has CORS enabled (already configured)
```

### "Table does not exist" error
```
Problem: Prisma migration didn't run
Solution:
1. Navigate to backend folder
2. Run: npx prisma migrate deploy
3. If that fails, reset: npx prisma migrate reset (warning: deletes data)
```

### "No payment method keys configured"
```
Problem: Stripe/Razorpay keys not in .env
Solution:
1. Get keys from respective dashboards
2. Add to backend/.env
3. Restart backend server: npm run dev
```

## 9. API Endpoints Reference

### Consultation Routes
```
GET /api/consultation/doctors
  Returns all available doctors

GET /api/consultation/slots?doctorId=1&date=2024-01-15
  Returns available time slots for doctor on date

POST /api/consultation/book
  Body: {
    doctorId, patientName, phone, email, 
    symptoms, date, timeSlot
  }
  Creates consultation booking
```

### Second Opinion Routes
```
POST /api/second-opinion
  Multipart form data with files
  Fields: name, phone, email, age, gender, remarks, 
          preferredContact, documents (file array)
  Creates second opinion request
```

### Payment Routes
```
POST /api/payment/stripe/create-intent
  Body: { amount, type, refId }
  Returns clientSecret for payment

POST /api/payment/stripe/verify
  Body: { paymentIntentId, type, refId }
  Verifies payment and updates record

POST /api/payment/razorpay/order
  Body: { amount, type, refId }
  Creates Razorpay order

POST /api/payment/razorpay/verify
  Body: { orderId, paymentId, signature, type, refId }
  Verifies Razorpay signature and updates record
```

### Admin Routes
```
POST /api/admin/login
  Body: { email, password }
  Returns JWT token (8hr expiry)

GET /api/admin/consultations
  Headers: Authorization: Bearer <token>
  Returns all consultations

GET /api/admin/second-opinions
  Headers: Authorization: Bearer <token>
  Returns all second opinions

POST /api/admin/consultations/:id/status
  Body: { status } (pending/booked/completed/cancelled)
  Updates consultation status

POST /api/admin/second-opinions/:id/status
  Body: { status } (pending/reviewed/completed)
  Updates second opinion status
```

## 10. Production Deployment

### Before deploying:
- [ ] Set strong admin password in .env
- [ ] Use production Stripe/Razorpay keys
- [ ] Configure PostgreSQL backup strategy
- [ ] Set JWT_SECRET to random 32+ char string
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable HTTPS on backend
- [ ] Set NODE_ENV=production

### Deploy options:
- **Vercel/Netlify**: Frontend (Next.js/Vite)
- **Render/Railway/Heroku**: Backend (Node.js)
- **AWS RDS/DigitalOcean**: PostgreSQL database
- **AWS S3/Cloudinary**: File storage for uploads

---

**For questions or issues, check the main README.md or create an issue in the repository.**
