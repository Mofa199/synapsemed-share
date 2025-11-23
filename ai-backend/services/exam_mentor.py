from typing import Dict, Any, Optional, List
from .base_ai_service import BaseAIService
import json
import random

class ExamMentor(BaseAIService):
    def __init__(self):
        super().__init__()
        self.student_performance = {}  # Track student performance
        self.hint_levels = ["subtle", "moderate", "detailed"]
    
    async def provide_exam_guidance(self, question: str, 
                                  student_answer: Optional[str] = None,
                                  correct_answer: Optional[str] = None,
                                  student_id: Optional[str] = None,
                                  difficulty: str = "intermediate") -> Dict[str, Any]:
        """Provide real-time exam mentoring and guidance"""
        
        # Analyze the question
        question_analysis = await self.analyze_question(question, difficulty)
        
        # Provide appropriate guidance based on context
        if student_answer and correct_answer:
            # Student has answered - provide feedback
            guidance = await self.provide_answer_feedback(
                question, student_answer, correct_answer, question_analysis
            )
        else:
            # Student needs help - provide hints
            guidance = await self.provide_hints(question, question_analysis)
        
        # Update student performance tracking
        if student_id:
            self.update_student_performance(student_id, question, student_answer, correct_answer)
        
        return {
            "question": question,
            "guidance": guidance,
            "question_analysis": question_analysis,
            "student_id": student_id
        }
    
    async def analyze_question(self, question: str, difficulty: str) -> Dict[str, Any]:
        """Analyze exam question to provide targeted guidance"""
        
        # Search for relevant knowledge
        relevant_knowledge = self.search_knowledge_base(question)
        
        # Create analysis prompt
        prompt = f"Analyze this exam question: '{question}'"
        task = "Identify the key concepts being tested, the type of question, and suggest approach strategies"
        
        # Get AI analysis
        result = await self.get_contextual_response(prompt, task, "exam")
        
        # Determine question type
        question_type = self.determine_question_type(question)
        
        # Identify key concepts
        key_concepts = self.extract_key_concepts_from_question(question)
        
        return {
            "question_type": question_type,
            "key_concepts": key_concepts,
            "difficulty": difficulty,
            "approach_strategy": result["response"][:200],
            "relevant_knowledge": relevant_knowledge[:3]
        }
    
    def determine_question_type(self, question: str) -> str:
        """Determine the type of exam question"""
        question_lower = question.lower()
        
        if "which of the following" in question_lower or "select all" in question_lower:
            return "multiple_choice"
        elif "explain" in question_lower or "describe" in question_lower:
            return "short_answer"
        elif "calculate" in question_lower or "determine" in question_lower:
            return "calculation"
        elif "diagnose" in question_lower or "what is the most likely" in question_lower:
            return "clinical_reasoning"
        elif "compare" in question_lower or "contrast" in question_lower:
            return "comparison"
        else:
            return "general"
    
    def extract_key_concepts_from_question(self, question: str) -> List[str]:
        """Extract key medical concepts from the question"""
        # Medical term patterns
        medical_keywords = [
            "symptom", "disease", "treatment", "diagnosis", "medication", 
            "patient", "clinical", "pathology", "therapy", "syndrome",
            "infection", "inflammation", "cardiac", "pulmonary", "renal"
        ]
        
        concepts = []
        question_words = question.lower().split()
        
        # Find medical keywords
        for word in question_words:
            if word in medical_keywords:
                concepts.append(word)
        
        # Extract capitalized terms (likely medical terms)
        import re
        capitalized = re.findall(r'\b[A-Z][a-z]+\b', question)
        concepts.extend(capitalized[:5])
        
        return list(set(concepts))[:10]
    
    async def provide_hints(self, question: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Provide progressive hints for exam questions"""
        
        question_type = analysis.get("question_type", "general")
        key_concepts = analysis.get("key_concepts", [])
        
        # Generate different levels of hints
        hints = {
            "subtle": await self.generate_subtle_hint(question, question_type, key_concepts),
            "moderate": await self.generate_moderate_hint(question, question_type, key_concepts),
            "detailed": await self.generate_detailed_hint(question, question_type, key_concepts)
        }
        
        # Provide approach strategy
        approach_strategy = self.get_approach_strategy(question_type)
        
        return {
            "hints": hints,
            "approach_strategy": approach_strategy,
            "recommended_hint_level": "subtle",  # Start with subtle
            "next_steps": self.get_next_steps(question_type)
        }
    
    async def generate_subtle_hint(self, question: str, question_type: str, 
                                 key_concepts: List[str]) -> str:
        """Generate a subtle hint"""
        if question_type == "multiple_choice":
            return "Consider eliminating obviously incorrect options first, then focus on the key medical concept being tested."
        elif question_type == "clinical_reasoning":
            return "Think about the patient's presentation systematically - what systems could be involved?"
        elif question_type == "calculation":
            return "Review the units and formulas needed. Double-check your setup before calculating."
        else:
            concept_hint = f"Focus on {key_concepts[0]}" if key_concepts else "Break down the question systematically"
            return f"{concept_hint} and consider what the question is really asking."
    
    async def generate_moderate_hint(self, question: str, question_type: str, 
                                   key_concepts: List[str]) -> str:
        """Generate a moderate hint"""
        prompt = f"Provide a moderate hint for this question without giving away the answer: {question}"
        task = "Give guidance on approach and key concepts to consider"
        
        result = await self.get_contextual_response(prompt, task, "exam")
        return result["response"][:150]
    
    async def generate_detailed_hint(self, question: str, question_type: str, 
                                   key_concepts: List[str]) -> str:
        """Generate a detailed hint"""
        prompt = f"Provide detailed guidance for approaching this question: {question}"
        task = "Explain the reasoning process and key knowledge areas needed"
        
        result = await self.get_contextual_response(prompt, task, "exam")
        return result["response"][:200]
    
    def get_approach_strategy(self, question_type: str) -> List[str]:
        """Get approach strategy based on question type"""
        strategies = {
            "multiple_choice": [
                "Read the question carefully before looking at options",
                "Eliminate obviously incorrect answers",
                "Use medical knowledge to narrow down choices",
                "Consider each option systematically"
            ],
            "clinical_reasoning": [
                "Gather all relevant patient information",
                "Consider differential diagnoses",
                "Apply clinical reasoning frameworks",
                "Think about most likely vs. most serious conditions"
            ],
            "calculation": [
                "Identify what you need to calculate",
                "List known values and required formulas",
                "Check units and conversions",
                "Verify your final answer makes sense"
            ],
            "short_answer": [
                "Organize your thoughts before writing",
                "Address all parts of the question",
                "Use specific medical terminology",
                "Provide examples if appropriate"
            ]
        }
        
        return strategies.get(question_type, [
            "Read the question carefully",
            "Identify key concepts",
            "Apply relevant knowledge",
            "Double-check your reasoning"
        ])
    
    def get_next_steps(self, question_type: str) -> List[str]:
        """Get recommended next steps"""
        return [
            "Try to answer based on the hint",
            "If still stuck, request a more detailed hint",
            "Review related concepts after answering",
            "Practice similar questions for reinforcement"
        ]
    
    async def provide_answer_feedback(self, question: str, student_answer: str, 
                                    correct_answer: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Provide detailed feedback on student's answer"""
        
        is_correct = self.evaluate_answer(student_answer, correct_answer)
        
        # Generate feedback
        if is_correct:
            feedback = await self.generate_positive_feedback(question, student_answer, analysis)
        else:
            feedback = await self.generate_corrective_feedback(
                question, student_answer, correct_answer, analysis
            )
        
        return {
            "is_correct": is_correct,
            "feedback": feedback,
            "explanation": await self.generate_explanation(question, correct_answer, analysis),
            "learning_points": self.extract_learning_points(question, analysis),
            "related_topics": self.get_related_topics(analysis.get("key_concepts", []))
        }
    
    def evaluate_answer(self, student_answer: str, correct_answer: str) -> bool:
        """Evaluate if student answer is correct"""
        # Simple comparison - could be made more sophisticated
        return student_answer.lower().strip() == correct_answer.lower().strip()
    
    async def generate_positive_feedback(self, question: str, answer: str, 
                                       analysis: Dict[str, Any]) -> str:
        """Generate positive feedback for correct answers"""
        prompt = f"Provide encouraging feedback for correctly answering: {question}"
        task = "Give positive reinforcement and highlight good reasoning"
        
        result = await self.get_contextual_response(prompt, task, "exam")
        return result["response"][:150]
    
    async def generate_corrective_feedback(self, question: str, student_answer: str, 
                                         correct_answer: str, analysis: Dict[str, Any]) -> str:
        """Generate corrective feedback for incorrect answers"""
        prompt = f"Student answered '{student_answer}' to '{question}'. The correct answer is '{correct_answer}'"
        task = "Provide constructive feedback explaining why the answer was incorrect and guide toward correct understanding"
        
        result = await self.get_contextual_response(prompt, task, "exam")
        return result["response"][:200]
    
    async def generate_explanation(self, question: str, correct_answer: str, 
                                 analysis: Dict[str, Any]) -> str:
        """Generate detailed explanation of the correct answer"""
        prompt = f"Explain why '{correct_answer}' is the correct answer to: {question}"
        task = "Provide educational explanation with reasoning"
        
        result = await self.get_contextual_response(prompt, task, "exam")
        return result["response"][:250]
    
    def extract_learning_points(self, question: str, analysis: Dict[str, Any]) -> List[str]:
        """Extract key learning points from the question"""
        key_concepts = analysis.get("key_concepts", [])
        
        learning_points = [
            f"Understanding {concept} is crucial for this type of question" 
            for concept in key_concepts[:3]
        ]
        
        learning_points.append("Practice similar questions to reinforce learning")
        return learning_points
    
    def get_related_topics(self, key_concepts: List[str]) -> List[str]:
        """Get related topics for further study"""
        topic_relations = {
            "cardiac": ["cardiovascular system", "heart disease", "ECG interpretation"],
            "respiratory": ["lung function", "breathing mechanics", "oxygen transport"],
            "renal": ["kidney function", "fluid balance", "electrolytes"],
            "diabetes": ["endocrine system", "metabolism", "insulin regulation"]
        }
        
        related = []
        for concept in key_concepts:
            if concept.lower() in topic_relations:
                related.extend(topic_relations[concept.lower()][:2])
        
        return related[:5]
    
    def update_student_performance(self, student_id: str, question: str, 
                                 student_answer: Optional[str], correct_answer: Optional[str]):
        """Update student performance tracking"""
        if student_id not in self.student_performance:
            self.student_performance[student_id] = {
                "total_questions": 0,
                "correct_answers": 0,
                "weak_areas": [],
                "strong_areas": []
            }
        
        performance = self.student_performance[student_id]
        performance["total_questions"] += 1
        
        if student_answer and correct_answer:
            is_correct = self.evaluate_answer(student_answer, correct_answer)
            if is_correct:
                performance["correct_answers"] += 1