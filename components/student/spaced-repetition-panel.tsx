"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { RotateCcw, ArrowLeft, ArrowRight, Sparkles, CheckCircle, XCircle, Brain } from "lucide-react"

interface FlashCard {
  id: string
  front: string
  back: string
  category: string
  tags: string[]
  difficulty: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  isFlipped: boolean
}

interface SpacedRepetitionPanelProps {
  className?: string
}

export function SpacedRepetitionPanel({ className = "" }: SpacedRepetitionPanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cards, setCards] = useState<FlashCard[]>([])
  const [stats, setStats] = useState({
    overdue: 0,
    dueToday: 0,
    upcoming: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/spaced-repetition/stats')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const startReview = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/spaced-repetition/review')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCards(result.data.map((card: any) => ({
            ...card,
            isFlipped: false
          })))
          setReviewing(true)
          setCurrentCardIndex(0)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load review cards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFlip = () => {
    setCards(prev => prev.map((card, idx) => 
      idx === currentCardIndex ? { ...card, isFlipped: !card.isFlipped } : card
    ))
  }

  const handleResponse = async (quality: number) => {
    const currentCard = cards[currentCardIndex]
    
    try {
      // Send review to backend with AI-powered scheduling
      await fetch('/api/user/spaced-repetition/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          quality // 0-5 rating based on SuperMemo algorithm
        })
      })

      // Move to next card or finish
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1)
        // Reset flip state for next card
        setCards(prev => prev.map((card, idx) => 
          idx === currentCardIndex + 1 ? { ...card, isFlipped: false } : card
        ))
      } else {
        // Review session complete
        toast({
          title: "Great job! 🎉",
          description: `You've completed ${cards.length} cards. Keep up the great work!`,
        })
        setReviewing(false)
        fetchStats() // Refresh stats
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      })
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

  if (reviewing && cards.length > 0) {
    const currentCard = cards[currentCardIndex]
    
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Review Session
            </CardTitle>
            <Badge variant="outline">
              {currentCardIndex + 1} / {cards.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Card Display */}
          <div 
            className="relative min-h-[250px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 cursor-pointer border-2 border-blue-200 hover:border-blue-300 transition-colors"
            onClick={handleFlip}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4">
                <Badge className={getDifficultyColor(currentCard.difficulty)}>
                  {currentCard.difficulty}
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {currentCard.category}
                </Badge>
              </div>
              
              <div className="text-lg font-medium mb-2">
                {currentCard.isFlipped ? currentCard.back : currentCard.front}
              </div>
              
              <div className="text-sm text-gray-500 mt-4">
                {currentCard.isFlipped ? (
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Rate your recall below
                  </span>
                ) : (
                  "Click to reveal answer"
                )}
              </div>
            </div>
          </div>

          {/* Response Buttons */}
          {currentCard.isFlipped && (
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="flex-col h-auto py-3 hover:bg-red-50"
                onClick={() => handleResponse(0)}
              >
                <XCircle className="h-5 w-5 mb-1 text-red-500" />
                <span className="text-xs">Forgot</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 hover:bg-yellow-50"
                onClick={() => handleResponse(2)}
              >
                <span className="text-xl mb-1">😕</span>
                <span className="text-xs">Hard</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 hover:bg-blue-50"
                onClick={() => handleResponse(3)}
              >
                <span className="text-xl mb-1">🙂</span>
                <span className="text-xs">Good</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 hover:bg-green-50"
                onClick={() => handleResponse(5)}
              >
                <CheckCircle className="h-5 w-5 mb-1 text-green-500" />
                <span className="text-xs">Easy</span>
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReviewing(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Exit Review
            </Button>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>AI-Powered Scheduling</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-purple-500" />
          Spaced Repetition
        </CardTitle>
        <CardDescription>Review your flashcards with AI-optimized intervals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
            <p className="text-xs text-gray-600">Overdue</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-yellow-500">{stats.dueToday}</p>
            <p className="text-xs text-gray-600">Due Today</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-green-500">{stats.upcoming}</p>
            <p className="text-xs text-gray-600">Upcoming</p>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={startReview}
          disabled={stats.overdue + stats.dueToday === 0}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {stats.overdue + stats.dueToday > 0 
            ? `Review ${stats.overdue + stats.dueToday} Cards` 
            : "No Cards Due"
          }
        </Button>

        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Powered by SuperMemo SM-2 algorithm with AI enhancements</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
