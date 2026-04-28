# Academic Atelier – Academic Record Management Portal

A full-stack web application built with **React** (frontend) and **Node.js/Express** (backend), using **MongoDB** for data persistence. Faithfully reproduces the "Curated Authority" design system from the original HTML prototype.

---

## Project Structure

```
academic-portal/
├── backend/          # Node.js + Express REST API
└── frontend/         # React app (CRA + Tailwind CSS)
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- npm or yarn

---

## Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env:
#   MONGODB_URI=mongodb://localhost:27017/academic_portal
#   JWT_SECRET=change_this_to_a_long_random_string
#   PORT=5000

npm run dev     # development (nodemon)
# or
npm start       # production
```

The API will be available at `http://localhost:5000`.

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | ✓ | Get current user |
| GET | /api/users | ✓ | List all users |
| GET | /api/users/:id | ✓ | Get single user |
| PUT | /api/users/me | ✓ | Update own profile |
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
npm start     # Runs on http://localhost:3000
```

The CRA proxy (`"proxy": "http://localhost:5000"` in package.json) forwards all `/api` calls to the backend — no CORS configuration needed in development.

### Build for Production

```bash
npm run build
# Output goes to frontend/build/
# Serve with: npx serve -s build
```

---

## Features

- **Authentication** – JWT-based register / login / persistent sessions
- **Feedback Portal** – Create, view, and manage feedback with star ratings
- **Tab Navigation** – Switch between Received / Given / Drafts
- **Pagination** – Server-side pagination for feedback lists
- **Responsive Design** – Full mobile support with bottom navigation bar
- **Design System** – Glassmorphism, gradient CTAs, asymmetric card layout, no-border tonal layering
- **Form Validation** – Client + server-side with friendly error messages

---

## Design System Tokens (Tailwind)

Key colours used throughout:
- `primary` — `#002045` (deep navy anchor)
- `primary-container` — `#1a365d`
- `secondary` — `#505f76` (slate grey)
- `surface` / `surface-container-low` — light blue-tinted page backgrounds
- `tertiary-fixed` — `#ffddb8` (warm amber for avatars/accents)

Fonts: **Manrope** (headlines) + **Inter** (body)
