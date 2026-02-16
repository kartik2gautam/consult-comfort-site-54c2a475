# Consult Comfort - Backend & Database Setup Guide

## Overview
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: REST API with proper CORS

## Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- PostgreSQL 13+ (see installation steps below)

---

## Step 1: Install PostgreSQL

### Option A: Windows (Local Installation)

1. **Download PostgreSQL**
   - Go to https://www.postgresql.org/download/windows/
   - Download the Windows installer (latest version)

2. **Run the Installer**
   - Run `postgresql-16.x-windows-x64.exe` (or your version)
   - Choose installation directory (default: `C:\Program Files\PostgreSQL\16`)
   - Create a superuser password (remember this!)
   - Default port: **5432**
   - Click "Finish"

3. **Verify Installation**
   Open PowerShell and run:
   ```powershell
   psql --version
   ```
   You should see `psql (PostgreSQL) 16.x`

4. **Create Database and User**
   Open PowerShell:
   ```powershell
   psql -U postgres
   ```
   Enter your password when prompted. Then run:
   ```sql
   CREATE DATABASE consult_comfort;
   CREATE USER consult_app WITH PASSWORD 'your_secure_password';
   ALTER ROLE consult_app WITH CREATEDB;
   GRANT ALL PRIVILEGES ON DATABASE consult_comfort TO consult_app;
   \q
   ```

### Option B: Docker (if you have Docker installed)

```bash
docker run -d \
  --name postgres-consult \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=consult_comfort \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:16
```

Verify:
```bash
docker exec postgres-consult psql -U postgres -c "SELECT 1;"
```

---

## Step 2: Setup Backend

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
copy .env.example .env    # or: cp .env.example .env
```

Edit `server/.env`:
```
DATABASE_URL=postgresql://consult_app:your_secure_password@localhost:5432/consult_comfort
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Note**: Replace `your_secure_password` with the password you created in Step 1.

### 3. Setup Prisma & Create Tables
```bash
# Generate Prisma client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate dev --name init
```

Expected output:
```
✓ Database migration complete!
✓ Generated Prisma Client in ./node_modules/@prisma/client
```

### 4. Start Backend Server
```bash
npm start
```

Expected output:
```
✓ Connected to PostgreSQL
✓ Seeded 4 doctors from db.json
✓ Booking backend running on http://localhost:4000
  Health check: http://localhost:4000/api/health
```

Test the server:
```bash
curl http://localhost:4000/api/health
# Response: {"status":"ok","timestamp":"2026-02-11T..."}
```

---

## Step 3: Connect Frontend

### 1. Create `.env` in project root (if not exists)
```
VITE_BACKEND_URL=http://localhost:4000
```

### 2. Start Frontend
```bash
# from workspace root
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
```

### 3. Verify Connection
- Open http://localhost:5173/book
- You should see a list of doctors (fetched from backend)
- Try booking an appointment — it should show "Appointment Confirmed"

---

## Troubleshooting

### ❌ "Failed to connect to PostgreSQL"
**Cause**: Database not running or wrong connection string

**Fix**:
1. Check PostgreSQL is running:
   ```powershell
   # Check services (Windows)
   Get-Service postgresql*
   # If not running, start it:
   Start-Service postgresql-x64-16
   ```

2. Verify DATABASE_URL in `server/.env`
   ```
   postgresql://consult_app:your_password@localhost:5432/consult_comfort
   ```

3. Test connection:
   ```bash
   psql -U consult_app -d consult_comfort -h localhost
   # Type your password
   # If you get a prompt, connection works
   \q
   ```

### ❌ "Booking failed" / CORS error
**Cause**: Frontend and backend CORS not configured

**Fix**:
1. Ensure `VITE_BACKEND_URL=http://localhost:4000` in project root `.env`
2. Verify backend CORS config in `server/index.js` includes your frontend port (5173)
3. Restart both frontend and backend

### ❌ "Table does not exist"
**Cause**: Prisma migrations not applied

**Fix**:
```bash
cd server
npx prisma migrate dev --name init
```

### ❌ Backend shows "Seeding doctors failed"
**Cause**: `db.json` not found or bad format

**Fix**:
1. Check `server/db.json` exists
2. Verify it has valid JSON structure:
   ```json
   {
     "doctors": [
       {
         "id": "1",
         "name": "Dr. James Whitmore",
         ...
       }
     ]
   }
   ```

---

## Common Commands

### Backend Development
```bash
cd server

# Install deps
npm install

# Start with auto-reload
npm run dev

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (UI for database)
npx prisma studio
```

### Frontend
```bash
# from workspace root
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Stopping Services
```bash
# Stop backend: Ctrl+C in terminal

# Stop PostgreSQL (Windows)
Stop-Service postgresql-x64-16

# Stop Docker PostgreSQL
docker stop postgres-consult
docker start postgres-consult  # to restart
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/doctors` | List all doctors |
| GET | `/api/bookings` | List all bookings (admin) |
| POST | `/api/bookings` | Create new booking |
| POST | `/api/forms` | Submit a form |

### Example: POST /api/bookings
```json
{
  "doctorId": "1",
  "department": "cardiology",
  "date": "2026-02-15",
  "time": "10:00",
  "consultationType": "video",
  "patientInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "symptoms": "Chest pain"
  },
  "paymentComplete": true
}
```

Response:
```json
{
  "success": true,
  "appointmentId": "KANT-ABC123-XY12",
  "booking": { ... }
}
```

---

## Environment Variables Reference

### Backend (`server/.env`)
| Variable | Example | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://user:pass@localhost:5432/db | PostgreSQL connection string |
| PORT | 4000 | Server port |
| NODE_ENV | development | Environment (development/production) |
| FRONTEND_URL | http://localhost:5173 | Frontend URL for CORS |

### Frontend (`.env`)
| Variable | Example | Description |
| VITE_BACKEND_URL | http://localhost:4000 | Backend API URL |

---

## Next Steps

1. ✅ Backend running? Test: `curl http://localhost:4000/api/doctors`
2. ✅ Frontend running? Visit: http://localhost:5173/book
3. ✅ Booking works? Check database: `npx prisma studio`
4. 🚀 Deploy when ready

---

## Support
If issues persist:
1. Check terminal output for error messages
2. Verify all `.env` files are configured
3. Ensure PostgreSQL and Node.js are latest versions
4. Run `npm install` again in both `server/` and root
5. Delete `server/node_modules` and reinstall if needed

Good luck! 🚀
