# 🔔 คู่มือตั้งค่าการแจ้งเตือน ChickGuard

## เลือกช่องทางการแจ้งเตือน

- **Option A: LINE Messaging API** ⭐ แนะนำสำหรับไทย
- **Option B: Email (Gmail)** 📧 สำรอง/เสริม

---

## 📱 Option A: LINE Messaging API (แนะนำ)

### ข้อดี:
- ✅ ฟรี 500 ข้อความ/เดือน
- ✅ แจ้งเตือนได้ทันที (push notification)
- ✅ รูปแบบข้อความสวยงาม (Flex Message)
- ✅ คนไทยใช้ LINE เกือบทุกคน

### ข้อเสีย:
- ⚠️ ต้องสมัครและตั้งค่าผ่าน LINE Developers

---

## 🔧 วิธีตั้งค่า LINE (5 ขั้นตอน - ใช้เวลา 15 นาที)

### ขั้นตอนที่ 1: สมัคร LINE Developers และสร้าง Provider

1. ไปที่: https://developers.line.biz/console/
2. คลิก **"Log in"** → Login ด้วย LINE account ของคุณ
3. ยอมรับ Terms of Use
4. คลิก **"Create"** หรือ **"Create a new provider"** (ปุ่มสีเขียว)
5. กรอก **Provider name:** `ChickGuard` (หรือชื่อฟาร์มของคุณ)
6. คลิก **"Create"**

✅ **เสร็จขั้นตอนที่ 1!**

---

💡 **Provider คืออะไร?** 
Provider เป็นเหมือน "บริษัท" หรือ "องค์กร" ที่เป็นเจ้าของ Bot - คุณสามารถมีหลาย Bot ภายใต้ Provider เดียวกัน

---

💡 **Provider คืออะไร?** 
Provider เป็นเหมือน "บริษัท" หรือ "องค์กร" ที่เป็นเจ้าของ Bot - คุณสามารถมีหลาย Bot ภายใต้ Provider เดียวกัน

---

### ขั้นตอนที่ 2: สร้าง Messaging API Channel (Bot)

หลังจากสร้าง Provider แล้ว คุณจะเห็นหน้า Provider:

1. **ในหน้า Provider** ให้คลิก **"Create a Messaging API channel"** 
   - หรือถ้าไม่เห็น ให้คลิก **"Create a new channel"** แล้วเลือกประเภท **"Messaging API"**

2. **กรอกข้อมูล Channel:**
   
   **Basic Information:**
   - **Channel icon:** อัพโหลดรูป (optional)
   - **Channel name:** `ChickGuard Alert` (ชื่อ Bot ที่จะแสดงใน LINE)
   - **Channel description:** `ระบบแจ้งเตือนสุขภาพไก่ อัตโนมัติ` (คำอธิบาย Bot)
   
   **Categories:**
   - **Category:** เลือก `Productivity & Tools` หรือ `Business`
   - **Subcategory:** เลือก `Other` หรือ `Agriculture`
   
   **Contact Information:**
   - **Email address:** กรอกอีเมลของคุณ

3. **อ่านและยอมรับ:**
   - ✅ ติ๊ก **"I have read and agree to the LINE Official Account Terms of Use"**
   - ✅ ติ๊ก **"I have read and agree to the LINE Official Account API Terms of Use"**

4. คลิก **"Create"**

✅ **เสร็จขั้นตอนที่ 2!**

---

💡 **ตอนนี้คุณจะเห็นหน้า Channel ที่มีแท็บหลายอัน:**
- **Basic settings** - ข้อมูลพื้นฐาน
- **Messaging API** ← **ต้องใช้แท็บนี้!**
- **LINE Official Account features** - ฟีเจอร์ OA
- **LINE Official Account Manager** - จัดการ OA

💡 **ตอนนี้คุณจะเห็นหน้า Channel ที่มีแท็บหลายอัน:**
- **Basic settings** - ข้อมูลพื้นฐาน
- **Messaging API** ← **ต้องใช้แท็บนี้!**
- **LINE Official Account features** - ฟีเจอร์ OA
- **LINE Official Account Manager** - จัดการ OA

---

### ขั้นตอนที่ 3: ดึง Channel Access Token

⚠️ **สำคัญ: อย่าสับสนระหว่าง 2 เว็บไซต์!**

คุณอาจจะเห็น 2 หน้าแยกกัน:
1. ❌ **LINE Official Account Manager** (manager.line.biz) - หน้าจัดการ Bot, Broadcast ← ไม่ใช่หน้านี้!
2. ✅ **LINE Developers Console** (developers.line.biz/console) - หน้าดึง Token ← ต้องหน้านี้!

---

**วิธีไปหน้าที่ถูกต้อง:**

1. เปิด URL นี้โดยตรง: **https://developers.line.biz/console/**
2. หรือถ้าอยู่ในหน้า Official Account Manager → ไปที่ **Settings** → หา **Messaging API** → คลิก **Manage in Console**
3. คุณจะเข้าสู่หน้า **LINE Developers Console**
4. เลือก **Provider** ของคุณ (เช่น "ChickGuard")
5. เลือก **Channel** ของคุณ (เช่น "ChickGuard Alert")

---

---

**ตอนนี้คุณจะเห็นแท็บ "Messaging API":**

คุณจะเห็นหน้าที่มีหลายส่วน ให้:

1. **คลิกแท็บ "Messaging API"** (แท็บที่ 2 จากซ้าย)

2. **เลื่อนลงมา** ไปที่ส่วน **"Channel access token (long-lived)"**
   - จะอยู่ประมาณตรงกลางของหน้า
   - **ไม่ใช่** "Channel secret" ที่อยู่ด้านบนสุด!

3. ถ้ายังไม่มี token → คลิก **"Issue"**
   - ระบบจะสร้าง token ให้

4. ถ้ามี token แล้ว → จะเห็น token ยาวๆ แสดงอยู่
   - คลิกปุ่ม **"Copy"** หรือคัดลอกด้วยตนเอง

5. **คัดลอก token** ที่ได้ (token จะยาวมาก ~170 ตัวอักษร)

⚠️ **คำเตือนสำคัญ:**
- **อย่าสับสนกับ "Channel secret"** ที่อยู่ด้านบนสุด (สั้นๆ แค่ 32 ตัว)
- **ต้องเป็น "Channel access token"** ที่ยาวมาก
- เก็บ token ไว้ดีๆ อย่าแชร์ให้ใครเห็น!

```
📍 ตำแหน่งที่ถูกต้องในหน้า Messaging API:

┌─────────────────────────────────────────────────────┐
│ ส่วนบน: Basic information                            │
│ - Webhook URL                                        │
│ - Use webhook: [Enabled/Disabled]                   │
├─────────────────────────────────────────────────────┤
│ ❌ Channel secret (อย่าใช้ตัวนี้!)                    │
│ 519457d1b3d427063547bbd4e0fdaf65                    │
│                                                      │
│ Assertion Signing Key                                │
│ [Register a public key]                              │
├─────────────────────────────────────────────────────┤
│ เลื่อนลงมา...                                        │
├─────────────────────────────────────────────────────┤
│ ✅ Channel access token (long-lived) ← ตัวนี้!       │
│ [Issue] หรือ [Re-issue]                             │
│ eyJhbGci...xxxxxxxxxxxxx...xxxxx [Copy]             │ ← คลิก Copy
│ (token ยาวมาก ~170 ตัวอักษร)                        │
├─────────────────────────────────────────────────────┤
│ ล่างสุด: Bot information                             │
│ - QR code                                            │
│ - Bot basic ID                                       │
│ - [Add friend]                                       │
└─────────────────────────────────────────────────────┘
```

**ตัวอย่าง Token ที่ถูกต้อง:**
```
❌ ไม่ใช่: 519457d1b3d427063547bbd4e0fdaf65 (สั้นเกินไป - นี่คือ Channel secret)

✅ ถูกต้อง: eyJhbGciOiJIUzI1NiJ9.wKdvvPZt3HZ0EwiHKW4KixZ0RNZW70R9TQ...
(ยาวมาก ตัวอย่างนี้สั้นกว่าจริง ของจริงจะยาวถึง 150-200 ตัวอักษร)
```

✅ **เสร็จขั้นตอนที่ 3!**

---

### ขั้นตอนที่ 4: เพิ่ม Bot เป็นเพื่อนและดึง User ID

1. ในหน้าเดียวกัน เลื่อนลงไปที่ **"Bot information"**
2. คลิก **"Add friend"** หรือ **Scan QR code**
3. เปิด LINE app → Scan QR code → Add friend

4. **ทดสอบส่งข้อความ:**
   - ส่งข้อความอะไรก็ได้ไปหา bot (เช่น "สวัสดี")
   - Bot จะไม่ตอบกลับ (ยังไม่ได้ตั้งค่า webhook)

5. **ดึง User ID:**
   - ใช้เครื่องมือนี้: https://developers.line.biz/console/
   - หรือใช้คำสั่งนี้:

```bash
# วิธีที่ 1: ใช้ curl (แทน YOUR_TOKEN ด้วย token จริง)
curl -X GET https://api.line.me/v2/bot/profile/{userId} \
-H "Authorization: Bearer YOUR_CHANNEL_ACCESS_TOKEN"

# วิธีที่ 2: ตั้งค่าให้ Backend แสดง User ID ให้
```

**🎯 วิธีง่ายที่สุด - ให้ Backend ช่วย:**

1. เปิดไฟล์ `backend/main.py`
2. แก้ไขเฉพาะบรรทัดนี้:
   ```python
   LINE_CHANNEL_ACCESS_TOKEN = "YOUR_CHANNEL_ACCESS_TOKEN_HERE"
   ```
3. Save แล้ว Restart backend
4. ไปที่: http://localhost:8000/api/notifications/get-user-id
5. จะแสดง User ID ของทุกคนที่เป็นเพื่อนกับ bot

✅ **เสร็จขั้นตอนที่ 4!**

---

### ขั้นตอนที่ 5: ตั้งค่าใน Backend

1. **สร้างไฟล์ .env** ที่ root ของโปรเจกต์:
   ```bash
   cd /Users/naphat-c/Documents/LDZA01/project/ChickGuard
   cp .env.example .env
   ```

2. **แก้ไขไฟล์ .env:**
   ```bash
   # เปิดไฟล์ด้วย editor ที่คุณชอบ
   nano .env
   # หรือ
   code .env
   ```

3. **ใส่ค่าที่ได้จากขั้นตอนก่อนหน้า:**

```bash
# ✏️ แก้ไขตรงนี้ - ใส่ token ที่ได้จากขั้นตอนที่ 3
LINE_CHANNEL_ACCESS_TOKEN=UX1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ==

# ✏️ แก้ไขตรงนี้ - ใส่ User ID ที่ได้จากขั้นตอนที่ 4
LINE_USER_ID=U1234567890abcdefghijklmnopqrstuv
```

4. **Save file** (Ctrl+O แล้ว Enter, หรือ Cmd+S)

5. **Restart Backend:**
   ```bash
   # Stop backend (Ctrl+C ที่ terminal ที่รัน backend)
   # Start again
   cd backend
   python main.py
   ```

6. **ทดสอบการแจ้งเตือน:**
   ```bash
   curl -X POST http://localhost:8000/api/alert/test
   ```

📱 **ควรได้รับข้อความใน LINE แล้ว!**

✅ **เสร็จทั้งหมด! LINE Messaging API พร้อมใช้งาน!**

---

## 📧 Option B: Email (Gmail)

### ข้อดี:
- ✅ ฟรี 100%
- ✅ ส่งได้ทุกที่ มีแค่อีเมล
- ✅ เก็บประวัติ alert ใน inbox

### ข้อเสีย:
- ⚠️ ช้ากว่า LINE (อาจล่าช้า 1-5 นาที)
- ⚠️ อาจเข้า Spam folder

---

## 🔧 วิธีตั้งค่า Gmail (3 ขั้นตอน - ใช้เวลา 10 นาที)

### ขั้นตอนที่ 1: เปิด 2-Step Verification

1. ไปที่: https://myaccount.google.com/security
2. Login ด้วย Gmail account
3. เลื่อนลงไปที่ **"2-Step Verification"**
4. คลิก **"Get Started"**
5. ตั้งค่าตามขั้นตอน (ใช้เบอร์โทรศัพท์ยืนยัน)

✅ **เสร็จขั้นตอนที่ 1!**

---

### ขั้นตอนที่ 2: สร้าง App Password

1. ไปที่: https://myaccount.google.com/apppasswords
2. หรือไปที่ Security → 2-Step Verification → App passwords
3. เลือก app: **"Mail"**
4. เลือก device: **"Other"** → ตั้งชื่อ `ChickGuard`
5. คลิก **"Generate"**
6. **คัดลอก password 16 หลัก** (จะมีช่องว่าง แต่ใช้ไม่ใช้ก็ได้)

```
ตัวอย่าง App Password:
abcd efgh ijkl mnop
หรือ: abcdefghijklmnop
```

⚠️ **สำคัญ:** เก็บ password นี้ไว้ดีๆ จะไม่สามารถดูอีกครั้งได้!

✅ **เสร็จขั้นตอนที่ 2!**

---

### ขั้นตอนที่ 3: ตั้งค่าใน Backend

1. **สร้างไฟล์ .env** ที่ root ของโปรเจกต์:
   ```bash
   cd /Users/naphat-c/Documents/LDZA01/project/ChickGuard
   cp .env.example .env
   ```

2. **แก้ไขไฟล์ .env:**
   ```bash
   # เปิดไฟล์ด้วย editor ที่คุณชอบ
   nano .env
   # หรือ
   code .env
   ```

3. **ใส่ค่าที่ได้จากขั้นตอนก่อนหน้า:**

```bash
# ✏️ แก้ไขตรงนี้ - อีเมล Gmail ของคุณ
SMTP_USER=your-email@gmail.com

# ✏️ แก้ไขตรงนี้ - App Password ที่ได้จากขั้นตอนที่ 2 (ไม่ใช่รหัส Gmail ปกติ!)
SMTP_PASSWORD=abcdefghijklmnop

# ✏️ แก้ไขตรงนี้ - อีเมลที่จะรับการแจ้งเตือน (อาจเป็นคนละที่กับ SMTP_USER)
ALERT_EMAIL=recipient@example.com
```

4. **Save file** (Ctrl+O แล้ว Enter, หรือ Cmd+S)
4. **Restart Backend:**
   ```bash
   # Stop backend (Ctrl+C)
   # Start again
   cd backend
   python main.py
   ```

5. **ทดสอบการแจ้งเตือน:**
   ```bash
   curl -X POST http://localhost:8000/api/alert/test
   ```

📧 **ควรได้รับอีเมลแล้ว! (เช็ค Spam ถ้าไม่เจอ)**

✅ **เสร็จทั้งหมด! Email notification พร้อมใช้งาน!**

---

## 🔍 การตรวจสอบสถานะ

### เช็คว่าตั้งค่าสำเร็จหรือยัง:

```bash
# วิธีที่ 1: ดูตอน start backend
cd backend
python main.py

# ต้องเห็นข้อความนี้:
# ✅ LINE Messaging Channel: Enabled
# ✅ Email Channel: Enabled
# 📢 Notification Manager: 2/2 channels enabled

# วิธีที่ 2: เช็คผ่าน API
curl http://localhost:8000/api/notifications/status
```

**ผลลัพธ์ที่ดี:**
```json
{
  "manager_status": "2/2 channels enabled",
  "channels": [
    {
      "name": "LINE Messaging",
      "enabled": true,
      "demo_mode": false
    },
    {
      "name": "Email",
      "enabled": true,
      "demo_mode": false
    }
  ]
}
```

---

## 🧪 ทดสอบการแจ้งเตือน

### ทดสอบแต่ละช่องทาง:

```bash
# ทดสอบทั้ง LINE และ Email พร้อมกัน
curl -X POST http://localhost:8000/api/alert/test

# หรือใช้เบราว์เซอร์:
http://localhost:8000/docs
# เลือก POST /api/alert/test → Try it out → Execute
```

### ทดสอบเฉพาะ LINE:
```bash
curl -X POST http://localhost:8000/api/notifications/test-all
```

---

## ❓ Troubleshooting

### LINE ไม่ได้รับข้อความ

1. **เช็ค Token:**
   - Token ถูกต้องหรือไม่?
   - มี `Bearer` หรือ `UX` นำหน้าหรือไม่?

2. **เช็ค User ID:**
   - User ID ถูกต้องหรือไม่?
   - ขึ้นต้นด้วย `U` หรือไม่?

3. **เช็คว่า Add friend แล้วหรือยัง:**
   - Scan QR code แล้วหรือยัง?
   - เห็น bot ใน LINE friend list หรือไม่?

4. **ดู Log:**
   ```bash
   cd backend
   tail -f backend.log
   ```

---

### Email ไม่ได้รับ

1. **เช็ค Spam folder:**
   - เช็คใน Gmail Spam/Junk

2. **เช็ค App Password:**
   - ใช้ App Password (16 หลัก) ไม่ใช่รหัส Gmail ปกติ
   - 2-Step Verification เปิดแล้วหรือยัง?

3. **เช็ค SMTP settings:**
   ```python
   SMTP_SERVER = "smtp.gmail.com"  # ต้องเป็น Gmail
   SMTP_PORT = 587  # ต้องเป็น 587
   ```

4. **ทดสอบ SMTP Connection:**
   ```bash
   cd backend
   python -c "
   import smtplib
   smtp = smtplib.SMTP('smtp.gmail.com', 587)
   smtp.starttls()
   smtp.login('your-email@gmail.com', 'your-app-password')
   print('✅ SMTP Connection OK!')
   smtp.quit()
   "
   ```

---

### Backend ไม่ start

1. **เช็คว่าติดตั้ง dependencies แล้วหรือยัง:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **เช็ค Python version:**
   ```bash
   python --version  # ต้อง 3.8+
   ```

3. **เช็ค Port 8000 ว่าว่างหรือไม่:**
   ```bash
   lsof -ti:8000 | xargs kill -9
   ```

---

## 📊 ข้อความแจ้งเตือนจะมาเมื่อไหร่?

### Auto Alert เมื่อ:
- 🔴 **Risk Score ≥ 70** (High Risk) → แจ้งทันที
- 🟡 **Risk Score ≥ 40** (Medium Risk) → แจ้งทุก 15 นาที (cooldown)
- 🟢 **Risk Score < 40** (Low Risk) → ไม่แจ้ง

### Manual Test:
- ใช้ API: `POST /api/alert/test`
- ใช้ Swagger: http://localhost:8000/docs

---

## 🎯 สรุป

### ตั้งค่า LINE:
1. สมัคร LINE Developers
2. สร้าง Messaging API Channel
3. ดึง Channel Access Token
4. Add Bot เป็นเพื่อน + ดึง User ID
5. ตั้งค่าใน `backend/main.py`

### ตั้งค่า Email (Gmail):
1. เปิด 2-Step Verification
2. สร้าง App Password
3. ตั้งค่าใน `backend/main.py`

### ทดสอบ:
```bash
curl -X POST http://localhost:8000/api/alert/test
```

---

**หากมีปัญหา ดูเพิ่มเติมที่: ONE_HEALTH_GUIDE.md**

<div align="center">
  <p>🔔 พร้อมรับการแจ้งเตือนแล้ว!</p>
  <p><strong>One Health - One Future</strong> 🐔🌍</p>
</div>
