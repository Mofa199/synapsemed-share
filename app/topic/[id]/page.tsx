"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { Clock, Users, Award, Star, Play, Download, Share, Heart, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { PremiumDiseaseViewer } from "@/components/topic/premium-disease-viewer"

// Define TypeScript interfaces
interface Topic {
  id: string
  title: string
  description: string
  type: string
  duration?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  content: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  moduleId?: string
  module?: {
    name: string
    id: string
  }
  curriculum?: {
    name: string
    id: string
  }
  _count?: {
    ratings: number
  }
}

interface UserProgress {
  id: string
  userId: string
  resourceType: string
  resourceId: string
  completionPercentage: number
  timeSpent: number
  status: string
  completedAt?: string
}

interface Rating {
  id: string
  userId: string
  resourceId: string
  rating: number
  createdAt: string
}

interface Bookmark {
  id: string
  userId: string
  resourceId: string
  resourceType: string
  createdAt: string
}

import React from "react";

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: topicId } = (React.use(params) as any);
  const { user } = useAuth()
  
  const [topic, setTopic] = useState<Topic | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [userRating, setUserRating] = useState<number>(0)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (topicId) {
      fetchTopicData()
    }
  }, [topicId])

  const fetchTopicData = async () => {
    try {
      setLoading(true)
      
      // Fetch topic data from API
      const topicResponse = await fetch(`/api/topics/${topicId}`)
      const topicResult = await topicResponse.json()
      
      if (topicResult.topic) {
        setTopic(topicResult.topic)
      } else {
        setError('Topic not found')
        return
      }
      
      // Fetch user progress for this topic
      if (user) {
        const progressResponse = await fetch(`/api/progress?userId=${user.id}`)
        const progressResult = await progressResponse.json()
        if (progressResult.success) {
          const topicProgress = progressResult.data.find((p: UserProgress) => 
            p.resourceType === 'TOPIC' && p.resourceId === topicId
          )
          setUserProgress(topicProgress || null)
        }
      }
      
      // Fetch user rating for this topic
      if (user) {
        const ratingResponse = await fetch(`/api/ratings?userId=${user.id}&resourceId=${topicId}`)
        const ratingResult = await ratingResponse.json()
        if (ratingResult.success && ratingResult.data.length > 0) {
          setUserRating(ratingResult.data[0].rating)
        }
      }
      
      // Check if topic is bookmarked
      if (user) {
        const bookmarkResponse = await fetch(`/api/bookmarks?userId=${user.id}&resourceId=${topicId}`)
        const bookmarkResult = await bookmarkResponse.json()
        if (bookmarkResult.success && bookmarkResult.data.length > 0) {
          setIsBookmarked(true)
        }
      }
    } catch (err) {
      setError('Failed to load topic data')
      console.error('Error fetching topic data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!user || !topic) return
    
    try {
      // Update user progress
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          resourceType: 'TOPIC',
          resourceId: topic.id,
          completionPercentage: 100,
          timeSpent: 45, // In a real app, this would be tracked
        }),
      })
      
      const result = await response.json()
      if (result.success) {
        setUserProgress(result.data)
        // Update user points
        user.points += topic.difficulty === 'BEGINNER' ? 20 : topic.difficulty === 'INTERMEDIATE' ? 30 : 40
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  const handleRating = async (rating: number) => {
    if (!user || !topic) return
    
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          resourceId: topic.id,
          resourceType: 'TOPIC',
          rating,
        }),
      })
      
      const result = await response.json()
      if (result.success) {
        setUserRating(rating)
      }
    } catch (error) {
      console.error("Failed to submit rating:", error)
    }
  }

  const handleShare = async () => {
    if (typeof window === 'undefined') return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: topic?.title || 'Topic',
          text: topic?.description || 'Check out this topic',
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      if (typeof window !== 'undefined') window.alert("Link copied to clipboard!")
    }
  }

  const handleBookmark = async () => {
    if (!user || !topic) return
    
    try {
      // Use POST for both adding and removing bookmarks
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          resourceId: topic.id,
          resourceType: 'TOPIC',
          bookmarked: !isBookmarked, // Send the opposite of current state
        }),
      })
      
      const result = await response.json()
      if (result.success) {
        setIsBookmarked(!isBookmarked)
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
    }
  }

  const handleDownload = (url: string, filename: string) => {
    // In a real implementation, this would download the actual resource
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error || 'Topic not found'}</p>
            <Button onClick={fetchTopicData} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isCompleted = userProgress?.status === 'COMPLETED'
  const completionPercentage = userProgress?.completionPercentage || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Breadcrumb Navigation - Kept outside the viewer for app consistency */}
      <div className="container mx-auto px-4 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/library" className="hover:text-[#213874] transition-colors">
            Library
          </Link>
          <ChevronRight className="w-4 h-4" />
          {topic.module && (
            <>
              <Link href={`/module/${topic.curriculum?.name.toLowerCase() || 'medical'}/${topic.moduleId}`} className="hover:text-[#213874] transition-colors">
                {topic.module.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-[#213874] font-medium">{topic.title}</span>
        </div>
      </div>

      <PremiumDiseaseViewer 
        topic={topic}
        userProgress={userProgress}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
        onComplete={handleComplete}
      />

      <AIHelper />
    </div>
  )
}