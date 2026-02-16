# Doctor Portal Migration Guide

## Overview

This guide explains the database schema changes needed to support the Doctor Portal functionality.

## What Changed

### New Fields in Doctor Model

The `Doctor` model has been enhanced with authentication capabilities:

```prisma
model Doctor {
  id            String   @id @default(uuid())
  doctorId      String   @unique
  name          String
  specialty     String?
  department    String?
  image         String?
  experience    String?
  qualifications String?
  bio           String?
  specialisms   String[]
  
  // NEW: Authentication fields
  email         String   @unique
  password      String   // Hashed with bcryptjs
  licenseNumber String   @unique
  phone         String?
  
  consultations Consultation[]
  slots         TimeSlot[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### New Fields
- `email` - Doctor's email for login (unique)
- `password` - Hashed password for authentication
- `licenseNumber` - Medical license number (unique)
- `phone` - Contact phone number

## Migration Steps

### 1. Backup Current Database

```bash
# Create backup of existing database
pg_dump consult_comfort > backup_consult_comfort_$(date +%Y%m%d).sql
```

### 2. Run Prisma Migration

```bash
cd backend

# Create migration
npx prisma migrate dev --name add_doctor_auth

# Or view what will happen without applying
npx prisma migrate resolve
```

### 3. Seed New Doctor Records

The backend automatically creates 4 test doctors on startup if none exist:

**Test Doctor Credentials:**
- Dr. James Whitmore: `james.whitmore@kanthealth.com` / `doctor123`
- Dr. Priya Sharma: `priya.sharma@kanthealth.com` / `doctor123`
- Dr. Michael Okonkwo: `michael.okonkwo@kanthealth.com` / `doctor123`
- Dr. Elizabeth Hayes: `elizabeth.hayes@kanthealth.com` / `doctor123`

Passwords are hashed using bcryptjs (10 salt rounds).

### 4. Verify Migration

```bash
# Connect to database
psql -U consult_app -d consult_comfort

# Check doctor table structure
\d "Doctor"

# View seeded doctors
SELECT doctorId, name, email, specialty FROM "Doctor";

# Exit
\q
```

Expected output:
```
 doctorId |       name        |            email             |         specialty
----------+-------------------+------------------------------+---------------------------
 1        | Dr. James Whitmore | james.whitmore@kanthealth.com | Consultant Cardiologist
 2        | Dr. Priya Sharma   | priya.sharma@kanthealth.com   | Consultant Physician
 3        | Dr. Michael Okonkwo| michael.okonkwo@kanthealth.com| Consultant Orthopaedic...
 4        | Dr. Elizabeth Hayes| elizabeth.hayes@kanthealth.com| Consultant Dermatologist
```

### 5. Restart Backend

```bash
cd backend
npm run dev
```

You should see:
```
✓ Seeded 4 doctors
✓ Backend running on http://localhost:5000
Test login: james.whitmore@kanthealth.com / doctor123
```

## What Each Field Does

### Email
- Used for doctor login (not patient contact)
- Must be unique across all doctors
- Validated using email format check
- Example: `james.whitmore@kanthealth.com`

### Password
- Hashed using bcryptjs algorithm
- 10 salt rounds for security
- Never stored in plain text
- 6 character minimum on creation

### License Number
- Medical license identifier
- Unique per doctor (regulatory requirement)
- Not displayed in public interface
- Example: `LIC-2024-001`

### Phone
- Optional doctor contact number
- Useful for clinic internal communications
- Not used for patient notifications
- Example: `+91-9876543210`

## Manual Doctor Registration

### Add New Doctor to Database

```sql
-- Note: Replace password hash with actual bcryptjs hash
INSERT INTO "Doctor" (
  id,
  "doctorId",
  name,
  specialty,
  department,
  email,
  password,
  "licenseNumber",
  phone,
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'DR-NEW',
  'Dr. New Doctor',
  'Neurology',
  'neurology',
  'new.doctor@kanthealth.com',
  '$2a$10$...hash...', -- Generate with bcryptjs
  'LIC-2024-005',
  '+91-9876543214',
  NOW(),
  NOW()
);
```

### Generate bcryptjs Hash

Use Node.js to generate password hash:

```javascript
const bcrypt = require('bcryptjs');

// Generate hash for password "doctor123"
bcrypt.hash('doctor123', 10).then(hash => {
  console.log('Password hash:', hash);
});

// Output example:
// $2a$10$...hash...
```

Then use the hash value in the INSERT statement above.

## Rollback (If Needed)

### Undo Last Migration

```bash
cd backend

# View migration history
npx prisma migrate status

# Rollback last migration
npx prisma migrate resolve --rolled-back <migration_name>
```

### Restore from Backup

```bash
# Drop current database
dropdb consult_comfort

# Restore from backup
psql consult_comfort < backup_consult_comfort_YYYYMMDD.sql

# Re-run migrations to latest version
npx prisma migrate deploy
```

## Verification Checklist

- [ ] Backup created before migration
- [ ] Migration runs without errors
- [ ] 4 doctors seeded successfully
- [ ] Can query Doctor table with email field
- [ ] Backend starts successfully
- [ ] Doctor login endpoint works
- [ ] Test credentials: `james.whitmore@kanthealth.com` / `doctor123`
- [ ] Dashboard loads with consultations

## Troubleshooting

### Migration Fails with "Column already exists"

**Problem**: Email or password column already exists

**Solution**:
```bash
# Check current schema
npx prisma db push --preview-only

# If columns exist, create a new migration
npx prisma migrate dev --name add_missing_fields
```

### Password Hash Issues

**Problem**: Can't login with doctor credentials

**Solution**:
1. Verify password is hashed correctly
2. Check hash starts with `$2a$10$` or `$2b$10$`
3. Delete doctor record and re-seed:
   ```bash
   npx prisma db push
   # Backend auto-seeds when restarted
   npm run dev
   ```

### Email Constraint Violation

**Problem**: "Duplicate key value violates unique constraint "Doctor_email_key""

**Solution**:
1. Check for duplicate emails:
   ```sql
   SELECT email, COUNT(*) FROM "Doctor" GROUP BY email HAVING COUNT(*) > 1;
   ```
2. Delete duplicates and re-insert

### License Number Issues

**Problem**: Multiple doctors with same license number

**Solution**:
```sql
-- Find duplicates
SELECT "licenseNumber", COUNT(*) FROM "Doctor" GROUP BY "licenseNumber" HAVING COUNT(*) > 1;

-- Update unique ones
UPDATE "Doctor" SET "licenseNumber" = 'LIC-2024-' || id LIMIT 1 WHERE "licenseNumber" IS NULL;
```

## Post-Migration Steps

1. **Test Doctor Login**
   - Navigate to http://localhost:5173/admin/login
   - Use credentials: `james.whitmore@kanthealth.com` / `doctor123`
   - Should redirect to dashboard

2. **Verify Dashboard**
   - Check statistics load
   - Verify consultations display
   - Test status update functionality

3. **Backend Validation**
   - Check backend logs for errors
   - Verify doctor routes responding:
     ```bash
     curl http://localhost:5000/api/health
     ```

4. **Database Validation**
   - Query doctors with emails
   - Verify password hashes are stored
   - Check relationships intact

## Timeline

- **Migration time**: < 1 minute
- **Seeding time**: < 1 second
- **Backend restart**: < 5 seconds
- **Total downtime**: < 1 minute

## Support

For issues during migration:
1. Check backend logs: `npm run dev`
2. Verify database connection: `psql consult_comfort`
3. Review Prisma schema: `backend/prisma/schema.prisma`
4. Check [DOCTOR_PORTAL.md](DOCTOR_PORTAL.md) for testing steps

---

**Important**: Always backup your database before running migrations in production.
