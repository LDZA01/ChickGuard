#!/usr/bin/env python3
"""
Alternative: Use video file instead of webcam
For development when webcam permission issues occur
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
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
    """Generate synthetic frames for testing without camera"""
    
    def __init__(self, width=1280, height=720):
        self.width = width
        self.height = height
        self.frame_count = 0
        
    def generate_frame(self):
        """Generate a frame with moving objects"""
        # Create blank frame
        frame = np.zeros((self.height, self.width, 3), dtype=np.uint8)
        
        # Background gradient
        for i in range(self.height):
            intensity = int(180 + (i / self.height) * 40)
            frame[i, :] = [intensity, intensity, intensity]
        
        # Add timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cv2.putText(frame, f"Synthetic Frame - {timestamp}", 
                   (30, 40), cv2.FONT_HERSHEY_SIMPLEX, 
                   0.8, (0, 255, 0), 2)
        
        # Add frame counter
        cv2.putText(frame, f"Frame: {self.frame_count}", 
                   (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 
                   0.7, (255, 255, 0), 2)
        
        # Add moving "objects" (circles)
        num_objects = np.random.randint(3, 8)
        t = self.frame_count * 0.05
        
        for i in range(num_objects):
            # Calculate position (circular motion)
            cx = int(self.width/2 + 200 * np.cos(t + i * 2 * np.pi / num_objects))
            cy = int(self.height/2 + 150 * np.sin(t + i * 2 * np.pi / num_objects))
            
            # Draw object
            radius = np.random.randint(20, 40)
            color = (
                np.random.randint(100, 255),
                np.random.randint(100, 255),
                np.random.randint(100, 255)
            )
            cv2.circle(frame, (cx, cy), radius, color, -1)
            cv2.circle(frame, (cx, cy), radius, (0, 0, 0), 2)
            
            # Add label
            cv2.putText(frame, f"Object {i+1}", 
                       (cx - 30, cy - radius - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        
        # Add info box
        cv2.rectangle(frame, (20, self.height - 100), (400, self.height - 20), 
                     (0, 0, 0), -1)
        cv2.rectangle(frame, (20, self.height - 100), (400, self.height - 20), 
                     (0, 255, 0), 2)
        
        info_lines = [
            "✅ No webcam needed!",
            "✅ Synthetic frame mode",
            f"✅ Objects: {num_objects}"
        ]
        
        y_pos = self.height - 80
        for line in info_lines:
            cv2.putText(frame, line, (30, y_pos),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
            y_pos += 25
        
        self.frame_count += 1
        return frame

# Use synthetic generator instead of webcam
class VideoDetector:
    """Real-time object detection using YOLOv8 with video file or synthetic frames"""
    
    def __init__(self, video_source="synthetic", model_name='yolov8n.pt'):
        self.video_source = video_source
        self.model_name = model_name
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
                logger.info("🎨 Using synthetic frame generator (no camera needed!)")
                self.frame_generator = SyntheticFrameGenerator()
                logger.info("✅ Synthetic generator initialized")
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
        """Draw bounding boxes"""
        for det in detections:
            x1, y1, x2, y2 = det['bbox']
            confidence = det['confidence']
            class_name = det['class']
            
            color = (0, 255, 0)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            label = f"{class_name} {confidence:.2f}"
            cv2.putText(frame, label, (x1, y1 - 5),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        
        # Stats overlay
        cv2.putText(frame, f"FPS: {self.stats['fps']:.1f}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(frame, f"Objects: {len(detections)}", (10, 60),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
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
            'farm_id': 1,
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

# Initialize detector
detector = VideoDetector(video_source=VIDEO_SOURCE)

# =====================================================
# API Endpoints (same as webcam version)
# =====================================================

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting ChickGuard Video AI System...")
    success = detector.start()
    if success:
        logger.info("✅ Video AI detection started (no webcam needed!)")
    else:
        logger.error("❌ Failed to start detector")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Shutting down...")
    detector.stop()

@app.get("/")
async def root():
    return {
        "message": "ChickGuard Video AI API (No webcam needed!)",
        "version": "3.1.0",
        "status": "running",
        "mode": "video_synthetic",
        "yolo_available": YOLO_AVAILABLE,
        "webcam_needed": False
    }

@app.get("/api/detection/live")
async def get_live_detection():
    """Get live detection with behavior analysis"""
    detection_data = detector.get_detection_data()
    detections = detector.current_detections
    
    # Analyze behavior
    behavior_data = behavior_analyzer.analyze(detections)
    
    # Calculate risk score
    risk_data = risk_calculator.calculate_risk_score(behavior_data)
    
    # Check if alert should be sent
    if risk_data['alert_required']:
        should_send, reason = risk_calculator.should_send_alert(
            risk_data['risk_score'],
            getattr(notification_manager, 'last_alert_time', None)
        )
        
        if should_send:
            results = notification_manager.send_alert(risk_data)
            notification_manager.last_alert_time = datetime.now()
            risk_data['alert_sent'] = results
    
    return {
        "detection": detection_data,
        "behavior": behavior_data,
        "risk": risk_data,
        "mode": "video_synthetic",
        "yolo_enabled": YOLO_AVAILABLE
    }

@app.get("/api/dashboard")
async def get_dashboard():
    """Dashboard with disease risk monitoring"""
    detection = detector.get_detection_data()
    detections = detector.current_detections
    
    # Get behavior and risk analysis
    behavior_data = behavior_analyzer.analyze(detections)
    risk_data = risk_calculator.calculate_risk_score(behavior_data)
    
    farms = [{
        "id": 1,
        "name": "ChickGuard Farm - One Health System 🐔",
        "location": "Smart Farm",
        "objects": detection['total_objects'],
        "healthScore": max(0, 100 - risk_data['risk_score']),  # Inverse of risk
        "riskScore": risk_data['risk_score'],
        "riskLevel": risk_data['risk_level'],
        "status": "active",
        "camera_status": "synthetic",
        "detections": detection['class_counts'],
        "lastUpdate": datetime.now().isoformat(),
        "anomalies": len(risk_data.get('anomalies', [])),
        "behaviorStatus": behavior_data['behavior_scores']['activity_level']
    }]
    
    return {
        "totalObjects": detection['total_objects'],
        "todayAlerts": len(risk_data.get('anomalies', [])),
        "systemEfficiency": round(detector.stats['fps'] / PROCESS_FPS * 100, 1),
        "riskScore": risk_data['risk_score'],
        "riskLevel": risk_data['risk_level'],
        "farms": farms,
        "realTimeData": {
            "detection": detection,
            "behavior": behavior_data,
            "risk": risk_data
        },
        "mode": "one_health_system"
    }

@app.get("/api/risk/current")
async def get_current_risk():
    """Get current disease risk score"""
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
    trend = risk_calculator.get_risk_trend(duration_minutes=60)
    return trend

@app.get("/api/behavior/summary")
async def get_behavior_summary():
    """Get behavior analysis summary"""
    return behavior_analyzer.get_summary()

@app.post("/api/alert/test")
async def test_alert():
    """Test all notification channels"""
    # Create test risk data
    test_risk = {
        'risk_score': 75,
        'risk_level': 'high',
        'urgency': 'urgent',
        'anomalies': [{
            'type': 'test',
            'severity': 'high',
            'description': 'This is a test alert'
        }],
        'recommendations': [{
            'priority': 'urgent',
            'action': 'Test notification',
            'reason': 'Testing notification system',
            'icon': '🧪'
        }]
    }
    
    results = notification_manager.send_alert(test_risk)
    
    return {
        "success": any(results.values()),
        "results": results,
        "message": "Test alerts sent to all configured channels",
        "channels_status": notification_manager.get_status()
    }

@app.get("/api/notifications/status")
async def get_notification_status():
    """Get notification channels status"""
    return notification_manager.get_status()

@app.post("/api/notifications/test-all")
async def test_all_notifications():
    """Test all configured notification channels"""
    results = notification_manager.test_all_channels()
    
    return {
        "results": results,
        "success": any(results.values()),
        "message": "Connection tests completed"
    }

@app.get("/api/video_feed")
async def video_feed():
    """Stream video feed"""
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
