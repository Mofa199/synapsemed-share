from typing import Dict, Any, Optional, List
from .base_ai_service import BaseAIService
import json
from datetime import datetime, timedelta

class StudyPlanner(BaseAIService):
    def __init__(self):
        super().__init__()
    
    async def create_study_plan(self, subjects: List[str], 
                              available_hours_per_day: int = 4,
                              exam_date: Optional[str] = None,
                              weak_areas: Optional[List[str]] = None,
                              student_level: Optional[str] = None) -> Dict[str, Any]:
        """Create personalized study plans with schedules"""
        
        # Calculate study period
        days_until_exam = self.calculate_study_days(exam_date)
        
        # Create prompt for study planning
        prompt = f"Create a detailed study plan for: {', '.join(subjects)}"
        prompt += f"\nAvailable study time: {available_hours_per_day} hours per day"
        if days_until_exam:
            prompt += f"\nDays until exam: {days_until_exam}"
        if weak_areas:
            prompt += f"\nAreas needing extra focus: {', '.join(weak_areas)}"
        
        task = "Generate a structured study schedule with daily topics, time allocations, and review sessions"
        
        # Get AI response
        result = await self.get_contextual_response(prompt, task, "study")
        
        # Create structured study plan
        study_plan = self.create_structured_plan(
            subjects, available_hours_per_day, days_until_exam, 
            weak_areas, result["response"]
        )
        
        return {
            "study_plan": study_plan,
            "subjects": subjects,
            "daily_hours": available_hours_per_day,
            "days_until_exam": days_until_exam,
            "weak_areas": weak_areas or [],
            "sources": result["sources"]
        }
    
    def calculate_study_days(self, exam_date: Optional[str]) -> Optional[int]:
        """Calculate days until exam"""
        if not exam_date:
            return None
        
        try:
            exam_datetime = datetime.strptime(exam_date, "%Y-%m-%d")
            today = datetime.now()
            days_difference = (exam_datetime - today).days
            return max(1, days_difference)  # At least 1 day
        except:
            return None
    
    def create_structured_plan(self, subjects: List[str], daily_hours: int, 
                             days_until_exam: Optional[int], weak_areas: Optional[List[str]],
                             ai_response: str) -> Dict[str, Any]:
        """Create a structured study plan"""
        
        # Default plan structure
        total_subjects = len(subjects)
        hours_per_subject = daily_hours // total_subjects if total_subjects > 0 else daily_hours
        
        # Create weekly schedule
        weekly_schedule = []
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        
        for i, day in enumerate(days_of_week):
            daily_schedule = {
                "day": day,
                "sessions": []
            }
            
            # Rotate subjects throughout the week
            for j, subject in enumerate(subjects):
                session_time = hours_per_subject
                
                # Give extra time to weak areas
                if weak_areas and subject in weak_areas:
                    session_time += 0.5
                
                daily_schedule["sessions"].append({
                    "subject": subject,
                    "duration": session_time,
                    "focus": "review" if i % 3 == 0 else "new_content",
                    "activities": [
                        "Read assigned materials",
                        "Complete practice questions", 
                        "Review flashcards",
                        "Make summary notes"
                    ]
                })
            
            # Add review session
            if i % 2 == 1:  # Every other day
                daily_schedule["sessions"].append({
                    "subject": "Review",
                    "duration": 1,
                    "focus": "comprehensive_review",
                    "activities": [
                        "Review previous day's notes",
                        "Practice mixed questions",
                        "Identify knowledge gaps"
                    ]
                })
            
            weekly_schedule.append(daily_schedule)
        
        # Create milestones
        milestones = []
        if days_until_exam:
            # Create milestone every week or every 25% of study period
            milestone_interval = min(7, days_until_exam // 4) if days_until_exam > 14 else days_until_exam // 2
            
            for i in range(1, (days_until_exam // milestone_interval) + 1):
                milestone_day = i * milestone_interval
                milestone_subjects = subjects[:(i * len(subjects) // 4)] if i < 4 else subjects
                
                milestones.append({
                    "day": milestone_day,
                    "title": f"Milestone {i}",
                    "goals": [f"Complete {subject} fundamentals" for subject in milestone_subjects[:3]],
                    "assessment": "Practice test covering completed topics"
                })
        
        study_plan = {
            "overview": {
                "total_subjects": len(subjects),
                "daily_hours": daily_hours,
                "study_period_days": days_until_exam,
                "focus_areas": weak_areas or []
            },
            "weekly_schedule": weekly_schedule,
            "milestones": milestones,
            "study_tips": [
                "Use active recall techniques",
                "Take regular breaks (Pomodoro technique)",
                "Review material within 24 hours",
                "Practice spaced repetition",
                "Get adequate sleep and exercise"
            ],
            "resources": [
                "Textbooks and course materials",
                "Practice question banks",
                "Flashcard systems",
                "Study groups",
                "Online resources and videos"
            ]
        }
        
        return study_plan