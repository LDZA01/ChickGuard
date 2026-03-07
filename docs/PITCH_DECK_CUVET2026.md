# 🐔 ChickGuard — Pitch Deck (Tech Deep-Dive)
### CUVET HACKATHON 2026 · Vet Tech For One Health · "Innovation Beyond The Species"

> เอกสารนี้ใช้สำหรับ **ทวนก่อนตอบคำถาม** — เน้นสาย Tech และการแก้ปัญหา

---

## SLIDE 1 — Problem Statement (ปัญหาที่แก้)

### ❌ ปัญหาเดิม: "รู้ช้าเกินไป"

| ปัญหา | ผลกระทบ |
|---|---|
| เกษตรกรตรวจฟาร์มด้วยตาเปล่า วันละ 2-3 ครั้ง | ช่องว่างเวลา 8-12 ชม. ก่อนพบโรค |
| ไก่แสดงอาการชัดเจน = โรคแพร่ไปแล้ว | ความเสียหาย 30-60% ของฝูงก่อนรู้ตัว |
| ฟาร์มขนาดใหญ่ 10,000+ ตัว มนุษย์ตรวจไม่ไหว | ใช้แรงงานสูง ต้นทุนสูง |
| ไม่มีข้อมูลย้อนหลังเชิงปริมาณ | ไม่รู้ว่าโรคเริ่มตอนไหน ป้องกันยาก |

### ✅ โอกาส: สัญญาณโรคมีก่อนอาการชัดเจน 24-48 ชั่วโมง
ไก่ที่ป่วยจะ **เคลื่อนไหวลดลง, กระจุกตัว, เปลี่ยนรูปแบบพฤติกรรม** ก่อนที่จะล้มป่วยชัดเจน  
→ AI อ่านสัญญาณนี้ได้ มนุษย์อ่านไม่ได้จากระยะไกล

---

## SLIDE 2 — Solution Overview (ระบบทำอะไร)

```
กล้อง IP ในโรงเรือน
        ↓
[ Backend: FastAPI + Python ]
        ↓
   YOLOv8 Object Detection
   (ตรวจจับตำแหน่งไก่แต่ละตัวในเฟรม)
        ↓
   BehaviorAnalyzer
   คำนวณ: Movement Score, Density Score, Clustering Score
        ↓
   RiskScoreCalculator
   คำนวณ Disease Risk Score (0-100)
   weighted: Anomaly 50% + Pattern 30% + Trend 20%
        ↓
   NotificationManager
   LINE Messaging API → เกษตรกร
        ↓
[ Frontend: React + TypeScript ]
   Dashboard · Analytics · Alerts · Vet Connect
```

---

## SLIDE 3 — Tech Stack (ตอบคำถาม Tech ได้เลย)

### Backend
| Component | Technology | เหตุผลที่เลือก |
|---|---|---|
| Web Framework | **FastAPI** (Python) | Async, Auto Swagger docs, Type-safe |
| Object Detection | **YOLOv8n** (Ultralytics) | Real-time, เบา, accuracy ดีสำหรับ edge |
| Video Processing | **OpenCV** | Standard library สำหรับ frame manipulation |
| Behavior Analysis | **NumPy** custom algorithm | ควบคุม logic ได้เอง, ไม่ต้องพึ่ง black box |
| Notification | **LINE Messaging API** | เกษตรกรไทยใช้ LINE 95% |
| Environment Config | **python-dotenv** | แยก config ออกจาก code |
| Server | **Uvicorn** (ASGI) | รองรับ async/WebSocket |

### Frontend
| Component | Technology | เหตุผลที่เลือก |
|---|---|---|
| UI Framework | **React 18 + TypeScript** | Type safety, component reuse |
| Build Tool | **Vite** | Dev server เร็วมาก |
| Styling | **TailwindCSS** | Rapid UI development |
| Charts | **Chart.js + react-chartjs-2** | Lightweight, interactive |
| Routing | **React Router v6** | SPA routing |
| Video Stream | **MJPEG over HTTP** | Simple, no WebRTC needed for MVP |

### Video Pipeline
```
SyntheticFrameGenerator (demo mode)
    OR
Camera IP / Video File
        ↓
VideoDetector._detection_loop()  ← Thread แยก
    ↓ rate: PROCESS_FPS (default 5 fps)
_process_frame() → YOLO inference
        ↓
behavior_analyzer.analyze(detections)
        ↓
risk_calculator.calculate_risk_score(behavior_data)
        ↓
/api/dashboard  ← Frontend poll ทุก 5 วินาที
```

---

## SLIDE 4 — AI Algorithm Deep-Dive (ตอบคำถาม judge สาย AI)

### 4.1 Object Detection Layer
- ใช้ **YOLOv8n** (nano variant) — เลือกเพราะ inference time ต่ำ (<20ms/frame บน CPU)
- Input: video frame (1280×720)
- Output: bounding boxes + confidence + class
- Confidence threshold: **0.5** (configurable ผ่าน env)
- ในโหมด synthetic: mock detection เพื่อ demo โดยไม่ต้องใช้กล้องจริง

### 4.2 BehaviorAnalyzer — 3 Metrics หลัก

**Movement Score** (0-100)
```python
# คำนวณจาก Standard Deviation ของตำแหน่ง (X, Y) ของ bounding box centers
std_x = np.std(centers[:, 0])
std_y = np.std(centers[:, 1])
movement_score = min(100, (std_x + std_y) / 10)
# ยิ่ง spread มาก = ยิ่งเคลื่อนที่มาก
```

**Density Score** (0-100)
```python
# คำนวณจาก average pairwise distance ระหว่าง centers
# ยิ่งใกล้กัน = density สูง = อาจกระจุกตัว
density = max(0, min(100, 100 - (avg_distance / 5)))
```

**Clustering Score** (0-100)
```python
# คำนวณจาก Variance ของตำแหน่ง
# Variance ต่ำ = กระจุกตัว = clustering สูง
clustering = max(0, min(100, 100 - (total_variance / 1000)))
```

### 4.3 Anomaly Detection — 5 Rules

| Rule | Trigger | Weight |
|---|---|---|
| `reduced_movement` | movement < baseline × 0.6 | 20 pts |
| `excessive_clustering` | clustering > 70 | 25 pts |
| `overcrowding` | density > baseline × 1.5 | 15 pts |
| `sudden_decrease` | count < recent_avg × 0.5 | 30 pts |
| `prolonged_inactivity` | avg_movement_30frames < baseline × 0.3 | 25 pts |

### 4.4 Disease Risk Score Formula
```
Risk Score = (Anomaly Risk × 0.50)
           + (Pattern Risk × 0.30)
           + (Trend Risk   × 0.20)

Clamped: 0 ≤ Score ≤ 100

Risk Level:
  0-39   → LOW    (ไม่แจ้งเตือน)
  40-69  → MEDIUM (แจ้งเตือนปกติ)
  70-100 → HIGH   (แจ้งเตือนทันที)
```

### 4.5 Trend Analysis
```python
# Linear regression บน sliding window 30 frames
slope = np.polyfit(x, y, 1)[0]
# slope > +2  → "increasing"
# slope < -2  → "decreasing"
# else        → "stable"
```

---

## SLIDE 5 — One Health Connection (สำคัญมากสำหรับ CUVET)

### ทำไม ChickGuard = One Health?

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  สุขภาพสัตว์    │    │  สุขภาพมนุษย์   │    │  สิ่งแวดล้อม    │
│                 │    │                 │    │                 │
│ ตรวจพบโรคไก่    │───▶│ ป้องกัน Zoonosis│───▶│ ลดยาปฏิชีวนะ   │
│ ก่อนแพร่กระจาย  │    │ ก่อนถึงมนุษย์   │    │ ลด AMR         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**โรคที่ ChickGuard ช่วยป้องกัน (Zoonotic Risk):**
- **Avian Influenza (H5N1)** — ติดคนได้ อัตราตาย 60%
- **Newcastle Disease** — ทำลายฝูงได้ทั้งโรงเรือน
- **Campylobacter/Salmonella** — ปนเปื้อนในห่วงโซ่อาหาร

**Impact Chain:**
1. AI ตรวจพบ behavioral anomaly ในไก่ → Risk Score สูง
2. แจ้งเตือนเกษตรกร → เรียกสัตวแพทย์ตรวจ (Vet Connect)
3. รักษาเร็ว → โรคไม่แพร่ → ลดการใช้ยาปฏิชีวนะ
4. ลด AMR (Antimicrobial Resistance) — ปัญหา One Health ระดับโลก
5. ข้อมูลฟาร์มสะสม → เชื่อมกับระบบ Disease Surveillance ของกรมปศุสัตว์

---

## SLIDE 6 — System Architecture (ตอบคำถาม Architecture)

### Multi-Farm Design
```
FARM_DB = [
  { id:1, name:"Farm 1", location:"Nakhon Pathom" },
  { id:2, name:"Farm 2", location:"Suphan Buri"   },
  { id:3, name:"Farm 3", location:"Ratchaburi"    },
]

for each farm:
  VideoDetector(farm_id=N)  ← Thread แยกต่าง farm
      ↓
  behavior_analyzer (shared instance)
  risk_calculator   (shared instance)
      ↓
  /api/dashboard  ← aggregate ทุก farm
  /api/farm/{id}  ← ดูแยกรายฟาร์ม
```

### API Endpoints ที่สำคัญ
| Endpoint | Method | ทำอะไร |
|---|---|---|
| `/api/dashboard` | GET | Aggregate ทุก farm: health, alerts, risk trend |
| `/api/detection/live?farm_id=N` | GET | Live detection + behavior + risk สำหรับ farm นั้น |
| `/api/risk/current?farm_id=N` | GET | Risk score + anomalies + recommendations |
| `/api/risk/trend` | GET | ประวัติ risk score (จาก real history หรือ synthetic) |
| `/api/analytics` | GET | Health trend 7 วัน + behavior hourly breakdown |
| `/api/farm/{id}` | GET | Detail: cameras, stats, environment |
| `/api/video_feed?farm_id=N` | GET | MJPEG stream |

### Notification Pipeline
```python
NotificationManager
  ├── LineMessagingChannel  ← LINE Official Account API
  │     push_message() to LINE_USER_ID
  │     format: Risk Score + Anomalies + Recommendations (ภาษาไทย)
  └── EmailChannel (SMTP)  ← Gmail/SMTP backup
        ส่ง daily report + high-risk alerts

Cooldown: 15 นาที (configurable) — ป้องกัน notification spam
```

---

## SLIDE 7 — MVP Features (สิ่งที่ทำงานจริงใน Demo)

### ✅ ทำงานได้จริง (Live Demo ได้เลย)

1. **Real-time Video Feed** — MJPEG stream จาก backend พร้อม bounding box
2. **YOLOv8 Detection** — detect object ใน frame พร้อม confidence score
3. **Behavior Analysis** — movement/density/clustering คำนวณ realtime
4. **Disease Risk Score** — 0-100 พร้อม level (Low/Medium/High)
5. **Multi-Farm Dashboard** — 3 ฟาร์ม aggregate ใน view เดียว
6. **Alert System** — list alerts พร้อม filter by severity
7. **LINE Notification** — แจ้งเตือนผ่าน LINE เมื่อ risk สูง (ต้องตั้งค่า token)
8. **Analytics Page** — Health trend chart + Behavior breakdown by hour
9. **Farm Detail Page** — Live camera + activity chart + environment data
10. **Bilingual UI** — ไทย / อังกฤษ toggle ได้
11. **Vet Connect** — UI Mockup พร้อม flow: ค้นหาสัตวแพทย์ → เลือก mode → confirm

### ⚠️ Mockup / Planned (ระบุชัดในหน้า UI)

- Vet Connect — video call, payment จริง (Roadmap v2.0)
- Feeding detection โดยตรงจาก computer vision (ปัจจุบัน = behavioral pattern proxy)
- SMS notification channel

---

## SLIDE 8 — Demo Flow (ลำดับ Demo)

```
1. เปิด Dashboard
   → แสดง 3 ฟาร์ม, total chickens, health score, risk trend chart

2. กด "Run Scan" บน AI Diagnostic
   → เรียก /api/risk/current
   → แสดง behavior summary (movement %, density %)

3. คลิก Farm 1 → Farm Detail
   → เห็น Live camera stream (MJPEG)
   → เห็น bounding boxes บนไก่ synthetic
   → เห็น Health Score + stats

4. ไปหน้า Analytics
   → Health Trend 7 วัน
   → Behavior Analysis by Hour

5. ไปหน้า Vet Connect (ใหม่!)
   → เห็น AI context alert (Risk 72)
   → คลิก "ปรึกษาเดี๋ยวนี้" → เลือก video call → confirm → mock session

6. ไปหน้า Alerts
   → filter High/Medium/Low

7. (optional) แสดง LINE notification
   → เปิด .env ให้ดู config
```

---

## SLIDE 9 — Competitive Advantage (ตอบคำถาม Why You?)

| Feature | ChickGuard | Sensor-based IoT | Manual Check |
|---|---|---|---|
| ต้นทุนติดตั้ง | กล้อง IP (ถูก) | เซนเซอร์หลายตัว (แพง) | แรงงาน (แพงซ่อน) |
| Non-invasive | ✅ ไม่สัมผัสไก่ | ⚠️ บางตัวต้องติดตัวสัตว์ | ✅ |
| 24/7 | ✅ | ✅ | ❌ |
| Behavioral insight | ✅ | ❌ sensor วัดแค่ environment | ❌ |
| Early warning (24-48h) | ✅ | ❌ | ❌ |
| Scalable (multi-farm) | ✅ | ⚠️ ต้องเดินสาย | ❌ |
| LINE integration | ✅ | ❌ มักส่ง email/app เฉพาะ | ❌ |
| Data moat | ✅ สะสม farm-specific behavior | ⚠️ | ❌ |
| Vet Connect | ✅ (roadmap) | ❌ | ❌ |

---

## SLIDE 10 — Technical Q&A Prep (ถาม-ตอบที่เจอบ่อย)

### Q: ทำไมใช้ YOLOv8 ไม่ใช้ model อื่น?
**A:** YOLOv8n (nano) ทำ real-time inference ได้บน CPU ธรรมดา inference ~15-20ms/frame  
ไม่ต้องใช้ GPU เพื่อ MVP ทำให้ deployment cost ต่ำ  
Ultralytics ยังมี pretrained weights ที่ดีและ community ใหญ่  

### Q: accuracy ของ model เป็นยังไง?
**A:** ตอนนี้ใช้ YOLOv8n pretrained บน COCO dataset  
ในโหมด synthetic เป็น mock detection เพื่อ demo  
สำหรับ production จะต้อง fine-tune บน dataset ไก่โดยเฉพาะ (ซึ่งเป็น next step)  
เราเน้น system architecture และ behavioral analysis pipeline ก่อน  

### Q: วิธีคำนวณ Risk Score มีพื้นฐานทางสัตวแพทยศาสตร์มั้ย?
**A:** weights ปัจจุบัน (sudden_decrease=30, clustering=25, inactivity=25) มาจาก  
literature review เกี่ยวกับ early disease indicators ในสัตว์ปีก  
`sudden_decrease` สูงสุดเพราะ mortality spike เป็น indicator แรกของ highly contagious disease  
ใน production จะ validate weights กับ veterinary expert และ real farm data  

### Q: ต่างจาก PLF (Precision Livestock Farming) ทั่วไปยังไง?
**A:** PLF ส่วนใหญ่ใช้ wearable sensor หรือ weight scale  
ChickGuard ใช้ Computer Vision ล้วน → ไม่ invasive, ต้นทุนต่ำ, scale ง่าย  
เพิ่ม behavioral dimension ที่ sensor ทั่วไปทำไม่ได้: clustering pattern, spatial distribution  

### Q: Privacy/Security ของวิดีโอฟาร์มล่ะ?
**A:** MVP: video stream อยู่ใน local network (LAN) ไม่ออก internet  
Production roadmap: encrypted RTSP + API authentication + video stored locally  
ไม่ส่ง raw video ออกไปนอกฟาร์ม ส่งแค่ metadata (detection count, risk score)  

### Q: scale ขึ้นไปกี่ฟาร์มได้?
**A:** Architecture ปัจจุบัน: 1 backend instance รัน detector thread แยกต่อ farm  
ขยายได้โดย: horizontal scaling (หลาย backend instance) + load balancer  
หรือ deploy edge device (Raspberry Pi / Jetson Nano) per farm แล้วส่งแค่ risk data มา central  

### Q: One Health มันเชื่อมยังไงจริงๆ?
**A:** 3 ระดับ:  
1. **Animal Health**: ตรวจพบโรคเร็ว ลดการตายของสัตว์  
2. **Human Health**: ป้องกัน Zoonosis ก่อนแพร่สู่คน (AI เป็น early sentinel)  
3. **Environmental Health**: ลดการใช้ยาปฏิชีวนะโดยไม่จำเป็น → ลด AMR ในสิ่งแวดล้อม  

ข้อมูลที่สะสมจากระบบสามารถ feed ไปยัง disease surveillance network ของกรมปศุสัตว์ได้  

### Q: Vet Connect เชื่อมกับ AI ยังไง?
**A:** เมื่อเปิด consult: ระบบส่ง Risk Score + Behavior Summary + Live Video URL ให้สัตวแพทย์  
สัตวแพทย์เห็น context ก่อนเริ่มการปรึกษา → ไม่ต้องอธิบายซ้ำ → save time  
นี่คือ AI-Assisted Consultation ที่ต่างจาก telemedicine ทั่วไป  

### Q: feeding detection แม่นแค่ไหน?
**A:** เราชัดเจนว่าเป็น **behavioral pattern analysis** ไม่ใช่ direct feeding detection  
วิเคราะห์จาก: activity score บริเวณ feeding zone + temporal pattern (เวลากินอาหาร)  
Direct feeding detection ต้องใช้ depth camera หรือ weight sensor เพิ่ม ซึ่งอยู่ใน roadmap  

---

## SLIDE 11 — Roadmap (แสดงให้เห็น Vision)

### v1.0 — MVP (ปัจจุบัน ✅)
- YOLOv8 detection + Behavior Analysis + Risk Score
- LINE notification
- Multi-farm dashboard
- Vet Connect mockup

### v2.0 — Production (6 เดือน)
- Fine-tuned model บน chicken dataset
- Vet Connect จริง (WebRTC + payment)
- Mobile app (React Native)
- Edge deployment (Jetson Nano per barn)
- Integration API สำหรับ Integrator ใหญ่

### v3.0 — Ecosystem (1 ปี)
- ต่อยอดสู่สัตว์อื่น (สุกร, เป็ด, โคนม)
- Disease prediction model (forecasting 48h)
- เชื่อมกับ กรมปศุสัตว์ Surveillance Network
- Data marketplace สำหรับ vet/researcher

---

## SLIDE 12 — Team & Ask

### สิ่งที่ต้องการจาก Hackathon นี้
1. **Feedback จาก veterinary experts** — validate anomaly weights และ disease indicators
2. **Dataset ของไก่จริง** — fine-tune YOLOv8 model ให้แม่นขึ้น
3. **Mentor สายสัตวแพทย์** — ออกแบบ clinical protocol สำหรับ Vet Connect

### One-liner สำหรับจำ
> **"ChickGuard ทำให้กล้อง CCTV ธรรมดากลายเป็น AI Vet ที่เฝ้าดูไก่ตลอด 24 ชั่วโมง"**

---

*เอกสารนี้ reflect สถานะ codebase จริง — อัปเดต March 2026*
