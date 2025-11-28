"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Send, 
  BookOpen, 
  Play, 
  HelpCircle, 
  Lightbulb,
  Target,
  RotateCcw,
  Trophy,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for the AI tutor
const mockContentLibrary = {
  videos: [
    { id: 1, title: "Cardiovascular Anatomy", topic: "Cardiology", duration: "15:30" },
    { id: 2, title: "Beta Blockers Pharmacology", topic: "Pharmacology", duration: "12:45" },
    { id: 3, title: "ECG Interpretation Basics", topic: "Cardiology", duration: "18:20" },
  ],
  conceptPages: [
    { id: 1, title: "Beta-1 vs Beta-2 Receptors", topic: "Pharmacology" },
    { id: 2, title: "Heart Sounds Explained", topic: "Cardiology" },
    { id: 3, title: "Renal Physiology Overview", topic: "Nephrology" },
  ],
  questions: [
    { id: 1, question: "Which beta blocker is most selective for beta-1 receptors?", topic: "Pharmacology" },
    { id: 2, question: "What is the most common cause of secondary hypertension?", topic: "Nephrology" },
  ]
};

// Mock AI responses
const getAIResponse = (question: string) => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes("beta") && lowerQuestion.includes("blocker")) {
    return {
      response: "Beta blockers are medications that reduce the effects of epinephrine (adrenaline) by blocking beta-adrenergic receptors. There are three types:\n\n1. **Beta-1 selective blockers** (e.g., metoprolol, atenolol) - primarily affect the heart\n2. **Non-selective beta blockers** (e.g., propranolol) - affect both heart and lungs\n3. **Beta-blockers with alpha-blocking properties** (e.g., carvedilol) - affect heart and blood vessels\n\nFor your question about beta-1 vs beta-2, beta-1 receptors are primarily found in the heart, while beta-2 receptors are found in the lungs and blood vessels.",
      suggestedContent: {
        videos: [mockContentLibrary.videos[1]],
        conceptPages: [mockContentLibrary.conceptPages[0]],
        questions: [mockContentLibrary.questions[0]]
      },
      quizSuggestion: "Would you like to test your knowledge with a quick quiz on beta blockers?"
    };
  }
  
  if (lowerQuestion.includes("cardio") || lowerQuestion.includes("heart")) {
    return {
      response: "Cardiology is a fascinating field focusing on the heart and cardiovascular system. Key topics include:\n\n- **Anatomy**: Heart chambers, valves, and blood flow\n- **Physiology**: Cardiac cycle, electrical conduction\n- **Pathology**: Coronary artery disease, heart failure, arrhythmias\n- **Pharmacology**: Antiarrhythmics, antihypertensives, anticoagulants\n\nI recommend starting with cardiovascular anatomy if you're new to the topic.",
      suggestedContent: {
        videos: [mockContentLibrary.videos[0], mockContentLibrary.videos[2]],
        conceptPages: [mockContentLibrary.conceptPages[1]],
        questions: []
      },
      quizSuggestion: "Want to review heart sounds with a quick quiz?"
    };
  }
  
  return {
    response: "I'm your AI Study Tutor, here to help with your medical studies! I can explain concepts, suggest relevant content, and create quizzes. Try asking me about specific topics like 'Explain beta blockers' or 'What is heart failure?'",
    suggestedContent: {
      videos: [],
      conceptPages: [],
      questions: []
    },
    quizSuggestion: null
  };
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestedContent?: {
    videos: typeof mockContentLibrary.videos;
    conceptPages: typeof mockContentLibrary.conceptPages;
    questions: typeof mockContentLibrary.questions;
  };
  quizSuggestion?: string;
}

export default function AIStudyTutorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI Study Tutor. I can help explain medical concepts, suggest relevant study materials, and even create quick quizzes. What would you like to learn about today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Try to call the AI backend
      const response = await fetch('/api/ai/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer || "I apologize, but I couldn't generate a response. Please try rephrasing your question.",
          timestamp: new Date(),
          suggestedContent: data.suggestedContent,
          quizSuggestion: data.quizSuggestion,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback to mock response
        const fallbackResponse = getAIResponse(currentQuestion);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackResponse.response,
          timestamp: new Date(),
          suggestedContent: fallbackResponse.suggestedContent,
          quizSuggestion: fallbackResponse.quizSuggestion || undefined,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('AI backend error:', error);
      toast({
        title: "Connection issue",
        description: "Using offline mode. AI backend may be unavailable.",
        variant: "default"
      });
      
      // Fallback to mock response
      const fallbackResponse = getAIResponse(currentQuestion);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackResponse.response,
        timestamp: new Date(),
        suggestedContent: fallbackResponse.suggestedContent,
        quizSuggestion: fallbackResponse.quizSuggestion || undefined,
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleStartQuiz = () => {
    const quizMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Great! Let's test your knowledge. Here's a quick 3-question quiz:\n\n**Question 1:** Which beta blocker is most selective for beta-1 receptors?\nA) Propranolol\nB) Metoprolol\nC) Carvedilol\nD) Labetalol",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, quizMessage]);
  };

  const handleNavigateToVideo = (videoId: number) => {
    toast({
      title: "Opening video",
      description: "Navigating to video player..."
    });
    setTimeout(() => {
      router.push(`/student/videos/${videoId}`);
    }, 500);
  };

  const handleNavigateToConcept = (conceptId: number) => {
    toast({
      title: "Opening concept",
      description: "Navigating to concept page..."
    });
    setTimeout(() => {
      router.push(`/student/concepts/${conceptId}`);
    }, 500);
  };

  const handleNavigateToQuestion = (questionId: number) => {
    toast({
      title: "Opening question",
      description: "Navigating to practice question..."
    });
    setTimeout(() => {
      router.push(`/student/questions/practice/${questionId}`);
    }, 500);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Study Tutor</h1>
        <p className="text-xl text-gray-600">Your personal medical education assistant</p>
        <p className="text-gray-700 mt-2">
          Ready to study smarter, not harder? Our AI Study Tutor answers your questions in real time, 
          recommends the right videos and concept pages, and creates quick quizzes to strengthen weak areas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-500" />
                AI Study Assistant
              </CardTitle>
              <CardDescription>Ask questions and get personalized study help</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-4 mb-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          {message.role === "assistant" && message.suggestedContent && (
                            <div className="mt-3 space-y-2">
                              {message.suggestedContent.videos.length > 0 && (
                                <div>
                                  <p className="font-medium text-sm mb-1">Recommended Videos:</p>
                                  <div className="space-y-1">
                                    {message.suggestedContent.videos.map((video) => (
                                      <div 
                                        key={video.id} 
                                        className="flex items-center text-sm bg-white p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleNavigateToVideo(video.id)}
                                      >
                                        <Play className="h-4 w-4 mr-2 text-red-500" />
                                        <span>{video.title}</span>
                                        <span className="ml-2 text-xs text-gray-500">({video.duration})</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {message.suggestedContent.conceptPages.length > 0 && (
                                <div>
                                  <p className="font-medium text-sm mb-1">Concept Pages:</p>
                                  <div className="space-y-1">
                                    {message.suggestedContent.conceptPages.map((page) => (
                                      <div 
                                        key={page.id} 
                                        className="flex items-center text-sm bg-white p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleNavigateToConcept(page.id)}
                                      >
                                        <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                                        <span>{page.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {message.suggestedContent.questions.length > 0 && (
                                <div>
                                  <p className="font-medium text-sm mb-1">Practice Questions:</p>
                                  <div className="space-y-1">
                                    {message.suggestedContent.questions.map((question) => (
                                      <div 
                                        key={question.id} 
                                        className="flex items-center text-sm bg-white p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleNavigateToQuestion(question.id)}
                                      >
                                        <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                                        <span>{question.question}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {message.role === "assistant" && message.quizSuggestion && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm">{message.quizSuggestion}</p>
                              <Button 
                                size="sm" 
                                className="mt-2 bg-blue-500 hover:bg-blue-600"
                                onClick={handleStartQuiz}
                              >
                                Start Quiz
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 text-gray-800 rounded-lg p-4">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about medical topics..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar with Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Your Progress
              </CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Concepts Mastered</span>
                    <span>12/45</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "27%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Questions Answered</span>
                    <span>85</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">Weak Areas:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Cardiology</span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Pharmacology</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
                Quick Questions
              </CardTitle>
              <CardDescription>Try these to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm h-auto py-2 px-3"
                onClick={() => handleQuickQuestion("Explain the difference between beta-1 and beta-2 blockers")}
              >
                Explain beta blockers
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm h-auto py-2 px-3"
                onClick={() => handleQuickQuestion("What are the symptoms of heart failure?")}
              >
                Heart failure symptoms
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm h-auto py-2 px-3"
                onClick={() => handleQuickQuestion("How does ACE inhibitor work?")}
              >
                ACE inhibitors mechanism
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm h-auto py-2 px-3"
                onClick={() => handleQuickQuestion("Create a quiz on ECG interpretation")}
              >
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                Generate quiz
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-500" />
                Study Recommendations
              </CardTitle>
              <CardDescription>Based on your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-2 bg-blue-50 rounded">
                <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Cardiovascular Anatomy</p>
                  <p className="text-xs text-gray-600">Video • 15 min</p>
                </div>
              </div>
              <div className="flex items-center p-2 bg-yellow-50 rounded">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Beta Blockers</p>
                  <p className="text-xs text-gray-600">Concept Page</p>
                </div>
              </div>
              <div className="flex items-center p-2 bg-green-50 rounded">
                <HelpCircle className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Heart Sounds Quiz</p>
                  <p className="text-xs text-gray-600">5 Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-6 text-lg">
          <Bot className="h-6 w-6 mr-2" />
          Try the AI Tutor now!
        </Button>
      </div>
    </div>
  );
}