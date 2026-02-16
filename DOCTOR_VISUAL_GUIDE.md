# Doctor Portal - Visual Guide & Walkthrough

## 🎬 User Experience Walkthrough

### Step 1: Access Doctor Portal

**URL**: `http://localhost:5173/admin/login`

**Visual**: Login page with KANT Healthcare branding

```
┌────────────────────────────────────────┐
│  KANT Healthcare                       │
│  Doctor Portal                         │
├────────────────────────────────────────┤
│                                        │
│  Doctor Portal                         │
│  Sign in to your doctor account        │
│                                        │
│  ⓘ Demo Credentials:                  │
│    Email: james.whitmore@...           │
│    Password: doctor123                 │
│                                        │
│  [Email Input Field]                   │
│  [Password Input Field]                │
│                                        │
│  [Sign In Button]                      │
│                                        │
│  Not a doctor? Back to Home            │
└────────────────────────────────────────┘
```

### Step 2: Enter Credentials

**Fields**:
- Email: `james.whitmore@kanthealth.com`
- Password: `doctor123` (masked as •••••••••)

**Actions**:
- Validation happens on submit
- Network request: `POST /api/doctor/login`

### Step 3: Dashboard Loads

**URL**: `http://localhost:5173/admin/dashboard`

**Visual**: Welcome header + Statistics

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  Welcome back, Dr. James Whitmore!                     │
│  Consultant Cardiologist | james.whitmore@...          │
│                                    [Logout Button] ×    │
│                                                        │
└────────────────────────────────────────────────────────┘

Statistics Cards:
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Total        │ Completed    │ Pending      │ Booked       │ Paid         │
│ Consultations│              │              │              │ Consultations│
│              │              │              │              │              │
│     15       │      8       │      3       │      4       │     12       │
│ 👥           │ ✓            │ ⏱️            │ 📅           │ 💵           │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### Step 4: View Consultations

**Filter Options**:
```
[All Consultations]  [Pending]  [Booked]  [Completed]
     ↓                  ↓          ↓          ↓
    All               3 items    4 items    8 items
```

**Table Display**:
```
┌─────────────┬──────────────┬──────────────┬──────────────┬────────┬────────┬────────┐
│ Patient     │ Contact      │ Date & Time  │ Symptoms     │ Status │Payment │ Action │
├─────────────┼──────────────┼──────────────┼──────────────┼────────┼────────┼────────┤
│ John Doe    │ +91-...      │ 2024-02-15  │ Chest pain   │Booked  │ Paid   │[✓] -  │
│             │ john@...     │ 09:00 AM    │              │        │        │        │
├─────────────┼──────────────┼──────────────┼──────────────┼────────┼────────┼────────┤
│ Jane Smith  │ +91-...      │ 2024-02-16  │ Back pain    │Pending │Pending │[Dropdown]
│             │ jane@...     │ 10:30 AM    │              │        │        │        │
├─────────────┼──────────────┼──────────────┼──────────────┼────────┼────────┼────────┤
│ Mike Johnson│ +91-...      │ 2024-02-17  │ Heart issues │Pending │Pending │[Dropdown]
│             │ mike@...     │ 02:00 PM    │              │        │        │        │
└─────────────┴──────────────┴──────────────┴──────────────┴────────┴────────┴────────┘
```

### Step 5: Update Consultation Status

**Action**: Click status dropdown

**Dropdown Options**:
```
┌─────────────────────────────────┐
│ Pending                         │
│ Booked                   ← Current
│ Completed                       │
│ Cancelled                       │
└─────────────────────────────────┘
```

**Selection**: Choose "Completed"

**Result**: 
```
✓ Status updated successfully!
┌─────────────┐
│ Success     │
│ Status      │
│ updated     │
│ successfully│
└─────────────┘
```

**Table Update**: Row refreshes with new status

### Step 6: Logout

**Button**: Click [Logout] in header

**Result**:
```
✓ Logged out successfully!
↓ Redirect to /admin/login
```

---

## 🎨 UI Components

### Color Palette

```
Primary (Healthcare Blue): #1e40af
├─ Dark blue header
├─ Active buttons
└─ Links & highlights

Success (Green): #10b981
├─ Completed status badge
├─ Success notifications
└─ Checkmarks

Warning (Yellow): #f59e0b
├─ Pending status badge
├─ Pending payment color
└─ Warning notifications

Error (Red): #ef4444
├─ Failed status badge
├─ Error notifications
└─ Danger actions

Muted (Gray): #6b7280
├─ Secondary text
├─ Disabled state
└─ Borders

Background: #ffffff
├─ Cards
├─ Tables
└─ Input fields
```

### Typography

```
Headlines (Font-Serif, Bold):
├─ "Welcome back, Dr. James Whitmore!" - 24px
├─ "Consultations" - 20px
└─ "Doctor Portal" - 18px

Body Text (Regular):
├─ Patient names, dates, etc. - 14px
├─ Form labels - 12px
└─ Helper text - 11px

Monospace (Optional):
├─ Error messages
└─ Code blocks
```

### Responsive Breakpoints

```
Desktop (>1024px):
┌─────────────────────────────────────┐
│  Header with full navigation         │
├─────────────────────────────────────┤
│  Statistics: 5 cards in single row   │
├─────────────────────────────────────┤
│  Full-width consultations table      │
└─────────────────────────────────────┘

Tablet (768px - 1024px):
┌──────────────────────────┐
│  Header (compact menu)   │
├──────────────────────────┤
│ Stats (2 rows × 3 cards) │
├──────────────────────────┤
│ Table (scrollable)       │
└──────────────────────────┘

Mobile (<768px):
┌──────────────────┐
│  Hamburger menu  │
├──────────────────┤
│ Stats (scrollable)
│ (1 per row)      │
├──────────────────┤
│ Table (scroll →) │
└──────────────────┘
```

---

## 🔐 Authentication Flow Diagram

```
┌─────────────────┐
│  User opens app │
└────────┬────────┘
         │
         ↓
┌──────────────────────────────────┐
│ Check localStorage.doctorToken   │
└───────┬─────────────┬────────────┘
        │ Exists      │ Missing
        ↓             ↓
    ┌────────┐    ┌────────────┐
    │ Continue│    │Redirect to │
    │         │    │ /admin/login
    └────────┘    └────────────┘
        │
        ↓
┌─────────────────────────────┐
│  Load Dashboard             │
│  Fetch /api/doctor/stats    │
│  Fetch /api/doctor/cons...  │
└─────────────────────────────┘
        │
        ↓
┌─────────────────────────────┐
│  Display Dashboard          │
│  ✓ Statistics cards loaded  │
│  ✓ Consultations table      │
│  ✓ Ready for interactions   │
└─────────────────────────────┘
```

---

## 📊 Data Flow Architecture

```
┌──────────────┐
│   Browser    │
│   (Frontend) │
├──────────────┤
│  DoctorLogin │
│     .tsx     │
│              │
│DoctorDashboard
│     .tsx     │
└──────────────┘
       ↕ HTTP
       │ REST API
       ↓
┌─────────────────────────────┐
│   Express Server            │
│   (backend/index.js)        │
├─────────────────────────────┤
│ POST /api/doctor/login      │
│ GET  /api/doctor/profile    │
│ GET  /api/doctor/consultations
│ GET  /api/doctor/consultations/stats
│ POST /api/doctor/consultations/:id/status
│ GET  /api/doctor/schedule   │
│ POST /api/doctor/schedule   │
└─────────────────────────────┘
       ↕ Prisma ORM
       │ SQL Queries
       ↓
┌──────────────────────┐
│   PostgreSQL         │
│   Database           │
├──────────────────────┤
│  Doctor Table        │
│  Consultation Table  │
│  TimeSlot Table      │
└──────────────────────┘
```

---

## 🔄 Status Update Flow

```
┌──────────────────────────────────┐
│  User sees consultation in table │
│  Status: "pending"               │
└────────────┬─────────────────────┘
             │
             ↓ User clicks dropdown
┌──────────────────────────────────┐
│  Options appear:                 │
│  - Pending                       │
│  - Booked                        │
│  - Completed                     │
│  - Cancelled                     │
└────────────┬─────────────────────┘
             │
             ↓ User selects "completed"
┌──────────────────────────────────┐
│  Frontend sends:                 │
│  POST /api/doctor/consultations/:id/status
│  { status: "completed" }         │
└────────────┬─────────────────────┘
             │
             ↓ Validates token
┌──────────────────────────────────┐
│  Backend receives request        │
│  - Verify authorization          │
│  - Check ownership (doctorId)    │
│  - Validate status enum          │
└────────────┬─────────────────────┘
             │
             ↓ Update database
┌──────────────────────────────────┐
│  prisma.consultation.update({    │
│    where: { id },                │
│    data: { status: "completed" } │
│  })                              │
└────────────┬─────────────────────┘
             │
             ↓ Return success
┌──────────────────────────────────┐
│  Frontend receives:              │
│  { success: true, consultation } │
└────────────┬─────────────────────┘
             │
             ↓ Show toast & refetch
┌──────────────────────────────────┐
│  ✓ Status updated successfully!  │
│  Refetch: /api/doctor/consultations
│  Refetch: /api/doctor/stats      │
└────────────┬─────────────────────┘
             │
             ↓ Re-render table
┌──────────────────────────────────┐
│  Table shows:                    │
│  Status: "completed" (green)     │
│  Statistics updated              │
└──────────────────────────────────┘
```

---

## 🧪 Testing Scenarios

### Scenario 1: Successful Login

```
1. Navigate to: http://localhost:5173/admin/login
   ✓ Page loads with form

2. Enter credentials:
   Email: james.whitmore@kanthealth.com
   Password: doctor123
   ✓ Fields fill correctly

3. Click "Sign In" button
   ✓ Loading state shows

4. Wait for response
   ✓ Redirects to /admin/dashboard
   ✓ Header shows "Welcome back, Dr. James Whitmore"
   ✓ Statistics cards load
   ✓ Consultations table displays
```

### Scenario 2: Invalid Login

```
1. Navigate to: http://localhost:5173/admin/login

2. Enter invalid credentials:
   Email: wrong@example.com
   Password: wrong123
   ✓ Fields fill correctly

3. Click "Sign In" button

4. Response returns
   ✗ Toast shows: "Invalid email or password"
   ✗ Stays on login page
   ✓ Form remains filled (except password)
```

### Scenario 3: Update Status

```
1. Login successfully
   ✓ Dashboard loads

2. Find a "pending" consultation
   ✓ Table shows consultation

3. Click status dropdown
   ✓ Options appear

4. Select "completed"
   ✓ API call sends
   ✓ Loading state brief

5. Response returns
   ✓ Toast: "Status updated successfully!"
   ✓ Table refreshes
   ✓ Row now shows "completed" (green)
   ✓ Statistics card updates (completed +1)
```

### Scenario 4: Filter Consultations

```
1. Dashboard loaded with 15 consultations
   ✓ Filter buttons visible: All, Pending, Booked, Completed

2. Click "pending" button
   ✓ Button becomes highlighted (gold)
   ✓ Table filters to show only 3 pending items

3. Click "booked" button
   ✓ Previous highlight removed
   ✓ Booked button highlighted
   ✓ Table shows only 4 booked items

4. Click "all" button
   ✓ All 15 items show again
   ✓ All button highlighted
```

---

## 📱 Mobile Experience

### Login Page (Mobile)

```
┌─────────────────────┐
│ KANT [hamburger]    │
├─────────────────────┤
│                     │
│   Doctor Portal     │
│ Sign in to account  │
│                     │
│  ⓘ Demo Creds:     │
│    james.whitmore..│
│    doctor123        │
│                     │
│ [Email ____]        │
│ [Password _]        │
│ [Sign In Button]    │
│                     │
│ Back to Home        │
│                     │
└─────────────────────┘
```

### Dashboard (Mobile)

```
┌─────────────────────┐
│ Dr. Whitmore   [×]  │
├─────────────────────┤
│ Welcome back!       │
│ (Brief message)     │
│ [Logout]            │
├─────────────────────┤
│ Total: 15   [👥]    │
├─────────────────────┤
│ Completed: 8 [✓]    │
├─────────────────────┤
│ Pending: 3 [⏱️]      │
├─────────────────────┤
│ Booked: 4 [📅]      │
├─────────────────────┤
│ Paid: 12 [💵]       │
├─────────────────────┤
│ [All] [Pending]     │
│ [Booked][Complete]  │
├─────────────────────┤
│ Consultations:      │
│ → (swipe to see)    │
│                     │
│ John Doe            │
│ +91-...             │
│ Chest pain          │
│ Booked | Paid       │
│ [✓] -               │
│                     │
│ Jane Smith          │
│ +91-...             │
│ Back pain           │
│ Pending | Pending   │
│ [Select ✓]          │
│                     │
└─────────────────────┘
```

---

## 🎯 Key User Interactions

### Login
- **Input**: Email, Password
- **Action**: Submit form
- **Result**: Token saved, redirect to dashboard

### View Stats
- **Input**: (automatic on load)
- **Action**: Dashboard displays 5 cards
- **Result**: See metrics at a glance

### Filter Consultations
- **Input**: Click filter button
- **Action**: Table filters by status
- **Result**: See only relevant consultations

### Update Status
- **Input**: Select from dropdown
- **Action**: API call to backend
- **Result**: Status updates, table refreshes, stats update

### Logout
- **Input**: Click logout button
- **Action**: Clear token, redirect
- **Result**: Logged out, back to login page

---

## 🔍 Visual Hierarchy

### By Importance

```
Level 1 (Most Important):
├─ "Welcome back, Dr. [Name]"  (greeting)
├─ Statistics cards              (key metrics)
└─ Consultations table           (main content)

Level 2 (Secondary):
├─ Logout button
├─ Filter buttons
└─ Status dropdown

Level 3 (Supporting):
├─ Contact info in header
├─ Table headers
└─ Helper text
```

### By Visual Weight

```
Heavy (Draws attention):
├─ Green checkmark (completed)
├─ Bold patient names
└─ Blue primary buttons

Medium (Readable):
├─ Gray text (secondary)
├─ Table rows
└─ Input fields

Light (Supporting):
├─ Borders
├─ Icons (subtle)
└─ Helper text
```

---

## 📐 Layout Structure

### Header
```
┌────────────────────────────────────────────┐
│  [Logo] KANT Healthcare          Phone [×] │
│         Doctor Portal            [Dr Portal]
│                                  [Book Now] │
└────────────────────────────────────────────┘
```

### Welcome Section
```
┌────────────────────────────────────────────┐
│  Welcome back, Dr. James Whitmore!         │
│  Consultant Cardiologist | james.whitmore..│
│                                  [Logout]  │
└────────────────────────────────────────────┘
```

### Statistics Grid
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ Total    │ Complete │ Pending  │ Booked   │ Paid     │
│ 15       │ 8        │ 3        │ 4        │ 12       │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

### Filters & Table
```
┌────────────────────────────────────────────┐
│  [All] [Pending] [Booked] [Completed]      │
├────────────────────────────────────────────┤
│ Patient  │ Contact  │ Date  │ ... │ Status │
├──────────┼──────────┼───────┼─────┼────────┤
│ John Doe │ +91-...  │ 2024..│ ... │ Booked │
│ Jane ... │ +91-...  │ 2024..│ ... │Pending │
└────────────────────────────────────────────┘
```

---

## ✨ Visual Feedback

### Loading States
```
Button: [Loading...] (disabled, spinner)
Table:  "Loading your dashboard..." (centered text)
Cards:  Skeleton loaders (gray placeholders)
```

### Success States
```
Toast:    ✓ Status updated successfully! (green)
Button:   Back to normal state
Table:    Row updates with new data (smooth)
```

### Error States
```
Toast:    ✗ Status update failed (red)
Button:   Enabled, can retry
Form:     Error message below field (red text)
```

### Disabled States
```
Button:   Gray, no cursor change, opacity 0.5
Input:    Gray background, cursor: not-allowed
Dropdown: Grayed out, no pointer events
```

---

**This visual guide helps understand the complete user experience from login to data management!**
