from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SYNAPSEMED AI Services",
    description="AI-powered medical education services (Simple Mode)",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    priority: str
    resources: Optional[List[str]] = None
    estimatedTime: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[Recommendation]

# Simple mock AI service
class SimpleAIService:
    def __init__(self):
        self.knowledge_base = [
            "The cardiovascular system consists of the heart, blood vessels, and blood that circulates throughout the body.",
            "Pharmacokinetics describes how the body processes drugs through absorption, distribution, metabolism, and excretion (ADME).",
            "The respiratory system includes the lungs, airways, and respiratory muscles that facilitate gas exchange.",
            "Diabetes mellitus is characterized by elevated blood glucose levels due to insulin deficiency or resistance.",
            "Antibiotics are medications that fight bacterial infections by killing bacteria or preventing their growth.",
            "The nervous system is divided into central (brain and spinal cord) and peripheral components.",
            "Hypertension is defined as blood pressure consistently above 140/90 mmHg in adults.",
            "The digestive system breaks down food into nutrients that the body can absorb and use for energy.",
            "Vaccines help the immune system recognize and fight specific diseases by providing immunity.",
            "The endocrine system regulates body functions through hormones produced by various glands."
        ]
    
    async def answer_question(self, question: str, context: str = "general", student_level: Optional[str] = None) -> Dict[str, Any]:
        # Find relevant knowledge
        relevant = [k for k in self.knowledge_base if any(word in k.lower() for word in question.lower().split())]
        
        if not relevant:
            relevant = self.knowledge_base[:2]
        
        answer = f"Based on medical knowledge: {relevant[0] if relevant else 'This is a complex medical topic that requires further study.'}"
        
        if student_level:
            answer += f"\n\nFor {student_level} level: This information is presented at an appropriate complexity level."
        
        return {
            "question": question,
            "answer": answer,
            "sources": relevant[:2],
            "confidence": 0.8
        }
    
    async def generate_flashcards(self, topic: str, context: str = "general", student_level: Optional[str] = None, count: int = 10) -> Dict[str, Any]:
        flashcards = []
        
        # Basic flashcard templates
        templates = [
            {
                "front": f"What is the primary function of the {topic}?",
                "back": f"The {topic} has multiple important functions in the human body.",
                "hint": f"Think about the main role of {topic} in body systems."
            },
            {
                "front": f"Name three key components of {topic}",
                "back": f"The {topic} consists of several interconnected components working together.",
                "hint": f"Consider the anatomical structure of {topic}."
            },
            {
                "front": f"What are common disorders related to {topic}?",
                "back": f"Several medical conditions can affect the {topic} system.",
                "hint": f"Think about pathological conditions involving {topic}."
            }
        ]
        
        for i in range(min(count, len(templates))):
            flashcards.append({
                "front": templates[i]["front"],
                "back": templates[i]["back"],
                "hint": templates[i]["hint"],
                "difficulty": "intermediate"
            })
        
        return {
            "topic": topic,
            "flashcards": flashcards,
            "sources": self.knowledge_base[:2],
            "context": context,
            "count": len(flashcards)
        }
    
    async def create_exam_questions(self, topic: str, count: int = 10, context: str = "general", student_level: Optional[str] = None, difficulty: str = "intermediate") -> Dict[str, Any]:
        questions = []
        
        # Sample questions
        sample_questions = [
            {
                "question": f"Which of the following best describes {topic}?",
                "options": [
                    f"A primary function of {topic}",
                    "An unrelated concept",
                    "A type of medication",
                    "A surgical procedure"
                ],
                "correctAnswer": 0,
                "explanation": f"The first option correctly describes a key aspect of {topic}."
            },
            {
                "question": f"What is the most important consideration when studying {topic}?",
                "options": [
                    "Memorizing terminology only",
                    "Understanding underlying mechanisms",
                    "Ignoring clinical applications",
                    "Focusing on historical aspects only"
                ],
                "correctAnswer": 1,
                "explanation": "Understanding mechanisms is crucial for comprehensive learning."
            }
        ]
        
        for i in range(min(count, len(sample_questions))):
            questions.append({
                "question": sample_questions[i]["question"],
                "options": sample_questions[i]["options"],
                "correctAnswer": sample_questions[i]["correctAnswer"],
                "explanation": sample_questions[i]["explanation"],
                "difficulty": difficulty
            })
        
        return {
            "topic": topic,
            "questions": questions,
            "context": context,
            "difficulty": difficulty,
            "count": len(questions)
        }
    
    async def generate_recommendations(self, current_context: str = "general", level: Optional[str] = None, weak_areas: Optional[List[str]] = None, preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        recommendations = [
            {
                "title": "Focus on Fundamentals",
                "description": "Build a strong foundation in basic medical concepts before advancing to complex topics.",
                "priority": "high",
                "resources": ["Medical textbooks", "Online courses", "Practice questions"],
                "estimatedTime": "2-3 hours daily"
            },
            {
                "title": "Active Learning Techniques",
                "description": "Use evidence-based study methods like spaced repetition and active recall.",
                "priority": "medium",
                "resources": ["Flashcard systems", "Practice testing", "Teaching others"],
                "estimatedTime": "1-2 hours daily"
            },
            {
                "title": "Clinical Application",
                "description": "Connect theoretical knowledge with real-world clinical scenarios.",
                "priority": "medium",
                "resources": ["Case studies", "Clinical rotations", "Simulation exercises"],
                "estimatedTime": "3-4 hours weekly"
            }
        ]
        
        # Add specific recommendations for weak areas
        if weak_areas:
            for area in weak_areas[:2]:
                recommendations.insert(0, {
                    "title": f"Strengthen {area}",
                    "description": f"Focus additional study time on {area} to improve understanding.",
                    "priority": "high",
                    "resources": [f"{area} study guides", f"{area} practice questions"],
                    "estimatedTime": "1 hour daily"
                })
        
        return {
            "recommendations": recommendations[:5],  # Limit to 5
            "context": current_context,
            "level": level
        }

# Initialize simple AI service
ai_service = SimpleAIService()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SYNAPSEMED AI Services (Simple Mode)", "note": "Running without full AI models - install complete requirements for full functionality"}

# Answer Questions Service
@app.post("/api/answer", response_model=QuestionResponse)
async def answer_question(request: QuestionRequest):
    try:
        result = await ai_service.answer_question(
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
        result = await ai_service.generate_flashcards(
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
        result = await ai_service.create_exam_questions(
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
        result = await ai_service.generate_recommendations(
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
                "description": "Answer medical questions with explanations",
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
        ],
        "note": "Simple mode - install full requirements for AI model functionality"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )