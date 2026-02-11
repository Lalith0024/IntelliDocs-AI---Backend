# IntelliDocs AI - Deployment Guide

This project consists of a React frontend and a FastAPI backend with ML capabilities.

## 🚀 Frontend Deployment (Vercel)

The frontend is a Vite + React application optimized for Vercel deployment.

1. **Push code to GitHub/GitLab.**
2. **Import the frontend project** (`Intellidocs AI - frontend` folder) into Vercel.
3. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Root Directory: `Intellidocs AI - frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables:**
   - Add `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://your-backend.onrender.com`).
5. **Deploy!**

## ⚡ Backend Deployment (Render - Recommended)

For ML applications using `sentence-transformers` and `faiss`, we recommend **Render** or any Docker-based platform due to library size limits on Vercel serverless functions.

### Option 1: Render (Easiest)
1. **Push code to GitHub.**
2. **Create a Web Service** on Render connected to your repo.
3. **Root Directory:** `./` (or leave empty)
4. **Runtime:** `Docker`
5. **Environment Variables:**
   - `GROQ_API_KEY`: Your Groq/LLM API key.
   - `PORT`: `10000` (default for Render)
6. **Deploy!** The `render.yaml` and `Dockerfile` are already configured for production.

### Option 2: Vercel (Advanced/Experimental)
*Note: May hit 250MB serverless function size limits due to ML libraries.*
1. **Import the root project** into Vercel.
2. **Framework Preset:** `Other` (or checks `api/index.py`).
3. **Environment Variables:**
   - `GROQ_API_KEY`: Your key.
4. **Deploy.** 

## 🛠 Local Development

### Backend
\```bash
source .venv/bin/activate
cd main
uvicorn main:app --reload --port 8000
\```

### Frontend
\```bash
cd "Intellidocs AI - frontend"
npm run dev
\```
