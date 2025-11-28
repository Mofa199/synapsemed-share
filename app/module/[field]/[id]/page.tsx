"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { Clock, Award, Star, Play, Users, Trophy, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Define TypeScript interfaces
interface Topic {
  id: string
  title: string
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
  }
}

interface Module {
  id: string
  name: string
  description?: string
  curriculumId: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  topics: Topic[]
  curriculum: {
    name: string
    field: string
  }
}

export default function ModulePage() {
  const { user } = useAuth()
  const params = useParams()
  const field = params.field as string
  const moduleId = params.id as string

  const [moduleData, setModuleData] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [topicProgress, setTopicProgress] = useState<any>({})

  useEffect(() => {
    if (moduleId && user) {
      fetchModuleData()
    }
  }, [moduleId, user])

  const fetchModuleData = async () => {
    try {
      setLoading(true)
      
      // Fetch module data from API
      const moduleResponse = await fetch(`/api/modules/${moduleId}`)
      const moduleResult = await moduleResponse.json()
      
      if (moduleResult.module) {
        setModuleData(moduleResult.module)
      } else {
        setError('Module not found')
      }
      
      // Fetch user progress data for this module
      if (user) {
        const progressResponse = await fetch(`/api/progress?userId=${user.id}`)
        const progressResult = await progressResponse.json()
        if (progressResult.success) {
          // Create a map of topic progress for easy lookup
          const progressMap: any = {}
          progressResult.data.forEach((progress: any) => {
            if (progress.topicId) {
              progressMap[progress.topicId] = progress
            }
          })
          setTopicProgress(progressMap)
        }
      }
    } catch (err) {
      setError('Failed to load module data')
      console.error('Error fetching module data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !moduleData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error || 'Module not found'}</p>
            <Button onClick={fetchModuleData} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate real progress data
  const completedTopics = moduleData.topics.filter((topic: Topic) => {
    const progress = topicProgress[topic.id]
    return progress && progress.status === 'COMPLETED'
  }).length
  
  const totalPoints = moduleData.topics.reduce((acc: number, topic: Topic) => {
    const progress = topicProgress[topic.id]
    if (progress && progress.status === 'COMPLETED') {
      // Award points based on difficulty
      return acc + (topic.difficulty === 'BEGINNER' ? 20 : topic.difficulty === 'INTERMEDIATE' ? 30 : 40)
    }
    return acc
  }, 0)
  
  const progress = moduleData.topics.length > 0 
    ? Math.round((completedTopics / moduleData.topics.length) * 100) 
    : 0

  const getTimeInvested = () => {
    // Calculate total time spent on topics in this module
    return Object.values(topicProgress).reduce((total: number, progress: any) => {
      if (progress && moduleData.topics.some((topic: Topic) => topic.id === progress.topicId)) {
        return total + progress.timeSpent
      }
      return total
    }, 0)
  }

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
            <span className="text-[#213874] font-medium">{moduleData.name}</span>
          </div>
          
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#213874] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">{moduleData.name}</h1>
              <p className="text-gray-600">{moduleData.description || 'No description available'}</p>
            </div>
            <Badge className="bg-[#f3ab1b] text-[#213874]">{progress}% Complete</Badge>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#213874] mb-2">{progress}%</div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#213874]">
                  {completedTopics}/{moduleData.topics.length}
                </div>
                <p className="text-xs text-gray-600">Topics finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#213874]">{totalPoints}</div>
                <p className="text-xs text-gray-600">Total points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#213874]">{getTimeInvested()}h</div>
                <p className="text-xs text-gray-600">Study time</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleData.topics.map((topic: Topic) => {
            const progress = topicProgress[topic.id]
            const isCompleted = progress && progress.status === 'COMPLETED'
            
            return (
              <Link key={topic.id} href={`/topic/${topic.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{topic.type || 'ARTICLE'}</Badge>
                          <Badge variant="outline">{topic.difficulty || 'BEGINNER'}</Badge>
                          {isCompleted && <Badge className="bg-green-100 text-green-700">✓ Completed</Badge>}
                        </div>
                        <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                          {topic.title}
                        </CardTitle>
                      </div>
                      {topic.type === "VIDEO" && (
                        <div className="w-10 h-10 bg-[#213874]/10 rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-[#213874]" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{topic.duration || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{topic.difficulty === 'BEGINNER' ? 20 : topic.difficulty === 'INTERMEDIATE' ? 30 : 40} pts</span>
                        </div>
                      </div>

                      <Button
                        className={`w-full bg-[#213874] hover:bg-[#1a6ac3]`}
                      >
                        {isCompleted ? 'Review Topic' : 'Start Topic'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Gamification Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#f3ab1b]" />
                Module Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#f3ab1b] rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-[#213874]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">First Steps</p>
                      <p className="text-xs text-gray-600">Complete your first topic</p>
                    </div>
                  </div>
                  {completedTopics > 0 && <Badge className="bg-green-100 text-green-700">Earned!</Badge>}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#f3ab1b] rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#213874]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Half Way There</p>
                      <p className="text-xs text-gray-600">Complete 50% of module</p>
                    </div>
                  </div>
                  {progress >= 50 && <Badge className="bg-green-100 text-green-700">Earned!</Badge>}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#f3ab1b] rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-[#213874]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Module Master</p>
                      <p className="text-xs text-gray-600">Complete entire module</p>
                    </div>
                  </div>
                  {progress === 100 && <Badge className="bg-green-100 text-green-700">Earned!</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Streak</CardTitle>
              <CardDescription>Keep learning every day to maintain your streak!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#f3ab1b] mb-2">{user?.streak || 0}</div>
                <p className="text-sm text-gray-600 mb-4">Days in a row</p>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: Math.min(user?.streak || 0, 7) }, (_, i) => i + 1).map((day) => (
                    <div key={day} className="w-6 h-6 bg-[#f3ab1b] rounded-full flex items-center justify-center">
                      <span className="text-xs text-[#213874] font-bold">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}