# Academic Atelier – Academic Record Management Portal

A full-stack web application built with **React** (frontend) and **Node.js/Express** (backend), using **MongoDB** for data persistence. Faithfully reproduces the "Curated Authority" design system from the original prototype.

---

## Project Structure

```
academic-portal/
├── backend/          # Node.js + Express REST API (Mongoose, JWT, Auth)
└── frontend/         # React application (Tailwind CSS, React Router, Context API)
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local install e.g. Homebrew `mongodb-community` or MongoDB Atlas)
- npm or yarn

---

## Quick Demo Credentials (1-Click Login Available)

| Role | Name | Email | Password | Assigned Class | Initial Due |
|------|------|-------|----------|----------------|-------------|
| Student | Alex Thompson | `alex@school.edu` | `password123` | Grade 10 - Section A | ₹0 (Paid) |
| Student | Priya Nair | `priya@school.edu` | `password123` | Grade 10 - Section B | ₹15,000 (Pending) |
| Student | Sasha Petrov | `sasha@school.edu` | `password123` | Grade 11 - Section A | ₹0 (Paid) |
| Faculty | Dr. Julian Thorne | `faculty@school.edu` | `password123` | Faculty Lead | N/A |
| Admin | Eleanor Vance | `admin@school.edu` | `password123` | Dean of Affairs | N/A |

---

## Backend Setup

```bash
cd backend
npm install

# Start server (auto-seeds database with initial users, distinct timetables, classes & fees)
npm run dev     # development (port 5001)
# or
npm start       # production

# Run automated system tests
npm test
```

The API runs on `http://localhost:5001`.

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register new user with role & assigned class |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | ✓ | Get current user profile |
| GET | /api/users | ✓ | List all users |
| GET | /api/users/:id | ✓ | Get single user |
| PUT | /api/users/me | ✓ | Update own profile |
| GET | /api/timetable | ✓ | Get personalized timetable (or by ?className=...&term=...) |
| GET | /api/timetable/classes | ✓ | Get available classes and terms |
| PUT | /api/timetable | ✓ | Update class timetable (Faculty/Admin only) |
| GET | /api/fees | ✓ | List fees (student view: own dues; admin view: all records) |
| POST | /api/fees | ✓ | Add new fee record (Faculty/Admin) |
| POST | /api/fees/:id/pay | ✓ | **Process payment** (Card, UPI, Netbanking) & issue receipt |
| GET | /api/fees/:id/receipt/:txnId | ✓ | Get official printable receipt / invoice |
| GET | /api/classes | ✓ | List classes and active student rosters |
| POST | /api/classes | ✓ | Create a new class |
| GET | /api/feedback | ✓ | Get received feedback (paginated) |
| GET | /api/feedback/given | ✓ | Get given feedback (paginated) |
| GET | /api/feedback/drafts | ✓ | Get draft feedback |
| POST | /api/feedback | ✓ | Create new feedback |
| PUT | /api/feedback/:id | ✓ | Update feedback (owner only) |
| DELETE | /api/feedback/:id | ✓ | Delete feedback (owner only) |

---

## Frontend Setup

```bash
cd frontend
npm install
npm start     # Runs on http://localhost:3000 (proxies to http://localhost:5001)
```

### Build for Production

```bash
npm run build
# Output goes to frontend/build/
```

---

## Deploying to Vercel

The project is pre-configured for 1-click Vercel deployment as a unified monorepo or as individual services.

### 1. In the Vercel Dashboard:
1. Select **Root Directory**: `./` (or leave as default).
2. For **Application Preset**, select **Other** (or use the detected **Services**).
3. Under **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection URI (`mongodb+srv://...`)
   - `JWT_SECRET`: A secure key (e.g., `academic_portal_secret_key_2026`)
   - `NODE_ENV`: `production`
4. Click **Deploy**!

Vercel will automatically:
- Run `npm run build` to build the React application into `frontend/build`.
- Deploy the Express API as a serverless function via `api/index.js`.
- Route `/api/*` requests to the backend serverless handler.
- Route all frontend paths to `/index.html` for clean React Router client-side navigation.

---

## Core Features & Fixes

1. **Per-Student & Per-Class Distinct Timetables**:
   - Fixed the issue where all students saw the identical timetable.
   - Each class (Grade 10-A, Grade 10-B, Grade 11-A, Grade 11-B, Grade 12-A) now has its own unique, realistic curriculum, subjects, teachers, and period allocations.
   - Students automatically receive their class's personalized schedule with room numbers, period highlights, and student badges.
   - Faculty and Admins can switch between any class schedule and edit cells inline with persistent database updates.

2. **Integrated Fee Payment System**:
   - Full online payment gateway flow integrated into the Fee Management page.
   - Supports **Credit/Debit Cards** (with real-time card brand detection & formatting), **UPI & Dynamic QR Code Scanner**, and **Net Banking** with instant bank redirection simulation.
   - Flexible full or partial payment options.
   - Instant transaction confirmation, automatic outstanding balance deduction, and status updates (Pending -> Partial -> Paid).
   - Generates official downloadable & printable fee receipts/invoices featuring institute seal, itemized breakdown, and digital signatures.

3. **Unified Auth & Architecture**:
   - Replaced fragmented hooks with a unified React `AuthProvider` / `AuthContext`.
   - Fixed login/registration redirects directly to `/dashboard`.
   - Configured port 5001 proxying to avoid macOS AirPlay port 5000 conflicts.
   - Zero compiler warnings and clean production builds.
