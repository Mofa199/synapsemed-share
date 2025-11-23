"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  X,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  Lightbulb,
  Search,
  Calendar,
  Brain,
  MessageCircle,
  Minimize2,
  Maximize2,
  Loader2
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SynapseMedAIProps {
  context?: 'exam' | 'study' | 'general'
  currentTopic?: string
  studentLevel?: string
}

export function SynapseMedAI({ 
  context = 'general',
  currentTopic,
  studentLevel 
}: SynapseMedAIProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hello! I'm **SYNAPSEMED**, your AI study companion.\n\nHow can I help you today?\n\n💡 **Quick Actions:**\n- Ask clinical or conceptual questions\n- Generate flashcards or quizzes\n- Create a study plan\n- Search for resources\n- Get explanations`,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: FileText, label: 'Generate Flashcards', action: 'flashcards' },
    { icon: Brain, label: 'Create Quiz', action: 'quiz' },
    { icon: Calendar, label: 'Study Plan', action: 'plan' },
    { icon: Search, label: 'Find Resources', action: 'search' },
    { icon: Lightbulb, label: 'Explain Concept', action: 'explain' },
    { icon: BookOpen, label: 'Summarize', action: 'summarize' }
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // TODO: Replace with actual AI API call
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          context,
          currentTopic,
          studentLevel,
          history: messages
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('AI service unavailable')
      }
    } catch (error) {
      // Mock response for now
      const mockResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🤖 **SYNAPSEMED AI**

I'm currently in setup mode. Once the AI backend is connected, I'll be able to:

✅ Answer your medical questions
✅ Generate personalized study materials
✅ Create custom lesson plans
✅ Provide real-time coaching
✅ Offer exam mentoring

Your question: "${inputValue}"

*AI service is being configured...*`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, mockResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    const actionPrompts: Record<string, string> = {
      flashcards: currentTopic 
        ? `Generate 10 flashcards for ${currentTopic}` 
        : 'Generate flashcards for the current topic',
      quiz: currentTopic 
        ? `Create a 5-question quiz on ${currentTopic}` 
        : 'Create a quiz for me',
      plan: 'Create a personalized study plan for my upcoming exam',
      search: 'Find relevant resources for my current topic',
      explain: currentTopic 
        ? `Explain the key concepts of ${currentTopic}` 
        : 'Explain this concept in simple terms',
      summarize: 'Summarize the main points of this content'
    }

    setInputValue(actionPrompts[action] || '')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-16 w-16 rounded-full bg-gradient-to-r from-[#213874] to-[#1a6ac3] hover:from-[#1a6ac3] hover:to-[#213874] shadow-lg animate-pulse"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
        <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50 transition-all duration-300`}>
      <Card className={`${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} shadow-2xl border-2 border-[#213874]/20 transition-all duration-300`}>
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-[#213874] to-[#1a6ac3] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">SYNAPSEMED</CardTitle>
                {!isMinimized && (
                  <p className="text-xs text-blue-100">Your AI Study Companion</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(100%-76px)]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-[#213874] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-[#f3ab1b]" />
                          <span className="font-semibold text-sm">SYNAPSEMED</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#213874]" />
                        <span className="text-sm text-gray-600">SYNAPSEMED is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-3 border-t bg-gray-50">
              <div className="grid grid-cols-3 gap-2 mb-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs h-auto py-2 flex flex-col items-center gap-1"
                  >
                    <action.icon className="h-3 w-3" />
                    <span className="text-[10px]">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask SYNAPSEMED anything..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#213874] hover:bg-[#1a6ac3]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {context === 'exam' && (
                <Badge className="mt-2 bg-orange-100 text-orange-700 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Exam Mentor Mode Active
                </Badge>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
