@echo off
REM SYNAPSEMED AI Backend Setup Script for Windows
REM This script sets up the AI backend with free, local models

echo 🚀 SYNAPSEMED AI Backend Setup
echo ==============================

REM Check Python version
echo 📋 Checking Python version...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set python_version=%%i
echo ✅ Python %python_version% detected

REM Create virtual environment
echo 🔧 Creating virtual environment...
if exist "venv" (
    echo ⚠️  Virtual environment already exists. Skipping creation.
) else (
    python -m venv venv
    echo ✅ Virtual environment created
)

REM Activate virtual environment
echo 🔗 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️  Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo 📦 Installing dependencies...
echo    This may take several minutes and will download ~3GB of AI models...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️  Creating environment configuration...
    copy .env.example .env
    echo ✅ Environment file created
) else (
    echo ⚠️  Environment file already exists
)

REM Check GPU availability
echo 🔍 Checking for GPU support...
python -c "import torch; print('✅ CUDA available:', torch.cuda.is_available())" 2>nul

REM Test basic imports
echo 🧪 Testing AI model imports...
python -c "try:\n    from transformers import AutoTokenizer\n    from sentence_transformers import SentenceTransformer\n    import torch\n    print('✅ All AI libraries imported successfully')\nexcept ImportError as e:\n    print(f'⚠️  Warning: {e}')\n    print('   Some features may not work properly')"

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📝 Next steps:
echo    1. Review and edit .env file if needed
echo    2. Start the AI backend: python main.py
echo    3. Visit http://localhost:8000/health to test
echo.
echo 💡 Tips:
echo    - First startup will download AI models (~2-3GB)
echo    - Models are cached for faster subsequent startups
echo    - Check AI_BACKEND_SETUP.md for detailed documentation
echo.
echo 🚀 Ready to run: python main.py
pause