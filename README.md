# Sprint

Platform to manage projects and track progress.

## Prerequisites

- Node.js 18+
- MongoDB 6+ (local install, or MongoDB Atlas)

## Configuration

Copy `env_example.txt` to `.env` in the project root and set `MONGODB_URI` and `SECRET_KEY`.

## Backend (Express + MongoDB)

```bash
cd server
npm install
npm run dev
```

The API serves at `http://localhost:8000` with routes under `/api/v1`.

### Seed demo users (optional)

```bash
cd server
npm run seed
```

Creates `admin@taskboard.com` / `admin123` (system admin) and `user@taskboard.com` / `user123`.

## Frontend

```bash
cd client
npm install
npm run dev
```

Set `VITE_API_URL` in `client/.env` if the API is not at `http://localhost:8000/api/v1`.
