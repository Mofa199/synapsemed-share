from typing import Dict, Any, Optional
from .base_ai_service import BaseAIService

class QuestionAnswerer(BaseAIService):
    def __init__(self):
        super().__init__()
    
    async def answer_question(self, question: str, context: str = "general", 
                            student_level: Optional[str] = None) -> Dict[str, Any]:
        """Answer medical questions with detailed explanations"""
        
        # Search knowledge base for relevant information
        relevant_knowledge = self.search_knowledge_base(question)
        
        # Create specific prompt for question answering
        task = "Answer the following medical question with a clear, detailed explanation"
        if student_level:
            task += f" appropriate for a {student_level} level student"
        
        # Get AI response
        result = await self.get_contextual_response(question, task, context)
        
        # Structure the response
        return {
            "question": question,
            "answer": result["response"],
            "sources": result["sources"],
            "confidence": result["confidence"],
            "context": context,
            "student_level": student_level
        }