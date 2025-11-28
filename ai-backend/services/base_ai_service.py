import os
import json
import logging
from typing import List, Dict, Any, Optional

try:
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    import torch
    DEPENDENCIES_AVAILABLE = True
except ImportError:
    DEPENDENCIES_AVAILABLE = False

class BaseAIService:
    def __init__(self):
        self.setup_logging()
        self.embedding_model = None
        self.llm_model = None
        self.tokenizer = None
        self.vector_store = None
        self.knowledge_base = []
        self.initialize_models()
        self.load_knowledge_base()
    
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def initialize_models(self):
        """Initialize local AI models"""
        try:
            # Initialize embedding model for semantic search
            self.logger.info("Loading embedding model...")
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Initialize local LLM (using Microsoft Phi-2 as it's smaller and free)
            self.logger.info("Loading language model...")
            model_name = "microsoft/phi-2"
            
            # Check if CUDA is available
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.logger.info(f"Using device: {device}")
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
            self.llm_model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                device_map="auto" if device == "cuda" else None,
                trust_remote_code=True
            )
            
            # Create text generation pipeline
            self.text_generator = pipeline(
                "text-generation",
                model=self.llm_model,
                tokenizer=self.tokenizer,
                device=0 if device == "cuda" else -1,
                max_length=2048,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.1
            )
            
            self.logger.info("Models loaded successfully!")
            
        except Exception as e:
            self.logger.error(f"Error initializing models: {e}")
            # Fallback to CPU-only smaller model
            self.initialize_fallback_model()
    
    def initialize_fallback_model(self):
        """Initialize a smaller model if the main one fails"""
        try:
            self.logger.info("Initializing fallback model...")
            # Use a smaller, CPU-friendly model
            model_name = "distilgpt2"
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.llm_model = AutoModelForCausalLM.from_pretrained(model_name)
            
            self.text_generator = pipeline(
                "text-generation",
                model=self.llm_model,
                tokenizer=self.tokenizer,
                device=-1,  # CPU only
                max_length=1024,
                do_sample=True,
                temperature=0.7
            )
            
            self.logger.info("Fallback model loaded successfully!")
            
        except Exception as e:
            self.logger.error(f"Error initializing fallback model: {e}")
    
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