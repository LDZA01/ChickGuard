"""
Behavior Analysis Module for ChickGuard
Analyzes chicken behavior patterns to detect early disease signs
"""
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
from collections import deque
import logging

logger = logging.getLogger(__name__)


class BehaviorAnalyzer:
    """
    Analyzes chicken behavior from detection data
    Detects anomalies that may indicate disease
    """
    
    def __init__(self, history_window=300):  # 5 minutes at 1 detection/sec
        """
        Args:
            history_window: Number of frames to keep in history
        """
        self.history_window = history_window
        
        # History buffers
        self.detection_history = deque(maxlen=history_window)
        self.movement_history = deque(maxlen=history_window)
        self.density_history = deque(maxlen=history_window)
        
        # Baseline values (learned from normal behavior)
        self.baseline_movement = 50.0  # Average movement score
        self.baseline_density = 30.0   # Average density
        self.baseline_objects = 5      # Average object count
        
        # Thresholds for anomaly detection
        self.movement_threshold = 0.6   # 60% below baseline = anomaly
        self.density_threshold = 1.5    # 150% above baseline = overcrowding
        self.inactivity_threshold = 0.3 # 30% below baseline = too inactive
        
        logger.info("🧠 BehaviorAnalyzer initialized")
    
    def analyze(self, detections: List[Dict]) -> Dict:
        """
        Analyze current detections for behavioral anomalies
        
        Args:
            detections: List of detection objects from YOLO
            
        Returns:
            Dictionary with behavior analysis results
        """
        timestamp = datetime.now()
        
        # Calculate metrics
        object_count = len(detections)
        movement_score = self._calculate_movement(detections)
        density_score = self._calculate_density(detections)
        clustering_score = self._calculate_clustering(detections)
        
        # Store in history
        data_point = {
            'timestamp': timestamp,
            'object_count': object_count,
            'movement': movement_score,
            'density': density_score,
            'clustering': clustering_score
        }
        
        self.detection_history.append(data_point)
        self.movement_history.append(movement_score)
        self.density_history.append(density_score)
        
        # Detect anomalies
        anomalies = self._detect_anomalies(data_point)
        
        # Calculate behavior scores
        behavior_scores = {
            'movement_score': movement_score,
            'density_score': density_score,
            'clustering_score': clustering_score,
            'activity_level': self._calculate_activity_level(movement_score),
            'crowding_level': self._calculate_crowding_level(density_score)
        }
        
        return {
            'timestamp': timestamp.isoformat(),
            'object_count': object_count,
            'behavior_scores': behavior_scores,
            'anomalies': anomalies,
            'trends': self._calculate_trends()
        }
    
    def _calculate_movement(self, detections: List[Dict]) -> float:
        """
        Calculate movement score based on detection positions
        Compares current positions with previous frame
        """
        if not detections or len(self.detection_history) == 0:
            return 50.0  # Default mid-range
        
        # Simple movement estimation based on position variance
        if len(detections) < 2:
            return 30.0  # Low movement with few objects
        
        # Calculate spread of objects (more spread = more movement)
        centers = [d['center'] for d in detections if 'center' in d]
        if not centers:
            return 50.0
        
        centers_array = np.array(centers)
        std_x = np.std(centers_array[:, 0])
        std_y = np.std(centers_array[:, 1])
        
        # Normalize to 0-100 scale
        movement = min(100, (std_x + std_y) / 10)
        
        return float(movement)
    
    def _calculate_density(self, detections: List[Dict]) -> float:
        """
        Calculate density score (how crowded the space is)
        Higher density = objects closer together
        """
        if len(detections) < 2:
            return 0.0
        
        centers = [d['center'] for d in detections if 'center' in d]
        if len(centers) < 2:
            return 0.0
        
        # Calculate average distance between objects
        centers_array = np.array(centers)
        distances = []
        
        for i in range(len(centers_array)):
            for j in range(i + 1, len(centers_array)):
                dist = np.linalg.norm(centers_array[i] - centers_array[j])
                distances.append(dist)
        
        if not distances:
            return 0.0
        
        avg_distance = np.mean(distances)
        
        # Convert to density score (closer = higher density)
        # Normalize assuming max distance of 500 pixels
        density = max(0, min(100, 100 - (avg_distance / 5)))
        
        return float(density)
    
    def _calculate_clustering(self, detections: List[Dict]) -> float:
        """
        Calculate clustering score (how grouped objects are)
        High clustering may indicate abnormal behavior
        """
        if len(detections) < 3:
            return 0.0
        
        centers = [d['center'] for d in detections if 'center' in d]
        if len(centers) < 3:
            return 0.0
        
        centers_array = np.array(centers)
        
        # Calculate variance in positions
        var_x = np.var(centers_array[:, 0])
        var_y = np.var(centers_array[:, 1])
        
        # Low variance = high clustering
        total_var = var_x + var_y
        clustering = max(0, min(100, 100 - (total_var / 1000)))
        
        return float(clustering)
    
    def _calculate_activity_level(self, movement_score: float) -> str:
        """Convert movement score to activity level"""
        if movement_score < 30:
            return "Very Low"
        elif movement_score < 50:
            return "Low"
        elif movement_score < 70:
            return "Normal"
        elif movement_score < 85:
            return "High"
        else:
            return "Very High"
    
    def _calculate_crowding_level(self, density_score: float) -> str:
        """Convert density score to crowding level"""
        if density_score < 30:
            return "Sparse"
        elif density_score < 50:
            return "Normal"
        elif density_score < 70:
            return "Crowded"
        else:
            return "Very Crowded"
    
    def _detect_anomalies(self, current_data: Dict) -> List[Dict]:
        """
        Detect behavioral anomalies
        Returns list of detected anomalies with severity
        """
        anomalies = []
        
        if len(self.detection_history) < 10:
            return anomalies  # Need more data
        
        # 1. Check for reduced movement (lethargy)
        if current_data['movement'] < self.baseline_movement * self.movement_threshold:
            anomalies.append({
                'type': 'reduced_movement',
                'severity': 'medium',
                'description': 'การเคลื่อนไหวลดลงผิดปกติ',
                'value': current_data['movement'],
                'baseline': self.baseline_movement
            })
        
        # 2. Check for excessive clustering
        if current_data['clustering'] > 70:
            anomalies.append({
                'type': 'excessive_clustering',
                'severity': 'high',
                'description': 'กระจุกตัวแน่นผิดปกติ',
                'value': current_data['clustering'],
                'threshold': 70
            })
        
        # 3. Check for abnormal density
        if current_data['density'] > self.baseline_density * self.density_threshold:
            anomalies.append({
                'type': 'overcrowding',
                'severity': 'medium',
                'description': 'ความหนาแน่นสูงผิดปกติ',
                'value': current_data['density'],
                'baseline': self.baseline_density
            })
        
        # 4. Check for sudden drop in object count
        if len(self.detection_history) > 5:
            recent_counts = [d['object_count'] for d in list(self.detection_history)[-5:]]
            avg_recent = np.mean(recent_counts)
            if current_data['object_count'] < avg_recent * 0.5:
                anomalies.append({
                    'type': 'sudden_decrease',
                    'severity': 'high',
                    'description': 'จำนวนลดลงอย่างกะทันหัน',
                    'value': current_data['object_count'],
                    'expected': avg_recent
                })
        
        # 5. Check for prolonged inactivity
        if len(self.movement_history) >= 30:
            recent_movement = list(self.movement_history)[-30:]
            avg_movement = np.mean(recent_movement)
            if avg_movement < self.baseline_movement * self.inactivity_threshold:
                anomalies.append({
                    'type': 'prolonged_inactivity',
                    'severity': 'high',
                    'description': 'เคลื่อนไหวน้อยเป็นเวลานาน',
                    'value': avg_movement,
                    'baseline': self.baseline_movement
                })
        
        return anomalies
    
    def _calculate_trends(self) -> Dict:
        """
        Calculate behavior trends over time
        """
        if len(self.detection_history) < 10:
            return {
                'movement_trend': 'stable',
                'density_trend': 'stable',
                'confidence': 'low'
            }
        
        # Get recent history
        recent_movement = list(self.movement_history)[-30:] if len(self.movement_history) >= 30 else list(self.movement_history)
        recent_density = list(self.density_history)[-30:] if len(self.density_history) >= 30 else list(self.density_history)
        
        # Calculate trends
        movement_trend = self._calculate_trend(recent_movement)
        density_trend = self._calculate_trend(recent_density)
        
        return {
            'movement_trend': movement_trend,
            'density_trend': density_trend,
            'confidence': 'high' if len(self.detection_history) >= 50 else 'medium'
        }
    
    def _calculate_trend(self, values: List[float]) -> str:
        """
        Calculate if values are increasing, decreasing, or stable
        """
        if len(values) < 5:
            return 'stable'
        
        # Simple linear regression
        x = np.arange(len(values))
        y = np.array(values)
        
        # Calculate slope
        slope = np.polyfit(x, y, 1)[0]
        
        # Determine trend
        if slope > 2:
            return 'increasing'
        elif slope < -2:
            return 'decreasing'
        else:
            return 'stable'
    
    def get_summary(self) -> Dict:
        """Get summary of current behavior analysis"""
        if not self.detection_history:
            return {
                'status': 'no_data',
                'message': 'ยังไม่มีข้อมูลเพียงพอ'
            }
        
        latest = self.detection_history[-1]
        
        # Calculate averages
        avg_movement = np.mean(list(self.movement_history)) if self.movement_history else 50
        avg_density = np.mean(list(self.density_history)) if self.density_history else 30
        
        return {
            'status': 'active',
            'current': {
                'objects': latest['object_count'],
                'movement': latest['movement'],
                'density': latest['density'],
                'clustering': latest['clustering']
            },
            'averages': {
                'movement': float(avg_movement),
                'density': float(avg_density)
            },
            'data_points': len(self.detection_history),
            'monitoring_duration_minutes': len(self.detection_history) / 60  # Assuming 1 per second
        }
