"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Volume2 } from 'lucide-react'

interface WordOfTheDay {
  id: string
  word: string
  definition: string
  pronunciation?: string
  etymology?: string
  category?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  example?: string
  dateScheduled: string
}

export function WordOfTheDay() {
  const [wordData, setWordData] = useState<WordOfTheDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodaysWord()
    
    // Set up interval to check for new word every hour
    const interval = setInterval(fetchTodaysWord, 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchTodaysWord = async () => {
    try {
      const response = await fetch('/api/admin/word-of-the-day')
      if (!response.ok) {
        setError('Failed to load word of the day')
        return
      }
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setError('Failed to load word of the day')
        return
      }
      const result = await response.json()
      
      if (result.success) {
        setWordData(result.data)
        setError(null)
      } else {
        setError('Failed to load word of the day')
      }
    } catch (err) {
      setError('Failed to load word of the day')
      console.error('Error fetching word of the day:', err)
    } finally {
      setLoading(false)
    }
  }

  const playPronunciation = () => {
    if (wordData?.pronunciation && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordData.word)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Word of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !wordData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Word of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error || 'No word available for today'}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span className="text-blue-900">Word of the Day</span>
          </div>
          <Badge className={getDifficultyColor(wordData.difficulty)}>
            {wordData.difficulty}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-3xl font-bold text-blue-900 capitalize">
            {wordData.word}
          </h3>
          {wordData.pronunciation && (
            <button
              onClick={playPronunciation}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              title="Play pronunciation"
            >
              <Volume2 className="h-4 w-4 text-blue-600" />
            </button>
          )}
        </div>
        
        {wordData.pronunciation && (
          <p className="text-gray-600 italic">
            {wordData.pronunciation}
          </p>
        )}

        {wordData.category && (
          <Badge variant="outline" className="w-fit">
            {wordData.category}
          </Badge>
        )}

        <div className="space-y-2">
          <p className="text-gray-800 leading-relaxed">
            <span className="font-semibold">Definition:</span> {wordData.definition}
          </p>
          
          {wordData.example && (
            <p className="text-gray-700 italic">
              <span className="font-semibold not-italic">Example:</span> "{wordData.example}"
            </p>
          )}
          
          {wordData.etymology && (
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Etymology:</span> {wordData.etymology}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-blue-100">
          <span>Updates daily at 23:00 EAT</span>
          <span>{new Date(wordData.dateScheduled).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}