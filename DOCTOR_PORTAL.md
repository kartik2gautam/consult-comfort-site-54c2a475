# Doctor Portal Documentation

## Overview

The Doctor Portal allows healthcare professionals to manage their consultations, view patient information, and update appointment statuses. Doctors can log in with their credentials and access a comprehensive dashboard displaying their schedule and patient metrics.

## Doctor Portal Features

### 1. Doctor Login (`/admin/login`)
- **URL**: `http://localhost:5173/admin/login`
- **Authentication**: Email + Password
- **Demo Credentials**:
  - Email: `james.whitmore@kanthealth.com`
  - Password: `doctor123`
  
Other pre-seeded doctors:
- `priya.sharma@kanthealth.com` / `doctor123`
- `michael.okonkwo@kanthealth.com` / `doctor123`
- `elizabeth.hayes@kanthealth.com` / `doctor123`

### 2. Doctor Dashboard (`/admin/dashboard`)
- **Protected Route**: Requires valid JWT token
- **Access**: After successful login
- **Features**:
  - View consultation statistics
  - See all patient consultations
  - Update consultation status
  - Filter consultations by status
  - View patient contact information
  - Track payment status

### 3. Dashboard Statistics
The dashboard displays real-time statistics:

| Metric | Description |
|--------|-------------|
| Total Consultations | All consultations assigned to doctor |
| Completed | Successfully completed consultations |
| Pending | Awaiting payment or confirmation |
| Booked | Confirmed appointments |
| Paid | Consultations with payment received |

### 4. Consultation Management

#### View Consultations
- Table showing all patient consultations
- Displays: Patient name, contact, date/time, symptoms, status, payment status
- Real-time data from backend

#### Filter by Status
Four filter buttons available:
- **All**: Show all consultations
- **Pending**: Awaiting status update
- **Booked**: Confirmed appointments
- **Completed**: Finished consultations

#### Update Status
Doctors can change consultation status using dropdown:
- `pending` → Initial state
- `booked` → Appointment confirmed
- `completed` → Consultation finished
- `cancelled` → Appointment cancelled

**How to Update**:
1. Find consultation in table
2. Click status dropdown
3. Select new status
4. Status updates automatically in dashboard

### 5. Payment Tracking
Each consultation shows:
- **Payment Status**: `paid`, `pending`, or `failed`
- **Amount**: ₹500 per consultation
- **Color Coding**: 
  - Green = Paid
  - Yellow = Pending
  - Red = Failed

## Backend API Endpoints

### Doctor Authentication

#### Login
```
POST /api/doctor/login
Content-Type: application/json

{
  "email": "james.whitmore@kanthealth.com",
  "password": "doctor123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGc...",
  "doctor": {
    "doctorId": "1",
    "name": "Dr. James Whitmore",
    "email": "james.whitmore@kanthealth.com",
    "specialty": "Consultant Cardiologist",
    "image": "..."
  }
}
```

#### Get Doctor Profile
```
GET /api/doctor/profile
Authorization: Bearer <token>

Response (200):
{
  "doctorId": "1",
  "name": "Dr. James Whitmore",
  "email": "james.whitmore@kanthealth.com",
  "specialty": "Consultant Cardiologist",
  "department": "cardiology",
  "experience": "25+ years",
  "image": "...",
  "phone": "+91-9876543210",
  "bio": "..."
}
```

### Consultation Management

#### Get All Consultations
```
GET /api/doctor/consultations
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "uuid",
    "doctorId": "1",
    "patientName": "John Doe",
    "phone": "+91-9876543210",
    "email": "john@example.com",
    "symptoms": "Chest pain",
    "date": "2024-02-15",
    "timeSlot": "09:00",
    "paymentId": "...",
    "paymentMethod": "stripe",
    "paymentStatus": "paid",
    "status": "booked",
    "amount": 500,
    "createdAt": "2024-02-12T10:30:00Z",
    "updatedAt": "2024-02-12T10:30:00Z"
  },
  ...
]
```

#### Get Statistics
```
GET /api/doctor/consultations/stats
Authorization: Bearer <token>

Response (200):
{
  "total": 15,
  "completed": 8,
  "pending": 3,
  "booked": 4,
  "paid": 12
}
```

#### Update Consultation Status
```
POST /api/doctor/consultations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}

Response (200):
{
  "success": true,
  "consultation": {
    "id": "uuid",
    "status": "completed",
    ...
  }
}
```

### Schedule Management

#### Get Doctor's Schedule
```
GET /api/doctor/schedule
Authorization: Bearer <token>
Query: ?date=2024-02-15 (optional)

Response (200):
[
  {
    "id": "uuid",
    "doctorId": "1",
    "date": "2024-02-15",
    "time": "09:00",
    "isBooked": true
  },
  ...
]
```

#### Update Schedule
```
POST /api/doctor/schedule
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-02-15",
  "times": ["09:00", "09:30", "10:00", "10:30", ...]
}

Response (201):
{
  "success": true,
  "message": "Schedule updated",
  "slotsCreated": 13
}
```

## Frontend Integration

### Login Flow
1. User navigates to `/admin/login`
2. Enters email and password
3. Frontend sends POST to `/api/doctor/login`
4. Backend validates credentials and returns JWT token
5. Token stored in `localStorage` as `doctorToken`
6. User redirected to `/admin/dashboard`

### Dashboard Flow
1. Check for `doctorToken` in localStorage
2. If missing, redirect to login
3. Fetch doctor stats and consultations using token
4. Display real-time data
5. Allow status updates with re-fetch on change

### Session Management
- Token expires after **24 hours**
- Logout clears token from localStorage
- Automatic redirect to login if token missing

## Security Features

### Authentication
- JWT token-based authentication
- Password hashing with bcryptjs (10 salt rounds)
- 24-hour token expiry
- Bearer token validation on all protected routes

### Authorization
- Doctors only see their own consultations
- Cannot access other doctors' data (doctorId checked)
- Status updates verified for ownership

### Validation
- Email format validation
- Password minimum 6 characters
- Status values restricted to enum
- Date format validation (YYYY-MM-DD)

## UI/UX Details

### Design System
- Matches main KANT Healthcare branding
- Consistent colors and typography
- Responsive layout (mobile, tablet, desktop)
- Icons from lucide-react library

### Dashboard Layout
- **Header**: Doctor welcome message + logout
- **Stats Section**: 5 metric cards (total, completed, pending, booked, paid)
- **Main Content**: Filterable consultations table
- **Responsive**: Stacks on mobile, full width on desktop

### Color Coding
| Status | Color | Hex |
|--------|-------|-----|
| Completed | Green | #10b981 |
| Booked | Blue | #3b82f6 |
| Pending | Yellow | #f59e0b |
| Cancelled | Red | #ef4444 |

### Status Update Dropdown
- Only shows for non-completed consultations
- Options: pending, booked, completed, cancelled
- Auto-updates dashboard on change

## Error Handling

### Common Errors

#### 401 Unauthorized
```
{
  "message": "Missing or invalid token"
}
```
**Solution**: Re-login to get fresh token

#### 403 Forbidden
```
{
  "message": "Unauthorized"
}
```
**Solution**: Cannot access other doctor's data

#### 404 Not Found
```
{
  "message": "Doctor not found"
}
```
**Solution**: Invalid doctor ID

#### 500 Server Error
```
{
  "message": "Failed to fetch consultations",
  "error": "..."
}
```
**Solution**: Backend issue, check logs

## Testing the Doctor Portal

### Local Testing
```bash
# 1. Start backend
cd backend
npm run dev  # Runs on :5000

# 2. Start frontend
npm run dev  # Runs on :5173

# 3. Access portal
http://localhost:5173/admin/login
```

### Test Scenario

1. **Login as Doctor**
   - Email: `james.whitmore@kanthealth.com`
   - Password: `doctor123`

2. **View Dashboard**
   - Check stats loading
   - Verify consultation list appears

3. **Filter Consultations**
   - Click each filter button
   - Verify table updates

4. **Update Status**
   - Select a pending consultation
   - Change status to "booked"
   - Check toast notification
   - Verify table updates

5. **Logout**
   - Click logout button
   - Verify redirect to login page
   - Check token cleared from storage

## Database Schema

### Doctor Model
```prisma
model Doctor {
  doctorId      String   @unique
  name          String
  specialty     String?
  department    String?
  email         String   @unique
  password      String   // Hashed with bcryptjs
  licenseNumber String   @unique
  phone         String?
  image         String?
  experience    String?
  qualifications String?
  bio           String?
  specialisms   String[]
  consultations Consultation[]
  slots         TimeSlot[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Adding New Doctors

### Via API (Admin Only - Need Auth)
```bash
POST /api/doctor/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Dr. New Doctor",
  "email": "new.doctor@kanthealth.com",
  "password": "secure123",
  "specialty": "Neurology",
  "department": "neurology",
  "licenseNumber": "LIC-2024-005",
  "phone": "+91-9876543214"
}
```

### Via Database (Direct)
```sql
INSERT INTO "Doctor" (id, "doctorId", name, specialty, email, password, "licenseNumber", phone, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'DR-NEW',
  'Dr. New Doctor',
  'Neurology',
  'new.doctor@kanthealth.com',
  '$2a$10$...', -- bcryptjs hash of password
  'LIC-2024-005',
  '+91-9876543214',
  NOW(),
  NOW()
);
```

## Troubleshooting

### "Login Failed"
- Verify email is correct
- Check password (case-sensitive)
- Ensure backend is running on port 5000

### "No Consultations Showing"
- Check if doctor has any consultations
- Verify token is valid
- Check browser console for errors

### "Token Expired"
- Logout and login again
- Tokens expire after 24 hours
- Clear browser cache if persisting

### "Status Update Failed"
- Verify consultation belongs to doctor
- Check backend logs for errors
- Ensure valid status value

## Future Enhancements

Potential features for future versions:
- Schedule management (add/edit time slots)
- Patient messaging system
- Prescription management
- Document upload for patients
- Video consultation integration
- Appointment reminders via SMS/WhatsApp
- Revenue/earnings dashboard
- Performance analytics

---

**For questions or issues with the Doctor Portal, please check the main README.md or backend logs.**
