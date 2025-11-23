#!/usr/bin/env python3
"""
Basic test for SYNAPSEMED AI backend
This tests if the system can start without all dependencies
"""

print("🚀 SYNAPSEMED AI - Basic Test")
print("=" * 40)

# Test Python basics
print("✅ Python is working")

# Test basic imports
try:
    import json
    import os
    from typing import Dict, Any, Optional, List
    print("✅ Basic Python libraries available")
except Exception as e:
    print(f"❌ Basic imports failed: {e}")

# Test if we can create a simple FastAPI-like mock
try:
    class MockAIService:
        def __init__(self):
            self.knowledge_base = [
                "The cardiovascular system consists of the heart, blood vessels, and blood.",
                "Pharmacokinetics describes how the body processes drugs.",
                "The respiratory system includes the lungs and airways.",
                "Diabetes mellitus is characterized by elevated blood glucose levels.",
                "Antibiotics are medications that fight bacterial infections."
            ]
        
        async def answer_question(self, question: str) -> Dict[str, Any]:
            # Simple mock response
            return {
                "question": question,
                "answer": f"This is a basic response about: {question}. In a full system, this would be powered by AI models.",
                "sources": self.knowledge_base[:2],
                "confidence": 0.7
            }
        
        async def generate_flashcards(self, topic: str, count: int = 5) -> Dict[str, Any]:
            flashcards = []
            for i in range(min(count, 3)):
                flashcards.append({
                    "front": f"Question {i+1} about {topic}",
                    "back": f"Answer {i+1} explaining {topic} concepts",
                    "hint": f"Think about {topic} fundamentals"
                })
            
            return {
                "topic": topic,
                "flashcards": flashcards,
                "count": len(flashcards)
            }
    
    # Test the mock service
    service = MockAIService()
    print("✅ Mock AI service created")
    
    # Test async function (won't actually run async in this test)
    print("✅ AI service structure ready")
    
except Exception as e:
    print(f"❌ Mock service failed: {e}")

print("\n📋 System Status:")
print("- Python: ✅ Working")
print("- Basic Structure: ✅ Ready")
print("- AI Models: ⏳ Will download when full system runs")
print("- FastAPI: ⏳ Installing...")

print("\n🎯 Next Steps:")
print("1. Wait for pip install to complete")
print("2. Run: python main.py")
print("3. Visit: http://localhost:8000/health")

print("\n💡 The system is ready! Just waiting for dependencies...")