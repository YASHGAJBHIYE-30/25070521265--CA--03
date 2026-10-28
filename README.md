# PageTurn - Personal Reading Tracker (MERN)

React (Vite) + Node/Express + MongoDB.

## Prerequisites
- Node.js 18+
- MongoDB Community Server running locally (default port 27017)

## Setup
```
npm install            # root (installs concurrently)
npm run install:all    # installs server + client dependencies
npm run seed           # creates demo user + 15 books
npm run dev            # starts API (5000) and client (5173)
```
Open http://localhost:5173

Demo login: `demo@pageturn.com` / `Demo@1234`

## Environment (server/.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pageturn
JWT_SECRET=change_me
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```
To use MongoDB Atlas, only change `MONGO_URI`.

## API
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| PUT | /api/users/profile | Update name / yearly goal |
| PUT | /api/users/password | Change password |
| GET/POST | /api/books | List (search, filter, sort, paginate) / create |
| GET/PUT/DELETE | /api/books/:id | Read / update / delete |
| GET | /api/books/stats | Dashboard statistics |

Passwords need 6+ characters with an uppercase letter, a lowercase letter and a number.
