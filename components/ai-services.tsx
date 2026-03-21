"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, FileText, HelpCircle, Star, BookOpen, Target } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface AIService {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  action: () => void
}

interface AIServicesProps {
  context?: string
  studentLevel?: string
}

export function AIServices({ context = 'general', studentLevel }: AIServicesProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [questionInput, setQuestionInput] = useState('')
  const [flashcardTopic, setFlashcardTopic] = useState('')
  const [examTopic, setExamTopic] = useState('')
  const [examQuestions, setExamQuestions] = useState(10)
  const [results, setResults] = useState<any>(null)
  const [currentService, setCurrentService] = useState<string | null>(null)

  const callAIService = async (service: string, data: any) => {
    setLoading(service)
    try {
      const response = await fetch(`/api/ai/${service}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          context,
          studentLevel
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
        description: `${(service?.charAt(0).toUpperCase() || '') + (service?.slice(1) || '')} completed successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process AI request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const services: AIService[] = [
    {
      id: 'answer',
      title: 'Answer Questions',
      description: 'Get detailed answers to medical questions with explanations',
      icon: HelpCircle,
      action: () => {
        if (!questionInput.trim()) {
          toast({
            title: "Input Required",
            description: "Please enter a question to get an answer.",
            variant: "destructive",
          })
          return
        }
        callAIService('answer', { question: questionInput })
      }
    },
    {
      id: 'flashcards',
      title: 'Generate Flashcards',
      description: 'Create study flashcards for any medical topic',
      icon: FileText,
      action: () => {
        if (!flashcardTopic.trim()) {
          toast({
            title: "Input Required",
            description: "Please enter a topic to generate flashcards.",
            variant: "destructive",
          })
          return
        }
        callAIService('flashcards', { topic: flashcardTopic })
      }
    },
    {
      id: 'exam-questions',
      title: 'Create Exam Questions',
      description: 'Generate practice exam questions with multiple choice answers',
      icon: Brain,
      action: () => {
        if (!examTopic.trim()) {
          toast({
            title: "Input Required",
            description: "Please enter a topic to generate exam questions.",
            variant: "destructive",
          })
          return
        }
        callAIService('exam-questions', {
          topic: examTopic,
          count: examQuestions
        })
      }
    },
    {
      id: 'recommendations',
      title: 'Provide Recommendations',
      description: 'Get personalized study recommendations and learning paths',
      icon: Star,
      action: () => {
        callAIService('recommendations', {
          currentContext: context,
          level: studentLevel
        })
      }
    }
  ]

  const renderResults = () => {
    if (!results || !currentService) return null

    switch (currentService) {
      case 'answer':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Answer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">Question: {results.question}</p>
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <p className="leading-relaxed text-gray-800">{results.answer}</p>
                </div>
                {results.sources && (
                  <div>
                    <p className="font-medium text-sm">Sources:</p>
                    <ul className="text-sm text-gray-600">
                      {results.sources.map((source: string, idx: number) => (
                        <li key={idx}>• {source}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 'flashcards':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Flashcards: {results.topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {results.flashcards?.map((card: any, idx: number) => (
                  <Card key={idx} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <p className="font-medium">Q: {card.front}</p>
                        <p className="text-gray-600">A: {card.back}</p>
                        {card.hint && (
                          <p className="text-sm text-blue-600">💡 {card.hint}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 'exam-questions':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Exam Questions: {results.topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.questions?.map((question: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <p className="font-medium">
                          {idx + 1}. {question.question}
                        </p>
                        <div className="grid gap-2">
                          {question.options?.map((option: string, optIdx: number) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <Badge variant={optIdx === question.correctAnswer ? "default" : "outline"}>
                                {String.fromCharCode(65 + optIdx)}
                              </Badge>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <div className="bg-green-50 p-3 rounded">
                            <p className="text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 'recommendations':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Study Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommendations?.map((rec: any, idx: number) => (
                  <Card key={idx} className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <p className="font-medium">{rec.title}</p>
                        </div>
                        <p className="text-gray-600">{rec.description}</p>
                        {rec.priority && (
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                            {rec.priority} priority
                          </Badge>
                        )}
                        {rec.resources && (
                          <div>
                            <p className="text-sm font-medium">Recommended Resources:</p>
                            <ul className="text-sm text-gray-600">
                              {rec.resources.map((resource: string, resIdx: number) => (
                                <li key={resIdx}>• {resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">SYNAPSEMED AI Services</h2>
        <p className="text-gray-600">Powered by advanced AI to enhance your medical learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Dialog key={service.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {service.title}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-none shadow-2xl p-0">
                <div className="p-6 space-y-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {service.title}
                  </DialogTitle>
                  <DialogDescription>{service.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Answer Questions Input */}
                  {service.id === 'answer' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Question:</label>
                      <Textarea
                        placeholder="Ask any medical question..."
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Flashcards Input */}
                  {service.id === 'flashcards' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Topic:</label>
                      <Input
                        placeholder="e.g., Cardiovascular System, Pharmacology, etc."
                        value={flashcardTopic}
                        onChange={(e) => setFlashcardTopic(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Exam Questions Input */}
                  {service.id === 'exam-questions' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Topic:</label>
                        <Input
                          placeholder="e.g., Respiratory System, Drug Interactions, etc."
                          value={examTopic}
                          onChange={(e) => setExamTopic(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Number of Questions:</label>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={examQuestions}
                          onChange={(e) => setExamQuestions(parseInt(e.target.value) || 10)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Recommendations - No input needed */}
                  {service.id === 'recommendations' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm">
                        Get personalized study recommendations based on your current learning context and level.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={service.action}
                    disabled={loading === service.id}
                    className="w-full"
                  >
                    {loading === service.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Generate ${service.title}`
                    )}
                  </Button>

                  {currentService === service.id && renderResults()}
                </div>
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>
    </div>
  )
}