# Doctor Portal Access Guide

## Overview
The Doctor Portal has been hidden from the main header navigation. Access is now available through hidden URLs.

## Access URLs

You can access the Doctor Portal through these URLs:

1. **Primary URL:** `http://localhost:8080/admin/login`
2. **Alternative URL:** `http://localhost:8080/doctor-portal`

Both URLs will take you to the Doctor Portal login page.

---

## Demo Credentials

Use the following dummy credentials to test the Doctor Portal:

### Test Doctor Account 1
- **Email:** james.whitmore@kanthealth.com
- **Password:** doctor123

### Test Doctor Account 2 (if available)
- **Email:** sarah.johnson@kanthealth.com
- **Password:** doctor123

---

## Features in Doctor Portal

Once logged in with dummy credentials, you can:

1. **View Consultation Requests**
   - See all incoming consultation requests
   - Patient details and symptoms
   - Preferred consultation mode (voice/video)

2. **Manage Availability**
   - Set available time slots
   - Manage schedule
   - Update consultation rates

3. **View Consultations**
   - Upcoming consultations
   - Past consultation history
   - Patient notes

4. **Access Second Opinion Requests**
   - Review document uploads
   - Patient medical history
   - Provide medical insights

---

## Header Navigation Changes

### Before
- Header showed: Home, About Us, Our Doctors, Services, Contact, Consultation, Second Opinion, Upload Documents, **Doctor Portal**

### After
- Header shows: Home, About Us, Our Doctors, Services, Contact
- **CTA Buttons (Right Side):**
  - Phone: +91 98765 43210
  - "Consultation" Button (outline)
  - "Second Opinion" Button (gold/filled)

---

## Important Notes

1. **Hidden but Accessible:** Doctor Portal is not visible in the main header, but can be accessed via:
   - Direct URL: `/admin/login` or `/doctor-portal`
   - Bookmarking the page
   - Sharing the link with doctors

2. **Dummy Credentials for Testing:** Use the credentials above to test the UI/UX

3. **Production Setup:** When moving to production:
   - Connect to real doctor database
   - Implement proper authentication (JWT/OAuth)
   - Remove or change dummy credentials
   - Consider implementing role-based access control (RBAC)

4. **Navigation Flow:**
   - Patients see: Consultation and Second Opinion as prominent buttons
   - Doctors access portal through hidden URLs
   - Admin can manage both from backend

---

## Testing Checklist

- [ ] Access `/doctor-portal` in browser
- [ ] Login with dummy credentials
- [ ] Verify doctor dashboard loads
- [ ] Check consultation requests display
- [ ] Verify patient information shows correctly
- [ ] Test logout functionality
- [ ] Check mobile responsiveness

---

## Future Enhancements

1. Implement real authentication against doctor database
2. Add forgot password functionality
3. Implement email-based OTP verification
4. Add two-factor authentication (2FA)
5. Create doctor registration flow
6. Add analytics dashboard
7. Implement document verification system
