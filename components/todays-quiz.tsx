"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface QuestionOfTheDay {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  dateScheduled: string
}

export function TodaysQuiz() {
  const [quizData, setQuizData] = useState<QuestionOfTheDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    fetchTodaysQuiz()
  }, [])

  const fetchTodaysQuiz = async () => {
    try {
      // For now, we'll use mock data since we don't have the API endpoint yet
      // In a real implementation, this would fetch from /api/question-of-the-day
      const mockQuiz: QuestionOfTheDay = {
        id: "1",
        question: "What is tachycardia?",
        options: [
          "A slow heart rate",
          "A rapid heart rate",
          "An irregular heart rhythm",
          "A heart murmur"
        ],
        correctAnswer: 1,
        explanation: "Tachycardia is defined as a rapid heart rate, typically greater than 100 beats per minute in adults at rest.",
        difficulty: "BEGINNER",
        category: "Cardiology",
        dateScheduled: new Date().toISOString()
      }
      
      setQuizData(mockQuiz)
      setError(null)
    } catch (err) {
      setError('Failed to load today\'s quiz')
      console.error('Error fetching quiz of the day:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !quizData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-red-600">{error || 'No quiz available for today'}</p>
        </CardContent>
      </Card>
    )
  }

  const isCorrect = selectedAnswer === quizData.correctAnswer

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-blue-900">Today's Quick Quiz</h3>
          <Badge className={getDifficultyColor(quizData.difficulty)}>
            {quizData.difficulty}
          </Badge>
        </div>
        
        {quizData.category && (
          <Badge variant="outline" className="mb-4">
            {quizData.category}
          </Badge>
        )}
        
        <p className="text-lg text-gray-800 mb-6">{quizData.question}</p>
        
        <div className="space-y-3 mb-6">
          {quizData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                showResult
                  ? index === quizData.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : index === selectedAnswer && !isCorrect
                    ? 'bg-red-100 border-red-500'
                    : 'bg-gray-50 border-gray-200'
                  : selectedAnswer === index
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                  showResult
                    ? index === quizData.correctAnswer
                      ? 'bg-green-500 border-green-500 text-white'
                      : index === selectedAnswer && !isCorrect
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-gray-200 border-gray-300'
                    : selectedAnswer === index
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <div className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
            <p className="text-gray-700 mb-3">{quizData.explanation}</p>
            <button
              onClick={() => {
                setSelectedAnswer(null)
                setShowResult(false)
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try Another Question
            </button>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-blue-100 mt-4">
          <span>Updates daily at 23:00 EAT</span>
          <span>{new Date(quizData.dateScheduled).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}