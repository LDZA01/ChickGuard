# ✅ ChickGuard Deployment Checklist

## 📋 สิ่งที่ต้องทำเพื่อให้ระบบทำงานได้เต็มรูปแบบ

---

## 1. ✅ ระบบพื้นฐาน (เสร็จแล้ว!)

- [x] **Backend API** - FastAPI + YOLOv8 ทำงานได้แล้ว
- [x] **Frontend Dashboard** - React + TypeScript พร้อมใช้งาน
- [x] **AI Detection** - YOLOv8 ตรวจจับวัตถุได้ (synthetic mode)
- [x] **Behavior Analysis** - วิเคราะห์พฤติกรรมไก่ได้แล้ว
- [x] **Risk Calculator** - คำนวณ Disease Risk Score (0-100)
- [x] **Multi-language** - รองรับ EN/TH แล้ว

---

## 2. 🔔 ระบบแจ้งเตือน (ต้องตั้งค่า)

### Option A: LINE Messaging API (แนะนำสำหรับไทย)

**สถานะ:** ⚠️ ยังไม่ได้ตั้งค่า (ทำงานใน demo mode)

**ขั้นตอน:**

1. **สมัคร LINE Developers Account**
   - ไปที่: https://developers.line.biz/console/
   - Login ด้วย LINE account
   - สร้าง Provider (ชื่อบริษัท/โปรเจกต์)

2. **สร้าง Messaging API Channel**
   - เลือก "Create a new channel"
   - เลือกประเภท: "Messaging API"
   - กรอกข้อมูล:
     - Channel name: "ChickGuard Alert"
     - Channel description: "แจ้งเตือนสุขภาพไก่"
     - Category: Business/Productivity
     - Subcategory: Other

3. **ดึง Channel Access Token**
   - ไปที่ Messaging API settings
   - Issue Channel Access Token (long-lived)
   - คัดลอก token

4. **เพิ่ม Bot เป็นเพื่อน**
   - Scan QR code ในหน้า Messaging API
   - Add bot เป็นเพื่อนใน LINE app

5. **ดึง User ID**
   - ส่งข้อความถึง bot
   - ใช้ API หรือ webhook เพื่อดึง User ID
   - หรือใช้ Line Official Account Manager

6. **ตั้งค่าใน Backend**
   ```bash
   cd backend
   # เปิดไฟล์ main.py และแก้ไขบรรทัดนี้:
   # LINE_CHANNEL_ACCESS_TOKEN = "YOUR_CHANNEL_ACCESS_TOKEN"
   # LINE_USER_ID = "YOUR_USER_ID"
   ```

**ต้นทุน:** ฟรี 500 ข้อความ/เดือน

---

### Option B: Email (สำรอง/เสริม)

**สถานะ:** ⚠️ ยังไม่ได้ตั้งค่า (ทำงานใน demo mode)

**สำหรับ Gmail:**

1. **เปิด 2-Step Verification**
   - ไปที่: https://myaccount.google.com/security
   - เปิดใช้งาน 2-Step Verification

2. **สร้าง App Password**
   - ไปที่: https://myaccount.google.com/apppasswords
   - เลือก app: "Mail"
   - เลือก device: "Other" → ตั้งชื่อ "ChickGuard"
   - คัดลอก password 16 หลัก

3. **ตั้งค่าใน Backend**
   ```bash
   cd backend
   # เปิดไฟล์ main.py และแก้ไขบรรทัดเหล่านี้:
   # SMTP_USER = "your-email@gmail.com"
   # SMTP_PASSWORD = "your-app-password-16-digits"
   # ALERT_EMAIL = "recipient@example.com"  # อีเมลที่จะรับการแจ้งเตือน
   ```

**ต้นทุน:** ฟรี (ใช้ Gmail account)

---

## 3. 🎥 กล้องจริง (ตอนนี้ใช้ synthetic mode)

**สถานะ:** ⚠️ ใช้ synthetic frames (ไม่ใช่กล้องจริง)

**เมื่อพร้อม Deploy จริง:**

### Option A: Webcam/USB Camera
```python
# แก้ไขใน backend/main.py
VIDEO_SOURCE = 0  # หรือ 1, 2 สำหรับ webcam อื่น
```

### Option B: IP Camera (RTSP)
```python
# แก้ไขใน backend/main.py
VIDEO_SOURCE = "rtsp://username:password@192.168.1.100:554/stream1"
```

### Option C: Video File (ทดสอบ)
```python
VIDEO_SOURCE = "path/to/video.mp4"
```

**ฮาร์ดแวร์แนะนำ:**
- 📹 กล้อง IP ความละเอียด 1080p ขึ้นไป
- 💡 แสงสว่างเพียงพอภายในโรงเรือน
- 🔌 ระบบไฟสำรอง (UPS)
- 🌐 Internet connection เสถียร

---

## 4. 🤖 Fine-tune AI Model (อนาคต)

**สถานะ:** ⚠️ ใช้ YOLOv8 base model (ทั่วไป)

**สำหรับความแม่นยำสูง:**

1. **เก็บข้อมูล**
   - ถ่ายวิดีโอไก่ในโรงเรือนอย่างน้อย 2-3 สัปดาห์
   - หลากหลายสภาวะ: เช้า กลางวัน เย็น
   - ทั้งไก่ปกติและไก่ป่วย (ถ้ามี)

2. **Label ข้อมูล**
   - ใช้เครื่องมือ: Roboflow, CVAT, หรือ LabelImg
   - Label ตำแหน่งไก่ในแต่ละ frame
   - อย่างน้อย 500-1000 ภาพ

3. **Train Model**
   - Fine-tune YOLOv8 ด้วย dataset ไก่
   - ใช้ GPU สำหรับ training
   - Validate ความแม่นยำ

4. **Deploy Model ใหม่**
   - แทนที่ไฟล์ `backend/yolov8n.pt`
   - Restart backend

**ประมาณการเวลา:** 1-2 สัปดาห์

---

## 5. 💾 ฐานข้อมูล (Optional - สำหรับ production)

**สถานะ:** ⚠️ ไม่มี (ข้อมูลจะหายเมื่อปิดระบบ)

**สำหรับเก็บประวัติ:**

1. **ติดตั้ง PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   
   # Start service
   brew services start postgresql
   ```

2. **สร้าง Database**
   ```bash
   createdb chickguard
   ```

3. **แก้ไข Backend**
   - เพิ่ม SQLAlchemy
   - สร้าง models สำหรับ: detections, behaviors, risks, alerts
   - บันทึกข้อมูลทุก detection

4. **Dashboard แสดงประวัติ**
   - Charts แสดง trend ย้อนหลัง
   - Export รายงาน Excel/PDF
   - Alert history

**ประมาณการเวลา:** 3-5 วัน

---

## 6. 🚀 Deployment (Production)

**สถานะ:** ⚠️ ทำงาน localhost เท่านั้น

### Option A: Cloud Deployment

**AWS/Azure/GCP:**
1. เช่า Virtual Machine (EC2, Azure VM, GCE)
2. ติดตั้ง dependencies
3. ตั้งค่า firewall/security groups
4. Deploy backend + frontend
5. ตั้งค่า domain name

**ต้นทุน:** $20-100/เดือน (ขึ้นกับ spec)

### Option B: Local Server (ในฟาร์ม)

**ฮาร์ดแวร์:**
- 💻 Mini PC / Raspberry Pi 4/5
- 🧠 NVIDIA Jetson Nano (สำหรับ AI)
- 🔌 UPS สำหรับไฟสำรอง
- 🌐 Router สำหรับ local network

**ข้อดี:**
- ไม่มีค่า subscription cloud
- ข้อมูลอยู่ในฟาร์ม
- ทำงานได้โดยไม่ต้องมี internet

**ต้นทุน:** $200-500 (ครั้งเดียว)

---

## 7. 📱 Mobile App (Future)

**สถานะ:** ❌ ยังไม่มี (ใช้ web browser)

**แผนอนาคต:**
- React Native app (iOS + Android)
- Push notifications แบบ native
- Offline mode
- Camera integration

**ประมาณการเวลา:** 1-2 เดือน

---

## 📊 สรุป Priority

### 🔴 High Priority (ทำก่อน)
1. ✅ **ระบบพื้นฐาน** - เสร็จแล้ว!
2. ⚠️ **ตั้งค่าการแจ้งเตือน** - LINE หรือ Email (1-2 ชั่วโมง)
3. ⚠️ **เชื่อมต่อกล้องจริง** - ถ้าพร้อม deploy (30 นาที)

### 🟡 Medium Priority (ทำได้ทีหลัง)
4. ⚠️ **Fine-tune AI Model** - เพิ่มความแม่นยำ (1-2 สัปดาห์)
5. ⚠️ **เพิ่ม Database** - เก็บประวัติ (3-5 วัน)

### 🟢 Low Priority (Future)
6. ⚠️ **Deploy Production** - Cloud/Local server
7. ❌ **Mobile App** - สำหรับอนาคต

---

## 🎯 Quick Start สำหรับทดสอบ

ระบบพร้อมใช้งานในโหมด Demo แล้ววันนี้!

```bash
# Terminal 1: Start Backend
cd backend
python main.py

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

เปิดเบราว์เซอร์: http://localhost:3001

**ทดสอบได้:**
- ✅ Dashboard แสดงข้อมูล real-time
- ✅ AI detection (synthetic mode)
- ✅ Behavior analysis
- ✅ Risk score calculation
- ✅ Alert system (demo mode)

**ยังไม่ได้:**
- ⚠️ แจ้งเตือนไป LINE/Email จริง (ต้องตั้งค่า)
- ⚠️ กล้องจริง (ใช้ synthetic)
- ⚠️ เก็บประวัติ (ไม่มี database)

---

## 📞 Support

- 📚 ดูเอกสารเพิ่มเติม: **ONE_HEALTH_GUIDE.md**
- 🐛 พบปัญหา: เช็ค Troubleshooting section
- 💡 ถาม: Open issue on GitHub

---

## 🎉 สรุป

### ระบบทำงานได้แล้ว:
- ✅ Backend API (8000)
- ✅ Frontend Dashboard (3001)
- ✅ AI Detection + Behavior + Risk
- ✅ Alert System (demo mode)

### ต้องทำเพิ่มเติม:
1. **ตั้งค่า LINE/Email** (1-2 ชั่วโมง) → แจ้งเตือนได้จริง
2. **เชื่อมกล้อง** (30 นาที) → ใช้งานจริงในฟาร์ม
3. **Fine-tune Model** (ถ้าต้องการความแม่นยำสูง)

**สามารถใช้งาน Demo ได้เลยวันนี้! 🚀**

---

<div align="center">
  <p><strong>One Health - One Future</strong> 🐔🌍</p>
</div>
