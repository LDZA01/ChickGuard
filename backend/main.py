#!/usr/bin/env python3
"""
Alternative: Use video file instead of webcam
For development when webcam permission issues occur
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from datetime import datetime, timedelta
import asyncio
import logging
import cv2
import numpy as np
from pathlib import Path
import json
from typing import List, Dict
import threading
import time
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file in root directory
root_dir = Path(__file__).parent.parent
env_path = root_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Import AI components
try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False
    logging.warning("⚠️  YOLOv8 not available. Install with: pip install ultralytics")

# Import ChickGuard modules
from behavior_analyzer import BehaviorAnalyzer
from risk_calculator import RiskScoreCalculator
from notification_system import NotificationManager

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ChickGuard AI API - One Health System",
    description="AI-Powered Disease Detection with Behavior Analysis",
    version="4.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Configuration - Load from environment variables
# =====================================================

# Video source
VIDEO_SOURCE = os.getenv("VIDEO_SOURCE", "synthetic")

# YOLO model
YOLO_MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "yolov8n.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))
PROCESS_FPS = int(os.getenv("PROCESS_FPS", "5"))

# Alert settings
ALERT_COOLDOWN_MINUTES = int(os.getenv("ALERT_COOLDOWN_MINUTES", "15"))
MEDIUM_RISK_THRESHOLD = int(os.getenv("MEDIUM_RISK_THRESHOLD", "40"))
HIGH_RISK_THRESHOLD = int(os.getenv("HIGH_RISK_THRESHOLD", "70"))

# Scaling factor: how many real chickens per detected object in the frame
CHICKEN_SCALE_FACTOR = int(os.getenv("CHICKEN_SCALE_FACTOR", "1000"))

# Initialize behavior analysis and risk calculation
behavior_analyzer = BehaviorAnalyzer(history_window=300)
risk_calculator = RiskScoreCalculator()

# Initialize notification manager (will load LINE and Email settings from env)
notification_manager = NotificationManager(
    line_token=os.getenv("LINE_CHANNEL_ACCESS_TOKEN"),
    line_user_id=os.getenv("LINE_USER_ID"),
    smtp_server=os.getenv("SMTP_SERVER", "smtp.gmail.com"),
    smtp_port=int(os.getenv("SMTP_PORT", "587")),
    smtp_user=os.getenv("SMTP_USER"),
    smtp_password=os.getenv("SMTP_PASSWORD"),
    alert_email=os.getenv("ALERT_EMAIL")
)

logger.info(f"🎬 Video Source: {VIDEO_SOURCE}")
logger.info("🧠 Behavior Analyzer: Ready")
logger.info("📊 Risk Calculator: Ready")
logger.info(f"📱 Notifications: {notification_manager.get_status()['enabled_channels']}/{notification_manager.get_status()['total_channels']} channels enabled")

# =====================================================
# Synthetic Frame Generator (No camera needed!)
# =====================================================

class SyntheticFrameGenerator:
    """Generate synthetic frames matching new UI mockup style"""
    
    def __init__(self, width=1280, height=720):
        self.width = width
        self.height = height
        self.frame_count = 0
        
    def _draw_chicken(self, img, cx, cy, radius):
        """Draw a simple chicken approximation instead of just a circle"""
        # Body (white/grey)
        cv2.circle(img, (cx, cy), radius, (240, 240, 240), -1)
        # Comb/Wattle (Red)
        cv2.circle(img, (cx, cy - radius), int(radius*0.4), (0, 0, 220), -1)
        cv2.circle(img, (cx - int(radius*0.6), cy), int(radius*0.3), (0, 0, 220), -1)
        # Beak (Yellow)
        pts = np.array([[cx-radius, cy-int(radius*0.2)], [cx-radius, cy+int(radius*0.2)], [cx-int(radius*1.4), cy]], np.int32)
        cv2.fillPoly(img, [pts], (0, 200, 255))
        # Eye (Black)
        cv2.circle(img, (cx - int(radius*0.4), cy - int(radius*0.3)), int(radius*0.15), (0, 0, 0), -1)
        
    def generate_frame(self):
        """Generate a frame with moving objects matching UI mockup"""
        # Create dark background #1a2421
        frame = np.zeros((self.height, self.width, 3), dtype=np.uint8)
        frame[:] = [33, 36, 26] # BGR for dark green-ish
        
        # Add dot matrix pattern (simulating grid)
        dot_spacing = 40
        for y in range(0, self.height, dot_spacing):
            for x in range(0, self.width, dot_spacing):
                 cv2.circle(frame, (x, y), 1, (60, 70, 50), -1)
        
        # Add moving "chickens"
        # We can seed based on width/height slightly so farms look different
        # Let's add a parameter hack for variety
        random_offset = getattr(self, 'farm_offset', 0)
        num_objects = 5 + (random_offset % 4) # Varies by farm
        t = self.frame_count * 0.03
        
        for i in range(num_objects):
            # Calculate position with some offset physics
            base_cx = int(self.width/2 + (300 - random_offset*20) * np.cos(t + i * 2 * np.pi / num_objects))
            base_cy = int(self.height/2 + 200 * np.sin(t*1.5 + i * 2 * np.pi / num_objects))
            
            # Add some jitter
            cx = base_cx + int(20 * np.sin(t*5 + i))
            cy = base_cy + int(20 * np.cos(t*4 + i))
            
            # Keep within bounds
            cx = max(100, min(self.width - 100, cx))
            cy = max(100, min(self.height - 100, cy))
            
            radius = 35
            
            # Draw synthetic chicken
            self._draw_chicken(frame, cx, cy, radius)
            
            # Draw bounding box matching the UI mockup (Green rounded)
            # OpenCV doesn't do rounded rects easily, so we draw normal rect
            x1, y1 = cx - radius - 10, cy - radius - 20
            x2, y2 = cx + radius + 10, cy + radius + 10
            cv2.rectangle(frame, (x1, y1), (x2, y2), (100, 200, 120), 2)
            
            # Add label box on top of bounding box
            conf = int(85 + (np.sin(t+i) * 10)) # fluctuating 75-95%
            label = f"Chicken {conf}%"
            
            # Black bg for text
            (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
            cv2.rectangle(frame, (x1, y1 - th - 10), (x1 + tw + 10, y1), (20, 30, 20), -1)
            cv2.putText(frame, "Chicken ", (x1 + 5, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (120, 220, 140), 1)
            # Mocking the dual color (Chicken = green, % = white)
            (tw_chicken, _), _ = cv2.getTextSize("Chicken ", cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
            cv2.putText(frame, f"{conf}%", (x1 + 5 + tw_chicken, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

        self.frame_count += 1
        return frame

# Use synthetic generator instead of webcam
class VideoDetector:
    """Real-time object detection using YOLOv8 with video file or synthetic frames"""
    
    def __init__(self, video_source="synthetic", model_name='yolov8n.pt', farm_id=1):
        self.video_source = video_source
        self.model_name = model_name
        self.farm_id = farm_id
        self.model = None
        self.frame_generator = None
        self.is_running = False
        self.current_frame = None
        self.current_detections = []
        self.frame_lock = threading.Lock()
        
        # Statistics
        self.stats = {
            'total_frames': 0,
            'processed_frames': 0,
            'total_detections': 0,
            'avg_confidence': 0,
            'fps': 0,
            'last_update': datetime.now()
        }
        
        logger.info(f"🎬 Initializing VideoDetector (Source: {video_source})")
        
    def initialize(self):
        """Initialize YOLO model and video source"""
        try:
            if not YOLO_AVAILABLE:
                logger.warning("⚠️  YOLO not available, using mock detection")
                self.model = None
            else:
                logger.info(f"📦 Loading YOLO model: {self.model_name}")
                self.model = YOLO(self.model_name)
                logger.info("✅ YOLO model loaded successfully")
            
            # Initialize video source
            if self.video_source == "synthetic":
                logger.info(f"🎨 Using synthetic frame generator for farm {self.farm_id}")
                self.frame_generator = SyntheticFrameGenerator()
                self.frame_generator.farm_offset = self.farm_id # Add unique feel
                logger.info(f"✅ Synthetic generator initialized for farm {self.farm_id}")
            else:
                # Future: support video files
                logger.warning(f"⚠️  Video file not implemented yet, using synthetic")
                self.frame_generator = SyntheticFrameGenerator()
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Initialization failed: {str(e)}")
            return False
    
    def start(self):
        """Start detection thread"""
        if not self.initialize():
            logger.error("❌ Cannot start detector - initialization failed")
            return False
        
        self.is_running = True
        self.detection_thread = threading.Thread(target=self._detection_loop, daemon=True)
        self.detection_thread.start()
        logger.info("🚀 Detection thread started")
        return True
    
    def stop(self):
        """Stop detection"""
        logger.info("🛑 Stopping detector...")
        self.is_running = False
        
        if hasattr(self, 'detection_thread') and self.detection_thread:
            self.detection_thread.join(timeout=5)
        
        logger.info("✅ Detector stopped")
    
    def _detection_loop(self):
        """Main detection loop"""
        logger.info("🔄 Detection loop started")
        frame_interval = 1.0 / PROCESS_FPS
        last_process_time = time.time()
        
        while self.is_running:
            try:
                # Generate frame
                frame = self.frame_generator.generate_frame()
                self.stats['total_frames'] += 1
                
                # Process at specified FPS
                current_time = time.time()
                if current_time - last_process_time >= frame_interval:
                    # Run detection
                    detections = self._process_frame(frame)
                    
                    # Update current frame and detections
                    with self.frame_lock:
                        self.current_frame = frame.copy()
                        self.current_detections = detections
                    
                    self.stats['processed_frames'] += 1
                    self.stats['fps'] = 1.0 / (current_time - last_process_time)
                    last_process_time = current_time
                
                # Small sleep
                time.sleep(0.01)
                
            except Exception as e:
                logger.error(f"❌ Error in detection loop: {str(e)}")
                time.sleep(0.1)
        
        logger.info("✅ Detection loop ended")
    
    def _process_frame(self, frame):
        """Process single frame with YOLO"""
        if self.video_source == "synthetic":
            # Mock detection for synthetic mode so API returns correct data
            num_objects = 5 + (self.farm_id % 4) # matching generator
            return [{
                'id': i,
                'class': 'chicken',
                'class_id': 0,
                'confidence': 0.85 + (i * 0.01),
                'bbox': [100 + i*50, 100 + i*50, 200 + i*50, 200 + i*50],
                'center': [150 + i*50, 150 + i*50],
                'area': 10000
            } for i in range(num_objects)]
            
        if not self.model:
            # Mock detection for testing
            return [{
                'id': i,
                'class': 'object',
                'class_id': 0,
                'confidence': 0.85,
                'bbox': [100 + i*100, 100, 200 + i*100, 200],
                'center': [150 + i*100, 150],
                'area': 10000
            } for i in range(3)]
        
        try:
            results = self.model(frame, conf=CONFIDENCE_THRESHOLD, verbose=False)
            detections = []
            total_confidence = 0
            
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    class_name = self.model.names[class_id]
                    
                    center_x = int((x1 + x2) / 2)
                    center_y = int((y1 + y2) / 2)
                    
                    detection = {
                        'id': len(detections),
                        'class': class_name,
                        'class_id': class_id,
                        'confidence': round(confidence, 3),
                        'bbox': [int(x1), int(y1), int(x2), int(y2)],
                        'center': [center_x, center_y],
                        'area': int((x2 - x1) * (y2 - y1))
                    }
                    detections.append(detection)
                    total_confidence += confidence
            
            self.stats['total_detections'] = len(detections)
            self.stats['avg_confidence'] = round(
                total_confidence / len(detections), 3
            ) if detections else 0
            self.stats['last_update'] = datetime.now()
            
            return detections
            
        except Exception as e:
            logger.error(f"❌ Frame processing error: {str(e)}")
            return []
    
    def get_current_frame(self, annotated=True):
        """Get current frame"""
        with self.frame_lock:
            if self.current_frame is None:
                return None
            frame = self.current_frame.copy()
            detections = self.current_detections.copy()
        
        if annotated and detections:
            frame = self._annotate_frame(frame, detections)
        
        return frame
    
    def _annotate_frame(self, frame, detections):
        """Draw bounding boxes (skip bounding boxes if synthetic, as generator already draws styled ones)"""
        # If synthetic, we only want to draw global stats, not re-draw square boxes
        is_synthetic = (self.video_source == "synthetic")
        
        if not is_synthetic:
            for det in detections:
                x1, y1, x2, y2 = det['bbox']
                confidence = det['confidence']
                class_name = det['class']
                
                color = (0, 255, 0)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                
                label = f"{class_name} {confidence:.2f}"
                cv2.putText(frame, label, (x1, y1 - 5),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        
        # Stats overlay is now optional, as frontend overlay handles FPS & Object count nicely.
        # But we'll leave it out to exactly match the clean mockup design in temp.md.
        
        return frame
    
    def get_detection_data(self):
        """Get detection data in API format"""
        with self.frame_lock:
            detections = self.current_detections.copy()
        
        class_counts = {}
        for det in detections:
            class_name = det['class']
            class_counts[class_name] = class_counts.get(class_name, 0) + 1
        
        activity_level = min(100, len(detections) * 10)
        
        return {
            'farm_id': self.farm_id,
            'timestamp': datetime.now().isoformat(),
            'total_objects': len(detections),
            'detections': detections,
            'class_counts': class_counts,
            'activity_level': activity_level,
            'processing_fps': round(self.stats['fps'], 1),
            'camera_status': 'active',
            'mode': 'video_synthetic',
            'stats': self.stats.copy()
        }

# =====================================================
# Farm Database and Detectors mapping
# =====================================================

FARM_DB = [
    {"id": 1, "name": "Healthy Farm 1", "location": "Nakhon Pathom", "base_temp": 30.5, "base_humidity": 65},
    {"id": 2, "name": "Healthy Farm 2", "location": "Suphan Buri", "base_temp": 31.0, "base_humidity": 70},
    {"id": 3, "name": "Healthy Farm 3", "location": "Ratchaburi", "base_temp": 29.5, "base_humidity": 60}
]

detectors = {}
for farm in FARM_DB:
    detectors[farm["id"]] = VideoDetector(video_source=VIDEO_SOURCE, farm_id=farm["id"])

# =====================================================
# API Endpoints (same as webcam version)
# =====================================================

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting ChickGuard Video AI System (Multi-Farm)...")
    for farm_id, detector in detectors.items():
        success = detector.start()
        if success:
            logger.info(f"✅ Video AI detection started for Farm {farm_id}")
        else:
            logger.error(f"❌ Failed to start detector for Farm {farm_id}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Shutting down...")
    for farm_id, detector in detectors.items():
        detector.stop()

@app.get("/")
async def root():
    return {
        "message": "ChickGuard Video AI API (Multi-Farm)",
        "version": "4.0.0",
        "status": "running",
        "active_farms": list(detectors.keys())
    }

@app.get("/api/detection/live")
async def get_live_detection(farm_id: int = 1):
    """Get live detection with behavior analysis for a specific farm"""
    detector = detectors.get(farm_id)
    if not detector:
        return {"error": "Farm not found"}
        
    detection_data = detector.get_detection_data()
    detections = detector.current_detections
    
    # Analyze behavior
    behavior_data = behavior_analyzer.analyze(detections)
    
    # Calculate risk score
    risk_data = risk_calculator.calculate_risk_score(behavior_data)
    
    return {
        "detection": detection_data,
        "behavior": behavior_data,
        "risk": risk_data,
        "mode": "video_synthetic",
        "yolo_enabled": YOLO_AVAILABLE
    }

@app.get("/api/dashboard")
async def get_dashboard():
    """Dashboard aggregating all farms data"""
    farm_responses = []
    total_objects = 0
    today_alerts = []
    total_risk = 0
    
    for farm in FARM_DB:
        detector = detectors.get(farm["id"])
        if not detector:
            continue
            
        detection = detector.get_detection_data()
        detections = detector.current_detections
        
        behavior_data = behavior_analyzer.analyze(detections)
        risk_data = risk_calculator.calculate_risk_score(behavior_data)
        
        total_objects += detection['total_objects']
        total_risk += risk_data['risk_score']
        
        if risk_data.get('anomalies'):
            # Convert anomalies to alert format
            for anom in risk_data['anomalies']:
                 today_alerts.append({
                     "id": str(int(time.time())) + str(farm["id"]),
                     "farmId": str(farm["id"]),
                     "farmName": farm["name"],
                     "type": "alert" if anom['severity'] == 'high' else "warning",
                     "severity": anom['severity'],
                     "message": anom['description'],
                     "timestamp": datetime.now().strftime("%H:%M"),
                     "read": False,
                     "camera": "CAM-01",
                     "zone": "A"
                 })
        
        farm_responses.append({
            "id": str(farm["id"]),
            "name": farm["name"],
            "location": farm["location"],
            "totalChickens": detection['total_objects'] * CHICKEN_SCALE_FACTOR,  # Configurable via CHICKEN_SCALE_FACTOR env
            "healthScore": max(0, 100 - risk_data['risk_score']),
            "riskScore": risk_data['risk_score'],
            "riskLevel": risk_data['risk_level'],
            "status": "warning" if risk_data['risk_score'] > 50 else "good",
            "camera_status": "active",
            "temperature": round(farm["base_temp"] + (time.time() % 3), 1),
            "humidity": round(farm["base_humidity"] + (time.time() % 5), 1),
            "lastUpdate": datetime.now().isoformat(),
        })
        
    avg_risk = total_risk / len(FARM_DB) if len(FARM_DB) > 0 else 0
    return {
        "totalChickens": total_objects * CHICKEN_SCALE_FACTOR,
        "todayAlerts": len(today_alerts),
        "averageHealth": round(max(0, 100 - avg_risk), 1),
        "farms": farm_responses,
        "alerts": today_alerts,
        "riskTrend": get_risk_trend_internal() # Reusing risk trend format
    }

def get_risk_trend_internal():
    """Format risk trend from real risk_calculator history. Falls back to synthetic if no history yet."""
    history = risk_calculator.risk_history
    now = datetime.now()

    if len(history) >= 2:
        # Sample up to 24 evenly-spaced points from real history
        step = max(1, len(history) // 24)
        sampled = history[::step][-24:]
        trend = []
        for i, record in enumerate(sampled):
            # Parse timestamp or use sequential labels
            try:
                ts = datetime.fromisoformat(record['timestamp'])
                label = ts.strftime("%H:%M")
            except Exception:
                label = f"{i*1:02d}:00"
            trend.append({"time": label, "risk": round(record['risk_score'])})
        return trend
    else:
        # Cold start fallback — synthetic until real history accumulates
        trend = []
        for i in range(24):
            t = (now - timedelta(hours=23 - i)).strftime("%H:00")
            trend.append({"time": t, "risk": int(20 + (10 * np.sin(i)) + np.random.randint(0, 10))})
        return trend

@app.get("/api/risk/current")
async def get_current_risk(farm_id: int = 1):
    """Get current disease risk score for a farm"""
    detector = detectors.get(farm_id)
    if not detector:
        return {"error": "Farm not found"}
        
    detections = detector.current_detections
    behavior_data = behavior_analyzer.analyze(detections)
    risk_data = risk_calculator.calculate_risk_score(behavior_data)
    
    return {
        "timestamp": datetime.now().isoformat(),
        "risk_score": risk_data['risk_score'],
        "risk_level": risk_data['risk_level'],
        "urgency": risk_data['urgency'],
        "anomalies": risk_data['anomalies'],
        "recommendations": risk_data['recommendations'],
        "behavior_summary": behavior_analyzer.get_summary()
    }

@app.get("/api/risk/trend")
async def get_risk_trend():
    """Get risk trend over time"""
    return get_risk_trend_internal()

@app.get("/api/analytics")
async def get_analytics():
    """Get analytics aggregated from real behavior and risk history"""
    history = list(behavior_analyzer.detection_history)
    risk_hist = risk_calculator.risk_history

    # --- Health Trend: last 7 data-points from risk history, labeled by day ---
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    if len(risk_hist) >= 7:
        step = max(1, len(risk_hist) // 7)
        sampled = risk_hist[::step][-7:]
        health_trend = [
            {
                "date": days[i % 7],
                "health": round(max(0, 100 - r['risk_score'])),
                "mortality": round(r['risk_score'] / 20)  # rough proxy
            }
            for i, r in enumerate(sampled)
        ]
    else:
        health_trend = [
            {"date": days[i], "health": 85 + i, "mortality": max(0, 2 - i // 2)}
            for i in range(7)
        ]

    # --- Behavior Analysis: bucket detection_history into hourly activity ---
    hour_buckets: dict = {}
    for point in history:
        hour = point['timestamp'].hour if hasattr(point['timestamp'], 'hour') else 0
        if hour not in hour_buckets:
            hour_buckets[hour] = []
        hour_buckets[hour].append(point)

    behavior_analysis = []
    for hour in sorted(hour_buckets.keys()):
        pts = hour_buckets[hour]
        avg_movement = float(np.mean([p['movement'] for p in pts]))
        avg_density = float(np.mean([p['density'] for p in pts]))
        normal_pct = round(max(0, 100 - avg_density))
        abnormal_pct = round(avg_density * 0.8)
        alert_pct = round(max(0, avg_density - 60))
        behavior_analysis.append({
            "hour": hour,
            "activity": round(avg_movement),
            "normal": normal_pct,
            "abnormal": abnormal_pct,
            "alert": alert_pct
        })

    # Fallback if no history yet
    if not behavior_analysis:
        behavior_analysis = [
            {"hour": 0,  "activity": 20, "normal": 95, "abnormal": 5, "alert": 0},
            {"hour": 6,  "activity": 40, "normal": 90, "abnormal": 8, "alert": 2},
            {"hour": 12, "activity": 85, "normal": 88, "abnormal": 10, "alert": 2},
            {"hour": 18, "activity": 65, "normal": 92, "abnormal": 7, "alert": 1}
        ]

    return {
        "healthTrend": health_trend,
        "behaviorAnalysis": behavior_analysis,
        # productionMetrics and diseaseRisk need real IoT/lab data — kept as reference values
        "productionMetrics": [
            {"week": "W1", "weight": 45,  "growth": 10, "mortality": 1},
            {"week": "W2", "weight": 120, "growth": 25, "mortality": 2},
            {"week": "W3", "weight": 250, "growth": 40, "mortality": 1},
            {"week": "W4", "weight": 450, "growth": 65, "mortality": 3}
        ],
        "diseaseRisk": [
            {"disease": "Avian Influenza",      "risk": 15, "trend": "stable"},
            {"disease": "Newcastle Disease",    "risk": 5,  "trend": "down"},
            {"disease": "Infectious Bronchitis", "risk": 45, "trend": "up"}
        ]
    }

@app.get("/api/farm/{farm_id}")
async def get_farm_detail(farm_id: int):
    """Get detail for a specific farm"""
    detector = detectors.get(farm_id)
    if not detector:
        return {"error": "Farm not found"}
        
    farm_info = next((f for f in FARM_DB if f["id"] == farm_id), None)
    if not farm_info:
        return {"error": "Farm info not found"}

    detection = detector.get_detection_data()
    detections = detector.current_detections
    behavior_data = behavior_analyzer.analyze(detections)
    risk_data = risk_calculator.calculate_risk_score(behavior_data)

    active_chickens = detection['total_objects'] * CHICKEN_SCALE_FACTOR  # Configurable via CHICKEN_SCALE_FACTOR env
    health_score = max(0, 100 - risk_data['risk_score'])  # Same formula as dashboard
    # Split total between 2 cameras (55% / 45%) so they add up to the stats card total
    cam1_det = round(active_chickens * 0.55)
    cam2_det = active_chickens - cam1_det  # ensures cam1 + cam2 = total exactly
    health_score_int = round(health_score)

    return {
        "farmId": str(farm_id),
        "name": farm_info["name"],
        "healthScore": health_score_int,
        "cameras": [
            {"id": "cam1", "name": "Main Barn", "status": "active", "zone": "Zone A", "location": "North", "lastImage": "", "detections": cam1_det, "healthScore": health_score_int},
            {"id": "cam2", "name": "Feeding Area", "status": "active", "zone": "Zone B", "location": "Center", "lastImage": "", "detections": cam2_det, "healthScore": health_score_int}
        ],
        "behaviorData": [
            {"hour": 8, "activity": 60, "feeding": 30, "resting": 10},
            {"hour": 12, "activity": 80, "feeding": 15, "resting": 5},
            {"hour": 16, "activity": 55, "feeding": 25, "resting": 20}
        ],
        "environmentData": [
             {"time": "08:00", "temperature": 24, "humidity": 60},
             {"time": "12:00", "temperature": 27, "humidity": 55},
             {"time": "16:00", "temperature": 25, "humidity": 58}
        ],
        "currentStats": {
            "temperature": farm_info["base_temp"],
            "humidity": farm_info["base_humidity"],
            "activeChickens": active_chickens,
            "feedingRate": 85,
            "waterConsumption": 450
        }
    }

@app.get("/api/settings")
async def get_settings():
    """Get mock settings"""
    return {
        "notifications": {
            "email": True,
            "sms": False,
            "push": True,
            "alertThreshold": "medium"
        },
        "monitoring": {
            "detectionSensitivity": 85,
            "recordingEnabled": True,
            "motionDetection": True,
            "nightVision": True
        },
        "alerts": {
            "healthScore": 80,
            "temperature": {"min": 20, "max": 28},
            "humidity": {"min": 50, "max": 70},
            "abnormalBehavior": True
        },
        "system": {
            "language": "en",
            "timezone": "Asia/Bangkok",
            "autoBackup": True,
            "dataRetention": 30
        }
    }

@app.get("/api/video_feed")
async def video_feed(farm_id: int = 1):
    """Stream video feed for specific farm"""
    detector = detectors.get(farm_id)
    if not detector:
        return {"error": "Farm not found"}
        
    def generate():
        while True:
            frame = detector.get_current_frame(annotated=True)
            
            if frame is not None:
                ret, buffer = cv2.imencode('.jpg', frame)
                if ret:
                    frame_bytes = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            time.sleep(1 / 30)
    
    return StreamingResponse(
        generate(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/api/stats")
async def get_stats():
    return {
        "stats": detector.stats,
        "yolo_available": YOLO_AVAILABLE,
        "video_source": VIDEO_SOURCE,
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "process_fps": PROCESS_FPS
    }

# =====================================================
# LINE Notification Endpoints
# =====================================================

# เก็บ User ID ทุกคนที่แอด Bot (in-memory)
line_subscribers: List[str] = []

@app.post("/webhook/line")
async def line_webhook(request: Request):
    """LINE Webhook — รับ event เมื่อมีคนแอด Bot แล้วเก็บ User ID + ส่ง welcome ทันที"""
    try:
        body = await request.json()
    except Exception:
        return {"status": "ok"}

    events = body.get("events", [])
    for event in events:
        user_id = event.get("source", {}).get("userId")
        event_type = event.get("type")  # follow, message, etc.

        if user_id and user_id not in line_subscribers:
            line_subscribers.append(user_id)
            logger.info(f"📱 New LINE subscriber: {user_id[:8]}... (event: {event_type})")

            # ส่ง welcome message ทันทีที่แอด
            for ch in notification_manager.channels:
                if hasattr(ch, 'send_message_to'):
                    ch.send_message_to(
                        user_id,
                        "🐔 สวัสดีครับ! ยินดีต้อนรับสู่ ChickGuard\n\n"
                        "━━━━━━━━━━━━━━━━\n"
                        "🤖 ระบบ AI เฝ้าระวังฟาร์มไก่\n"
                        "🚨 แจ้งเตือนทันทีเมื่อตรวจพบความผิดปกติ\n"
                        "📊 วิเคราะห์พฤติกรรมและความเสี่ยงโรค\n"
                        "━━━━━━━━━━━━━━━━\n"
                        "✅ คุณจะได้รับการแจ้งเตือนอัตโนมัติแล้ว!"
                    )
    return {"status": "ok"}

@app.get("/api/notify/subscribers")
async def get_subscribers():
    """ดูจำนวนและรายการคนที่แอด Bot"""
    return {
        "count": len(line_subscribers),
        "subscribers": [uid[:8] + "..." for uid in line_subscribers]
    }

@app.post("/api/notify/broadcast")
async def broadcast_alert(risk_score: float = 75.0, risk_level: str = "high"):
    """ส่ง alert ไปหาทุกคนที่แอด Bot (ใช้ตอน pitch!)"""
    if not line_subscribers:
        return {"success": False, "message": "❌ ยังไม่มีคนแอด Bot เลย — ให้ scan QR ก่อน"}

    message = (
        f"🚨 ChickGuard AI Alert!\n"
        f"━━━━━━━━━━━━━━━━\n"
        f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        f"📊 Risk Score: {risk_score}/100\n"
        f"🎯 Risk Level: {risk_level.upper()}\n\n"
        f"💡 กรุณาตรวจสอบฟาร์มทันที!\n"
        f"━━━━━━━━━━━━━━━━\n"
        f"🐔 ChickGuard System"
    )

    results = []
    for uid in line_subscribers:
        ok = False
        for ch in notification_manager.channels:
            if hasattr(ch, 'send_message_to'):
                ok = ch.send_message_to(uid, message)
                break
        results.append({"user": uid[:8] + "...", "success": ok})

    success_count = sum(1 for r in results if r["success"])
    return {
        "success": success_count > 0,
        "sent_to": success_count,
        "total_subscribers": len(line_subscribers),
        "results": results
    }

@app.post("/api/notify/test")
async def notify_test():
    """ส่ง test message ไปทุก channel ที่ configured (LINE, Email) เพื่อทดสอบ"""
    results = notification_manager.test_all_channels()
    any_success = any(results.values())
    return {
        "success": any_success,
        "results": results,
        "message": "✅ Test message sent! Check your LINE app." if any_success else "❌ No channels configured. Set LINE_CHANNEL_ACCESS_TOKEN and LINE_USER_ID in .env"
    }

@app.post("/api/notify/alert")
async def notify_alert(risk_score: float = 75.0, risk_level: str = "high"):
    """ส่ง alert จริง โดยกำหนด risk_score และ risk_level เอง (high/medium/low)"""
    risk_data = {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "urgency": "immediate" if risk_level == "high" else "moderate",
        "anomalies": [
            {"description": f"Manual alert triggered via API (score: {risk_score})"}
        ],
        "recommendations": [
            {"priority": "urgent" if risk_level == "high" else "high", "icon": "🔍", "action": "ตรวจสอบฟาร์มทันที"}
        ]
    }
    results = notification_manager.send_alert(risk_data)
    any_success = any(results.values())
    return {
        "success": any_success,
        "results": results,
        "message": f"✅ Alert sent! (risk_level={risk_level}, score={risk_score})" if any_success else "❌ No channels configured. Check .env"
    }

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("🐔 ChickGuard Video AI System (No Webcam Needed!)")
    print("=" * 60)
    print(f"🎬 Video Source: {VIDEO_SOURCE}")
    print(f"🎯 Confidence Threshold: {CONFIDENCE_THRESHOLD}")
    print(f"⚡ Processing FPS: {PROCESS_FPS}")
    print(f"📦 YOLOv8 Available: {YOLO_AVAILABLE}")
    print(f"✅ No webcam permission needed!")
    print("=" * 60)
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
