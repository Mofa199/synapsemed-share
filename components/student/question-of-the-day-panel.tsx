"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, CheckCircle, XCircle, Lightbulb, TrendingUp, Bell, Sparkles } from "lucide-react"

interface QuestionOption {
  text: string
  isCorrect: boolean
}

interface QuestionData {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  category: string
  tags: string[]
  dateScheduled: string
}

interface QuestionOfTheDayPanelProps {
  className?: string
}

export function QuestionOfTheDayPanel({ className = "" }: QuestionOfTheDayPanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetchQuestionOfTheDay()
    checkNotificationStatus()
  }, [])

  const fetchQuestionOfTheDay = async () => {
    try {
      const response = await fetch('/api/user/question-of-the-day')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setQuestionData(result.data.question)
          setHasAnswered(result.data.hasAnswered)
          setStreak(result.data.streak || 0)
          if (result.data.hasAnswered) {
            setSelectedAnswer(result.data.userAnswer)
            setShowExplanation(true)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching question:', error)
      toast({
        title: "Error",
        description: "Failed to load today's question",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkNotificationStatus = async () => {
    try {
      const response = await fetch('/api/user/preferences')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setNotificationsEnabled(result.data.qotdNotifications || false)
        }
      }
    } catch (error) {
      console.error('Error checking notifications:', error)
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (hasAnswered) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !questionData) return

    try {
      const response = await fetch('/api/user/question-of-the-day/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questionData.id,
          answer: selectedAnswer
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setHasAnswered(true)
          setShowExplanation(true)
          
          const isCorrect = selectedAnswer === questionData.correctAnswer
          if (isCorrect) {
            setStreak(prev => prev + 1)
            toast({
              title: "Correct! 🎉",
              description: `Great job! Your streak is now ${streak + 1} days!`,
            })
          } else {
            setStreak(0)
            toast({
              title: "Incorrect",
              description: "Don't worry, learning is a process. Check the explanation below.",
              variant: "destructive",
            })
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      })
    }
  }

  const toggleNotifications = async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qotdNotifications: !notificationsEnabled
        })
      })

      if (response.ok) {
        setNotificationsEnabled(!notificationsEnabled)
        toast({
          title: notificationsEnabled ? "Notifications disabled" : "Notifications enabled",
          description: notificationsEnabled 
            ? "You won't receive daily question reminders" 
            : "You'll receive daily reminders for the question of the day",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    }
  }

  const getAnswerStyle = (index: number) => {
    if (!hasAnswered) {
      return selectedAnswer === index
        ? 'border-2 border-blue-500 bg-blue-50'
        : 'border border-gray-200 hover:border-gray-300'
    }

    if (index === questionData?.correctAnswer) {
      return 'border-2 border-green-500 bg-green-50'
    }

    if (index === selectedAnswer && selectedAnswer !== questionData?.correctAnswer) {
      return 'border-2 border-red-500 bg-red-50'
    }

    return 'border border-gray-200 opacity-60'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!questionData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            Question of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">No question available for today</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            Question of the Day
          </CardTitle>
          {streak > 0 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              {streak} day streak!
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Test your clinical reasoning daily</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNotifications}
            className="h-6 px-2 text-xs"
          >
            <Bell className={`h-3 w-3 mr-1 ${notificationsEnabled ? 'text-blue-500' : ''}`} />
            {notificationsEnabled ? 'On' : 'Off'}
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Header */}
        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(questionData.difficulty)}>
            {questionData.difficulty}
          </Badge>
          <Badge variant="outline">{questionData.category}</Badge>
          <Badge variant="outline" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Generated
          </Badge>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900 leading-relaxed">
            {questionData.question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-2">
          {questionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
              className={`w-full text-left p-3 rounded-lg transition-all ${getAnswerStyle(index)}`}
            >
              <div className="flex items-start gap-3">
                <span className="font-semibold text-gray-700 mt-0.5">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{option}</span>
                {hasAnswered && index === questionData.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
                {hasAnswered && index === selectedAnswer && selectedAnswer !== questionData.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!hasAnswered && (
          <Button 
            className="w-full" 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <h4 className="font-semibold text-sm">Explanation</h4>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {questionData.explanation}
              </p>
            </div>
          </div>
        )}

        {/* AI Badge */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Question curated by AI based on your learning progress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
