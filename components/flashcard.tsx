"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface Flashcard {
  id: string
  front: string
  back: string
  category: string
}

export function Flashcard() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlashcards()
  }, [])

  const fetchFlashcards = async () => {
    try {
      const response = await fetch('/api/flashcards')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setFlashcards(result.flashcards)
          if (result.flashcards.length > 0) {
            // Select a random flashcard
            const randomIndex = Math.floor(Math.random() * result.flashcards.length)
            setCurrentCard(result.flashcards[randomIndex])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (flashcards.length > 0) {
      const randomIndex = Math.floor(Math.random() * flashcards.length)
      setCurrentCard(flashcards[randomIndex])
      setIsFlipped(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentCard) {
    return (
      <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No flashcards available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Daily Flashcard</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {currentCard.category}
          </span>
        </div>
        
        <div 
          className={`min-h-[120px] flex items-center justify-center cursor-pointer transition-all duration-300 ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
        >
          <div className="text-center">
            <p className="text-lg text-gray-800 mb-2">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
            <p className="text-sm text-gray-500">
              {isFlipped ? 'Click to see question' : 'Click to reveal answer'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-100">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNext}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Card
          </Button>
          <span className="text-xs text-gray-500">
            Updated daily
          </span>
        </div>
      </CardContent>
    </Card>
  )
}