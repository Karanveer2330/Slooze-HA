# Deployment Guide - Render (Both Frontend & Backend)

## Quick Start

Deploy both frontend and backend on Render (FREE tier available).

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2: Deploy Backend on Render

1. **Go to Render:**
   - Visit https://render.com
   - Sign up/login with GitHub

2. **Create PostgreSQL Database:**
   - Click "New" → "PostgreSQL"
   - Name: `zaika-db`
   - Plan: Free
   - Region: Choose closest
   - Click "Create Database"
   - Copy the **Internal Database URL**

3. **Deploy Backend:**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - **Name:** `zaika-backend`
     - **Root Directory:** `server`
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `node index.js`
   - **Environment Variables:**
     - `DATABASE_URL` = (Internal Database URL)
     - `jwtSecret` = your-secret-key-here
     - `ENCRYPTION_KEY` = your-32-char-key
     - `PORT` = 10000
     - `FRONTEND_URL` = https://your-frontend.onrender.com (update after frontend deploy)
   - Click "Create Web Service"
   - Copy backend URL (e.g., `https://zaika-backend.onrender.com`)

## Step 3: Deploy Frontend on Render

**Option A: Static Site (Recommended for Render)**

1. **Create Static Site:**
   - Click "New" → "Static Site"
   - Connect GitHub repository
   - Settings:
     - **Name:** `zaika-frontend`
     - **Root Directory:** (leave empty)
     - **Build Command:** `npm install && npm run build && npm run export`
     - **Publish Directory:** `out`
   - **Environment Variables:**
     - `NEXT_PUBLIC_API_URL` = your backend URL
   - Click "Create Static Site"

2. **Update package.json:**
   Add export script:
   ```json
   "export": "next build && next export"
   ```

**Option B: Web Service (For SSR features)**

1. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - **Name:** `zaika-frontend`
     - **Root Directory:** (leave empty)
     - **Environment:** Node
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NEXT_PUBLIC_API_URL` = your backend URL
     - `PORT` = 10000
   - Click "Create Web Service"

3. **Update Backend CORS:**
   - Go to backend settings
   - Update `FRONTEND_URL` = your frontend URL
   - Redeploy

## Step 4: Database Setup

1. **Connect to PostgreSQL:**
   - Use Render database dashboard
   - Or use External Database URL with pgAdmin
   - Run `server/database/setup.sql`

2. **Insert Test Users:**
   - Run `node server/database/insert_test_users.js` locally
   - Or insert manually via SQL

## Step 5: Update Next.js Config (For Static Export)

If using Static Site, update `next.config.js`:

```javascript
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

## Environment Variables

### Frontend:
- `NEXT_PUBLIC_API_URL` = https://zaika-backend.onrender.com

### Backend:
- `DATABASE_URL` = (from PostgreSQL)
- `jwtSecret` = your-secret-key
- `ENCRYPTION_KEY` = your-encryption-key
- `PORT` = 10000
- `FRONTEND_URL` = https://zaika-frontend.onrender.com

## Free Tier Notes

- **Render Web Service:** Free tier (sleeps after 15min inactivity)
- **Render Static Site:** Free, always on
- **Render PostgreSQL:** Free for 90 days, then $7/month

## Troubleshooting

- **Build fails:** Check build logs
- **CORS errors:** Update `FRONTEND_URL` in backend
- **Database connection:** Verify `DATABASE_URL`
- **API not found:** Check `NEXT_PUBLIC_API_URL`
