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

export default function TopicPage() {
  const { user } = useAuth()
  const params = useParams()
  const topicId = params.id as string
  
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
      alert("Link copied to clipboard!")
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

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/courses" className="hover:text-[#213874] transition-colors">
              Courses
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
          
          {topic.module && (
            <Link href={`/module/${topic.curriculum?.name.toLowerCase() || 'medical'}/${topic.moduleId}`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#213874] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Module
            </Link>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{topic.type || 'ARTICLE'}</Badge>
                      <Badge variant="outline">{topic.difficulty || 'BEGINNER'}</Badge>
                      {isCompleted && <Badge className="bg-green-100 text-green-700">Completed</Badge>}
                    </div>
                    <CardTitle className="text-2xl text-[#213874] mb-2">{topic.title}</CardTitle>
                    <CardDescription className="text-base">{topic.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleBookmark}>
                    <Heart className={`w-4 h-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{topic.duration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {topic._count?.ratings ? (topic._count.ratings / 5).toFixed(1) : '0.0'} ({topic._count?.ratings || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>0 completed</span> {/* In a real app, this would show actual completions */}
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{topic.difficulty === 'BEGINNER' ? 20 : topic.difficulty === 'INTERMEDIATE' ? 30 : 40} points</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Video/Content Player */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-[#213874] to-[#1a6ac3] rounded-t-lg flex items-center justify-center">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Play className="w-8 h-8 mr-2" />
                    Play Video
                  </Button>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#213874]">Topic Content</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload('#', `${topic.title}.pdf`)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div 
                    className="prose prose-sm max-w-none" 
                    dangerouslySetInnerHTML={{ __html: topic.content }} 
                  />

                  {!isCompleted && (
                    <Button className="w-full mt-6 bg-[#213874] hover:bg-[#1a6ac3]" onClick={handleComplete}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete (+{topic.difficulty === 'BEGINNER' ? 20 : topic.difficulty === 'INTERMEDIATE' ? 30 : 40} points)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rating Section */}
            <Card>
              <CardHeader>
                <CardTitle>Rate this Topic</CardTitle>
                <CardDescription>Help other students by rating this content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => handleRating(star)} className="transition-colors">
                      <Star
                        className={`w-6 h-6 ${
                          star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      You rated this {userRating} star{userRating !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Topic Progress</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {isCompleted ? "Completed! Great job!" : "Start watching to track progress"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  No prerequisites for this topic
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  No additional resources available
                </div>
              </CardContent>
            </Card>

            {/* Next Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Up Next</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  No recommended next topics
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}