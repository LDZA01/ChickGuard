#!/usr/bin/env python3
"""
Test Environment Variables Configuration
ตรวจสอบว่า .env ตั้งค่าครบถ้วนหรือไม่
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
project_root = Path(__file__).parent.parent
env_path = project_root / '.env'

print("=" * 60)
print("🔍 ChickGuard Environment Configuration Test")
print("=" * 60)
print(f"📁 Project Root: {project_root}")
print(f"📄 .env file: {env_path}")
print()

if not env_path.exists():
    print("❌ .env file not found!")
    print("💡 Copy .env.example to .env and configure it")
    sys.exit(1)

load_dotenv(env_path)

# Test configurations
configs = {
    "LINE Notification": {
        "LINE_CHANNEL_ACCESS_TOKEN": os.getenv("LINE_CHANNEL_ACCESS_TOKEN"),
        "LINE_USER_ID": os.getenv("LINE_USER_ID"),
    },
    "Email Notification": {
        "SMTP_HOST": os.getenv("SMTP_HOST"),
        "SMTP_PORT": os.getenv("SMTP_PORT"),
        "SMTP_USER": os.getenv("SMTP_USER"),
        "SMTP_PASSWORD": os.getenv("SMTP_PASSWORD"),
        "ALERT_EMAIL": os.getenv("ALERT_EMAIL"),
    },
    "System Settings": {
        "CONFIDENCE_THRESHOLD": os.getenv("CONFIDENCE_THRESHOLD", "0.5"),
        "VIDEO_FPS": os.getenv("VIDEO_FPS", "5"),
        "ALERT_COOLDOWN_SECONDS": os.getenv("ALERT_COOLDOWN_SECONDS", "900"),
        "MEDIUM_RISK_THRESHOLD": os.getenv("MEDIUM_RISK_THRESHOLD", "40"),
        "HIGH_RISK_THRESHOLD": os.getenv("HIGH_RISK_THRESHOLD", "70"),
    }
}

all_ok = True

for category, settings in configs.items():
    print(f"📋 {category}")
    print("-" * 60)
    
    for key, value in settings.items():
        if value:
            # Mask sensitive values
            if "TOKEN" in key or "PASSWORD" in key:
                display_value = value[:10] + "..." if len(value) > 10 else "***"
            else:
                display_value = value
            
            print(f"  ✅ {key}: {display_value}")
        else:
            print(f"  ❌ {key}: Not set")
            all_ok = False
    
    print()

# Summary
print("=" * 60)
if all_ok:
    print("✅ All configurations are set!")
    print("🚀 Ready to run ChickGuard")
else:
    print("⚠️  Some configurations are missing")
    print("📖 See docs/ENV_SETUP.md for setup instructions")
print("=" * 60)

sys.exit(0 if all_ok else 1)
