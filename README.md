# Dev Tinder - Global Deployment Version

This keeps the backend routes as original (`/login`, `/signup`, `/profile/view`, etc.).
Only environment variables were added so the same backend can run globally.

Live: https://dev-tinder-1-ydtg.onrender.com

## Backend env
Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_url
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-secret-key
```

Run backend:

```bash
cd backend
npm install
npm start
```

## Frontend env
Create `frontend/.env`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

Run/build frontend:

```bash
cd frontend
npm install
npm run build
```

## Important for global deployment
- Backend and frontend can be deployed separately.
- In backend `CLIENT_URL`, add your deployed frontend URL.
- In frontend `VITE_API_BASE_URL`, add your deployed backend URL.
- MongoDB Atlas must allow your deployed backend IP, or use `0.0.0.0/0` for testing only.
