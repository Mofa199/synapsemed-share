"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Brain, FileText, HelpCircle, Star, Sparkles, X, MessageSquare, Calendar } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface FloatingAIAssistantProps {
  context?: string
  studentLevel?: string
}

export function FloatingAIAssistant({ context = 'general', studentLevel }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [questionInput, setQuestionInput] = useState('')
  const [flashcardTopic, setFlashcardTopic] = useState('')
  const [examTopic, setExamTopic] = useState('')
  const [studyPlanTopic, setStudyPlanTopic] = useState('')
  const [examQuestions, setExamQuestions] = useState(5)
  const [results, setResults] = useState<any>(null)
  const [currentService, setCurrentService] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('ask')

  const callAIService = async (service: string, data: any) => {
    setLoading(service)
    setResults(null)
    setCurrentService(null)
    
    try {
      // Get the text content of the page for AI context
      let pageContent = '';
      if (typeof window !== 'undefined') {
        const bodyText = document.body.innerText || '';
        // Grab up to 8000 characters to prevent huge payloads
        pageContent = bodyText.substring(0, 8000);
      }

      // Use the internal Next.js API route
      const response = await fetch(`/api/ai/${service}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          context,
          studentLevel,
          pageContent
        }),
      })

      if (!response.ok) {
        throw new Error('AI service request failed')
      }

      const result = await response.json()
      setResults(result)
      setCurrentService(service)
      
      toast({
        title: "Success!",
        description: `AI response generated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleAskQuestion = () => {
    if (!questionInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a question.",
        variant: "destructive",
      })
      return
    }
    callAIService('answer', { question: questionInput })
  }

  const handleGenerateFlashcards = () => {
    if (!flashcardTopic.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a topic.",
        variant: "destructive",
      })
      return
    }
    callAIService('flashcards', { topic: flashcardTopic, count: 5 })
  }

  const handleGenerateExam = () => {
    if (!examTopic.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a topic.",
        variant: "destructive",
      })
      return
    }
    callAIService('exam-questions', { topic: examTopic, count: examQuestions })
  }

  const handleGenerateStudyPlan = () => {
    if (!studyPlanTopic.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a topic for your study plan.",
        variant: "destructive",
      })
      return
    }
    callAIService('study-plan', { topic: studyPlanTopic })
  }

  const handleGetRecommendations = () => {
    callAIService('recommendations', { currentContext: context, level: studentLevel })
  }

  const renderResults = () => {
    if (!results || !currentService) return null

    switch (currentService) {
      case 'answer':
        return (
          <ScrollArea className="h-64 mt-4">
            <Card className="border-blue-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-blue-50/50">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  SynapseMed AI Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
                    {results.answer}
                  </div>
                  {results.sources && results.sources.length > 0 && (
                    <div className="pt-4 border-t border-blue-100">
                      <p className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider">Sources & References:</p>
                      <ul className="space-y-1.5">
                        {results.sources.map((source: string, idx: number) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <div className="h-1 w-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        )

      case 'flashcards':
        return (
          <Card className="mt-4 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Flashcards: {results.topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {results.flashcards?.map((card: any, idx: number) => (
                    <Card key={idx} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-3 pb-3">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Q: {card.front}</p>
                          <p className="text-sm text-gray-600">A: {card.back}</p>
                          {card.hint && (
                            <p className="text-xs text-green-600">💡 {card.hint}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )

      case 'exam-questions':
        return (
          <Card className="mt-4 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Exam Questions: {results.topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {results.questions?.map((question: any, idx: number) => (
                    <Card key={idx} className="border-purple-100">
                      <CardContent className="pt-3 pb-3">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            {idx + 1}. {question.question}
                          </p>
                          <div className="space-y-1">
                            {question.options?.map((option: string, optIdx: number) => (
                              <div key={optIdx} className="flex items-start gap-2 text-sm">
                                <Badge variant={optIdx === question.correctAnswer ? "default" : "outline"} className="mt-0.5">
                                  {String.fromCharCode(65 + optIdx)}
                                </Badge>
                                <span className={optIdx === question.correctAnswer ? "font-medium" : ""}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <div className="bg-purple-50 p-2 rounded text-xs mt-2">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )

      case 'recommendations':
        return (
          <ScrollArea className="h-64 mt-4">
            <div className="space-y-3">
              {results.recommendations?.map((rec: any, idx: number) => (
                <Card key={idx} className="border-l-4 border-l-yellow-500 shadow-sm">
                  <CardContent className="pt-3 pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-[#213874]">{rec.title}</p>
                        <Badge className={rec.priority === 'high' ? 'bg-red-100 text-red-800' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 italic mb-2">"{rec.description}"</p>
                      {rec.resources && rec.resources.length > 0 && (
                        <div className="text-xs">
                          <p className="font-bold mb-1 uppercase tracking-tight text-[10px] text-gray-400">Recommended Resources:</p>
                          <ul className="space-y-1">
                            {rec.resources.slice(0, 3).map((resource: string, resIdx: number) => (
                              <li key={resIdx} className="flex items-center gap-1.5 underline decoration-blue-200 decoration-2 underline-offset-2">
                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )

      case 'study-plan':
        return (
          <ScrollArea className="h-64 mt-4">
            <Card className="border-indigo-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-indigo-50/50">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  AI Personalized Study Plan: {results.topic}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {results.plan?.map((day: any, idx: number) => (
                    <div key={idx} className="border-b border-indigo-100 last:border-0 pb-4 last:pb-0">
                      <h4 className="font-bold text-indigo-900 mb-2">Day {day.day}: {day.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{day.objective}</p>
                      <ul className="space-y-1">
                        {day.tasks?.map((task: string, tIdx: number) => (
                          <li key={tIdx} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 text-indigo-400 mt-0.5" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {!results.plan && <p className="text-sm text-gray-600">{results.summary}</p>}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-[#213874] to-[#1a6ac3] hover:from-[#1a6ac3] hover:to-[#213874] border-2 border-white animate-pulse"
        >
          <Sparkles className="h-7 w-7 text-white" />
        </Button>
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-xs text-white font-bold">AI</span>
        </div>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-[#213874]" />
              SYNAPSEMED AI Assistant
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Powered by SynapseMedAI Backend
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Your AI-powered medical learning companion
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="ask">Ask</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="exam">Exam</TabsTrigger>
              <TabsTrigger value="plan">Study Plan</TabsTrigger>
              <TabsTrigger value="recommend">Tips</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value="ask" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Ask a medical question:</label>
                  <Textarea
                    placeholder="e.g., What is hypertension and how is it treated?"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button 
                    onClick={handleAskQuestion} 
                    disabled={loading === 'answer'}
                    className="w-full"
                  >
                    {loading === 'answer' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Get Answer
                      </>
                    )}
                  </Button>
                </div>
                {currentService === 'answer' && renderResults()}
              </TabsContent>

              <TabsContent value="flashcards" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Topic for flashcards:</label>
                  <Input
                    placeholder="e.g., Cardiovascular System"
                    value={flashcardTopic}
                    onChange={(e) => setFlashcardTopic(e.target.value)}
                  />
                  <Button 
                    onClick={handleGenerateFlashcards} 
                    disabled={loading === 'flashcards'}
                    className="w-full"
                  >
                    {loading === 'flashcards' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Flashcards
                      </>
                    )}
                  </Button>
                </div>
                {currentService === 'flashcards' && renderResults()}
              </TabsContent>

              <TabsContent value="exam" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Exam topic:</label>
                  <Input
                    placeholder="e.g., Diabetes Management"
                    value={examTopic}
                    onChange={(e) => setExamTopic(e.target.value)}
                  />
                  <div>
                    <label className="text-sm font-medium">Number of questions:</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={examQuestions}
                      onChange={(e) => setExamQuestions(parseInt(e.target.value) || 5)}
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateExam} 
                    disabled={loading === 'exam-questions'}
                    className="w-full"
                  >
                    {loading === 'exam-questions' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </div>
                {currentService === 'exam-questions' && renderResults()}
              </TabsContent>

              <TabsContent value="recommend" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Get personalized study recommendations based on your current context and level.
                  </p>
                  <Button 
                    onClick={handleGetRecommendations} 
                    disabled={loading === 'recommendations'}
                    className="w-full"
                  >
                    {loading === 'recommendations' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 h-4 w-4" />
                        Get Recommendations
                      </>
                    )}
                  </Button>
                </div>
                {currentService === 'recommendations' && renderResults()}
              </TabsContent>

              <TabsContent value="plan" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Topic for study plan:</label>
                  <Input
                    placeholder="e.g., Cardiology Boards Prep"
                    value={studyPlanTopic}
                    onChange={(e) => setStudyPlanTopic(e.target.value)}
                  />
                  <Button 
                    onClick={handleGenerateStudyPlan} 
                    disabled={loading === 'study-plan'}
                    className="w-full"
                  >
                    {loading === 'study-plan' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Generate AI Study Plan
                      </>
                    )}
                  </Button>
                </div>
                {currentService === 'study-plan' && renderResults()}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}