# Doctor Portal - Quick Reference

## 🚀 Get Started in 60 Seconds

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
npm run dev

# Browser: Login
http://localhost:5173/admin/login
Email: james.whitmore@kanthealth.com
Password: doctor123
```

## 📍 Key Routes

| URL | Purpose |
|-----|---------|
| `/admin/login` | Doctor login page |
| `/admin/dashboard` | Consultation dashboard |
| `/api/doctor/login` | Backend auth endpoint |
| `/api/doctor/consultations` | Get doctor's consultations |
| `/api/doctor/consultations/stats` | Get statistics |

## 💾 Test Credentials

```
Dr. James Whitmore
Email: james.whitmore@kanthealth.com
Password: doctor123

Dr. Priya Sharma  
Email: priya.sharma@kanthealth.com
Password: doctor123

Dr. Michael Okonkwo
Email: michael.okonkwo@kanthealth.com
Password: doctor123

Dr. Elizabeth Hayes
Email: elizabeth.hayes@kanthealth.com
Password: doctor123
```

## 📁 File Structure

```
src/pages/admin/
├── DoctorLogin.tsx       ← Login page (360 lines)
└── DoctorDashboard.tsx   ← Dashboard (350 lines)

backend/routes/
└── doctor.js             ← Doctor endpoints (260 lines)

backend/prisma/
└── schema.prisma         ← Updated Doctor model
```

## 🔐 Authentication Flow

1. User submits email + password
2. POST `/api/doctor/login`
3. Backend returns JWT token
4. Token stored in `localStorage.doctorToken`
5. Included in all requests: `Authorization: Bearer <token>`
6. Token expires in 24 hours

## 📊 Dashboard Features

| Feature | Status |
|---------|--------|
| Statistics (5 cards) | ✅ |
| Consultations table | ✅ |
| Status filtering | ✅ |
| Status updates | ✅ |
| Logout button | ✅ |
| Responsive design | ✅ |

## 🔄 Update Consultation Status

```javascript
// Frontend sends this:
POST /api/doctor/consultations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{ "status": "completed" }

// Backend responds:
{
  "success": true,
  "consultation": { /* updated data */ }
}
```

## 🎨 UI Components

- Layout: `src/components/layout/Layout.tsx`
- Card: `src/components/ui/card.tsx`
- Button: `src/components/ui/button.tsx`
- Colors: TailwindCSS (primary, muted-foreground, etc.)

## 🧪 Test Scenarios

### Scenario 1: Login & View Dashboard
1. Go to `/admin/login`
2. Enter test credentials
3. Should see dashboard with stats

### Scenario 2: Filter Consultations
1. Click "pending" filter
2. Table should show only pending items
3. Click "all" to reset

### Scenario 3: Update Status
1. Find a consultation in table
2. Click status dropdown
3. Select "completed"
4. Should see success toast
5. Table should refresh

### Scenario 4: Logout
1. Click "Logout" button
2. Should redirect to login
3. localStorage.doctorToken should be cleared

## 🐛 Debugging

### Check Token in Browser
```javascript
// In browser console:
localStorage.getItem('doctorToken')
localStorage.getItem('doctorInfo')
```

### Check Backend Logs
```bash
# Terminal running backend
# Should show successful login:
✓ Seeded 4 doctors
✓ Backend running on http://localhost:5000
Test login: james.whitmore@kanthealth.com / doctor123
```

### Network Inspection
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "doctor" or "login"
4. Check request/response headers and body

## 🔗 API Endpoints Summary

```
Authentication:
POST   /api/doctor/login
GET    /api/doctor/profile

Consultations:
GET    /api/doctor/consultations
GET    /api/doctor/consultations/stats
POST   /api/doctor/consultations/:id/status

Schedule:
GET    /api/doctor/schedule
POST   /api/doctor/schedule
```

All endpoints except `/login` require `Authorization: Bearer <token>`

## 🚨 Common Issues

### "Login failed"
- Check email spelling
- Verify password is exactly `doctor123`
- Ensure backend is running on :5000

### "No consultations showing"
- Doctor has no consultations yet
- Check backend logs for errors
- Verify token is valid

### "Cannot update status"
- Token might be expired
- Consultation might not belong to doctor
- Check browser console for error details

### "Blank dashboard"
- Page might still loading (check Network tab)
- Check browser console for JavaScript errors
- Verify VITE_BACKEND_URL in .env

## 📦 Dependencies

**Frontend**:
- React 18
- React Router v6
- TypeScript
- TailwindCSS
- shadcn/ui

**Backend**:
- Express.js
- Prisma
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## 🔑 Environment Variables

**Frontend (.env)**:
```
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUB_KEY=pk_test_...
```

**Backend (.env)**:
```
DATABASE_URL=postgresql://consult_app:password@localhost:5432/consult_comfort
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
PORT=5000
```

## 📈 Data Model

```
Doctor
├── doctorId (unique)
├── email (unique)
├── password (hashed)
├── licenseNumber (unique)
├── name, specialty, department
└── consultations (FK) → Consultation
    └── patientName, phone, email, date, status, paymentStatus
```

## 🔍 Query Examples

### Get Doctor's Consultations (Backend)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/doctor/consultations
```

### Update Consultation Status (Backend)
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}' \
  http://localhost:5000/api/doctor/consultations/<id>/status
```

### Get Statistics (Backend)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/doctor/consultations/stats
```

## 📚 Documentation Links

- **Full Guide**: [DOCTOR_PORTAL.md](DOCTOR_PORTAL.md)
- **Migration Guide**: [DOCTOR_MIGRATION.md](DOCTOR_MIGRATION.md)
- **Implementation Summary**: [DOCTOR_PORTAL_SUMMARY.md](DOCTOR_PORTAL_SUMMARY.md)
- **Project README**: [README.md](README.md)

## ⚡ Performance Tips

1. **Token Caching**: Already handled in localStorage
2. **Lazy Loading**: Dashboard data fetched on mount
3. **Status Updates**: Only refetch when status changes
4. **Table Rendering**: Uses React keys efficiently
5. **Responsive**: CSS media queries for mobile

## 🎓 Learning Resources

To understand the code better:

1. Read `src/pages/admin/DoctorLogin.tsx` (authentication)
2. Read `src/pages/admin/DoctorDashboard.tsx` (main dashboard)
3. Read `backend/routes/doctor.js` (API implementation)
4. Read `backend/prisma/schema.prisma` (database schema)

## 💡 Code Quality

- ✅ TypeScript with strict types
- ✅ Error boundaries and fallbacks
- ✅ Input validation (frontend & backend)
- ✅ Proper HTTP status codes
- ✅ Meaningful error messages
- ✅ Toast notifications for user feedback
- ✅ Responsive design
- ✅ Accessible components (ARIA labels)

## 🚀 Next Steps

1. ✅ Local testing complete
2. → Integration testing with payments
3. → User acceptance testing
4. → Production deployment
5. → User training & documentation

---

**Status**: ✅ Development Complete | Ready for Testing

**Last Updated**: February 12, 2024
