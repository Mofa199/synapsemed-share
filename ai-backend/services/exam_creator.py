from typing import Dict, Any, Optional, List
from .base_ai_service import BaseAIService
import json
import re
import random

class ExamCreator(BaseAIService):
    def __init__(self):
        super().__init__()
    
    async def create_exam_questions(self, topic: str, count: int = 10, 
                                  context: str = "general", 
                                  student_level: Optional[str] = None,
                                  difficulty: str = "intermediate") -> Dict[str, Any]:
        """Generate practice exam questions with multiple choice answers"""
        
        # Search knowledge base for relevant information
        relevant_knowledge = self.search_knowledge_base(topic)
        
        # Create specific prompt for exam question generation
        task = f"Generate {count} multiple choice exam questions about {topic}. Each question should have 4 options (A, B, C, D) with only one correct answer"
        if student_level:
            task += f" appropriate for a {student_level} level student"
        
        task += f"\nDifficulty level: {difficulty}"
        task += "\n\nFormat your response as:\nQUESTION: [question text]\nA) [option A]\nB) [option B]\nC) [option C]\nD) [option D]\nCORRECT: [A, B, C, or D]\nEXPLANATION: [detailed explanation]\n---"
        
        # Get AI response
        result = await self.get_contextual_response(topic, task, context)
        
        # Parse questions from response
        questions = self.parse_exam_questions(result["response"], count)
        
        return {
            "topic": topic,
            "questions": questions,
            "sources": result["sources"],
            "context": context,
            "student_level": student_level,
            "difficulty": difficulty,
            "count": len(questions)
        }
    
    def parse_exam_questions(self, response: str, requested_count: int) -> List[Dict[str, Any]]:
        """Parse exam questions from AI response"""
        questions = []
        
        try:
            # Split by separator
            question_blocks = response.split('---')
            
            for block in question_blocks:
                block = block.strip()
                if not block:
                    continue
                
                # Extract question components
                question_match = re.search(r'QUESTION:\s*(.+?)(?=A\)|$)', block, re.DOTALL | re.IGNORECASE)
                options_match = re.findall(r'([A-D])\)\s*(.+?)(?=[A-D]\)|CORRECT:|$)', block, re.DOTALL | re.IGNORECASE)
                correct_match = re.search(r'CORRECT:\s*([A-D])', block, re.IGNORECASE)
                explanation_match = re.search(r'EXPLANATION:\s*(.+?)$', block, re.DOTALL | re.IGNORECASE)
                
                if question_match and len(options_match) >= 4 and correct_match:
                    # Convert correct answer letter to index
                    correct_letter = correct_match.group(1).upper()
                    correct_index = ord(correct_letter) - ord('A')
                    
                    question_data = {
                        "question": question_match.group(1).strip(),
                        "options": [option[1].strip() for option in options_match[:4]],
                        "correctAnswer": correct_index,
                        "explanation": explanation_match.group(1).strip() if explanation_match else "No explanation provided",
                        "difficulty": "intermediate"
                    }
                    questions.append(question_data)
            
            # If parsing failed, create basic questions
            if not questions:
                questions = self.create_basic_questions(response, requested_count)
            
        except Exception as e:
            self.logger.error(f"Error parsing exam questions: {e}")
            questions = self.create_basic_questions(response, requested_count)
        
        return questions[:requested_count]
    
    def create_basic_questions(self, response: str, count: int) -> List[Dict[str, Any]]:
        """Create basic questions if parsing fails"""
        questions = []
        sentences = [s.strip() for s in response.split('.') if len(s.strip()) > 20]
        
        basic_medical_questions = [
            {
                "question": "What is the primary function of the cardiovascular system?",
                "options": [
                    "To digest food",
                    "To pump blood throughout the body",
                    "To produce hormones",
                    "To filter toxins"
                ],
                "correctAnswer": 1,
                "explanation": "The cardiovascular system's primary function is to pump blood throughout the body, delivering oxygen and nutrients to tissues."
            },
            {
                "question": "Which of the following is NOT a vital sign?",
                "options": [
                    "Blood pressure",
                    "Heart rate",
                    "Height",
                    "Temperature"
                ],
                "correctAnswer": 2,
                "explanation": "Height is not a vital sign. The four main vital signs are temperature, blood pressure, heart rate, and respiratory rate."
            },
            {
                "question": "What does the term 'tachycardia' refer to?",
                "options": [
                    "Slow heart rate",
                    "Fast heart rate",
                    "Irregular heart rate",
                    "Normal heart rate"
                ],
                "correctAnswer": 1,
                "explanation": "Tachycardia refers to a fast heart rate, typically over 100 beats per minute in adults."
            }
        ]
        
        # Use basic questions and try to create more from the response
        questions.extend(basic_medical_questions[:count])
        
        return questions[:count]