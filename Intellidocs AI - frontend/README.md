# ⚛️ The Neural Dashboard
### Frontend Interface for IntelliDocs AI

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Lighting_Fast-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Design-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **Where Neural Search Meets Human Intuition.**
> This is not just a search bar. It's a reactive, semantic intelligence surface built to visualize complex vector data in real-time.

---

## 🎨 Design Philosophy: "Glass & Motion"

We moved away from sterile enterprise dashboards. This interface is built on **Human-Computer Interaction (HCI)** principles:

*   **Glassmorphism**: A clean, layered UI that establishes hierarchy through depth and blur (`backdrop-filter`), keeping the focus on the content.
*   **Fluid Motion**: Every interaction—from expanding a file to loading a citation—is animated with `Framer Motion` for a physics-based, natural feel.
*   **Visual Logic**: Confidence scores aren't just numbers; they are color-coded signal badges (Emerald/Amber/Rose) that allow instant decision-making.

---

## ⚡ technical_architecture.tsx

Built for speed and type safety. We use a **Server-State-First** approach.

| Layer | Technology | Why we chose it |
| :--- | :--- | :--- |
| **Core** | **React 19 + Vite** | Instant HMR and optimized production builds. |
| **State** | **TanStack Query (v5)** | Handles caching, deduping, and background refetching of neural search results. |
| **Styles** | **Tailwind CSS v4** | Utility-first styling with a custom design token system for consistency. |
| **Viz** | **Recharts** | Rendering high-performance vector graphics for the live analytics dashboard. |
| **Routing** | **React Router v7** | Client-side routing with optimized code-splitting. |

---

## 🧩 Component System

Our architecture allows for modular development. Key visual components include:

### 1. The Inference Engine (`<AnswerPanel />`)
The heart of the app. It takes the LLM's streaming response and renders it with extensive markdown support, while simultaneously rendering a "Citation Grid" below it.
*   *Key Prop:* `data: QueryResponse`
*   *Behavior:* Smartly switches between "Loading Skeleton" and "Result View".

### 2. Evidence Cards (`<SourceCard />`)
Not just a link. These cards visualize the **Vector Similarity Score**.
*   **Interactive**: Click to expand and read the *exact* passage the AI used.
*   **Badges**: Displays `High Confidence` tags dynamically based on the backend threshold (0.45+).

### 3. Live Analytics (`<AnalyticsDashboard />`)
A real-time viewport into the system's brain.
*   **Latency Tracker**: Visualizes how long retrieval took (ms).
*   **Confidence Distribution**: Pie chart showing the quality of recent queries.

---

## 🚀 Developer Quickstart

Get the UI running in seconds.

```bash
# 1. Install Dependencies
npm install

# 2. Configure Environment (Optional)
# Only needed if your backend isn't on localhost:8000
echo "VITE_API_URL=https://your-backend-api.com" > .env

# 3. Ignite
npm run dev
```

> **Pro Tip:** The app uses `clsx` and `tailwind-merge`. Use the `cn()` utility in `/utils` when conditionally applying classes to avoid conflicts.

---

## 🚢 Deployment (Vercel)

This repo is **Vercel-Native**.

1.  Push to GitHub.
2.  Import project to Vercel.
3.  **Framework Preset**: `Vite`.
4.  **Build Command**: `npm run build`.
5.  **Output Directory**: `dist`.
6.  **Environment Variables**:
    *   `VITE_API_URL`: Your backend URL.

---

*Designed with precision. Built for intelligence.*
