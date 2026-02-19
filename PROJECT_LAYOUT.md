# 📁 ChickGuard Project Structure

```
ChickGuard/
├── 📄 README.md                    # Main project overview
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .gitattributes               # Git attributes
│
├── 📁 docs/                        # 📚 Documentation
│   ├── README.md                   # Documentation index
│   ├── QUICKSTART.md               # 5-minute quick start
│   ├── ONE_HEALTH_GUIDE.md         # Complete technical guide
│   ├── PROJECT_STRUCTURE.md        # Code organization
│   ├── CONTRIBUTING.md             # Contribution guidelines
│   ├── ENV_SETUP.md                # Environment configuration
│   ├── NOTIFICATION_SETUP_QUICK.md # LINE + Email setup
│   └── DEPLOYMENT_CHECKLIST.md     # Production deployment
│
├── 📁 scripts/                     # 🛠️ Utility Scripts
│   ├── README.md                   # Scripts documentation
│   ├── setup.sh                    # Auto installation script
│   ├── test_env.py                 # Test .env configuration
│   └── test_line.py                # Test LINE notifications
│
├── 📁 backend/                     # 🐍 Python Backend
│   ├── main.py                     # FastAPI server + orchestration
│   ├── behavior_analyzer.py        # Behavior analysis module
│   ├── risk_calculator.py          # Disease risk scoring
│   ├── notification_system.py      # LINE + Email notifications
│   ├── requirements.txt            # Python dependencies
│   └── yolov8n.pt                  # YOLOv8 model weights
│
└── 📁 frontend/                    # ⚛️ React Frontend
    ├── package.json                # Node dependencies
    ├── vite.config.ts              # Vite configuration
    ├── tsconfig.json               # TypeScript config
    ├── tailwind.config.js          # Tailwind CSS config
    ├── index.html                  # HTML entry point
    │
    ├── 📁 public/                  # Static assets
    │   └── chicken-icon.svg
    │
    └── 📁 src/                     # Source code
        ├── main.tsx                # React entry point
        ├── App.tsx                 # Main app component
        ├── index.css               # Global styles
        │
        ├── 📁 pages/               # Page components
        │   ├── Dashboard.tsx       # Main dashboard
        │   ├── Analytics.tsx       # Analytics page
        │   ├── Alerts.tsx          # Alerts history
        │   ├── Settings.tsx        # Settings page
        │   ├── FarmDetail.tsx      # Farm details
        │   └── BackendStatus.tsx   # Backend status
        │
        ├── 📁 components/          # Reusable components
        │   ├── Layout.tsx          # Main layout
        │   ├── StatCard.tsx        # Stat display card
        │   ├── AlertCard.tsx       # Alert card
        │   ├── HeatmapCanvas.tsx   # Density heatmap
        │   └── LanguageSwitcher.tsx # Language toggle
        │
        ├── 📁 contexts/            # React contexts
        │   └── LanguageContext.tsx # i18n context
        │
        ├── 📁 locales/             # i18n translations
        │   ├── th.ts               # Thai translations
        │   └── en.ts               # English translations
        │
        ├── 📁 services/            # API services
        │   └── api.ts              # Backend API client
        │
        ├── 📁 types/               # TypeScript types
        │   └── index.ts            # Type definitions
        │
        └── 📁 utils/               # Utilities
            └── mockData.ts         # Mock data generator
```

---

## 📊 File Statistics

| Category | Files | Purpose |
|----------|-------|---------|
| **Documentation** | 8 | Guides and setup instructions |
| **Scripts** | 3 | Installation and testing |
| **Backend** | 6 | AI + API + Notifications |
| **Frontend** | 29 | React dashboard |
| **Config** | 8 | Project configuration |
| **Total** | ~54 | Complete system |

---

## 🎯 Key Features by Location

### Backend (`backend/`)
- 🤖 **AI Detection**: YOLOv8 object detection
- 🧠 **Behavior Analysis**: Movement, clustering, density
- 📊 **Risk Calculator**: Disease risk scoring (0-100)
- 📱 **Notifications**: LINE Messaging API + Email
- 🎬 **Video Processing**: Real-time + synthetic frames
- 🔌 **FastAPI**: RESTful API endpoints

### Frontend (`frontend/src/`)
- 📱 **Dashboard**: Real-time monitoring
- 📊 **Charts**: Risk trends, behavior analysis
- 🗺️ **Heatmap**: Density visualization
- 🔔 **Alerts**: Alert management
- 🌐 **i18n**: Thai + English support
- 🎨 **UI**: Tailwind CSS + responsive

### Documentation (`docs/`)
- 🚀 **Quick Start**: 5-minute setup
- 🏥 **One Health**: Complete technical guide
- ⚙️ **Configuration**: .env + notifications
- 📦 **Deployment**: Production checklist
- 🤝 **Contributing**: Development guide

### Scripts (`scripts/`)
- 🛠️ **Auto Setup**: One-command installation
- 🧪 **Testing**: Environment + LINE validation
- 📋 **Documentation**: Usage instructions

---

## 🔄 Data Flow

```
┌─────────────┐
│   Camera    │ or Synthetic Video
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  YOLOv8 Model   │ ← backend/main.py
│  (Detection)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Behavior Analyzer   │ ← backend/behavior_analyzer.py
│ - Movement          │
│ - Clustering        │
│ - Density           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Risk Calculator    │ ← backend/risk_calculator.py
│  Score: 0-100       │
└──────────┬──────────┘
           │
           ├─────────────────┐
           │                 │
           ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│  Notifications   │  │   Frontend API   │
│  - LINE          │  │   - Dashboard    │
│  - Email         │  │   - Charts       │
└──────────────────┘  └──────────────────┘
```

---

## 🚀 Quick Commands

### Setup
```bash
# Auto installation
bash scripts/setup.sh

# Test configuration
python3 scripts/test_env.py
python3 scripts/test_line.py
```

### Run
```bash
# Backend (Terminal 1)
cd backend
python main.py

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Access
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📖 More Information

- **[Main README](../README.md)** - Project overview
- **[Documentation](docs/README.md)** - All guides
- **[Quick Start](docs/QUICKSTART.md)** - Get started in 5 minutes

---

<div align="center">
  <p>📁 Clean and organized project structure</p>
  <p><strong>Easy to navigate • Well documented • Production ready</strong></p>
</div>
