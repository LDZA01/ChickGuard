"""
Disease Risk Score Calculator for ChickGuard
Calculates risk score based on behavioral anomalies
Following One Health principles
"""
import numpy as np
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

TZ_TH = timezone(timedelta(hours=7))

def now_th() -> datetime:
    return datetime.now(TZ_TH)


class RiskScoreCalculator:
    """
    Calculates Disease Risk Score from behavior analysis
    Score: 0-100 (0=safe, 100=critical)
    """
    
    # Risk weights for different anomalies
    ANOMALY_WEIGHTS = {
        'reduced_movement': 20,
        'excessive_clustering': 25,
        'overcrowding': 15,
        'sudden_decrease': 30,
        'prolonged_inactivity': 25
    }
    
    # Severity multipliers
    SEVERITY_MULTIPLIERS = {
        'low': 0.5,
        'medium': 1.0,
        'high': 1.5
    }
    
    def __init__(self):
        self.risk_history = []
        self.alert_threshold_medium = 40
        self.alert_threshold_high = 70
        logger.info("📊 RiskScoreCalculator initialized")
    
    def calculate_risk_score(self, behavior_data: Dict) -> Dict:
        """
        Calculate comprehensive risk score
        
        Args:
            behavior_data: Output from BehaviorAnalyzer.analyze()
            
        Returns:
            Dictionary with risk score and recommendations
        """
        anomalies = behavior_data.get('anomalies', [])
        behavior_scores = behavior_data.get('behavior_scores', {})
        trends = behavior_data.get('trends', {})
        
        # Calculate base risk from anomalies
        anomaly_risk = self._calculate_anomaly_risk(anomalies)
        
        # Calculate risk from behavior patterns
        pattern_risk = self._calculate_pattern_risk(behavior_scores)
        
        # Calculate risk from trends
        trend_risk = self._calculate_trend_risk(trends)
        
        # Combined risk score (weighted average)
        total_risk = (
            anomaly_risk * 0.5 +     # Anomalies are most important
            pattern_risk * 0.3 +      # Patterns are secondary
            trend_risk * 0.2          # Trends provide context
        )
        
        # Ensure 0-100 range
        total_risk = max(0, min(100, total_risk))
        
        # Determine risk level
        risk_level = self._get_risk_level(total_risk)
        
        # Get recommendations
        recommendations = self._get_recommendations(
            total_risk, anomalies, behavior_scores
        )
        
        # Store in history
        risk_record = {
            'timestamp': now_th().isoformat(),
            'risk_score': total_risk,
            'risk_level': risk_level,
            'anomaly_risk': anomaly_risk,
            'pattern_risk': pattern_risk,
            'trend_risk': trend_risk
        }
        self.risk_history.append(risk_record)
        
        # Keep last 1000 records
        if len(self.risk_history) > 1000:
            self.risk_history = self.risk_history[-1000:]
        
        return {
            'risk_score': round(total_risk, 2),
            'risk_level': risk_level,
            'components': {
                'anomaly_risk': round(anomaly_risk, 2),
                'pattern_risk': round(pattern_risk, 2),
                'trend_risk': round(trend_risk, 2)
            },
            'anomalies_detected': len(anomalies),
            'anomalies': anomalies,
            'recommendations': recommendations,
            'alert_required': total_risk >= self.alert_threshold_medium,
            'urgency': self._get_urgency(total_risk)
        }
    
    def _calculate_anomaly_risk(self, anomalies: List[Dict]) -> float:
        """Calculate risk score from detected anomalies"""
        if not anomalies:
            return 0.0
        
        total_risk = 0.0
        
        for anomaly in anomalies:
            anomaly_type = anomaly.get('type', 'unknown')
            severity = anomaly.get('severity', 'medium')
            
            # Get base weight for this anomaly type
            base_weight = self.ANOMALY_WEIGHTS.get(anomaly_type, 10)
            
            # Apply severity multiplier
            severity_mult = self.SEVERITY_MULTIPLIERS.get(severity, 1.0)
            
            # Calculate weighted risk
            weighted_risk = base_weight * severity_mult
            total_risk += weighted_risk
        
        # Cap at 100
        return min(100, total_risk)
    
    def _calculate_pattern_risk(self, behavior_scores: Dict) -> float:
        """Calculate risk from behavior patterns"""
        movement = behavior_scores.get('movement_score', 50)
        density = behavior_scores.get('density_score', 30)
        clustering = behavior_scores.get('clustering_score', 0)
        
        risk = 0.0
        
        # Low movement is risky
        if movement < 30:
            risk += (30 - movement) * 1.5
        
        # High density is risky
        if density > 70:
            risk += (density - 70) * 1.2
        
        # High clustering is risky
        if clustering > 60:
            risk += (clustering - 60) * 1.0
        
        return min(100, risk)
    
    def _calculate_trend_risk(self, trends: Dict) -> float:
        """Calculate risk from behavior trends"""
        movement_trend = trends.get('movement_trend', 'stable')
        density_trend = trends.get('density_trend', 'stable')
        
        risk = 0.0
        
        # Decreasing movement is concerning
        if movement_trend == 'decreasing':
            risk += 20
        
        # Increasing density is concerning
        if density_trend == 'increasing':
            risk += 15
        
        return risk
    
    def _get_risk_level(self, risk_score: float) -> str:
        """Convert risk score to risk level"""
        if risk_score < 30:
            return 'low'
        elif risk_score < 70:
            return 'medium'
        else:
            return 'high'
    
    def _get_urgency(self, risk_score: float) -> str:
        """Get urgency level for alerts"""
        if risk_score < 30:
            return 'normal'
        elif risk_score < 50:
            return 'monitor'
        elif risk_score < 70:
            return 'attention'
        else:
            return 'urgent'
    
    def _get_recommendations(
        self, 
        risk_score: float, 
        anomalies: List[Dict],
        behavior_scores: Dict
    ) -> List[Dict]:
        """
        Generate actionable recommendations based on risk analysis
        """
        recommendations = []
        
        # High risk - immediate action required
        if risk_score >= 70:
            recommendations.append({
                'priority': 'urgent',
                'action': 'Inspect barn immediately',
                'reason': 'High risk — possible disease outbreak detected',
                'icon': '🚨'
            })
            recommendations.append({
                'priority': 'urgent',
                'action': 'Contact veterinarian',
                'reason': 'Expert assessment required',
                'icon': '👨‍⚕️'
            })
        
        # Medium risk - monitoring required
        elif risk_score >= 40:
            recommendations.append({
                'priority': 'high',
                'action': 'Increase monitoring frequency',
                'reason': 'Moderate risk — close observation needed',
                'icon': '⚠️'
            })
        
        # Specific recommendations based on anomalies
        anomaly_types = [a['type'] for a in anomalies]
        
        if 'reduced_movement' in anomaly_types or 'prolonged_inactivity' in anomaly_types:
            recommendations.append({
                'priority': 'high',
                'action': 'Check chicken movement patterns',
                'reason': 'Reduced movement detected — possible sign of illness',
                'icon': '🐔'
            })
            recommendations.append({
                'priority': 'medium',
                'action': 'Check temperature and humidity',
                'reason': 'Environment may be affecting behavior',
                'icon': '🌡️'
            })
        
        if 'excessive_clustering' in anomaly_types:
            recommendations.append({
                'priority': 'high',
                'action': 'Investigate abnormal clustering',
                'reason': 'Chickens clustering unusually — may indicate heat stress or cold',
                'icon': '👥'
            })
        
        if 'overcrowding' in anomaly_types:
            recommendations.append({
                'priority': 'medium',
                'action': 'Adjust space allocation',
                'reason': 'Density too high — increases disease transmission risk',
                'icon': '📏'
            })
        
        if 'sudden_decrease' in anomaly_types:
            recommendations.append({
                'priority': 'urgent',
                'action': 'Count flock and check mortality rate',
                'reason': 'Sudden population decrease detected',
                'icon': '📉'
            })
        
        # General recommendations
        if behavior_scores.get('movement_score', 50) < 40:
            recommendations.append({
                'priority': 'medium',
                'action': 'Check feed and water supply',
                'reason': 'Low activity — possible food or water shortage',
                'icon': '🍚'
            })
        
        if not recommendations:
            recommendations.append({
                'priority': 'low',
                'action': 'Continue normal operations',
                'reason': 'Behavior within normal parameters',
                'icon': '✅'
            })
        
        return recommendations
    
    def get_risk_trend(self, duration_minutes: int = 60) -> Dict:
        """
        Get risk trend over specified duration
        """
        if not self.risk_history:
            return {
                'status': 'no_data',
                'trend': 'unknown'
            }
        
        # Get recent history
        recent = self.risk_history[-duration_minutes:] if len(self.risk_history) >= duration_minutes else self.risk_history
        
        if len(recent) < 2:
            return {
                'status': 'insufficient_data',
                'trend': 'unknown'
            }
        
        scores = [r['risk_score'] for r in recent]
        
        # Calculate trend
        x = np.arange(len(scores))
        slope = np.polyfit(x, scores, 1)[0]
        
        if slope > 1:
            trend = 'increasing'
            status = 'warning'
        elif slope < -1:
            trend = 'decreasing'
            status = 'improving'
        else:
            trend = 'stable'
            status = 'normal'
        
        return {
            'status': status,
            'trend': trend,
            'current_score': scores[-1],
            'average_score': np.mean(scores),
            'min_score': min(scores),
            'max_score': max(scores),
            'data_points': len(scores)
        }
    
    def should_send_alert(self, risk_score: float, last_alert_time: datetime = None) -> Tuple[bool, str]:
        """
        Determine if alert should be sent
        Includes cooldown to prevent alert spam
        
        Returns:
            (should_send, reason)
        """
        # Always alert on high risk
        if risk_score >= self.alert_threshold_high:
            return True, 'high_risk'
        
        # Alert on medium risk if no recent alert
        if risk_score >= self.alert_threshold_medium:
            if last_alert_time is None:
                return True, 'medium_risk'
            
            # Check cooldown (15 minutes)
            time_since_alert = (now_th() - last_alert_time).total_seconds() / 60
            if time_since_alert >= 15:
                return True, 'medium_risk_cooldown_expired'
        
        return False, 'below_threshold'
