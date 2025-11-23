"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  Play, 
  BarChart3, 
  Trophy,
  Users,
  ChevronRight,
  FileText,
  Video,
  Brain,
  Lightbulb,
  Award
} from "lucide-react"
import { useParams } from "next/navigation"

interface Chapter {
  id: string
  title: string
  duration: number
  topics: number
  completed?: boolean
  progress?: number
}

interface StudyGuide {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  estimatedHours: number
  chapters: Chapter[]
  prerequisites: string[]
  learningObjectives: string[]
  resources: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface UserProgress {
  chaptersCompleted: number
  totalTimeSpent: number
  averageScore: number
  lastStudied: string
  streak: number
  rank: number
  notesCount: number
  bookmarksCount: number
}

export default function StudyGuidePage() {
  const { user } = useAuth()
  const params = useParams()
  const studyGuideId = params?.id as string

  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    chaptersCompleted: 4,
    totalTimeSpent: 1680, // minutes
    averageScore: 87.5,
    lastStudied: "2024-01-20",
    streak: 7,
    rank: 45,
    notesCount: 23,
    bookmarksCount: 15
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudyGuide()
  }, [studyGuideId])

  const fetchStudyGuide = async () => {
    try {
      // In a real app, this would fetch from your API
      const mockData = {
        id: studyGuideId || '1',
        title: 'Cardiovascular System Mastery',
        description: 'Comprehensive study guide covering anatomy, physiology, and pathology of the cardiovascular system. Learn through interactive content, 3D models, and clinical case studies.',
        category: 'medical',
        difficulty: 'intermediate',
        estimatedHours: 25,
        chapters: [
          { id: '1', title: 'Heart Anatomy', duration: 3, topics: 12, completed: true, progress: 100 },
          { id: '2', title: 'Cardiac Physiology', duration: 4, topics: 16, completed: true, progress: 100 },
          { id: '3', title: 'Blood Vessels', duration: 3, topics: 14, completed: true, progress: 100 },
          { id: '4', title: 'Cardiovascular Pathology', duration: 5, topics: 18, completed: true, progress: 100 },
          { id: '5', title: 'ECG Interpretation', duration: 4, topics: 15, completed: false, progress: 60 },
          { id: '6', title: 'Clinical Cases', duration: 6, topics: 20, completed: false, progress: 0 }
        ],
        prerequisites: ['Basic Anatomy', 'Cell Biology'],
        learningObjectives: [
          'Understand cardiovascular anatomy and physiology',
          'Identify common cardiovascular diseases',
          'Interpret basic ECG patterns',
          'Apply knowledge to clinical scenarios'
        ],
        resources: ['Interactive 3D models', 'Video lectures', 'Practice quizzes', 'Case studies'],
        isActive: true,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      }
      setStudyGuide(mockData)
    } catch (error) {
      console.error('Error fetching study guide:', error)
    } finally {
      setLoading(false)
    }
  }

  const overallProgress = studyGuide 
    ? Math.round((userProgress.chaptersCompleted / studyGuide.chapters.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!studyGuide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Study Guide Not Found</h1>
            <p className="text-gray-600">The requested study guide could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Study Guides</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">{studyGuide.title}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-[#213874] flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#213874]">{studyGuide.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {studyGuide.difficulty}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {studyGuide.category}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {studyGuide.estimatedHours} hours • {studyGuide.chapters.length} chapters
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 max-w-3xl">{studyGuide.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Play className="w-5 h-5 mr-2" />
                Continue Learning
              </Button>
              <Button size="lg" variant="outline">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Progress
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-[#213874]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <p className="text-xs text-gray-600 mt-2">
                {userProgress.chaptersCompleted} of {studyGuide.chapters.length} chapters completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{Math.round(userProgress.totalTimeSpent / 60)}h</div>
              <p className="text-xs text-gray-600 mt-2">
                Out of {studyGuide.estimatedHours} estimated hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Trophy className="h-4 w-4 text-[#f3ab1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#f3ab1b]">{userProgress.streak}</div>
              <p className="text-xs text-gray-600 mt-2">Days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userProgress.averageScore}%</div>
              <p className="text-xs text-gray-600 mt-2">Quiz performance</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-[#213874] to-[#1a6ac3] rounded-lg text-white">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">ECG Interpretation</h3>
                            <p className="text-sm opacity-90">Chapter 5 • 60% complete</p>
                          </div>
                          <Progress value={60} className="w-24 bg-white/20" />
                        </div>
                        <Button className="bg-white text-[#213874] hover:bg-gray-100">
                          <Play className="w-4 h-4 mr-2" />
                          Continue Chapter
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-16 justify-start">
                          <div className="flex items-center gap-3">
                            <Brain className="w-6 h-6 text-[#213874]" />
                            <div className="text-left">
                              <div className="font-semibold">Quick Review</div>
                              <div className="text-sm text-gray-600">Review completed chapters</div>
                            </div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-16 justify-start">
                          <div className="flex items-center gap-3">
                            <Lightbulb className="w-6 h-6 text-[#213874]" />
                            <div className="text-left">
                              <div className="font-semibold">Practice Quiz</div>
                              <div className="text-sm text-gray-600">Test your knowledge</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                    <CardDescription>Recommended background knowledge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {studyGuide.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-[#213874] border-[#213874]">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Guide Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estimated Duration</span>
                      <span className="font-medium">{studyGuide.estimatedHours} hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Chapters</span>
                      <span className="font-medium">{studyGuide.chapters.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Difficulty Level</span>
                      <Badge variant="outline" className="capitalize">{studyGuide.difficulty}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      <Badge variant="outline" className="capitalize">{studyGuide.category}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notes Created</span>
                      <span className="font-medium">{userProgress.notesCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bookmarks</span>
                      <span className="font-medium">{userProgress.bookmarksCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Global Rank</span>
                      <span className="font-medium">#{userProgress.rank}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Studied</span>
                      <span className="font-medium">{userProgress.lastStudied}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-6">
            <div className="space-y-4">
              {studyGuide.chapters.map((chapter, index) => (
                <Card key={chapter.id} className={`cursor-pointer transition-all hover:shadow-md ${chapter.completed ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          chapter.completed ? 'bg-green-600' : chapter.progress && chapter.progress > 0 ? 'bg-[#213874]' : 'bg-gray-400'
                        }`}>
                          {chapter.completed ? <CheckCircle className="w-6 h-6" /> : index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{chapter.title}</h3>
                          <p className="text-sm text-gray-600">
                            {chapter.duration} hours • {chapter.topics} topics
                          </p>
                          {chapter.progress !== undefined && chapter.progress > 0 && !chapter.completed && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <Progress value={chapter.progress} className="flex-1 max-w-[200px]" />
                                <span className="text-sm text-gray-600">{chapter.progress}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {chapter.completed && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Completed
                          </Badge>
                        )}
                        <Button 
                          variant={chapter.completed ? "outline" : "default"}
                          className={!chapter.completed ? "bg-[#213874] hover:bg-[#1a6ac3]" : ""}
                        >
                          {chapter.completed ? "Review" : chapter.progress && chapter.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
                <CardDescription>What you'll achieve by completing this study guide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyGuide.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-[#213874] mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Resources</CardTitle>
                  <CardDescription>Tools and materials included in this guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studyGuide.resources.map((resource, index) => {
                      const getResourceIcon = (resource: string) => {
                        if (resource.toLowerCase().includes('video')) return Video
                        if (resource.toLowerCase().includes('quiz') || resource.toLowerCase().includes('practice')) return Brain
                        if (resource.toLowerCase().includes('case')) return FileText
                        return BookOpen
                      }
                      
                      const Icon = getResourceIcon(resource)
                      
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Icon className="w-5 h-5 text-[#213874]" />
                          <span>{resource}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Tips</CardTitle>
                  <CardDescription>Maximize your learning effectiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-[#f3ab1b] mt-0.5" />
                      <div>
                        <p className="font-medium">Take Notes</p>
                        <p className="text-sm text-gray-600">Use the built-in note-taking feature to capture key insights</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Set Study Schedule</p>
                        <p className="text-sm text-gray-600">Allocate 1-2 hours per session for optimal retention</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Practice Regularly</p>
                        <p className="text-sm text-gray-600">Complete chapter quizzes to reinforce learning</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AIHelper />
    </div>
  )
}