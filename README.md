
# BeautyAgent SaaS - Deployment Guide

## 🚀 Overview
BeautyAgent is a complete SaaS solution for beauty salon management, featuring a client booking portal, staff dashboard, and owner admin panel with AI insights.

**Stack:**
- React 18 (Vite)
- TailwindCSS
- Lucide React (Icons)
- Google Gemini API (AI Features)

## 🛠️ Prerequisites
- Node.js 18+
- Vercel Account
- Google AI Studio Key

## 📦 Installation (Local)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/beauty-agent.git
   cd beauty-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

## ☁️ Deployment to Vercel

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository.

2. **Import Project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click "Add New" -> "Project".
   - Import your GitHub repository.

3. **Configure Build Settings**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**:
   - In the "Environment Variables" section, add:
     - `API_KEY`: Your Google Gemini API Key.

5. **Deploy**: Click "Deploy".

## 🔧 Backend Integration (Roadmap)

Currently, the app uses `localStorage` for data persistence (MVP/Demo mode). To make it production-ready for multi-tenant SaaS:

1. **Database (Supabase)**:
   - Replace `useBeautyData.ts` local logic with Supabase Client calls.
   - Tables needed: `users`, `salons`, `bookings`, `services`, `staff`.

2. **Payments (Stripe)**:
   - Integrate Stripe Checkout in `/pages/trial/Register.tsx` after the trial period.
   - Use Webhooks to update subscription status in Supabase.

3. **Notifications (Twilio)**:
   - Replace simulated logs in `pages/client/OTP.tsx` with real SMS API calls.

## 🔑 Admin Access
- **URL**: `/admin/login`
- **Master Key**: `437501`

---
© 2024 BeautyAgent Infrastructure. All rights reserved.
