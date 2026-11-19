# Alzikrayat — MERN Edition

Full-stack photo sharing application built with the MERN stack (MongoDB, Express.js, React, Node.js).
This is the rebuild of the original PHP/MySQL "Alzikrayat" project (Project 1) for
**Advanced Web Technologies — Course Project 3**.

Student name: ali adil mohamed

## Features

- Register / Login with bcrypt password hashing (basic authentication)
- Toolbar shows "Hi firstName" + Logout when logged in, "Please Login" when logged out
- Home page with banner, description and navigation
- Gallery fetched from the API (`useEffect` + `fetch`) with 3 display styles: 3 columns, 4 columns, list
- Photo upload (multer, stored in `server/uploads/`) for logged-in users only
- Photo detail page `/photos/:id` (`useParams`) with metadata and comments
- Comments added without reloading the page
- Delete photo: owner only, checked on the server (also removes the file and the photo's comments)
- Server-side validation with Joi, loading and error states in the UI, responsive Bootstrap layout

## Tech Stack

| Tier | Technology |
|---|---|
| Presentation | React 18 + Vite, React Router 6, Bootstrap 5 (CDN) |
| Application | Node.js, Express 4, Joi, multer, cors, dotenv |
| Data | MongoDB + Mongoose (schema validation) |

## Project Structure

```text
alzikrayat-mern/
├── server/
│   ├── models/        User.js, Photo.js, Comment.js
│   ├── routes/        authRoutes.js, photoRoutes.js, commentRoutes.js
│   ├── controllers/   authController.js, photoController.js, commentController.js
│   ├── middleware/    validation.js (Joi), auth.js, upload.js (multer), errorHandler.js
│   ├── uploads/       stored image files
│   ├── .env.example   MONGODB_URI, PORT, CLIENT_URL
│   └── server.js
└── client/
    ├── src/
    │   ├── components/  Navbar, PhotoCard, CommentForm, LoginForm, RegisterForm
    │   ├── pages/       Home, Gallery, PhotoDetail, LoginRegister, UploadPhoto
    │   ├── context/     AuthContext.jsx (logged-in user state)
    │   ├── api.js       fetch wrapper
    │   ├── App.jsx      routes
    │   └── main.jsx
    ├── index.html
    └── vite.config.js   dev proxy to the Express API
```

## Setup

Requirements: Node.js 18+ and MongoDB (local instance or MongoDB Atlas).

### 1. Server

```bash
cd server
npm install
cp .env.example .env      # then edit the values
npm run dev               # or: npm start
```

Environment variables (`server/.env`, never commit this file):

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/alzikrayat` |
| `PORT` | API port | `5000` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |

### 2. Client

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`,
so the API must be running.

## REST API

| Method | Route | Auth | Description | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | — | Create user (password hashed with bcrypt) | 201 |
| POST | `/api/auth/login` | — | Check password, return the public profile | 200 |
| GET | `/api/photos` | — | List all photos (newest first) | 200 |
| GET | `/api/photos/:id` | — | One photo | 200 |
| POST | `/api/photos` | user | Upload photo (`multipart/form-data`: `photo`, `title`, `description`) | 201 |
| DELETE | `/api/photos/:id` | owner | Delete photo, file and comments | 200 |
| GET | `/api/photos/:id/comments` | — | Comments of a photo | 200 |
| POST | `/api/photos/:id/comments` | user | Add comment (`{ "comment": "..." }`) | 201 |

Error codes: `400` validation, `401` not logged in / wrong credentials, `403` not the owner,
`404` not found, `409` email already registered.

## Authentication note

As required by the Project 3 specification, authentication is basic: after login the client keeps the user in
React state (and `localStorage`) and sends the user's id in the `x-user-id` header on write requests; the server
checks that the user exists (`middleware/auth.js`) and validates ownership before deleting.
JWT-based authentication is the optional Project 4 bonus.

## Database (Mongoose)

- `User`: firstName, lastName, email (unique, validated), password (bcrypt hash, hidden from JSON), location, description, occupation
- `Photo`: userId (ref User), fileName, title, description, dateTime
- `Comment`: photoId (ref Photo), userId (ref User), comment, dateTime
