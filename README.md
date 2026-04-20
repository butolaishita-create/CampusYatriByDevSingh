# 🚗 Campus Ride Share

A full-stack ride-sharing platform built for college students. Share rides, split costs, and message fellow students — all in one place.

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Tailwind CSS, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Folder Structure

```
campus-rideshare/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── server.js       # Entry point
│   ├── .env.example
│   └── render.yaml     # Render deployment config
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # React context (auth)
    │   ├── pages/      # All page components
    │   └── services/   # Axios API calls
    ├── tailwind.config.js
    ├── vercel.json
    └── .env.example
```

---

## ⚙️ Local Development Setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd campus-rideshare
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see below)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit REACT_APP_API_URL=http://localhost:5000/api
npm start
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/campus-rideshare
JWT_SECRET=your_long_random_secret_here
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ☁️ Deployment

### MongoDB Atlas (Database)
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user with username/password
4. Whitelist IP: `0.0.0.0/0` (allow all for Render)
5. Get connection string → use as `MONGO_URI`

### Render (Backend)
1. Push backend folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Add environment variables:
   - `MONGO_URI` = your Atlas URI
   - `JWT_SECRET` = any random long string
   - `FRONTEND_URL` = your Vercel URL (set after frontend deploy)
7. Deploy → copy your Render URL (e.g. `https://campus-rideshare-api.onrender.com`)

> ⚠️ Free Render services sleep after 15 min inactivity. First request may be slow.

### Vercel (Frontend)
1. Push frontend folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your frontend repo
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-render-url.onrender.com/api`
5. Deploy!

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Rides
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rides` | List rides (filter: from, to, date; paginate: page, limit) |
| POST | `/api/rides` | Create ride (auth) |
| GET | `/api/rides/:id` | Get ride details |
| POST | `/api/rides/:id/join` | Join ride (auth) |
| POST | `/api/rides/:id/leave` | Leave ride (auth) |
| DELETE | `/api/rides/:id` | Cancel ride (driver only) |
| GET | `/api/rides/user/:userId` | User's ride history (auth) |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages` | Send message (auth) |
| GET | `/api/messages/:userId` | Get conversation (auth) |
| GET | `/api/messages/conversations` | List all conversations (auth) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/profile` | Update own profile (auth) |
| POST | `/api/users/:id/rate` | Rate a user (auth) |

---

## 🧩 Features

- ✅ JWT Auth (register, login, protected routes)
- ✅ Post rides with from/to/date/seats/price
- ✅ Browse & search rides with filters + pagination
- ✅ Join / leave rides
- ✅ Cancel ride (driver only)
- ✅ Real-time-like chat via polling (every 4s)
- ✅ User profiles with ride history
- ✅ Star rating system
- ✅ Mobile-responsive design
- ✅ Toast notifications & loading states
- ✅ Empty states for all screens

---

## ⚡ Performance Notes

- MongoDB `.lean()` used in all read queries
- Indexes on `from`, `to`, `date`, `status` fields
- Pagination on ride listings (default 9 per page)
- JWT decoded on each request (no sessions = stateless)
- Polling interval: 4 seconds for chat (not socket)
- Max DB pool size: 5 (optimized for free tier)

---

## 🐛 Troubleshooting

**Backend won't connect to MongoDB:**
- Check `MONGO_URI` format
- Ensure IP `0.0.0.0/0` is whitelisted in Atlas

**Frontend API calls fail:**
- Check `REACT_APP_API_URL` is set correctly
- Ensure CORS allows your Vercel domain in backend `FRONTEND_URL`

**Render service sleeping:**
- Free tier sleeps after inactivity — first request may take 30–60s to wake up
- Use [UptimeRobot](https://uptimerobot.com) to ping `/health` every 14 min to keep it awake

---

## 📄 License

MIT — free to use and modify.
