# 📚 ChickGuard Documentation

Welcome to ChickGuard documentation! This folder contains detailed guides and setup instructions.

## 📖 Documentation Structure

### 🚀 Getting Started
- **[Quick Start Guide](QUICKSTART.md)** - Start here! 5-minute setup
- **[Auto Setup Script](../scripts/setup.sh)** - One-command installation
- **[Project Overview](../README.md)** - Main README

### ⚙️ Setup Guides
- **[Environment Variables](ENV_SETUP.md)** - Configure .env file
- **[Notification Setup](NOTIFICATION_SETUP_QUICK.md)** - LINE + Email (15 min)
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Production deployment

### 📘 Technical Documentation
- **[One Health System Guide](ONE_HEALTH_GUIDE.md)** - Complete system architecture
  - Disease Risk Score algorithm
  - Behavior analysis details
  - API documentation
  - Data flow diagrams
- **[Project Structure](PROJECT_STRUCTURE.md)** - Code organization
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute

### 🛠️ Utility Scripts
- **[Scripts Documentation](../scripts/README.md)** - Testing and setup tools
- **[test_env.py](../scripts/test_env.py)** - Verify environment config
- **[test_line.py](../scripts/test_line.py)** - Test LINE notifications

---

## 🚀 Recommended Reading Order

### For Users:
1. [Quick Start Guide](QUICKSTART.md) ⭐
2. [Environment Variables Setup](ENV_SETUP.md)
3. [Notification Setup](NOTIFICATION_SETUP_QUICK.md)

### For Developers:
1. [Quick Start Guide](QUICKSTART.md)
2. [One Health System Guide](ONE_HEALTH_GUIDE.md) 📘
3. [Project Structure](PROJECT_STRUCTURE.md)
4. [Contributing Guide](CONTRIBUTING.md)

### For System Administrators:
1. [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) ✅
2. [Environment Variables Setup](ENV_SETUP.md)
3. [Notification Setup](NOTIFICATION_SETUP_QUICK.md)

---

## 🔗 Quick Links

### Live System
- [Backend API Docs](http://localhost:8000/docs) - Swagger UI (interactive)
- [Frontend Dashboard](http://localhost:3001) - React app
- [Video Feed](http://localhost:8000/api/video_feed) - MJPEG stream

### External Resources
- [GitHub Repository](https://github.com/LDZA01/ChickGuard)
- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

---

## 📋 Document Index

| Document | Purpose | Time Required |
|----------|---------|---------------|
| [QUICKSTART.md](QUICKSTART.md) | Get started quickly | 5 min |
| [ENV_SETUP.md](ENV_SETUP.md) | Configure environment | 10 min |
| [NOTIFICATION_SETUP_QUICK.md](NOTIFICATION_SETUP_QUICK.md) | Setup LINE + Email | 15 min |
| [ONE_HEALTH_GUIDE.md](ONE_HEALTH_GUIDE.md) | Technical deep dive | 30 min |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Code organization | 10 min |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Production deploy | 60 min |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide | 15 min |

---

## 🆘 Need Help?

### Common Issues

**Backend won't start:**
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Check Python version (need 3.8+)
python3 --version
```

**Frontend error:**
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**LINE notification not working:**
```bash
# Test configuration
python3 scripts/test_env.py
python3 scripts/test_line.py

# See detailed guide
cat docs/NOTIFICATION_SETUP_QUICK.md
```

### Getting Support

1. Check [Troubleshooting section](ONE_HEALTH_GUIDE.md#troubleshooting) in One Health Guide
2. Review [Common Issues](#common-issues) above
3. Search [GitHub Issues](https://github.com/LDZA01/ChickGuard/issues)
4. Open a new issue with detailed error logs

---

<div align="center">
  <p>📚 Complete Documentation for ChickGuard</p>
  <p><a href="../README.md">← Back to Main README</a></p>
</div>

---

## 📝 Additional Resources

### External Documentation:
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/)
- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

### Support:
- Open an issue on GitHub
- Check [Troubleshooting](../ONE_HEALTH_GUIDE.md#troubleshooting) section

---

<div align="center">
  <p><strong>One Health - One Future</strong> 🐔🌍</p>
</div>
