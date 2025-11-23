from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv

# Import service modules
from services.question_answerer import QuestionAnswerer
from services.flashcard_generator import FlashcardGenerator
from services.exam_creator import ExamCreator
from services.recommendation_engine import RecommendationEngine
from services.lesson_plan_generator import LessonPlanGenerator
from services.study_planner import StudyPlanner
from services.smart_search import SmartSearch
from services.exam_mentor import ExamMentor

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SYNAPSEMED AI Services",
    description="AI-powered medical education services using DeepSeek",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI services
question_answerer = QuestionAnswerer()
flashcard_generator = FlashcardGenerator()
exam_creator = ExamCreator()
recommendation_engine = RecommendationEngine()
lesson_plan_generator = LessonPlanGenerator()
study_planner = StudyPlanner()
smart_search = SmartSearch()
exam_mentor = ExamMentor()

# Request/Response Models
class QuestionRequest(BaseModel):
    question: str
    context: Optional[str] = "general"
    studentLevel: Optional[str] = None

class QuestionResponse(BaseModel):
    question: str
    answer: str
    sources: Optional[List[str]] = None
    confidence: Optional[float] = None

class FlashcardRequest(BaseModel):
    topic: str
    context: Optional[str] = "general"
    studentLevel: Optional[str] = None
    count: Optional[int] = 10

class Flashcard(BaseModel):
    front: str
    back: str
    hint: Optional[str] = None
    difficulty: Optional[str] = None

class FlashcardResponse(BaseModel):
    topic: str
    flashcards: List[Flashcard]

class ExamRequest(BaseModel):
    topic: str
    count: Optional[int] = 10
    context: Optional[str] = "general"
    studentLevel: Optional[str] = None
    difficulty: Optional[str] = "intermediate"

class ExamQuestion(BaseModel):
    question: str
    options: List[str]
    correctAnswer: int
    explanation: Optional[str] = None
    difficulty: Optional[str] = None

class ExamResponse(BaseModel):
    topic: str
    questions: List[ExamQuestion]

class RecommendationRequest(BaseModel):
    currentContext: Optional[str] = "general"
    level: Optional[str] = None
    weakAreas: Optional[List[str]] = None
    preferences: Optional[Dict[str, Any]] = None

class Recommendation(BaseModel):
    title: str
    description: str
    priority: str  # high, medium, low
    resources: Optional[List[str]] = None
    estimatedTime: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[Recommendation]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SYNAPSEMED AI Services"}

# Answer Questions Service
@app.post("/api/answer", response_model=QuestionResponse)
async def answer_question(request: QuestionRequest):
    try:
        result = await question_answerer.answer_question(
            question=request.question,
            context=request.context or "general",
            student_level=request.studentLevel
        )
        return QuestionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

# Generate Flashcards Service
@app.post("/api/flashcards", response_model=FlashcardResponse)
async def generate_flashcards(request: FlashcardRequest):
    try:
        result = await flashcard_generator.generate_flashcards(
            topic=request.topic,
            context=request.context or "general",
            student_level=request.studentLevel,
            count=request.count or 10
        )
        return FlashcardResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")

# Create Exam Questions Service
@app.post("/api/exam-questions", response_model=ExamResponse)
async def create_exam_questions(request: ExamRequest):
    try:
        result = await exam_creator.create_exam_questions(
            topic=request.topic,
            count=request.count or 10,
            context=request.context or "general",
            student_level=request.studentLevel,
            difficulty=request.difficulty or "intermediate"
        )
        return ExamResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating exam questions: {str(e)}")

# Provide Recommendations Service
@app.post("/api/recommendations", response_model=RecommendationResponse)
async def provide_recommendations(request: RecommendationRequest):
    try:
        result = await recommendation_engine.generate_recommendations(
            current_context=request.currentContext or "general",
            level=request.level,
            weak_areas=request.weakAreas,
            preferences=request.preferences
        )
        return RecommendationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

# Get all available services
@app.get("/api/services")
async def get_services():
    return {
        "services": [
            {
                "name": "answer",
                "description": "Answer medical questions with detailed explanations",
                "endpoint": "/api/answer"
            },
            {
                "name": "flashcards",
                "description": "Generate study flashcards for medical topics",
                "endpoint": "/api/flashcards"
            },
            {
                "name": "exam-questions",
                "description": "Create practice exam questions with multiple choice answers",
                "endpoint": "/api/exam-questions"
            },
            {
                "name": "recommendations",
                "description": "Provide personalized study recommendations",
                "endpoint": "/api/recommendations"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )