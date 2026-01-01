import logging
import torch
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

class ModelManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if self.initialized:
            return
            
        self.setup_logging()
        self.embedding_model = None
        self.llm_model = None
        self.tokenizer = None
        self.text_generator = None
        self.initialize_models()
        self.initialized = True

    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def initialize_models(self):
        """Initialize local AI models"""
        try:
            # Initialize embedding model for semantic search
            self.logger.info("Loading embedding model (Singleton)...")
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Initialize local LLM (using Microsoft Phi-2)
            self.logger.info("Loading language model (Singleton)...")
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
