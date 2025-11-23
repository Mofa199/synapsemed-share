from typing import Dict, Any, Optional, List
from .base_ai_service import BaseAIService
import json
import re

class FlashcardGenerator(BaseAIService):
    def __init__(self):
        super().__init__()
    
    async def generate_flashcards(self, topic: str, context: str = "general", 
                                student_level: Optional[str] = None, 
                                count: int = 10) -> Dict[str, Any]:
        """Generate study flashcards for medical topics"""
        
        # Search knowledge base for relevant information
        relevant_knowledge = self.search_knowledge_base(topic)
        
        # Create specific prompt for flashcard generation
        task = f"Generate {count} educational flashcards about {topic}. Each flashcard should have a clear question/term on the front and a detailed answer/explanation on the back"
        if student_level:
            task += f" appropriate for a {student_level} level student"
        
        task += "\n\nFormat your response as:\nFRONT: [question/term]\nBACK: [answer/explanation]\nHINT: [optional helpful hint]\n---"
        
        # Get AI response
        result = await self.get_contextual_response(topic, task, context)
        
        # Parse flashcards from response
        flashcards = self.parse_flashcards(result["response"], count)
        
        return {
            "topic": topic,
            "flashcards": flashcards,
            "sources": result["sources"],
            "context": context,
            "student_level": student_level,
            "count": len(flashcards)
        }
    
    def parse_flashcards(self, response: str, requested_count: int) -> List[Dict[str, Any]]:
        """Parse flashcards from AI response"""
        flashcards = []
        
        try:
            # Split by separator or try to identify flashcard patterns
            cards = response.split('---')
            
            for card_text in cards:
                card_text = card_text.strip()
                if not card_text:
                    continue
                
                # Extract front, back, and hint
                front_match = re.search(r'FRONT:\s*(.+?)(?=BACK:|$)', card_text, re.DOTALL | re.IGNORECASE)
                back_match = re.search(r'BACK:\s*(.+?)(?=HINT:|$)', card_text, re.DOTALL | re.IGNORECASE)
                hint_match = re.search(r'HINT:\s*(.+?)$', card_text, re.DOTALL | re.IGNORECASE)
                
                if front_match and back_match:
                    flashcard = {
                        "front": front_match.group(1).strip(),
                        "back": back_match.group(1).strip(),
                        "hint": hint_match.group(1).strip() if hint_match else None,
                        "difficulty": "intermediate"
                    }
                    flashcards.append(flashcard)
            
            # If parsing failed, create basic flashcards from the response
            if not flashcards:
                flashcards = self.create_basic_flashcards(response, requested_count)
            
        except Exception as e:
            self.logger.error(f"Error parsing flashcards: {e}")
            flashcards = self.create_basic_flashcards(response, requested_count)
        
        return flashcards[:requested_count]  # Limit to requested count
    
    def create_basic_flashcards(self, response: str, count: int) -> List[Dict[str, Any]]:
        """Create basic flashcards if parsing fails"""
        sentences = response.split('.')
        flashcards = []
        
        for i, sentence in enumerate(sentences[:count]):
            sentence = sentence.strip()
            if len(sentence) > 10:  # Only use meaningful sentences
                # Try to create a question from the sentence
                if 'is' in sentence.lower():
                    parts = sentence.split(' is ', 1)
                    if len(parts) == 2:
                        flashcards.append({
                            "front": f"What is {parts[0].strip()}?",
                            "back": f"{parts[0].strip()} is {parts[1].strip()}",
                            "hint": None,
                            "difficulty": "basic"
                        })
                else:
                    flashcards.append({
                        "front": f"Question {i+1}",
                        "back": sentence,
                        "hint": "Review your study materials",
                        "difficulty": "basic"
                    })
        
        return flashcards