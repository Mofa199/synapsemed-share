# 🤖 SYNAPSEMED AI - Quick Start Guide

## ✅ What's Already Done

### Frontend Components (✓ Complete)
1. **`<SynapseMedAI />`** - Floating AI assistant
   - Location: `components/synapsemed-ai.tsx`
   - Features:
     - ✅ Floating button (bottom-right)
     - ✅ Chat interface
     - ✅ Quick actions (flashcards, quiz, study plan, etc.)
     - ✅ Context-aware (exam, study, general modes)
     - ✅ Message history
     - ✅ Minimize/maximize
     
2. **Global Integration** (✓ Complete)
   - Added to `app/client-layout.tsx`
   - Appears on ALL pages (except auth pages)
   - Context switches automatically:
     - **Exam Mode**: During assessments/questions
     - **Study Mode**: On topic/article pages
     - **General Mode**: Everywhere else

3. **API Endpoint** (✓ Complete)
   - Route: `/api/ai/chat`
   - Accepts: message, context, topic, student level
   - Returns: AI responses (mock for now)

---

## 🚀 Next Steps - Backend AI Setup

### Step 1: Install Ollama (5 minutes)

#### Windows:
```powershell
# Download from: https://ollama.ai/download
# Run the installer

# After installation, open PowerShell and pull a model:
ollama pull phi        # Lightweight (1.6GB) - Recommended to start
# OR
ollama pull llama2:7b  # More powerful (4GB)
```

#### Verify Installation:
```powershell
ollama list  # Should show installed models
ollama run phi "Hello, SYNAPSEMED!"  # Test the model
```

### Step 2: Create Python AI Service (10 minutes)

```powershell
# Navigate to your project
cd "c:\Users\rana\Documents\synapsemed-l6-main (6)\synapsemed-l6-main"

# Create AI service folder
mkdir ai-service
cd ai-service

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn langchain langchain-community faiss-cpu sentence-transformers psycopg2-binary python-dotenv requests
```

### Step 3: Create AI Service Files

I can generate all the Python files for you. The structure will be:

```
ai-service/
├── main.py              # FastAPI server
├── config.py            # Configuration
├── requirements.txt     # Dependencies
├── services/
│   ├── chat_service.py     # Chat handling
│   ├── flashcard_gen.py    # Flashcard generation
│   ├── question_gen.py     # Question generation
│   ├── lesson_planner.py   # Lesson plan creation
│   └── study_planner.py    # Study plan creation
└── vectorstore/
    └── indexer.py          # Content indexing
```

---

## 📝 Implementation Phases

### Phase 1: Basic Q&A (Week 1) ⬅️ START HERE
- [x] Frontend components
- [x] API endpoints
- [ ] Python AI service
- [ ] Ollama integration
- [ ] Basic chat responses

### Phase 2: Content Generation (Week 2)
- [ ] Flashcard generator
- [ ] Quiz generator
- [ ] Summary generation
- [ ] Explanation engine

### Phase 3: Planning Tools (Week 3)
- [ ] Lesson plan generator
- [ ] Study plan creator
- [ ] Resource recommendations
- [ ] Progress tracking

### Phase 4: Exam Mentor (Week 4)
- [ ] Hint system
- [ ] Adaptive feedback
- [ ] Performance analysis
- [ ] Encouragement engine

### Phase 5: Advanced Features (Week 5)
- [ ] Index medical content (articles, drugs, etc.)
- [ ] Vector search (FAISS)
- [ ] Personalization engine
- [ ] Multi-turn conversations
- [ ] Citation/source tracking

---

## 🎯 How to Use SYNAPSEMED (For Students)

### 1. **Open the AI Assistant**
- Look for the pulsing blue AI button in the bottom-right corner
- Click to open the chat interface

### 2. **Ask Questions**
Type any medical question:
- "What is the mechanism of action of aspirin?"
- "Explain the cardiac cycle"
- "What are the symptoms of diabetes?"

### 3. **Use Quick Actions**
Click the quick action buttons:
- **Generate Flashcards**: Auto-create study cards
- **Create Quiz**: Test your knowledge
- **Study Plan**: Get a personalized schedule
- **Find Resources**: Discover relevant materials
- **Explain Concept**: Get detailed explanations
- **Summarize**: Condense long content

### 4. **Context-Aware Help**
- **During Exams**: SYNAPSEMED becomes your mentor
  - Provides hints (without giving answers)
  - Offers encouragement
  - Explains after submission
  
- **While Studying**: SYNAPSEMED is your co-pilot
  - Summarizes content
  - Creates study materials
  - Answers questions
  
- **General Use**: SYNAPSEMED is your companion
  - Search for anything
  - Plan your studies
  - Track progress

---

## 🔧 Configuration

### Environment Variables
Create `.env` in `ai-service/`:

```env
# Ollama Configuration
OLLAMA_URL=http://localhost:11434
MODEL_NAME=phi  # or llama2:7b

# Database Connection
DATABASE_URL=postgresql://neondb_owner:npg_E0pXyIMQO4HP@ep-silent-frog-a8bezbh1-pooler.eastus2.azure.neon.tech/neondb?sslmode=require

# API Configuration
AI_SERVICE_PORT=8000
NEXT_JS_URL=http://localhost:3000

# Features
ENABLE_FLASHCARDS=true
ENABLE_LESSON_PLANS=true
ENABLE_STUDY_PLANS=true
ENABLE_VECTOR_SEARCH=true
```

### Next.js Configuration
Add to `.env.local`:

```env
# AI Service
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_SECRET=your-secret-key-here
```

---

## 🎨 Customization

### Change AI Name/Branding
In `components/synapsemed-ai.tsx`:
```typescript
<CardTitle className="text-lg font-bold">SYNAPSEMED</CardTitle>
// Change to your preferred name
```

### Adjust Colors
```typescript
// Change gradient colors
className="bg-gradient-to-r from-[#213874] to-[#1a6ac3]"
// Update to your brand colors
```

### Add Custom Quick Actions
```typescript
const quickActions = [
  { icon: YourIcon, label: 'Your Action', action: 'your-action' },
  // Add more actions
]
```

---

## 📊 Testing the AI

### Test Ollama Connection
```powershell
# In PowerShell
curl http://localhost:11434/api/generate -d '{
  "model": "phi",
  "prompt": "What is the cardiac cycle?",
  "stream": false
}'
```

### Test Chat API (After Backend Setup)
```powershell
# Test the chat endpoint
curl -X POST http://localhost:3000/api/ai/chat `
  -H "Content-Type: application/json" `
  -d '{"message":"Hello SYNAPSEMED","context":"general"}'
```

---

## 🎓 Features by Context

### Exam Mentor Mode
Activated on:
- `/student/exam-simulation`
- `/student/questions`
- `/question-bank/*`

Features:
- Progressive hints (3 levels)
- Encouragement messages
- Performance feedback
- Detailed explanations
- Time management tips

### Study Co-Pilot Mode
Activated on:
- `/topic/*`
- `/module/*`
- `/article/*`
- `/book/*`

Features:
- Content summarization
- Flashcard generation
- Quiz creation
- Concept explanation
- Resource finding

### General Mode
Activated everywhere else

Features:
- Medical Q&A
- Study plan creation
- Lesson planning
- Smart search
- Progress tracking

---

## 🚨 Troubleshooting

### AI Button Not Showing
1. Check if you're logged in
2. Verify you're not on auth pages (/login, /auth)
3. Check browser console for errors

### API Errors
1. Verify AI service is running (`http://localhost:8000`)
2. Check environment variables
3. Look at Next.js terminal for errors

### Slow Responses
1. Try lighter model (`phi` instead of `llama2:7b`)
2. Check your hardware (RAM, GPU)
3. Reduce context size in prompts

### Ollama Not Found
```powershell
# Check if Ollama is running
ollama list

# Restart Ollama service
# Windows: Search "Services" -> Restart "Ollama"
```

---

## 📈 Performance Tips

### Optimize Model Selection
- **Phi (1.6GB)**: Fast, good for simple Q&A
- **LLaMA 2 7B (4GB)**: Better quality, slower
- **Mistral 7B (4GB)**: Best balance

### Hardware Recommendations
- **Minimum**: 8GB RAM, no GPU needed (with Phi)
- **Recommended**: 16GB RAM, 6GB GPU (with LLaMA 2)
- **Optimal**: 32GB RAM, 12GB GPU (with larger models)

### Speed Optimization
1. Use smaller models for quick responses
2. Cache frequent queries
3. Implement response streaming
4. Use GPU acceleration if available

---

## 🎁 What's Next?

### Ready to Build?
Say **"generate AI service files"** and I'll create:
1. Complete Python FastAPI backend
2. All service implementations
3. Vector database setup
4. Content indexing scripts
5. Deployment guides

### Want to See It in Action?
1. Refresh your browser
2. Login to your account
3. Look for the pulsing AI button (bottom-right)
4. Click and start chatting!

---

## 📚 Resources

- **Ollama**: https://ollama.ai/
- **LangChain**: https://python.langchain.com/
- **FAISS**: https://faiss.ai/
- **FastAPI**: https://fastapi.tiangolo.com/

---

## 💡 Tips for Best Results

1. **Be Specific**: "Explain the renin-angiotensin system" vs "Tell me about kidneys"
2. **Use Context**: The AI knows what page you're on
3. **Try Quick Actions**: They're optimized for common tasks
4. **Provide Feedback**: Help improve responses
5. **Experiment**: Try different questions and features

---

**Ready to activate SYNAPSEMED AI?** 🚀

Just say: **"generate Python AI backend"** and I'll create all the files!
