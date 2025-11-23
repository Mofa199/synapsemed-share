from typing import Dict, Any, Optional, List, Tuple
from .base_ai_service import BaseAIService
import json
import re

class SmartSearch(BaseAIService):
    def __init__(self):
        super().__init__()
        self.search_history = []
    
    async def intelligent_search(self, query: str, 
                               context: str = "general",
                               filters: Optional[Dict[str, Any]] = None,
                               user_id: Optional[str] = None) -> Dict[str, Any]:
        """Perform intelligent search with context awareness"""
        
        # Enhance query with context
        enhanced_query = self.enhance_search_query(query, context)
        
        # Search knowledge base
        relevant_knowledge = self.search_knowledge_base(enhanced_query, top_k=10)
        
        # Get AI-powered search insights
        search_insights = await self.generate_search_insights(query, relevant_knowledge, context)
        
        # Apply filters if provided
        filtered_results = self.apply_search_filters(relevant_knowledge, filters)
        
        # Store search history
        self.store_search_history(query, context, user_id)
        
        # Get related suggestions
        suggestions = self.get_search_suggestions(query, context)
        
        return {
            "query": query,
            "enhanced_query": enhanced_query,
            "results": filtered_results,
            "insights": search_insights,
            "suggestions": suggestions,
            "context": context,
            "total_results": len(filtered_results)
        }
    
    def enhance_search_query(self, query: str, context: str) -> str:
        """Enhance search query based on context"""
        medical_synonyms = {
            "heart": ["cardiac", "cardiovascular", "myocardial"],
            "lung": ["pulmonary", "respiratory", "pneumonic"],
            "kidney": ["renal", "nephric"],
            "liver": ["hepatic", "hepato"],
            "brain": ["cerebral", "neurological", "cranial"],
            "blood": ["hematologic", "vascular", "circulatory"]
        }
        
        enhanced_terms = [query]
        
        # Add medical synonyms
        for term, synonyms in medical_synonyms.items():
            if term.lower() in query.lower():
                enhanced_terms.extend(synonyms)
        
        # Add context-specific terms
        if context == "exam":
            enhanced_terms.extend(["questions", "practice", "assessment", "quiz"])
        elif context == "study":
            enhanced_terms.extend(["learning", "education", "tutorial", "guide"])
        
        return " ".join(enhanced_terms)
    
    async def generate_search_insights(self, query: str, results: List[str], 
                                     context: str) -> Dict[str, Any]:
        """Generate AI-powered insights about search results"""
        
        if not results:
            return {
                "summary": "No relevant results found for your query.",
                "key_concepts": [],
                "difficulty_level": "unknown"
            }
        
        # Create prompt for insights
        results_text = "\n".join(results[:5])  # Use top 5 results
        prompt = f"Analyze these search results for the query '{query}' and provide insights:\n{results_text}"
        
        task = "Provide a summary, identify key concepts, and determine difficulty level"
        
        # Get AI response
        result = await self.get_contextual_response(prompt, task, context)
        
        # Extract key concepts from results
        key_concepts = self.extract_key_concepts(results_text)
        
        return {
            "summary": result["response"][:200] + "..." if len(result["response"]) > 200 else result["response"],
            "key_concepts": key_concepts,
            "difficulty_level": self.assess_difficulty_level(results_text),
            "confidence": result["confidence"]
        }
    
    def extract_key_concepts(self, text: str) -> List[str]:
        """Extract key medical concepts from text"""
        # Common medical terms and patterns
        medical_patterns = [
            r'\b[A-Z][a-z]+itis\b',  # Inflammations (e.g., arthritis)
            r'\b[A-Z][a-z]*ology\b',  # Medical fields (e.g., cardiology)
            r'\b[A-Z][a-z]*pathy\b',  # Diseases (e.g., neuropathy)
            r'\b[A-Z][a-z]*osis\b',   # Conditions (e.g., fibrosis)
            r'\b[A-Z][a-z]*emia\b',   # Blood conditions (e.g., anemia)
        ]
        
        concepts = set()
        
        # Extract pattern-based concepts
        for pattern in medical_patterns:
            matches = re.findall(pattern, text)
            concepts.update(matches)
        
        # Extract capitalized medical terms
        capitalized_terms = re.findall(r'\b[A-Z][a-z]{3,}\b', text)
        medical_terms = [term for term in capitalized_terms 
                        if term.lower() not in ['The', 'This', 'That', 'When', 'Where', 'What']]
        concepts.update(medical_terms[:10])  # Limit to top 10
        
        return list(concepts)[:15]  # Return max 15 concepts
    
    def assess_difficulty_level(self, text: str) -> str:
        """Assess the difficulty level of the content"""
        # Simple heuristic based on text complexity
        complex_terms = ['pathophysiology', 'pharmacokinetics', 'differential', 'etiology']
        basic_terms = ['anatomy', 'basic', 'introduction', 'overview']
        
        complex_count = sum(1 for term in complex_terms if term.lower() in text.lower())
        basic_count = sum(1 for term in basic_terms if term.lower() in text.lower())
        
        if complex_count > basic_count:
            return "advanced"
        elif basic_count > 0:
            return "beginner"
        else:
            return "intermediate"
    
    def apply_search_filters(self, results: List[str], filters: Optional[Dict[str, Any]]) -> List[str]:
        """Apply search filters to results"""
        if not filters:
            return results
        
        filtered_results = results.copy()
        
        # Apply content type filter
        if 'content_type' in filters:
            content_type = filters['content_type'].lower()
            if content_type == 'questions':
                filtered_results = [r for r in filtered_results if '?' in r]
            elif content_type == 'definitions':
                filtered_results = [r for r in filtered_results if ' is ' in r.lower()]
        
        # Apply difficulty filter
        if 'difficulty' in filters:
            difficulty = filters['difficulty'].lower()
            # This would need more sophisticated filtering based on content analysis
            pass
        
        return filtered_results
    
    def store_search_history(self, query: str, context: str, user_id: Optional[str]):
        """Store search history for personalization"""
        search_entry = {
            "query": query,
            "context": context,
            "user_id": user_id,
            "timestamp": self.get_current_timestamp()
        }
        
        self.search_history.append(search_entry)
        
        # Keep only last 100 searches
        if len(self.search_history) > 100:
            self.search_history = self.search_history[-100:]
    
    def get_search_suggestions(self, query: str, context: str) -> List[str]:
        """Get search suggestions based on query and context"""
        suggestions = []
        
        # Context-based suggestions
        if context == "exam":
            suggestions.extend([
                f"{query} practice questions",
                f"{query} exam tips",
                f"{query} study guide",
                f"Common {query} mistakes"
            ])
        elif context == "study":
            suggestions.extend([
                f"{query} overview",
                f"{query} fundamentals",
                f"{query} clinical applications",
                f"{query} case studies"
            ])
        else:
            suggestions.extend([
                f"{query} definition",
                f"{query} symptoms",
                f"{query} treatment",
                f"{query} causes"
            ])
        
        # Add related medical topics
        medical_relations = {
            "heart": ["cardiovascular system", "cardiac cycle", "heart disease"],
            "diabetes": ["insulin", "glucose", "endocrine system"],
            "infection": ["antibiotics", "immune system", "pathogens"],
            "cancer": ["oncology", "tumor", "chemotherapy"]
        }
        
        for key, related in medical_relations.items():
            if key.lower() in query.lower():
                suggestions.extend(related[:2])
        
        return suggestions[:8]  # Limit to 8 suggestions
    
    def get_current_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()