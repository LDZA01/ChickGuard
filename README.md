# 🐔 ChickGuard

**AI-Powered Chicken Health Monitoring System**

<div align="center">
  <img src="https://img.shields.io/badge/AI-YOLOv8-blue?style=for-the-badge" alt="YOLOv8">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-Latest-orange?style=for-the-badge" alt="FastAPI">
  <img src="https://img.shields.io/badge/LINE-Messaging_API-00B900?style=for-the-badge" alt="LINE">
</div>

---

## What is ChickGuard?

ChickGuard uses AI to detect early signs of disease in chicken flocks — before it spreads across the entire barn.

```
Camera 24/7  →  AI Behavior Analysis  →  Disease Risk Score (0–100)  →  LINE Alert
```

The system detects subtle behavioral signals invisible to the human eye:
- 🐔 Reduced movement
- 👥 Abnormal clustering
- 🍚 Changes in feeding patterns

---

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt

cp .env.example .env   # configure your credentials

python main.py
```

| Endpoint | URL |
|---|---|
| API Server | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Risk Score | http://localhost:8000/api/risk/current |
| Video Feed | http://localhost:8000/api/video_feed |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at: http://localhost:3001

### 3. Notifications (Optional)

Edit `.env` at project root:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_token_here
LINE_USER_ID=your_user_id_here
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALERT_EMAIL=recipient@example.com
```

See [Environment Setup](docs/ENV_SETUP.md) and [Notifications Setup](docs/NOTIFICATION_SETUP_QUICK.md) for details.

---

## Features

| Module | Capabilities |
|---|---|
| 🤖 AI Detection | YOLOv8 real-time object detection, 5 FPS, no webcam required |
| 🧠 Behavior Analysis | Movement tracking, clustering detection, density monitoring |
| 📊 Risk Score | Disease risk 0–100, multi-level alerts, trend analysis |
| 📱 LINE Notifications | Auto-alert on high risk, broadcast to all subscribers |
| 🎥 Video Stream | Synthetic frame generation, MJPEG real-time streaming |
| 🖥️ Dashboard | Multi-farm overview, charts, bilingual (EN/TH) |

---

## How It Works

```
Synthetic Frame Generator
        │
        ▼
  YOLOv8 Detection         ← real object detection
        │
        ▼
  Behavior Analyzer        ← movement, clustering, density
        │
        ▼
  Risk Score Calculator    ← disease risk 0–100
        │
        ▼
  LINE Alert System        ← auto-alert on high risk
        │
        ▼
  React Dashboard          ← real-time monitoring UI
```

---

## API Endpoints

```bash
# Detection & Risk
GET  /api/detection/live     # live detection + behavior + risk
GET  /api/dashboard          # all farms overview
GET  /api/risk/current       # current risk score
GET  /api/risk/trend         # risk trend (24h)

# Notifications
GET  /api/notify/subscribers # list LINE subscribers
POST /api/notify/test        # test all channels
POST /api/notify/broadcast   # broadcast to all subscribers
POST /api/notify/alert       # send manual alert

# Other
GET  /api/video_feed         # MJPEG video stream
GET  /docs                   # Swagger UI
```

---

## Project Structure

```
ChickGuard/
├── backend/
│   ├── main.py                  # FastAPI server
│   ├── behavior_analyzer.py     # Behavior analysis
│   ├── risk_calculator.py       # Risk scoring
│   ├── notification_system.py   # LINE + Email alerts
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # Dashboard, Analytics, Alerts
│   │   ├── components/          # Reusable UI components
│   │   ├── services/            # API integration
│   │   └── locales/             # EN/TH translations
│   └── package.json
│
├── docs/                        # Full documentation
└── scripts/                     # Setup & test utilities
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | FastAPI, YOLOv8, OpenCV, Python 3.12 |
| Notifications | LINE Messaging API, SMTP Email |
| Deployment | Railway (backend), Vercel (frontend) |

---

## Documentation

| Guide | Description |
|---|---|
| [Quick Start](docs/QUICKSTART.md) | Get started in 5 minutes |
| [One Health Guide](docs/ONE_HEALTH_GUIDE.md) | Full system architecture |
| [Environment Setup](docs/ENV_SETUP.md) | Configure .env variables |
| [Notifications Setup](docs/NOTIFICATION_SETUP_QUICK.md) | LINE + Email (15 min) |
| [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md) | Production deployment |
| [Contributing Guide](docs/CONTRIBUTING.md) | How to contribute |

---

## Troubleshooting

**Backend won't start:**
```bash
pip install fastapi uvicorn opencv-python-headless numpy requests python-dotenv
```

**Frontend error:**
```bash
cd frontend && rm -rf node_modules && npm install
```

**Port already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

---

<div align="center">
  <p>Made with ❤️ for Thai Farmers</p>
  <p><strong>One Health — One Future</strong> 🐔🌍</p>
</div>
