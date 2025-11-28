#!/bin/bash

# SYNAPSEMED AI Backend Setup Script
# This script sets up the AI backend with free, local models

echo "🚀 SYNAPSEMED AI Backend Setup"
echo "=============================="

# Check Python version
echo "📋 Checking Python version..."
if ! python3 --version &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python version $python_version is not supported. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python $python_version detected"

# Create virtual environment
echo "🔧 Creating virtual environment..."
if [ -d "venv" ]; then
    echo "⚠️  Virtual environment already exists. Skipping creation."
else
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔗 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📦 Installing dependencies..."
echo "   This may take several minutes and will download ~3GB of AI models..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo "✅ Environment file created"
else
    echo "⚠️  Environment file already exists"
fi

# Check GPU availability
echo "🔍 Checking for GPU support..."
python3 -c "import torch; print('✅ CUDA available:', torch.cuda.is_available())" 2>/dev/null

# Test basic imports
echo "🧪 Testing AI model imports..."
python3 -c "
try:
    from transformers import AutoTokenizer
    from sentence_transformers import SentenceTransformer
    import torch
    print('✅ All AI libraries imported successfully')
except ImportError as e:
    print(f'⚠️  Warning: {e}')
    print('   Some features may not work properly')
"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Review and edit .env file if needed"
echo "   2. Start the AI backend: python main.py"
echo "   3. Visit http://localhost:8000/health to test"
echo ""
echo "💡 Tips:"
echo "   - First startup will download AI models (~2-3GB)"
echo "   - Models are cached for faster subsequent startups"
echo "   - Check AI_BACKEND_SETUP.md for detailed documentation"
echo ""
echo "🚀 Ready to run: python main.py"