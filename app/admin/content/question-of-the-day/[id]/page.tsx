"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  User, 
  BarChart3,
  Clock,
  Edit
} from "lucide-react"
import { format } from "date-fns"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  category: string
  tags: string[]
  dateScheduled: string
  isActive: boolean
  totalAnswers: number
  correctAnswers: number
  accuracy: number
  createdAt: string
  updatedAt: string
  userAnswers: {
    isCorrect: boolean
    answer: number
    createdAt: string
    user: {
      id: string
      name: string
      email: string
      field: string
      level: number
      points: number
    }
  }[]
}

import React from "react";

export default function QuestionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = (React.use(params) as any);
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)) {
      router.push('/')
      return
    }

    if (id) {
      fetchQuestion(id)
    }
  }, [user, router, id])

  const fetchQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/question-of-the-day/${id}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setQuestion(result.data)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch question details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getFieldColor = (field: string) => {
    switch (field.toLowerCase()) {
      case 'medical': return 'bg-red-50 text-red-700'
      case 'nursing': return 'bg-blue-50 text-blue-700'
      case 'pharmacy': return 'bg-green-50 text-green-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  const handleBack = () => {
    router.push('/admin/content/question-of-the-day')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Question not found</h3>
            <p className="text-gray-500 mb-4">The requested question could not be found.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/content/question-of-the-day/${question.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{question.question}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                {question.category && (
                  <Badge variant="outline">{question.category}</Badge>
                )}
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(question.dateScheduled), 'MMM d, yyyy')}
                </Badge>
                {!question.isActive && (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{question.totalAnswers}</p>
                <p className="text-xs text-gray-500">Total Answers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{question.correctAnswers}</p>
                <p className="text-xs text-gray-500">Correct Answers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{100 - question.accuracy}%</p>
                <p className="text-xs text-gray-500">Incorrect</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{question.accuracy}%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Accuracy</p>
                <p className="text-xs text-gray-500">Overall Performance</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Options</h3>
            <div className="space-y-2">
              {(question.options || []).map((option: string, index: number) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    index === question.correctAnswer 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index === question.correctAnswer 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {index === question.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explanation</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          </div>

          {question.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(question.tags || []).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Responses</CardTitle>
          <CardDescription>
            {question.userAnswers.length} students have answered this question
          </CardDescription>
        </CardHeader>
        <CardContent>
          {question.userAnswers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No responses yet</p>
          ) : (
            <div className="space-y-4">
              {question.userAnswers.map((answer, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{answer.user.name}</p>
                        <p className="text-sm text-gray-500">{answer.user.email}</p>
                      </div>
                    </div>
                    <Badge className={getFieldColor(answer.user.field)}>
                      {answer.user.field}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      Level {answer.user.level} • {answer.user.points} pts
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">Answer: </span>
                      <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {String.fromCharCode(65 + answer.answer)}
                      </span>
                    </div>
                    <Badge variant={answer.isCorrect ? 'default' : 'destructive'}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {format(new Date(answer.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}