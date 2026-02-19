# 🛠️ ChickGuard Scripts

Utility scripts สำหรับการติดตั้งและทดสอบระบบ

---

## 📋 Scripts

### 🚀 setup.sh - Auto Installation

ติดตั้งระบบอัตโนมัติ (Backend + Frontend)

```bash
bash scripts/setup.sh
```

**Features:**
- ✅ ตรวจสอบ Python และ Node.js
- ✅ สร้าง Python virtual environment
- ✅ ติดตั้ง dependencies ทั้งหมด
- ✅ สร้างไฟล์ .env จาก template

---

### 🔍 test_env.py - Test Environment Configuration

ตรวจสอบว่า `.env` ตั้งค่าครบถ้วนหรือไม่

```bash
python3 scripts/test_env.py
```

**Output:**
```
🔍 ChickGuard Environment Configuration Test
==============================================================
📋 LINE Notification
--------------------------------------------------------------
  ✅ LINE_CHANNEL_ACCESS_TOKEN: eyJhbGciOiJ...
  ✅ LINE_USER_ID: U86faff353173242936519364f46ae8eb

📋 Email Notification
--------------------------------------------------------------
  ❌ SMTP_HOST: Not set
  ❌ SMTP_PORT: Not set
  ...

📋 System Settings
--------------------------------------------------------------
  ✅ CONFIDENCE_THRESHOLD: 0.5
  ✅ VIDEO_FPS: 5
  ...
==============================================================
```

---

### 📱 test_line.py - Test LINE Notification

ทดสอบการส่งข้อความผ่าน LINE Messaging API

```bash
python3 scripts/test_line.py
```

**Output:**
```
📱 LINE Messaging API Test
==============================================================
✅ Access Token: eyJhbGciOiJIUzI1NiI...
✅ User ID: U86faff353173242936519364f46ae8eb

📤 Sending test message...
✅ Message sent successfully!
📱 Check your LINE app to see the message

==============================================================
🎉 LINE Notification is working!
==============================================================
```

คุณจะได้รับข้อความใน LINE app:
```
🧪 ChickGuard LINE Test

✅ LINE Messaging API is working!
⏰ 2024-02-19 16:30:45

This is a test message from ChickGuard.
If you receive this, your LINE notification 
is configured correctly! 🎉
```

---

## 🔄 Workflow

### การติดตั้งครั้งแรก:

```bash
# 1. Auto setup
bash scripts/setup.sh

# 2. แก้ไข .env
nano .env

# 3. ทดสอบการตั้งค่า
python3 scripts/test_env.py

# 4. ทดสอบ LINE notification
python3 scripts/test_line.py

# 5. รันระบบ
cd backend && python main.py  # Terminal 1
cd frontend && npm run dev     # Terminal 2
```

---

## 📖 Documentation

- [Environment Setup Guide](../docs/ENV_SETUP.md)
- [Notification Setup Guide](../docs/NOTIFICATION_SETUP_QUICK.md)
- [Quick Start](../docs/QUICKSTART.md)

---

## 💡 Tips

### ถ้า test_env.py ขึ้นสีแดง (❌):
```bash
# แก้ไขไฟล์ .env
nano .env

# เพิ่มค่าที่ขาดหาย
LINE_CHANNEL_ACCESS_TOKEN="your-token-here"
LINE_USER_ID="your-user-id-here"
```

### ถ้า test_line.py ส่งไม่ได้:
1. เช็ค Access Token ถูกต้องหรือไม่
2. เช็ค User ID ถูกต้องหรือไม่
3. ดู [Notification Setup Guide](../docs/NOTIFICATION_SETUP_QUICK.md)

### ถ้าต้องการแก้ไข scripts:
```bash
# Scripts เป็น Python ธรรมดา สามารถแก้ไขได้เลย
nano scripts/test_env.py

# ถ้าเป็น .sh ต้องให้สิทธิ์ execute
chmod +x scripts/setup.sh
```

---

<div align="center">
  <p>🛠️ Utility Scripts for ChickGuard</p>
  <p><a href="../README.md">← Back to Main README</a></p>
</div>
