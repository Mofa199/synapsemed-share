"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Heart, Users, Pill, BookOpen, Clock, Award, Brain, FileText, Target, Plus, Edit, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Module {
  id: string
  name: string
  description?: string
  curriculumId: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  topics?: Array<{
    id: string
    title: string
    description: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration?: string
    views: number
  }>
  _count?: {
    topics: number
  }
  curriculum?: {
    name: string
    field: 'MEDICAL' | 'NURSING' | 'PHARMACY'
  }
}

interface Curriculum {
  id: string
  name: string
  description?: string
  field: 'MEDICAL' | 'NURSING' | 'PHARMACY'
  isActive: boolean
  createdAt: string
  updatedAt: string
  modules: Module[]
  _count: {
    modules: number
    topics: number
  }
}

interface QuestionBank {
  id: string
  title: string
  description: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  _count: {
    questions: number
  }
}

interface StudyGuide {
  id: string
  title: string
  description: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

interface DrugClass {
  id: string
  name: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
  _count: {
    drugs: number
  }
}

interface UserProgress {
  level: number
  points: number
  streak: number
  completionRate: number
  completedItems: number
  totalItems: number
  progressToNextLevel: number
  pointsForNextLevel: number
}

export default function CoursesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [curricula, setCurricula] = useState<Curriculum[]>([])
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([])
  const [drugClasses, setDrugClasses] = useState<DrugClass[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      // Check if user has admin privileges
      setIsAdmin(['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role))
    }
    // Fetch all data
    fetchData()
  }, [user, setIsAdmin])

  const fetchData = async () => {
    try {
      setLoading(true)

      const fetchJson = async (url: string) => {
        try {
          const res = await fetch(url)
          if (!res.ok) return null
          const contentType = res.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            return await res.json()
          }
          return null
        } catch (e) {
          return null
        }
      }

      // Fetch curriculum data
      const curriculumResult = await fetchJson('/api/student/curricula') || await fetchJson('/api/admin/curriculums')
      
      const curriculaData = curriculumResult?.data || curriculumResult?.curricula || [];
      const userFieldCurricula = user?.field 
        ? curriculaData.filter((c: Curriculum) => c.field === user.field) 
        : curriculaData;

      // Modules are already included in the student/curricula endpoint.
      // If we used the admin endpoint, modules might not be included, but we assume they are for now or we just map them over.
      const curriculaWithModules = userFieldCurricula.map((curriculum: Curriculum) => {
        return {
          ...curriculum,
          modules: curriculum.modules || []
        }
      });

      setCurricula(curriculaWithModules)

      // Fetch question banks (using admin endpoints gracefully)
      const qbResult = await fetchJson('/api/admin/question-banks')
      setQuestionBanks(qbResult?.data || qbResult?.questionBanks || [])

      // Fetch study guides
      const sgResult = await fetchJson('/api/admin/study-guides')
      setStudyGuides(sgResult?.data || sgResult?.studyGuides || [])

      // Fetch drug classes
      const dcResult = await fetchJson('/api/admin/drug-classes')
      setDrugClasses(dcResult?.data || dcResult?.drugClasses || [])

      // Only fetch user progress data if logged in
      if (user) {
        const progressResult = await fetchJson('/api/user/profile')
        if (progressResult?.success) {
          setUserProgress(progressResult.data.gamification)
        }
      }
    } catch (err) {
      setError('Failed to load data')
      console.error('Error fetching data:', err)
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchData} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'MEDICAL': return Heart
      case 'NURSING': return Users
      case 'PHARMACY': return Pill
      default: return BookOpen
    }
  }

  const getFieldColor = (field: string) => {
    switch (field) {
      case 'MEDICAL': return 'text-red-600'
      case 'NURSING': return 'text-blue-600'
      case 'PHARMACY': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#213874] mb-2">My Courses</h1>
          <p className="text-gray-600">Select a curriculum to view its modules and start learning.</p>
        </div>

        {/* Curriculums Grid */}
        {curricula.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {curricula.map((curriculum: any, index: number) => {
              const CurriculumIcon = getFieldIcon(curriculum.field)
              const iconColor = getFieldColor(curriculum.field)
              
              return (
                <div key={curriculum.id} className="relative group">
                  <Link href={`/courses/${curriculum.id}`}>
                    <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden bg-white">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center`}>
                            <CurriculumIcon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-[#213874]" />
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-[#213874]">{curriculum.name}</CardTitle>
                        <CardDescription className="line-clamp-2 text-gray-500 mt-2">{curriculum.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-[#213874]" />
                            <span>{curriculum.modules?.length || 0} Modules</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-inner mb-16">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Curriculums Found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              We couldn't find any curriculums available for your field at the moment.
            </p>
          </div>
        )}

        {/* Additional Learning Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#213874] mb-6">Additional Learning Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Question Banks */}
            {questionBanks.length > 0 && (
              <Link href={`/question-bank/${questionBanks[0].id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3]">{questionBanks[0].title}</CardTitle>
                        <CardDescription>Question Bank</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{questionBanks[0].description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Your Progress</span>
                        <span className="font-medium">0/{questionBanks[0]._count?.questions || 0}</span>
                      </div>
                      <Progress value={0} className="h-2" />
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-purple-600 border-purple-600">Beginner</Badge>
                        <Badge variant="outline">Practice</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Study Guides */}
            {studyGuides.length > 0 && (
              <Link href={`/study-guide/${studyGuides[0].id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3]">{studyGuides[0].title}</CardTitle>
                        <CardDescription>Study Guide</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{studyGuides[0].description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Chapters Completed</span>
                        <span className="font-medium">0/0</span>
                      </div>
                      <Progress value={0} className="h-2" />
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-600">Beginner</Badge>
                        <Badge variant="outline">Guide</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Drug Database */}
            <Link href="/drugs">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3]">Drug Database</CardTitle>
                      <CardDescription>Comprehensive Reference</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Complete drug information with mechanisms and dosages</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-bold text-[#213874]">{drugClasses.length}+</div>
                        <div className="text-gray-600">Drug Classes</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-bold text-[#213874]">
                          {drugClasses.reduce((sum, dc) => sum + (dc._count?.drugs || 0), 0)}+
                        </div>
                        <div className="text-gray-600">Individual Drugs</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">All Categories</Badge>
                      <Badge variant="outline">Updated Daily</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Browse All */}
            <Link href="/learning-resources">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full border-dashed border-2 border-gray-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Target className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3]">Browse All Resources</CardTitle>
                      <CardDescription>Complete Library</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Explore our complete library of learning materials</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-bold text-[#213874]">{questionBanks.length}+</div>
                        <div className="text-gray-600">Question Banks</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-bold text-[#213874]">{studyGuides.length}+</div>
                        <div className="text-gray-600">Study Guides</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Course Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Course Completion</span>
                  <span>{userProgress?.completionRate || 0}%</span>
                </div>
                <Progress value={userProgress?.completionRate || 0} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">Keep going! You're making great progress.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f3ab1b] mb-2">{user?.streak || 0}</div>
                <p className="text-sm text-gray-600">Days in a row</p>
                <Badge className="mt-2 bg-[#f3ab1b] text-[#213874]">
                  {user && user.streak > 5 ? "On Fire! 🔥" : "Keep Going! 💪"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {userProgress?.level || 1}</span>
                  <span>{userProgress?.points || 0} XP</span>
                </div>
                <Progress value={userProgress?.progressToNextLevel || 0} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">
                  {userProgress?.pointsForNextLevel ? (userProgress.pointsForNextLevel - (userProgress.points || 0)) : 1000 - (userProgress?.points || 0)} XP to next level!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}