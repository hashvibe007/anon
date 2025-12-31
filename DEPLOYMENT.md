# AnonChat Deployment Guide

## Quick Deploy to Render (Recommended - Free)

### Prerequisites
- GitHub account
- Render account (sign up at https://render.com)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy on Render

#### Option A: Auto-deploy with Blueprint (Easiest)
1. Go to https://render.com/
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create both services
5. Set environment variables in Render dashboard:
   - For `anonchat-server`:
     - `CLIENT_URL` = Your frontend URL (e.g., `https://anonchat-client.onrender.com`)
   - For `anonchat-client`:
     - `REACT_APP_SOCKET_URL` = Your backend URL (e.g., `https://anonchat-server.onrender.com`)

#### Option B: Manual Deploy
1. Deploy Backend:
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Name: `anonchat-server`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variable: `CLIENT_URL` = (your frontend URL)

2. Deploy Frontend:
   - Click "New" → "Static Site"
   - Connect same repo
   - Name: `anonchat-client`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Add environment variable: `REACT_APP_SOCKET_URL` = (your backend URL)

### Step 3: Update Environment Variables
After both services are deployed, update the environment variables with the actual URLs:
- Backend `CLIENT_URL`: https://your-frontend-url.onrender.com
- Frontend `REACT_APP_SOCKET_URL`: https://your-backend-url.onrender.com

---

## Alternative: Deploy to Railway (Free Trial)

1. Visit https://railway.app/
2. Click "Start a New Project"
3. Connect your GitHub repo
4. Railway will auto-detect your app structure
5. Add environment variables as needed

---

## Alternative: Split Deployment

### Frontend → Vercel
```bash
cd client
vercel
```
Add environment variable: `REACT_APP_SOCKET_URL=<your-backend-url>`

### Backend → Render/Railway
Deploy the `server` folder separately with WebSocket support.

---

## Testing Locally
```bash
# Install all dependencies
npm run install-all

# Run both client and server
npm run dev

# Or run separately
npm run server  # runs on port 3001
npm run client  # runs on port 3000
```

---

## Important Notes
- Free tier on Render spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- For production, consider upgrading to paid tier for always-on service
