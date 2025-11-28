from typing import Dict, Any, Optional, List
from .base_ai_service import BaseAIService
import json
import re

class LessonPlanGenerator(BaseAIService):
    def __init__(self):
        super().__init__()
    
    async def generate_lesson_plan(self, topic: str, duration: int = 60, 
                                 student_level: Optional[str] = None,
                                 learning_objectives: Optional[List[str]] = None) -> Dict[str, Any]:
        """Generate comprehensive lesson plans for medical topics"""
        
        # Search knowledge base for relevant information
        relevant_knowledge = self.search_knowledge_base(topic)
        
        # Create specific prompt for lesson plan generation
        objectives_text = ""
        if learning_objectives:
            objectives_text = f"Learning objectives: {', '.join(learning_objectives)}"
        
        task = f"Create a detailed {duration}-minute lesson plan for '{topic}'"
        if student_level:
            task += f" for {student_level} level students"
        
        task += f"\n{objectives_text}\n\nInclude: introduction, main content sections, activities, assessment, and conclusion with time allocations."
        
        # Get AI response
        result = await self.get_contextual_response(topic, task, "study")
        
        # Structure the lesson plan
        lesson_plan = self.parse_lesson_plan(result["response"], topic, duration)
        
        return {
            "topic": topic,
            "duration": duration,
            "student_level": student_level,
            "lesson_plan": lesson_plan,
            "sources": result["sources"],
            "learning_objectives": learning_objectives or []
        }
    
    def parse_lesson_plan(self, response: str, topic: str, duration: int) -> Dict[str, Any]:
        """Parse and structure lesson plan from AI response"""
        # Default lesson plan structure
        lesson_plan = {
            "title": f"Lesson Plan: {topic}",
            "total_duration": duration,
            "sections": [
                {
                    "title": "Introduction",
                    "duration": int(duration * 0.1),
                    "content": "Welcome and overview of today's topic",
                    "activities": ["Brief review of prerequisites"]
                },
                {
                    "title": "Main Content",
                    "duration": int(duration * 0.6),
                    "content": response[:300] + "..." if len(response) > 300 else response,
                    "activities": ["Interactive discussion", "Case study review"]
                },
                {
                    "title": "Practice/Assessment",
                    "duration": int(duration * 0.2),
                    "content": "Apply learned concepts through practice",
                    "activities": ["Practice questions", "Group exercises"]
                },
                {
                    "title": "Conclusion",
                    "duration": int(duration * 0.1),
                    "content": "Summary and next steps",
                    "activities": ["Recap key points", "Preview next lesson"]
                }
            ],
            "materials_needed": [
                "Presentation slides",
                "Handouts",
                "Practice questions",
                "Case studies"
            ],
            "assessment_methods": [
                "Formative questions during lesson",
                "Exit ticket",
                "Practice quiz"
            ]
        }
        
        return lesson_plan