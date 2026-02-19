# 🐔 ChickGuard

**AI-Powered Chicken Health Monitoring System**  
**Based on One Health Principles**

<div align="center">
  <img src="https://img.shields.io/badge/AI-YOLOv8-blue?style=for-the-badge" alt="YOLOv8">
  <img src="https://img.shields.io/badge/React----

## 📚 Documentation

### 🚀 Getting Started
- 📖 **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in 5 minutes
- 🤖 **[Auto Setup Script](scripts/setup.sh)** - One-command installation
  ```bash
  bash scripts/setup.sh
  ```

### 📘 System Documentation
- 🏥 **[One Health Guide](docs/ONE_HEALTH_GUIDE.md)** - Complete system architecture
- 📊 **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Code organization
- 📁 **[docs/](docs/)** - All documentation

### ⚙️ Configuration Guides
- 🔐 **[Environment Setup](docs/ENV_SETUP.md)** - Configure .env file
- 📱 **[Notifications Setup](docs/NOTIFICATION_SETUP_QUICK.md)** - LINE + Email (15 min)
- 🚀 **[Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)** - Production deployment

### 🛠️ Development Tools
- 🧪 **[Test Environment](scripts/test_env.py)** - Verify .env configuration
  ```bash
  python3 scripts/test_env.py
  ```
- 📱 **[Test LINE](scripts/test_line.py)** - Test LINE notifications
  ```bash
  python3 scripts/test_line.py
  ```

### 👥 For Developers
- 🤝 **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute
- 🔗 **[API Documentation](http://localhost:8000/docs)** - Swagger UI (when running)for-the-badge" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-Latest-orange?style=for-the-badge" alt="FastAPI">
  <img src="https://img.shields.io/badge/LINE-Notify-00B900?style=for-the-badge" alt="LINE">
</div>

---

## 🌟 One Health Concept

**เมื่อสุขภาพสัตว์สั่นคลอน มนุษย์และสิ่งแวดล้อมก็ได้รับผลกระทบ**

ChickGuard ใช้ AI ตรวจจับสัญญาณเตือนต้นของโรคระบาดในไก่  
**ก่อน**ที่จะลุกลามทั้งโรงเรือน

### 🤖 ChickGuard ทำอะไร?

```
กล้อง 24 ชม. → AI วิเคราะห์พฤติกรรม → Disease Risk Score → � แจ้งเตือน LINE
```

**AI สามารถตรวจจับสัญญาณเล็กๆ ที่สายตามนุษย์มองไม่เห็น:**
- 🐔 การเคลื่อนไหวลดลง
- 👥 การกระจุกตัวแน่นผิดปกติ  
- 🍚 การกินอาหารเปลี่ยนไป

จากนั้นระบบจะคำนวณเป็น **Disease Risk Score (0-100)**  
หากความเสี่ยงสูง → **📱 แจ้งเตือนทันทีผ่าน LINE**

---

## �🚀 Quick Start

### 1️⃣ Backend (AI + Behavior Analysis)
```bash
# ติดตั้ง dependencies
cd backend
pip install -r requirements.txt

# ตั้งค่า environment variables
cd ..
cp .env.example .env
nano .env  # แก้ไขตามต้องการ

# รัน backend
cd backend
python main.py
```

**รัน:** http://localhost:8000
- API Docs: http://localhost:8000/docs
- Risk Score: http://localhost:8000/api/risk/current
- Video Feed: http://localhost:8000/api/video_feed

### 2️⃣ Frontend (Dashboard)
```bash
cd frontend
npm install
npm run dev
```

**เปิด:** http://localhost:3001

### 3️⃣ Configuration (Optional - สำหรับการแจ้งเตือน)

แก้ไขไฟล์ `.env` ที่ root:
```bash
LINE_CHANNEL_ACCESS_TOKEN=your_token_here
LINE_USER_ID=your_user_id_here
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALERT_EMAIL=recipient@example.com
```

📚 **คู่มือละเอียด:** ดู `ENV_SETUP.md` และ `NOTIFICATION_SETUP_QUICK.md`

---

## ✨ Features

### 🤖 Real AI Detection (YOLOv8)
- ✅ Real-time object detection
- ✅ 80 COCO classes
- ✅ Bounding boxes + confidence scores
- ✅ 5 FPS processing
- ✅ **No webcam needed!** (uses synthetic frames)

### 🧠 Behavior Analysis (NEW!)
- ✅ Movement tracking
- ✅ Clustering detection
- ✅ Density monitoring
- ✅ Activity level analysis
- ✅ Anomaly detection

### 📊 Disease Risk Score (NEW!)
- ✅ Real-time risk calculation (0-100)
- ✅ Multiple risk levels (Low/Medium/High)
- ✅ Anomaly-based scoring
- ✅ Actionable recommendations
- ✅ Trend analysis

### 📱 LINE Notifications (NEW!)
- ✅ Auto-alert on high risk
- ✅ Thai language messages
- ✅ Detailed anomaly reports
- ✅ Actionable recommendations
- ✅ Daily summary reports

### 🎥 Video System
- ✅ Synthetic frame generation
- ✅ Moving objects simulation
- ✅ Real-time streaming (MJPEG)
- ✅ Annotated video feed

### 📊 Dashboard
- ✅ Real-time risk monitoring
- ✅ Behavior visualization
- ✅ Object counting
- ✅ Activity tracking
- ✅ Interactive charts
- ✅ Bilingual (EN/TH)

---

## 🎯 How It Works

```
┌─────────────────┐
│ Synthetic Frame │  ← Generates realistic video frames
│   Generator     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  YOLOv8 AI      │  ← Real object detection
│  Detection      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Behavior        │  ← Movement, clustering, density
│ Analysis        │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Risk Score      │  ← Disease Risk Calculator
│ Calculator      │     (0-100 score)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ LINE Notify     │  ← Auto-alert on high risk
│ Alert System    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ React Dashboard │  ← Beautiful real-time UI
└─────────────────┘
```

---

## 📦 Project Structure

```
ChickGuard/
├── frontend/              # React + TypeScript Dashboard
│   ├── src/
│   │   ├── pages/        # Dashboard, Analytics, Alerts
│   │   ├── components/   # Reusable UI components
│   │   ├── services/     # API integration
│   │   └── locales/      # EN/TH translations
│   └── package.json
│
├── backend/              # FastAPI + YOLOv8 + AI
│   ├── main.py          # Main server
│   ├── behavior_analyzer.py    # Behavior analysis
│   ├── risk_calculator.py      # Risk score
│   ├── notification_system.py  # Alerts (LINE + Email)
│   └── requirements.txt
│
├── README.md            # Quick start (this file)
└── ONE_HEALTH_GUIDE.md  # Complete documentation
```

---

## 🛠️ Technology Stack

**Frontend:** React 18 • TypeScript • Vite • Tailwind CSS • Chart.js  
**Backend:** FastAPI • YOLOv8 • OpenCV • PyTorch  
**Notifications:** LINE Messaging API • Email (SMTP)  
**AI:** Behavior Analysis • Risk Score Calculator • Real-time Detection

---

## 📚 Documentation

- **README.md** (this file) - Quick start & overview
- **ONE_HEALTH_GUIDE.md** - Complete guide with:
  - Disease Risk Score details
  - Notification setup (LINE + Email)
  - API documentation
  - Troubleshooting

---

## 🎮 API Endpoints

### Detection & Risk
```bash
GET  /api/detection/live    # Real-time detection + behavior + risk
GET  /api/dashboard          # Dashboard overview
GET  /api/risk/current       # Current risk score
GET  /api/risk/trend         # Risk trend (1 hour)
GET  /api/behavior/summary   # Behavior analysis summary
```

### Notifications
```bash
GET  /api/notifications/status      # Check channels status
POST /api/notifications/test-all    # Test all channels
POST /api/alert/test                # Send test alert
```

### Video
```bash
GET  /api/video_feed        # MJPEG video stream
GET  /docs                  # Swagger API docs
```

---

## 🐛 Troubleshooting

**Backend won't start:**
```bash
pip install ultralytics opencv-python fastapi uvicorn torch numpy requests
```

**Frontend error:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```


---

## � Documentation

### Quick Links
- 📖 **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- 📘 **[One Health Guide](ONE_HEALTH_GUIDE.md)** - Complete system documentation
- � **[docs/](docs/)** - All documentation

### Setup Guides
- � **[Environment Variables](docs/ENV_SETUP.md)** - Configure .env file
- 📱 **[Notifications Setup](docs/NOTIFICATION_SETUP_QUICK.md)** - LINE + Email (15 min)
- � **[Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)** - Production deployment

### For Developers
- 🤝 **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- 🔗 **[API Documentation](http://localhost:8000/docs)** - Swagger UI (when running)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

---

<div align="center">
  <p>Made with ❤️ for Thai Farmers</p>
  <p><strong>One Health - One Future</strong> 🐔🌍</p>
  <p>
    <a href="https://github.com/LDZA01/ChickGuard">GitHub</a> •
    <a href="docs/">Documentation</a> •
    <a href="docs/CONTRIBUTING.md">Contributing</a>
  </p>
</div>
