# ChickGuard Project Structure

```
ChickGuard/
├── 📄 README.md                      # Project overview & quick start
├── 📄 QUICKSTART.md                  # 5-minute setup guide
├── 📄 ONE_HEALTH_GUIDE.md            # Complete technical documentation
├── 📄 CONTRIBUTING.md                # Contribution guidelines
├── 📄 .env.example                   # Environment variables template
├── 📄 .gitignore                     # Git ignore rules
├── 📄 .gitattributes                 # Git line endings configuration
│
├── 📁 docs/                          # Documentation folder
│   ├── README.md                     # Documentation index
│   ├── ENV_SETUP.md                  # Environment setup guide
│   ├── NOTIFICATION_SETUP_QUICK.md   # Notification configuration (15 min)
│   └── DEPLOYMENT_CHECKLIST.md       # Production deployment checklist
│
├── 📁 backend/                       # Python backend (FastAPI + AI)
│   ├── main.py                       # Main server + API endpoints
│   ├── behavior_analyzer.py          # Behavior analysis engine
│   ├── risk_calculator.py            # Disease risk score calculator
│   ├── notification_system.py        # Multi-channel notifications
│   ├── requirements.txt              # Python dependencies
│   └── yolov8n.pt                    # YOLOv8 model weights
│
├── 📁 frontend/                      # React frontend (TypeScript)
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Node dependencies
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   │
│   ├── 📁 public/                    # Static assets
│   │   └── chicken-icon.svg          # Logo icon
│   │
│   └── 📁 src/                       # Source code
│       ├── main.tsx                  # React entry point
│       ├── App.tsx                   # Main App component
│       ├── index.css                 # Global styles
│       ├── vite-env.d.ts             # Vite type definitions
│       │
│       ├── 📁 pages/                 # Page components
│       │   ├── Dashboard.tsx         # Main dashboard
│       │   ├── Analytics.tsx         # Analytics page
│       │   ├── Alerts.tsx            # Alerts page
│       │   ├── Settings.tsx          # Settings page
│       │   ├── FarmDetail.tsx        # Farm detail page
│       │   └── BackendStatus.tsx     # Backend status (testing)
│       │
│       ├── 📁 components/            # Reusable components
│       │   ├── Layout.tsx            # Layout wrapper
│       │   ├── StatCard.tsx          # Statistic card
│       │   ├── AlertCard.tsx         # Alert card
│       │   ├── HeatmapCanvas.tsx     # Heatmap visualization
│       │   └── LanguageSwitcher.tsx  # Language toggle
│       │
│       ├── 📁 contexts/              # React contexts
│       │   └── LanguageContext.tsx   # i18n context
│       │
│       ├── 📁 services/              # API services
│       │   └── api.ts                # Backend API client
│       │
│       ├── 📁 types/                 # TypeScript types
│       │   └── index.ts              # Type definitions
│       │
│       ├── 📁 locales/               # Translations
│       │   ├── en.ts                 # English
│       │   └── th.ts                 # Thai
│       │
│       └── 📁 utils/                 # Utilities
│           └── mockData.ts           # Mock data generator
│
└── 📁 scripts/                       # Utility scripts
    └── (testing scripts when needed)
```

## 📊 File Count Summary

- **Root Files:** 7 files
- **Documentation:** 4 files (in docs/)
- **Backend:** 6 Python files + 1 model
- **Frontend:** 44+ files (excluding node_modules)
- **Total:** ~60+ core files (clean & organized)

## 🎯 Key Features by Location

### Backend (backend/)
- ✅ YOLOv8 AI Detection
- ✅ Behavior Analysis (movement, clustering, density)
- ✅ Risk Score Calculator (0-100)
- ✅ Multi-channel Notifications (LINE + Email)
- ✅ RESTful API (FastAPI)
- ✅ Synthetic video mode (no camera needed)

### Frontend (frontend/src/)
- ✅ Real-time Dashboard
- ✅ Analytics & Visualizations
- ✅ Alert Management
- ✅ Bilingual (EN/TH)
- ✅ Responsive Design
- ✅ Backend Integration

### Documentation (docs/)
- ✅ Environment Setup Guide
- ✅ Notification Configuration
- ✅ Deployment Checklist
- ✅ API Documentation
- ✅ Troubleshooting

## 🔄 Data Flow

```
Video Input → YOLOv8 → Behavior Analysis → Risk Calculator → Notification
                                                    ↓
                                              Frontend API
                                                    ↓
                                               Dashboard
```

## 📦 Dependencies

### Backend
- ultralytics (YOLOv8)
- opencv-python
- fastapi
- uvicorn
- torch
- numpy
- requests
- python-dotenv

### Frontend
- react
- typescript
- vite
- tailwindcss
- chart.js
- react-router-dom

## 🚀 Getting Started

See [QUICKSTART.md](../QUICKSTART.md) or [README.md](../README.md)

---

<div align="center">
  <p><strong>One Health - One Future</strong> 🐔🌍</p>
</div>
