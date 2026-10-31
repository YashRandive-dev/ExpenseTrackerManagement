# Expense Tracker (MERN)

Dark glassmorphism expense tracker: React 18 + Vite + Tailwind + Framer Motion + Recharts on the front, Express + MongoDB Atlas + JWT on the back.

```
ExpenseTracker/
├── backend/
│   ├── config/db.js
│   ├── controllers/  authController, incomeController, expenseController, dashboardController
│   ├── middleware/   authMiddleware, uploadMiddleware
│   ├── models/       User, Income, Expense
│   ├── routes/       authRoutes, incomeRoutes, expenseRoutes, dashboardRoutes
│   ├── uploads/      profile images (git-ignored)
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/ layouts, cards, charts, inputs, modals, common
    │   ├── pages/      Auth/{Login,SignUp}, Dashboard/{Home,Income,Expense}
    │   ├── context/UserContext.jsx
    │   ├── hooks/useUserAuth.jsx
    │   ├── utils/      axiosInstance, apiPaths, helper
    │   ├── App.jsx, main.jsx, index.css
    ├── tailwind.config.js, vite.config.js, vercel.json
    └── .env.example
```

## Run locally

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas), add a database user, allow your IP, copy the connection string.

2. Backend

```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:8000
```

3. Frontend (second terminal)

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm install
npm run dev               # http://localhost:5173
```

### Environment variables

| File | Variable | Example |
| --- | --- | --- |
| backend/.env | `PORT` | `8000` |
| backend/.env | `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/expense-tracker` |
| backend/.env | `JWT_SECRET` | long random string (`openssl rand -hex 32`) |
| backend/.env | `CLIENT_URL` | `http://localhost:5173` (comma-separate multiple origins) |
| frontend/.env | `VITE_API_URL` | `http://localhost:8000` |

## API

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | – |
| POST | `/api/v1/auth/login` | – |
| GET | `/api/v1/auth/getUser` | JWT |
| POST | `/api/v1/auth/upload-image` (multipart field `image`) | – |
| POST | `/api/v1/income/add` | JWT |
| GET | `/api/v1/income/get` | JWT |
| DELETE | `/api/v1/income/:id` | JWT |
| GET | `/api/v1/income/downloadexcel` | JWT |
| POST/GET/DELETE | `/api/v1/expense/add`, `/get`, `/:id` | JWT |
| GET | `/api/v1/expense/downloadexcel` | JWT |
| GET | `/api/v1/dashboard` | JWT |

## Deploy

**1. Database – MongoDB Atlas.** In *Network Access* allow `0.0.0.0/0` (Render IPs are dynamic). Use the same `MONGO_URI`.

**2. Backend – Render.** Easiest: New → Blueprint → pick the repo (uses `render.yaml`). Or New → Web Service manually:
- Root directory: `backend`, build `npm install`, start `npm start`, health check `/api/health`
- Env vars (see `backend/.env.production.example`): `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL, no trailing slash). `PORT` is set by Render.
- **Email (required, sends verify/reset codes):** Render's free tier blocks SMTP, so use Brevo's HTTP API. Create a free Brevo account, verify a sender, then set `BREVO_API_KEY` and `MAIL_FROM` (`Expense Tracker <verified@address>`). SMTP_* still works locally or on paid plans.
- **Profile photos:** Render's free disk is wiped on every deploy, so set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (free Cloudinary account). If unset, images are saved to `backend/uploads` (fine locally, lost on Render).

**3. Frontend – Vercel.** New Project → import the repo.
- Root directory: `frontend`, framework preset: Vite
- Env var: `VITE_API_URL` = your Render URL (e.g. `https://expense-tracker-api.onrender.com`)
- `vercel.json` already rewrites all routes to `index.html` for React Router.

Then go back to Render and make sure `CLIENT_URL` equals the final Vercel domain, and redeploy the backend.

## Notes
- Currency is set in `frontend/src/utils/helper.js` (`CURRENCY`, `LOCALE`).
- JWTs last 7 days and are stored in `localStorage`; a 401 from the API logs the user out.
