from typing import Dict, Any, Optional, List
from .base_ai_service import BaseAIService
import json

class RecommendationEngine(BaseAIService):
    def __init__(self):
        super().__init__()
        self.study_patterns = {
            "beginner": {
                "focus_areas": ["basic concepts", "terminology", "fundamentals"],
                "study_time": "2-3 hours daily",
                "difficulty": "basic"
            },
            "intermediate": {
                "focus_areas": ["clinical applications", "case studies", "connections"],
                "study_time": "3-4 hours daily", 
                "difficulty": "intermediate"
            },
            "advanced": {
                "focus_areas": ["complex cases", "research", "teaching others"],
                "study_time": "4-5 hours daily",
                "difficulty": "advanced"
            }
        }
    
    async def generate_recommendations(self, current_context: str = "general",
                                    level: Optional[str] = None,
                                    weak_areas: Optional[List[str]] = None,
                                    preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate personalized study recommendations"""
        
        # Create prompt for recommendations
        prompt_parts = [
            f"Provide personalized study recommendations for a medical student",
            f"Current context: {current_context}",
        ]
        
        if level:
            prompt_parts.append(f"Student level: {level}")
        
        if weak_areas:
            prompt_parts.append(f"Areas needing improvement: {', '.join(weak_areas)}")
        
        if preferences:
            prompt_parts.append(f"Learning preferences: {json.dumps(preferences)}")
        
        prompt = ". ".join(prompt_parts)
        
        # Get AI response
        task = "Generate specific, actionable study recommendations with priorities and resources"
        result = await self.get_contextual_response(prompt, task, current_context)
        
        # Generate structured recommendations
        recommendations = self.create_structured_recommendations(
            current_context, level, weak_areas, result["response"]
        )
        
        return {
            "recommendations": recommendations,
            "context": current_context,
            "level": level,
            "sources": result["sources"]
        }
    
    def create_structured_recommendations(self, context: str, level: Optional[str], 
                                       weak_areas: Optional[List[str]], 
                                       ai_response: str) -> List[Dict[str, Any]]:
        """Create structured recommendations"""
        recommendations = []
        
        # Context-specific recommendations
        if context == "exam":
            recommendations.extend(self.get_exam_recommendations(level))
        elif context == "study":
            recommendations.extend(self.get_study_recommendations(level))
        else:
            recommendations.extend(self.get_general_recommendations(level))
        
        # Weak area specific recommendations
        if weak_areas:
            for area in weak_areas:
                recommendations.append({
                    "title": f"Focus on {area}",
                    "description": f"Dedicated practice and review of {area} concepts",
                    "priority": "high",
                    "resources": [
                        f"Review {area} flashcards daily",
                        f"Complete {area} practice questions",
                        f"Watch {area} educational videos"
                    ],
                    "estimatedTime": "1-2 hours daily"
                })
        
        # Add AI-generated insights if available
        if ai_response and len(ai_response) > 50:
            recommendations.append({
                "title": "AI-Generated Insights",
                "description": ai_response[:200] + "..." if len(ai_response) > 200 else ai_response,
                "priority": "medium",
                "resources": ["Follow AI recommendations"],
                "estimatedTime": "Varies"
            })
        
        return recommendations[:10]  # Limit to 10 recommendations
    
    def get_exam_recommendations(self, level: Optional[str]) -> List[Dict[str, Any]]:
        """Get exam-specific recommendations"""
        return [
            {
                "title": "Practice Timed Questions",
                "description": "Complete practice questions under exam conditions to improve speed and accuracy",
                "priority": "high",
                "resources": [
                    "Use question banks with timer",
                    "Review incorrect answers immediately",
                    "Focus on high-yield topics"
                ],
                "estimatedTime": "2-3 hours daily"
            },
            {
                "title": "Review Key Concepts",
                "description": "Focus on fundamental concepts that appear frequently in exams",
                "priority": "high",
                "resources": [
                    "Create concept maps",
                    "Use active recall techniques",
                    "Teach concepts to others"
                ],
                "estimatedTime": "1-2 hours daily"
            },
            {
                "title": "Simulate Exam Conditions",
                "description": "Practice under realistic exam conditions to reduce anxiety",
                "priority": "medium",
                "resources": [
                    "Take full-length practice exams",
                    "Practice time management",
                    "Use official exam formats"
                ],
                "estimatedTime": "3-4 hours weekly"
            }
        ]
    
    def get_study_recommendations(self, level: Optional[str]) -> List[Dict[str, Any]]:
        """Get study-specific recommendations"""
        return [
            {
                "title": "Active Learning Techniques",
                "description": "Use evidence-based study methods for better retention",
                "priority": "high",
                "resources": [
                    "Spaced repetition flashcards",
                    "Practice testing",
                    "Elaborative interrogation"
                ],
                "estimatedTime": "Daily practice"
            },
            {
                "title": "Create Study Schedule",
                "description": "Organize study time effectively across all subjects",
                "priority": "medium",
                "resources": [
                    "Use calendar blocking",
                    "Set specific goals",
                    "Track progress regularly"
                ],
                "estimatedTime": "30 minutes planning weekly"
            },
            {
                "title": "Join Study Groups",
                "description": "Collaborate with peers for deeper understanding",
                "priority": "low",
                "resources": [
                    "Form discussion groups",
                    "Explain concepts to others",
                    "Share study resources"
                ],
                "estimatedTime": "2-3 hours weekly"
            }
        ]
    
    def get_general_recommendations(self, level: Optional[str]) -> List[Dict[str, Any]]:
        """Get general learning recommendations"""
        return [
            {
                "title": "Build Strong Fundamentals",
                "description": "Master core medical concepts before advancing to complex topics",
                "priority": "high",
                "resources": [
                    "Review anatomy and physiology",
                    "Understand basic pathophysiology",
                    "Learn medical terminology"
                ],
                "estimatedTime": "1-2 hours daily"
            },
            {
                "title": "Develop Clinical Reasoning",
                "description": "Practice applying knowledge to clinical scenarios",
                "priority": "medium",
                "resources": [
                    "Work through case studies",
                    "Use clinical reasoning frameworks",
                    "Practice differential diagnosis"
                ],
                "estimatedTime": "1 hour daily"
            },
            {
                "title": "Stay Updated",
                "description": "Keep current with medical advances and guidelines",
                "priority": "low",
                "resources": [
                    "Read medical journals",
                    "Follow professional guidelines",
                    "Attend medical conferences"
                ],
                "estimatedTime": "2-3 hours weekly"
            }
        ]