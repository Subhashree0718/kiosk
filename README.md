# SUVIDHA – Smart Urban Virtual Interactive Digital Helpdesk Assistant

> A centralized, multilingual, touch-enabled civic service kiosk platform.

## 📁 Project Structure

```
Kiosk/ (monorepo root)
├── apps/
│   ├── kiosk/       → Citizen-facing React touch UI
│   ├── admin/       → Admin & officer web portal
│   └── backend/     → Node.js + Express REST API (PostgreSQL + Prisma)
├── packages/
│   ├── ui/          → Shared React component library
│   ├── i18n/        → Multilingual string translations (en, hi, ta, te)
│   ├── types/       → Shared JS type contracts (JSDoc)
│   ├── utils/       → Common helper utilities
│   └── config/      → SLA thresholds, constants, env schema
├── infra/           → Docker, docker-compose, Nginx config
└── docs/            → Architecture, API, SRS documentation
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Run database migrations
cd apps/backend && npx prisma migrate dev

# 4. Start all apps in dev mode
npm run dev

# Or start individually:
npm run dev:kiosk      # http://localhost:5173
npm run dev:admin      # http://localhost:5174
npm run dev:backend    # http://localhost:4000
```

## 🧩 Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Kiosk UI   | React + Vite (JSX)          |
| Admin UI   | React + Vite (JSX)          |
| Backend    | Node.js + Express           |
| Database   | PostgreSQL + Prisma ORM     |
| Auth       | JWT + OTP (SMS Gateway)     |
| i18n       | i18next                     |
| State      | Zustand                     |
| Maps       | Leaflet.js                  |
| Monorepo   | npm Workspaces + Turborepo  |
| Infra      | Docker + Nginx              |

## 📋 Features

- 🌐 Multilingual interface (EN, HI, TA, TE)
- 🎙️ Voice-assisted navigation
- 🔐 OTP-based authentication + JWT sessions
- 🏛️ Unified department dashboard
- 💳 Bill payment processing
- 📝 Service request submission
- 📢 Complaint registration + geo-tagging
- 📊 Ticket tracking
- 📩 SMS notifications
- ⚡ Automated SLA escalation engine
- 🗺️ Geographic issue heat-map
- 🖥️ Admin monitoring portal
