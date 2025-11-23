# SYNAPSEMED AI Backend Setup Guide

## Overview
This guide will help you set up the SYNAPSEMED AI backend using **free, open-source models** that run locally on your server.

## Features
- ✅ **Answer Questions** - Get detailed medical answers with explanations
- ✅ **Generate Flashcards** - Create study flashcards for any medical topic  
- ✅ **Create Exam Questions** - Generate practice questions with multiple choice
- ✅ **Provide Recommendations** - Personalized study recommendations
- ✅ **Lesson Plan Generator** - Create comprehensive lesson plans
- ✅ **Study Planner** - Smart study schedules and planning
- ✅ **Smart Search** - Context-aware search with AI insights
- ✅ **Exam Mentor** - Real-time exam guidance and hints
- ✅ **Adaptive Learning** - Performance tracking and personalization
- ✅ **Floating Assistant** - Context-aware AI available on all pages

## Technology Stack
- **Language Model**: Microsoft Phi-2 (free, runs locally)
- **Embeddings**: all-MiniLM-L6-v2 (for semantic search)
- **Vector Database**: FAISS (for knowledge base search)
- **Backend**: FastAPI with Python
- **Frontend Integration**: Next.js API routes

## Prerequisites
- Python 3.8 or higher
- At least 8GB RAM (16GB recommended)
- 10GB+ free disk space for models
- GPU optional (CUDA support for faster performance)

## Installation Steps

### 1. Navigate to AI Backend Directory
```bash
cd ai-backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\\Scripts\\activate

# On macOS/Linux  
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Download Models (First Time)
The models will be automatically downloaded on first run. This may take 10-15 minutes:
- Microsoft Phi-2: ~2.7GB
- Sentence Transformer: ~90MB

### 5. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` file with your preferences:
```env
HOST=0.0.0.0
PORT=8000
MODEL_NAME=microsoft/phi-2
USE_CUDA=False  # Set to True if you have GPU
```

### 6. Start the AI Backend
```bash
python main.py
```

The AI backend will be available at: `http://localhost:8000`

### 7. Update Next.js Environment
Add to your `.env.local` in the main project:
```env
AI_BACKEND_URL=http://localhost:8000
```

## API Endpoints

### Core Services
- `POST /api/answer` - Answer medical questions
- `POST /api/flashcards` - Generate flashcards
- `POST /api/exam-questions` - Create exam questions
- `POST /api/recommendations` - Get study recommendations

### Advanced Services  
- `POST /api/lesson-plan` - Generate lesson plans
- `POST /api/study-plan` - Create study schedules
- `POST /api/search` - Smart search with AI insights
- `POST /api/exam-mentor` - Real-time exam guidance

### System
- `GET /health` - Health check
- `GET /api/services` - List all available services

## Usage Examples

### Answer Questions
```javascript
const response = await fetch('/api/ai/answer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: "What is hypertension?",
    context: "study",
    studentLevel: "intermediate"
  })
})
```

### Generate Flashcards
```javascript
const response = await fetch('/api/ai/flashcards', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: "Cardiovascular System",
    count: 10,
    studentLevel: "beginner"
  })
})
```

### Create Exam Questions
```javascript
const response = await fetch('/api/ai/exam-questions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: "Diabetes Management", 
    count: 5,
    difficulty: "intermediate"
  })
})
```

## Performance Optimization

### CPU Optimization
- The system automatically uses CPU-optimized models
- Fallback to smaller models if main model fails
- Memory management for efficient processing

### GPU Acceleration (Optional)
If you have a compatible GPU:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

Set in `.env`:
```env
USE_CUDA=True
```

## Troubleshooting

### Common Issues

**1. Out of Memory Error**
- Reduce model size in configuration
- Close other applications
- Use CPU-only mode

**2. Model Download Fails**
- Check internet connection
- Clear huggingface cache: `rm -rf ~/.cache/huggingface`
- Restart the service

**3. Slow Response Times**
- First request is slower (model loading)
- Subsequent requests are much faster
- Consider GPU acceleration

**4. Import Errors**
- Ensure virtual environment is activated
- Reinstall requirements: `pip install -r requirements.txt --force-reinstall`

### Performance Tuning
```env
# For faster responses (less quality)
MAX_TOKENS=1024
TEMPERATURE=0.5

# For better quality (slower)
MAX_TOKENS=2048
TEMPERATURE=0.7
```

## Knowledge Base Integration

The AI system can be enhanced with your medical content:

1. **Database Integration**: Connect to your existing medical database
2. **Content Indexing**: Index your articles, books, and study materials  
3. **Semantic Search**: AI searches your content first before generating answers
4. **Context Awareness**: Responses tailored to your curriculum

## Production Deployment

### Docker Deployment (Recommended)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

### System Requirements (Production)
- **Minimum**: 4 CPU cores, 16GB RAM
- **Recommended**: 8 CPU cores, 32GB RAM, GPU
- **Storage**: 50GB+ for models and data

## Security Considerations
- Run AI backend on internal network only
- Use authentication for API access
- Implement rate limiting
- Monitor resource usage

## Monitoring and Logging
- Check logs: `tail -f ai_backend.log`
- Monitor memory usage: `htop` or `top`
- API health check: `curl http://localhost:8000/health`

## Support and Updates
- Model updates: Re-run with updated `requirements.txt`
- Performance issues: Check system resources
- Feature requests: Add to project roadmap

## Cost Analysis
- **Setup Cost**: $0 (free models and software)
- **Running Cost**: Only server/hosting costs
- **No API fees**: Unlike paid services (OpenAI, etc.)
- **Offline Capable**: Works without internet after setup

---

**Ready to use!** 🚀 Your AI-powered medical education system is now running locally with no ongoing costs!