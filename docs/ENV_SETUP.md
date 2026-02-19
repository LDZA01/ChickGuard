# 🔧 การตั้งค่า Environment Variables

## 📝 Quick Setup

### 1. สร้างไฟล์ .env

```bash
# คัดลอกจาก template
cp .env.example .env

# แก้ไขด้วย editor ที่ชอบ
nano .env
# หรือ
code .env
```

### 2. กรอกค่าต่างๆ

เปิดไฟล์ `.env` แล้วกรอกค่าต่อไปนี้:

```bash
# ==================== LINE Messaging API ====================
LINE_CHANNEL_ACCESS_TOKEN=YOUR_TOKEN_HERE
LINE_USER_ID=YOUR_USER_ID_HERE

# ==================== Email Configuration ====================
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-16-digits
ALERT_EMAIL=recipient@example.com

# ==================== System Configuration ====================
VIDEO_SOURCE=synthetic
```

### 3. Restart Backend

```bash
cd backend
python main.py
```

---

## 📋 ตัวแปรทั้งหมด

### LINE Messaging API (Optional)
- `LINE_CHANNEL_ACCESS_TOKEN` - Channel Access Token จาก LINE Developers Console
- `LINE_USER_ID` - User ID ของผู้ที่จะรับการแจ้งเตือน

**วิธีรับ:**
1. ไปที่: https://developers.line.biz/console/
2. สร้าง Messaging API Channel
3. Issue Channel Access Token
4. Add bot เป็นเพื่อนและดึง User ID

📚 **คู่มือเต็ม:** ดูใน `NOTIFICATION_SETUP_QUICK.md`

---

### Email Notification (Optional)
- `SMTP_SERVER` - SMTP server (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 587)
- `SMTP_USER` - อีเมลผู้ส่ง (Gmail)
- `SMTP_PASSWORD` - App Password (ไม่ใช่รหัส Gmail ปกติ!)
- `ALERT_EMAIL` - อีเมลผู้รับการแจ้งเตือน

**วิธีรับ Gmail App Password:**
1. เปิด 2-Step Verification: https://myaccount.google.com/security
2. สร้าง App Password: https://myaccount.google.com/apppasswords
3. คัดลอก password 16 หลัก

📚 **คู่มือเต็ม:** ดูใน `NOTIFICATION_SETUP_QUICK.md`

---

### System Configuration
- `VIDEO_SOURCE` - แหล่งวิดีโอ
  - `synthetic` - สร้างเฟรมจำลอง (สำหรับทดสอบ)
  - `0` - Webcam แรก
  - `1` - Webcam ที่สอง
  - `rtsp://...` - IP Camera (RTSP stream)
  
- `YOLO_MODEL_PATH` - path ไปยังโมเดล YOLOv8 (default: yolov8n.pt)
- `CONFIDENCE_THRESHOLD` - threshold สำหรับ detection (default: 0.5)
- `PROCESS_FPS` - FPS สำหรับ processing (default: 5)

### Alert Settings
- `ALERT_COOLDOWN_MINUTES` - ระยะห่างระหว่างการแจ้งเตือน (default: 15 นาที)
- `MEDIUM_RISK_THRESHOLD` - คะแนนความเสี่ยงระดับกลาง (default: 40)
- `HIGH_RISK_THRESHOLD` - คะแนนความเสี่ยงสูง (default: 70)

### Server Settings
- `HOST` - host address (default: 0.0.0.0)
- `PORT` - port number (default: 8000)

---

## ✅ ตรวจสอบการตั้งค่า

### วิธีที่ 1: ดูตอน start backend

```bash
cd backend
python main.py
```

ควรเห็น:
```
✅ LINE Messaging API enabled
✅ Email notification enabled
📢 Notification Manager: 2/2 channels enabled
```

### วิธีที่ 2: เช็คผ่าน API

```bash
curl http://localhost:8000/api/notifications/status
```

---

## 🔒 Security

### ⚠️ สำคัญมาก!

1. **อย่า commit ไฟล์ .env ขึ้น git!**
   - ไฟล์ `.env` อยู่ใน `.gitignore` แล้ว
   - เช็คก่อน commit: `git status`

2. **ใช้เฉพาะ App Password สำหรับ Email**
   - ไม่ใช้รหัส Gmail จริง
   - สามารถ revoke ได้ตลอดเวลา

3. **เก็บ LINE Token ให้ดี**
   - อย่าแชร์ให้ใคร
   - Regenerate ถ้ารั่วไหล

---

## 📖 ตัวอย่างไฟล์ .env ที่กรอกแล้ว

```bash
# ==================== LINE Messaging API ====================
LINE_CHANNEL_ACCESS_TOKEN=UX1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ==
LINE_USER_ID=U1234567890abcdefghijklmnopqrstuv

# ==================== Email Configuration ====================
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=myfarm@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
ALERT_EMAIL=owner@farm.com

# ==================== System Configuration ====================
VIDEO_SOURCE=synthetic
YOLO_MODEL_PATH=yolov8n.pt
CONFIDENCE_THRESHOLD=0.5
PROCESS_FPS=5

# ==================== Alert Settings ====================
ALERT_COOLDOWN_MINUTES=15
MEDIUM_RISK_THRESHOLD=40
HIGH_RISK_THRESHOLD=70

# ==================== Server Settings ====================
HOST=0.0.0.0
PORT=8000
```

---

## 🧪 ทดสอบ

### ทดสอบทั้งหมด:
```bash
curl -X POST http://localhost:8000/api/alert/test
```

### ทดสอบเฉพาะช่องทาง:
```bash
curl -X POST http://localhost:8000/api/notifications/test-all
```

---

## ❓ Troubleshooting

### ❌ "ModuleNotFoundError: No module named 'dotenv'"
```bash
pip install python-dotenv
```

### ⚠️ ตั้งค่าแล้วแต่ยังเป็น demo mode

1. เช็คว่าไฟล์ `.env` อยู่ที่ root ของโปรเจกต์
   ```bash
   ls -la .env
   ```

2. เช็คว่ามีค่าในไฟล์หรือไม่
   ```bash
   cat .env
   ```

3. Restart backend
   ```bash
   cd backend
   python main.py
   ```

### 🔍 เช็คว่า backend อ่านค่า .env ได้หรือไม่

```python
# ทดสอบใน Python
import os
from dotenv import load_dotenv
from pathlib import Path

root_dir = Path.cwd()
env_path = root_dir / '.env'
load_dotenv(dotenv_path=env_path)

print(f"LINE Token: {os.getenv('LINE_CHANNEL_ACCESS_TOKEN')}")
print(f"Email User: {os.getenv('SMTP_USER')}")
```

---

## 📚 เอกสารเพิ่มเติม

- **NOTIFICATION_SETUP_QUICK.md** - คู่มือตั้งค่าการแจ้งเตือนแบบละเอียด
- **DEPLOYMENT_CHECKLIST.md** - Checklist สำหรับ deployment
- **ONE_HEALTH_GUIDE.md** - คู่มือระบบ One Health ฉบับเต็ม

---

<div align="center">
  <p>🔒 เก็บรักษา .env ให้ปลอดภัย!</p>
  <p><strong>One Health - One Future</strong> 🐔🌍</p>
</div>
