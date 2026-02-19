#!/bin/bash
# ChickGuard Auto Setup Script
# สคริปต์ติดตั้งระบบอัตโนมัติ

set -e

echo "=================================================="
echo "🐔 ChickGuard Auto Setup"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS or Linux
OS=$(uname -s)
echo "🖥️  Operating System: $OS"
echo ""

# 1. Check Python
echo "📋 Step 1: Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ Python found: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}❌ Python 3 not found${NC}"
    echo "Please install Python 3.8 or higher"
    exit 1
fi
echo ""

# 2. Check Node.js
echo "📋 Step 2: Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js 18 or higher"
    exit 1
fi
echo ""

# 3. Setup Backend
echo "📋 Step 3: Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo -e "${GREEN}✅ Backend setup complete${NC}"
cd ..
echo ""

# 4. Setup Frontend
echo "📋 Step 4: Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "node_modules already exists, skipping..."
fi

echo -e "${GREEN}✅ Frontend setup complete${NC}"
cd ..
echo ""

# 5. Check .env file
echo "📋 Step 5: Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
else
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from template..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}💡 Please edit .env and configure your settings${NC}"
fi
echo ""

# 6. Summary
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Configure .env file:"
echo "   nano .env"
echo ""
echo "2. Test environment:"
echo "   python3 scripts/test_env.py"
echo ""
echo "3. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   source venv/bin/activate  # or: venv\\Scripts\\activate on Windows"
echo "   python main.py"
echo ""
echo "4. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open Browser:"
echo "   http://localhost:3001"
echo ""
echo "=================================================="
echo "📖 Documentation: docs/"
echo "🚀 Quick Start: docs/QUICKSTART.md"
echo "=================================================="
