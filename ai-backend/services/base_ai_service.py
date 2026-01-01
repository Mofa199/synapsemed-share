import os
import json
import logging
from typing import List, Dict, Any, Optional

try:
    import faiss
    import numpy as np
    DEPENDENCIES_AVAILABLE = True
except ImportError:
    DEPENDENCIES_AVAILABLE = False

from .model_manager import ModelManager

class BaseAIService:
    def __init__(self):
        self.setup_logging()
        self.knowledge_base = []
        
        # Initialize/Get ModelManager Singleton
        self.model_manager = ModelManager()
        
        # Proxy attributes to ModelManager
        self.embedding_model = self.model_manager.embedding_model
        self.llm_model = self.model_manager.llm_model
        self.tokenizer = self.model_manager.tokenizer
        self.text_generator = self.model_manager.text_generator
        
        self.vector_store = None
        self.load_knowledge_base()
    
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    
    def load_knowledge_base(self):
        """Load medical knowledge base from your content"""
        try:
            # This would connect to your database to load medical content
            # For now, we'll use sample medical knowledge
            self.knowledge_base = [
                "The cardiovascular system consists of the heart, blood vessels, and blood.",
                "Pharmacokinetics describes how the body processes drugs through absorption, distribution, metabolism, and excretion.",
                "The respiratory system includes the lungs, airways, and respiratory muscles.",
                "Diabetes mellitus is characterized by elevated blood glucose levels.",
                "Antibiotics are medications that fight bacterial infections.",
                "The nervous system is divided into central and peripheral components.",
                "Hypertension is defined as blood pressure consistently above 140/90 mmHg.",
                "The digestive system breaks down food into nutrients the body can absorb.",
                "Vaccines help the immune system recognize and fight specific diseases.",
                "The endocrine system regulates body functions through hormones."
            ]
            
            if self.embedding_model and self.knowledge_base:
                # Create embeddings for knowledge base
                embeddings = self.embedding_model.encode(self.knowledge_base)
                
                # Initialize FAISS vector store
                dimension = embeddings.shape[1]
                self.vector_store = faiss.IndexFlatIP(dimension)
                self.vector_store.add(embeddings.astype('float32'))
                
                self.logger.info(f"Knowledge base loaded with {len(self.knowledge_base)} entries")
                
        except Exception as e:
            self.logger.error(f"Error loading knowledge base: {e}")
    
    def search_knowledge_base(self, query: str, top_k: int = 3) -> List[str]:
        """Search knowledge base for relevant information"""
        try:
            if not self.embedding_model or not self.vector_store:
                return []
            
            # Encode query
            query_embedding = self.embedding_model.encode([query])
            
            # Search in vector store
            scores, indices = self.vector_store.search(query_embedding.astype('float32'), top_k)
            
            # Return relevant knowledge
            relevant_knowledge = []
            for i, idx in enumerate(indices[0]):
                if idx != -1 and scores[0][i] > 0.3:  # Threshold for relevance
                    relevant_knowledge.append(self.knowledge_base[idx])
            
            return relevant_knowledge
            
        except Exception as e:
            self.logger.error(f"Error searching knowledge base: {e}")
            return []
    
    def generate_text(self, prompt: str, max_length: int = 500) -> str:
        """Generate text using local LLM"""
        try:
            if not self.text_generator:
                return "AI service not available"
            
            # Generate text
            result = self.text_generator(
                prompt,
                max_length=len(prompt.split()) + max_length,
                num_return_sequences=1,
                pad_token_id=self.tokenizer.eos_token_id if self.tokenizer and hasattr(self.tokenizer, 'eos_token_id') and self.tokenizer.eos_token_id else 50256
            )
            
            # Extract generated text (remove the prompt)
            generated_text = result[0]['generated_text']
            if generated_text.startswith(prompt):
                generated_text = generated_text[len(prompt):].strip()
            
            return generated_text
            
        except Exception as e:
            self.logger.error(f"Error generating text: {e}")
            return "Sorry, I couldn't generate a response at this time."
    
    def create_medical_prompt(self, task: str, context: str = "", user_input: str = "", 
                            relevant_knowledge: Optional[List[str]] = None) -> str:
        """Create a well-structured prompt for medical AI tasks"""
        
        knowledge_context = ""
        if relevant_knowledge:
            knowledge_context = "\n\nRelevant medical knowledge:\n" + "\n".join(f"- {k}" for k in relevant_knowledge)
        
        system_prompt = f"""You are SYNAPSEMED AI, a medical education assistant. You provide accurate, educational medical information.

Task: {task}
Context: {context}
{knowledge_context}

User Request: {user_input}

Please provide a helpful, accurate, and educational response:"""
        
        return system_prompt
    
    async def get_contextual_response(self, user_input: str, task: str, 
                                    context: str = "general") -> Dict[str, Any]:
        """Get AI response with knowledge base search"""
        try:
            # Search knowledge base first
            relevant_knowledge = self.search_knowledge_base(user_input)
            
            # Create prompt
            prompt = self.create_medical_prompt(task, context, user_input, relevant_knowledge)
            
            # Generate response
            response = self.generate_text(prompt, max_length=300)
            
            return {
                "response": response,
                "sources": relevant_knowledge,
                "context": context,
                "confidence": 0.8 if relevant_knowledge else 0.5
            }
            
        except Exception as e:
            self.logger.error(f"Error getting contextual response: {e}")
            return {
                "response": "I apologize, but I'm having trouble processing your request right now.",
                "sources": [],
                "context": context,
                "confidence": 0.0
            }