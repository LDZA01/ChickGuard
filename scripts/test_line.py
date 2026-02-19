#!/usr/bin/env python3
"""
Test LINE Messaging API
ทดสอบการส่งข้อความผ่าน LINE
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime

# Load .env from project root
project_root = Path(__file__).parent.parent
env_path = project_root / '.env'

print("=" * 60)
print("📱 LINE Messaging API Test")
print("=" * 60)

if not env_path.exists():
    print("❌ .env file not found!")
    print("💡 Copy .env.example to .env and configure it")
    sys.exit(1)

load_dotenv(env_path)

access_token = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")
user_id = os.getenv("LINE_USER_ID")

if not access_token or not user_id:
    print("❌ LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID not set")
    print("📖 See docs/NOTIFICATION_SETUP_QUICK.md for setup")
    sys.exit(1)

print(f"✅ Access Token: {access_token[:20]}...")
print(f"✅ User ID: {user_id}")
print()

# Create test message
message = {
    "type": "text",
    "text": f"""🧪 ChickGuard LINE Test

✅ LINE Messaging API is working!
⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

This is a test message from ChickGuard.
If you receive this, your LINE notification is configured correctly! 🎉"""
}

# Send message
print("📤 Sending test message...")
try:
    response = requests.post(
        'https://api.line.me/v2/bot/message/push',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        },
        json={
            'to': user_id,
            'messages': [message]
        }
    )
    
    if response.status_code == 200:
        print("✅ Message sent successfully!")
        print("📱 Check your LINE app to see the message")
        print()
        print("=" * 60)
        print("🎉 LINE Notification is working!")
        print("=" * 60)
        sys.exit(0)
    else:
        print(f"❌ Failed to send message")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        sys.exit(1)

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
