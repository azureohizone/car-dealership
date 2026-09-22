# 🏁 Legendary Motors — Luxury Marketplace & Private Vaults

[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg?logo=three.js)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

An end-to-end luxury hypercar and supercar dealership ecosystem featuring an interactive **Three.js 3D WebGL showroom**, private climate-controlled vault storage allocations across Cambodia, a client marketplace, customer private garage fleet, and an admin management portal.

---

## 🌟 Key Features

### 🏎️ 1. Interactive 3D WebGL Showroom
* **Real-time 3D View:** Inspect high-performance supercars in an interactive 3D WebGL studio powered by **Three.js**.
* **Studio Lighting & Reflections:** Dynamic spot lighting, turntable LED ring, contact shadows, and realistic metallic/clearcoat paint shaders.
* **Live Paint Customizer:** Change vehicle paint colors in real-time (*Apex Crimson, Onyx Shadow, Monaco Blue, Cyber Gold, Titanium Silver, Emerald Vault*).
* **Smooth Camera Controls:** Full 360° orbit rotation, dampening physics, zoom controls, and auto-turntable spin.

### 💎 2. Luxury Car Marketplace
* **Inventory Browsing:** Filter by categories (*Hypercar, Supercar, Track Edition, Bespoke Grand Tourer, Classic Exotic*).
* **Deep Vehicle Specifications:** Horsepower, 0-100 km/h acceleration, top velocity, bespoke engine specs, transmission, and drive type.
* **High-Definition Image Galleries:** Interactive image carousel and fullscreen photo previews.
* **Real-Time Stock Tracking:** Dynamic stock status indicators (*Available, Sold Out, In-Vault*).

### 🏛️ 3. Private Vault Storage System (Cambodia)
* **High-Security Vault Allocations:** Every vehicle purchase includes automated registration into one of 6 climate-controlled private vaults across Cambodia (Phnom Penh, Siem Reap, Sihanoukville, Kampot, Battambang, Koh Rong).
* **Interactive Map:** Powered by **Leaflet** with custom high-contrast dark markers and location coordinates.

### 💳 4. Checkout Wizard & Transaction Simulation
* **Guided Step-by-Step Purchase:** Buyer details, payment method selection (Wire Transfer, Crypto Vault, Private Concierge), and destination vault assignment.
* **Instant Email Notifications:** Automated dispatch of purchase confirmations and ownership certificates via Nodemailer / In-App email inspector.

### 🛡️ 5. Dedicated Admin Management Dashboard
* **Full CRUD Operations:** Add, update, price-adjust, and delete vehicles and private vaults.
* **Multi-Image Uploads:** Handled via **Multer** and served statically by the Express backend.
* **Admin Key Authentication:** Protected endpoints with token/key authorization.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Client / Frontend** | React 18, Vite, Three.js (WebGL), Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet, Canvas-Confetti |
| **Admin Panel** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Backend / API** | Node.js, Express.js, Multer, Nodemailer, Morgan, CORS |
| **Database** | MongoDB & Mongoose ODM |

---

## 📁 Repository Structure

```
car-dealership/
├── client/              # Main Customer Marketplace & 3D WebGL Showroom
│   ├── src/
│   │   ├── components/  # CarViewer3D, Marketplace, Hero, Vault Showcase, etc.
│   │   ├── services/    # Frontend API client
│   │   └── utils/       # Sound effects, helpers
│   └── public/
│
├── admin/               # Dedicated Vehicle & Vault Admin Management Portal
│   └── src/
│       ├── components/  # Vehicle management, Garage/Vault management
│       └── services/    # Admin API calls with authentication
│
├── server/              # Express API Server & Database Models
│   ├── src/
│   │   ├── controllers/ # Vehicle, Garage, Order, Customer controllers
│   │   ├── models/      # Mongoose schemas (Vehicle, Garage, Order, Customer)
│   │   ├── routes/      # Express REST API routes
│   │   ├── seed/        # Database initial seed script
│   │   └── services/    # Nodemailer email dispatch services
│   └── uploads/         # Static uploaded vehicle images
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or higher)
* [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or via MongoDB Atlas)

---

### 1. Clone & Set Up the Backend Server

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/legendary_motors
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Email / SMTP Configuration (Optional)
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Admin Security Key
ADMIN_KEY=legendary-admin-2026
```

**Seed initial demo vehicles & private vaults into MongoDB:**
```bash
npm run seed
```

**Start the backend server:**
```bash
npm run dev
# Server running at http://localhost:5001
```

---

### 2. Set Up the Client Marketplace

```bash
cd ../client
npm install
npm run dev
# Marketplace running at http://localhost:5173
```

---

### 3. Set Up the Admin Dashboard

```bash
cd ../admin
npm install
npm run dev
# Admin dashboard running at http://localhost:5175
```

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/vehicles` | List all available vehicles (with category filtering) | No |
| `GET` | `/api/vehicles/:id` | Get full technical specs for a vehicle | No |
| `POST` | `/api/vehicles` | Create a new vehicle listing (Multipart with images) | **Admin Key** |
| `PUT` | `/api/vehicles/:id` | Update vehicle details or stock status | **Admin Key** |
| `DELETE` | `/api/vehicles/:id` | Remove a vehicle from the catalog | **Admin Key** |
| `GET` | `/api/garages` | Get all climate-controlled vault locations in Cambodia | No |
| `POST` | `/api/orders` | Create a purchase order and assign storage vault | No |
| `GET` | `/api/customers/:email/garage` | Retrieve a customer's acquired vehicle fleet | No |
| `GET` | `/api/emails/recent` | In-app inspection of recent dispatched receipts | No |

---

## 🎮 Interactive Features Guide

* **Rotate 3D Car:** Click & drag anywhere in the 3D viewport.
* **Zoom in 3D:** Scroll mouse wheel or pinch trackpad.
* **Change Paint Color:** Click any color swatch (*Apex Crimson, Onyx Shadow, Monaco Blue, etc.*) inside the 3D viewer.
* **Customer Vault Fleet:** Check the "My Garage" tab using `collector@legendarymotors.vip` to view purchased vehicles and assigned vaults.
* **Simulated Receipts:** Open the inbox icon in the navigation bar to inspect generated purchase confirmations.

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for personal or educational portfolio projects.
