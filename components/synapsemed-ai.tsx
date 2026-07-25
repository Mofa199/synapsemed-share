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
  Loader2,
  Zap
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
      content: `👋 Welcome to **Neural Sync**. I'm your Gemini-powered clinical assistant.\n\nHow can I help you master medicine today?`,
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
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Sync Error: Unable to reach Gemini core. Please check your connectivity.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
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
          className="h-16 w-16 rounded-2xl bg-[#213874] text-white shadow-2xl hover:scale-110 transition-all border-2 border-white/20"
        >
          <Bot className="h-8 w-8" />
        </Button>
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-[#f3ab1b] rounded-full border-2 border-white animate-bounce flex items-center justify-center">
           <span className="text-[8px] font-black text-[#213874]">AI</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500`}>
      <Card className={`${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} shadow-2xl border-none bg-[#f4f4f6] rounded-3xl overflow-hidden transition-all duration-500`}>
        {/* Header */}
        <CardHeader className="p-5 bg-[#213874] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-[#213874]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-tighter">NEURAL AI</CardTitle>
                {!isMinimized && (
                  <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest">Powered by Gemini 1.5</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-[#213874] text-white rounded-tr-none'
                          : 'bg-white text-[#213874] rounded-tl-none border border-gray-100'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-3 w-3 text-[#f3ab1b]" />
                          <span className="font-black text-[9px] uppercase tracking-widest">SynapseCore</span>
                        </div>
                      )}
                      <div className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-[8px] mt-2 font-bold uppercase tracking-widest ${message.role === 'user' ? 'text-blue-300/50' : 'text-gray-300'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-[#213874]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Neural Synthesis...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask for clinical guidance..."
                  className="flex-1 bg-gray-50 border-gray-100 rounded-xl h-12 text-xs font-medium focus:ring-[#213874]/20"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#213874] hover:bg-[#1a6ac3] text-white rounded-xl h-12 w-12 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
