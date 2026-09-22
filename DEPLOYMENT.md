# 🚀 Legendary Motors - Production Deployment Guide

This guide provides step-by-step instructions to deploy the entire Legendary Motors platform using **MongoDB Atlas** (Database), **Render.com** (Node.js Backend), and **Vercel** (Client & Admin Frontends).

---

## 📋 Architecture Overview

| Component | Technology | Recommended Host | Free Tier Available? |
| :--- | :--- | :--- | :--- |
| **Database** | MongoDB | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | ✅ Yes (M0 Free Sandbox) |
| **Backend API** | Node.js / Express | [Render.com](https://render.com) (or Railway) | ✅ Yes (Free Web Service) |
| **Buyer Marketplace** | React + Vite + Tailwind | [Vercel](https://vercel.com) (or Netlify) | ✅ Yes (Hobby Tier) |
| **Admin Dashboard** | React + Vite + Tailwind | [Vercel](https://vercel.com) (or Netlify) | ✅ Yes (Hobby Tier) |

---

## 🗄️ Step 1: Create a MongoDB Atlas Database

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create** to deploy a new database:
   - Choose **M0 (Free)**.
   - Select your preferred Cloud Provider & Region (e.g. AWS / us-east-1 or Singapore).
   - Click **Create Deployment**.
3. **Create Database User**:
   - Set a Username (e.g. `legendary_admin`).
   - Set a strong Password (save this password).
   - Click **Create Database User**.
4. **Configure IP Access**:
   - In the Network Access tab, click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Render and local seed scripts can connect.
   - Click **Confirm**.
5. **Get Connection String**:
   - In Overview, click **Connect** -> **Drivers** (Node.js).
   - Copy the connection string. It will look like:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/legendary_motors?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your actual credentials.

---

## ⚙️ Step 2: Deploy Backend API on Render.com

1. Push your repository to **GitHub** or **GitLab**.
2. Go to [Render Dashboard](https://dashboard.render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `legendary-motors-api` (or your preferred name)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Scroll down to **Environment Variables** and add the following:

| Key | Example Value | Note |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `10000` | Render assigns ports automatically, 10000 or 5001 is fine |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI from Step 1 |
| `ADMIN_KEY` | `legendary-admin-2026` | Master admin key for managing inventory |
| `SMTP_SERVICE` | `gmail` | (Optional) Email service |
| `SMTP_USER` | `your_email@gmail.com` | (Optional) Email for order notifications |
| `SMTP_PASS` | `your_app_password` | (Optional) Gmail App Password |
| `ALLOWED_ORIGINS` | `*` | Or comma-separated frontend URLs after deploying Vercel |

6. Click **Deploy Web Service**.
7. Once deployed, copy your Render Web Service URL (e.g. `https://legendary-motors-api.onrender.com`).

---

## 🏎️ Step 3: Seed the Production Database

To populate your MongoDB Atlas database with the vehicle fleet, garages, and test data:

### Option A: From your local machine (Easiest)
1. Open terminal in the project root:
   ```bash
   cd server
   ```
2. Run the seed script with your MongoDB Atlas connection URI:
   ```bash
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/legendary_motors?retryWrites=true&w=majority" npm run seed
   ```

### Option B: From the Render Dashboard Shell
1. In Render, go to your Web Service -> **Shell**.
2. Run:
   ```bash
   npm run seed
   ```

---

## 💻 Step 4: Deploy Client (Buyer App) on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client`**
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-render-app.onrender.com/api` *(replace with your actual Render URL from Step 2)*
5. Click **Deploy**.
6. Once deployed, note your client domain (e.g. `https://legendary-motors-client.vercel.app`).

---

## 🛡️ Step 5: Deploy Admin Dashboard on Vercel

1. In Vercel Dashboard, click **Add New...** -> **Project**.
2. Import the **same repository** again.
3. Configure Project Settings:
   - **Project Name**: `legendary-motors-admin`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`admin`**
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-render-app.onrender.com/api` *(replace with your Render URL)*
5. Click **Deploy**.
6. Once deployed, note your admin domain (e.g. `https://legendary-motors-admin.vercel.app`).

---

## 🔒 Step 6: Tighten CORS (Recommended)

1. Return to your **Render Dashboard** -> `legendary-motors-api` -> **Environment**.
2. Update the `ALLOWED_ORIGINS` variable with your actual frontend domains:
   ```text
   ALLOWED_ORIGINS=https://legendary-motors-client.vercel.app,https://legendary-motors-admin.vercel.app
   ```
3. Save changes (Render will automatically redeploy).

---

## ✅ Deployment Checklist & Verification

- [ ] Visit `https://your-render-app.onrender.com/` → Should return `{"name":"Legendary Motors API","status":"online",...}`.
- [ ] Visit `https://your-render-app.onrender.com/api/vehicles` → Should return the list of vehicles.
- [ ] Open your Client URL on Vercel → Browse cars, filter, and test the checkout flow.
- [ ] Open your Admin URL on Vercel → Log in using your `ADMIN_KEY` (e.g., `legendary-admin-2026`) and verify you can view and edit vehicles.
