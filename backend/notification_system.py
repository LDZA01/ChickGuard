"""
Unified Notification System for ChickGuard
Supports: LINE Messaging API, Email, SMS (extensible)
"""
import logging
from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from datetime import datetime
import os

logger = logging.getLogger(__name__)


class NotificationChannel(ABC):
    """Abstract base class for notification channels"""
    
    def __init__(self, name: str):
        self.name = name
        self.enabled = False
        
    @abstractmethod
    def send_alert(self, risk_data: Dict) -> bool:
        """Send risk alert notification"""
        pass
    
    @abstractmethod
    def send_daily_report(self, summary_data: Dict) -> bool:
        """Send daily summary report"""
        pass
    
    @abstractmethod
    def test_connection(self) -> bool:
        """Test connection to notification service"""
        pass
    
    def format_alert_message(self, risk_data: Dict) -> str:
        """Format alert message (can be overridden)"""
        risk_score = risk_data['risk_score']
        risk_level = risk_data['risk_level']
        urgency = risk_data['urgency']
        anomalies = risk_data.get('anomalies', [])
        recommendations = risk_data.get('recommendations', [])
        
        emoji_map = {'low': '✅', 'medium': '⚠️', 'high': '🚨'}
        emoji = emoji_map.get(risk_level, '⚠️')
        
        lines = [
            f"\n{emoji} ChickGuard Alert {emoji}",
            f"━━━━━━━━━━━━━━━━",
            f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"",
            f"📊 Disease Risk Score: {risk_score:.1f}/100",
            f"🎯 Risk Level: {risk_level.upper()}",
            f"🔔 Urgency: {urgency.upper()}",
        ]
        
        if anomalies:
            lines.append(f"\n🔍 ตรวจพบความผิดปกติ:")
            for i, anomaly in enumerate(anomalies[:3], 1):
                lines.append(f"  {i}. {anomaly['description']}")
        
        urgent_recs = [r for r in recommendations if r['priority'] == 'urgent']
        high_recs = [r for r in recommendations if r['priority'] == 'high']
        
        if urgent_recs or high_recs:
            lines.append(f"\n💡 แนะนำ:")
            for rec in (urgent_recs + high_recs)[:3]:
                lines.append(f"  {rec['icon']} {rec['action']}")
        
        lines.append(f"\n━━━━━━━━━━━━━━━━")
        lines.append(f"🐔 ChickGuard System")
        
        return '\n'.join(lines)


class LineMessagingChannel(NotificationChannel):
    """LINE Messaging API Channel (Official Account)"""
    
    def __init__(self, channel_access_token: Optional[str] = None, user_id: Optional[str] = None):
        super().__init__("LINE Messaging API")
        self.channel_access_token = channel_access_token
        self.user_id = user_id
        self.api_url = 'https://api.line.me/v2/bot/message/push'
        self.enabled = bool(self.channel_access_token and self.user_id)
        
        if self.enabled:
            logger.info("✅ LINE Messaging API enabled")
        else:
            logger.warning("⚠️  LINE Messaging API not configured")
            logger.info("💡 Setup: https://developers.line.biz/console/")
    
    def send_alert(self, risk_data: Dict) -> bool:
        if not self.enabled:
            logger.info("📱 [DEMO] LINE Messaging Alert (not configured)")
            self._print_demo(risk_data)
            return False
        
        try:
            import requests
            
            message = self.format_alert_message(risk_data)
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.channel_access_token}'
            }
            
            payload = {
                'to': self.user_id,
                'messages': [
                    {
                        'type': 'text',
                        'text': message
                    }
                ]
            }
            
            # Add flex message for rich UI (optional)
            if risk_data['risk_level'] == 'high':
                payload['messages'].append(self._create_flex_message(risk_data))
            
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                logger.info(f"✅ LINE message sent (Risk: {risk_data['risk_score']})")
                return True
            else:
                logger.error(f"❌ LINE message failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ LINE Messaging error: {str(e)}")
            return False
    
    def send_daily_report(self, summary_data: Dict) -> bool:
        if not self.enabled:
            return False
        
        try:
            import requests
            
            message = self._format_daily_report(summary_data)
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.channel_access_token}'
            }
            
            payload = {
                'to': self.user_id,
                'messages': [{'type': 'text', 'text': message}]
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                logger.info("✅ LINE daily report sent")
                return True
            else:
                logger.error(f"❌ LINE daily report failed: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ LINE daily report error: {str(e)}")
            return False
    
    def test_connection(self) -> bool:
        if not self.enabled:
            logger.warning("⚠️  Cannot test - LINE Messaging API not configured")
            return False
        
        try:
            import requests
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.channel_access_token}'
            }
            
            payload = {
                'to': self.user_id,
                'messages': [
                    {
                        'type': 'text',
                        'text': '🧪 ChickGuard Test Message\nLINE Messaging API connection successful! ✅'
                    }
                ]
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                logger.info("✅ LINE Messaging API test successful")
                return True
            else:
                logger.error(f"❌ LINE test failed: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ LINE test error: {str(e)}")
            return False
    
    def _create_flex_message(self, risk_data: Dict) -> Dict:
        """Create rich flex message for high-risk alerts"""
        return {
            'type': 'flex',
            'altText': f"⚠️ High Risk Alert: {risk_data['risk_score']:.1f}",
            'contents': {
                'type': 'bubble',
                'header': {
                    'type': 'box',
                    'layout': 'vertical',
                    'contents': [
                        {
                            'type': 'text',
                            'text': '🚨 HIGH RISK ALERT',
                            'weight': 'bold',
                            'color': '#FF0000',
                            'size': 'xl'
                        }
                    ]
                },
                'body': {
                    'type': 'box',
                    'layout': 'vertical',
                    'contents': [
                        {
                            'type': 'text',
                            'text': f"Risk Score: {risk_data['risk_score']:.1f}/100",
                            'weight': 'bold',
                            'size': 'lg'
                        },
                        {
                            'type': 'text',
                            'text': f"Urgency: {risk_data['urgency'].upper()}",
                            'color': '#FF5555',
                            'margin': 'md'
                        }
                    ]
                },
                'footer': {
                    'type': 'box',
                    'layout': 'vertical',
                    'contents': [
                        {
                            'type': 'button',
                            'action': {
                                'type': 'uri',
                                'label': 'View Dashboard',
                                'uri': 'http://localhost:3001'
                            },
                            'style': 'primary'
                        }
                    ]
                }
            }
        }
    
    def _format_daily_report(self, summary: Dict) -> str:
        lines = [
            f"\n📊 ChickGuard Daily Report",
            f"━━━━━━━━━━━━━━━━",
            f"📅 {datetime.now().strftime('%Y-%m-%d')}",
            f"",
            f"📈 Summary:",
            f"  • Average Risk: {summary.get('avg_risk', 0):.1f}/100",
            f"  • Peak Risk: {summary.get('max_risk', 0):.1f}/100",
            f"  • Alerts Sent: {summary.get('alerts_sent', 0)}",
            f"  • Monitoring Uptime: {summary.get('uptime_hours', 0):.1f}h",
            f"",
            f"🐔 Behavior Analysis:",
            f"  • Avg Activity: {summary.get('avg_activity', 'N/A')}",
            f"  • Anomalies: {summary.get('total_anomalies', 0)}",
            f"",
            f"✅ Status: {summary.get('status', 'Normal')}",
            f"━━━━━━━━━━━━━━━━"
        ]
        return '\n'.join(lines)
    
    def _print_demo(self, risk_data: Dict):
        message = self.format_alert_message(risk_data)
        print("\n" + "="*50)
        print("📱 LINE MESSAGING API (DEMO MODE)")
        print("="*50)
        print(message)
        print("="*50 + "\n")


class EmailChannel(NotificationChannel):
    """Email Notification Channel"""
    
    def __init__(self, smtp_server: Optional[str] = None, smtp_port: Optional[int] = None,
                 smtp_user: Optional[str] = None, smtp_password: Optional[str] = None,
                 recipient_email: Optional[str] = None):
        super().__init__("Email")
        self.smtp_host = smtp_server or 'smtp.gmail.com'
        self.smtp_port = smtp_port or 587
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password
        self.recipient_email = recipient_email
        self.enabled = bool(self.smtp_user and self.smtp_password and self.recipient_email)
        
        if self.enabled:
            logger.info("✅ Email notification enabled")
        else:
            logger.warning("⚠️  Email not configured")
            logger.info("💡 Set: SMTP_USER, SMTP_PASSWORD, ALERT_EMAIL")
    
    def send_alert(self, risk_data: Dict) -> bool:
        if not self.enabled:
            logger.info("📧 [DEMO] Email Alert (not configured)")
            self._print_demo(risk_data)
            return False
        
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            
            subject = self._create_subject(risk_data)
            body = self._create_html_body(risk_data)
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_user
            msg['To'] = self.recipient_email
            
            msg.attach(MIMEText(self.format_alert_message(risk_data), 'plain'))
            msg.attach(MIMEText(body, 'html'))
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"✅ Email sent (Risk: {risk_data['risk_score']})")
            return True
            
        except Exception as e:
            logger.error(f"❌ Email error: {str(e)}")
            return False
    
    def send_daily_report(self, summary_data: Dict) -> bool:
        if not self.enabled:
            return False
        
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            
            subject = f"ChickGuard Daily Report - {datetime.now().strftime('%Y-%m-%d')}"
            body = self._create_report_html(summary_data)
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_user
            msg['To'] = self.recipient_email
            
            msg.attach(MIMEText(body, 'html'))
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info("✅ Daily report email sent")
            return True
            
        except Exception as e:
            logger.error(f"❌ Daily report email error: {str(e)}")
            return False
    
    def test_connection(self) -> bool:
        if not self.enabled:
            logger.warning("⚠️  Cannot test - Email not configured")
            return False
        
        try:
            import smtplib
            from email.mime.text import MIMEText
            
            msg = MIMEText("🧪 ChickGuard Test Email\nConnection successful! ✅")
            msg['Subject'] = 'ChickGuard Test'
            msg['From'] = self.smtp_user
            msg['To'] = self.recipient_email
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info("✅ Email test successful")
            return True
            
        except Exception as e:
            logger.error(f"❌ Email test error: {str(e)}")
            return False
    
    def _create_subject(self, risk_data: Dict) -> str:
        emoji_map = {'low': '✅', 'medium': '⚠️', 'high': '🚨'}
        emoji = emoji_map.get(risk_data['risk_level'], '⚠️')
        return f"{emoji} ChickGuard Alert - Risk {risk_data['risk_score']:.1f}/100"
    
    def _create_html_body(self, risk_data: Dict) -> str:
        color_map = {'low': '#28a745', 'medium': '#ffc107', 'high': '#dc3545'}
        color = color_map.get(risk_data['risk_level'], '#ffc107')
        
        anomalies_html = ""
        for anomaly in risk_data.get('anomalies', [])[:3]:
            anomalies_html += f"<li>{anomaly['description']}</li>"
        
        recs_html = ""
        for rec in risk_data.get('recommendations', [])[:3]:
            recs_html += f"<li>{rec['icon']} {rec['action']}</li>"
        
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: {color};">🐔 ChickGuard Alert</h2>
                <hr>
                <p><strong>Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <div style="background-color: {color}; color: white; padding: 15px; border-radius: 5px;">
                    <h3 style="margin: 0;">Risk Score: {risk_data['risk_score']:.1f}/100</h3>
                    <p style="margin: 5px 0;">Level: {risk_data['risk_level'].upper()}</p>
                    <p style="margin: 5px 0;">Urgency: {risk_data['urgency'].upper()}</p>
                </div>
                
                {f'<h4>🔍 Detected Anomalies:</h4><ul>{anomalies_html}</ul>' if anomalies_html else ''}
                {f'<h4>💡 Recommendations:</h4><ul>{recs_html}</ul>' if recs_html else ''}
                
                <hr>
                <p style="color: #666; font-size: 12px;">ChickGuard - AI-Powered Health Monitoring</p>
            </div>
        </body>
        </html>
        """
    
    def _create_report_html(self, summary: Dict) -> str:
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>📊 ChickGuard Daily Report</h2>
                <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d')}</p>
                <hr>
                <h3>Summary</h3>
                <ul>
                    <li>Average Risk: {summary.get('avg_risk', 0):.1f}/100</li>
                    <li>Peak Risk: {summary.get('max_risk', 0):.1f}/100</li>
                    <li>Alerts Sent: {summary.get('alerts_sent', 0)}</li>
                    <li>Uptime: {summary.get('uptime_hours', 0):.1f} hours</li>
                </ul>
                <h3>Behavior Analysis</h3>
                <ul>
                    <li>Average Activity: {summary.get('avg_activity', 'N/A')}</li>
                    <li>Total Anomalies: {summary.get('total_anomalies', 0)}</li>
                </ul>
                <hr>
                <p><strong>Status:</strong> {summary.get('status', 'Normal')}</p>
            </div>
        </body>
        </html>
        """
    
    def _print_demo(self, risk_data: Dict):
        print("\n" + "="*50)
        print("📧 EMAIL NOTIFICATION (DEMO MODE)")
        print("="*50)
        print(f"To: {self.recipient_email or 'not-configured@example.com'}")
        print(f"Subject: {self._create_subject(risk_data)}")
        print("-"*50)
        print(self.format_alert_message(risk_data))
        print("="*50 + "\n")


class NotificationManager:
    """Manages multiple notification channels"""
    
    def __init__(self, line_token: Optional[str] = None, line_user_id: Optional[str] = None,
                 smtp_server: Optional[str] = None, smtp_port: Optional[int] = None,
                 smtp_user: Optional[str] = None, smtp_password: Optional[str] = None,
                 alert_email: Optional[str] = None):
        self.channels: List[NotificationChannel] = []
        self._setup_channels(line_token, line_user_id, smtp_server, smtp_port, 
                            smtp_user, smtp_password, alert_email)
        
    def _setup_channels(self, line_token, line_user_id, smtp_server, smtp_port,
                       smtp_user, smtp_password, alert_email):
        """Initialize all available channels"""
        # LINE Messaging API
        line_channel = LineMessagingChannel(line_token, line_user_id)
        self.channels.append(line_channel)
        
        # Email
        email_channel = EmailChannel(smtp_server, smtp_port, smtp_user, smtp_password, alert_email)
        self.channels.append(email_channel)
        
        enabled_count = sum(1 for c in self.channels if c.enabled)
        logger.info(f"📢 Notification Manager: {enabled_count}/{len(self.channels)} channels enabled")
    
    def send_alert(self, risk_data: Dict) -> Dict[str, bool]:
        """Send alert through all enabled channels"""
        results = {}
        for channel in self.channels:
            if channel.enabled:
                success = channel.send_alert(risk_data)
                results[channel.name] = success
            else:
                # Still try to send for demo mode
                channel.send_alert(risk_data)
                results[channel.name] = False
        
        return results
    
    def send_daily_report(self, summary_data: Dict) -> Dict[str, bool]:
        """Send daily report through all enabled channels"""
        results = {}
        for channel in self.channels:
            if channel.enabled:
                success = channel.send_daily_report(summary_data)
                results[channel.name] = success
        
        return results
    
    def test_all_channels(self) -> Dict[str, bool]:
        """Test all configured channels"""
        results = {}
        for channel in self.channels:
            if channel.enabled:
                success = channel.test_connection()
                results[channel.name] = success
            else:
                results[channel.name] = False
                logger.info(f"⚠️  {channel.name} not configured - skipping test")
        
        return results
    
    def get_status(self) -> Dict:
        """Get status of all channels"""
        return {
            'channels': [
                {
                    'name': channel.name,
                    'enabled': channel.enabled,
                    'status': 'configured' if channel.enabled else 'not_configured'
                }
                for channel in self.channels
            ],
            'total_channels': len(self.channels),
            'enabled_channels': sum(1 for c in self.channels if c.enabled)
        }
