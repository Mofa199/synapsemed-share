"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Heart, Users, Pill, BookOpen, Clock, Award, Brain, FileText, Target, Plus, Edit, Trash2 } from "lucide-react"
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
    if (!user) {
      router.push("/")
      return
    }
    
    // Check if user has admin privileges
    setIsAdmin(['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role))
    
    // Fetch all data
    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch curriculum data
      const curriculumResponse = await fetch('/api/curricula')
      const curriculumResult = await curriculumResponse.json()
      
      // Filter curriculum by user's field
      const userFieldCurricula = user?.field ? curriculumResult.curricula.filter((c: Curriculum) => c.field === user.field) : [];
      
      // Fetch modules for each curriculum
      const curriculaWithModules = await Promise.all(
        userFieldCurricula.map(async (curriculum: Curriculum) => {
          const modulesResponse = await fetch(`/api/modules`)
          const modulesResult = await modulesResponse.json()
          
          // Filter modules by curriculum
          const curriculumModules = modulesResult.modules.filter((m: Module) => m.curriculumId === curriculum.id)
          
          return {
            ...curriculum,
            modules: curriculumModules
          }
        })
      )
      
      setCurricula(curriculaWithModules)
      
      // Fetch question banks
      const qbResponse = await fetch('/api/question-banks')
      const qbResult = await qbResponse.json()
      setQuestionBanks(qbResult.questionBanks || [])
      
      // Fetch study guides
      const sgResponse = await fetch('/api/study-guides')
      const sgResult = await sgResponse.json()
      setStudyGuides(sgResult.studyGuides || [])
      
      // Fetch drug classes
      const dcResponse = await fetch('/api/drug-classes')
      const dcResult = await dcResponse.json()
      setDrugClasses(dcResult.drugClasses || [])
      
      // Fetch user progress data
      const progressResponse = await fetch('/api/user/profile')
      const progressResult = await progressResponse.json()
      if (progressResult.success) {
        setUserProgress(progressResult.data.gamification)
      }
    } catch (err) {
      setError('Failed to load data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213874] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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

  // Filter curriculum by user's field
  const userCurriculum = curricula.find(c => c.field === user.field) || curricula[0]
  
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

  const CourseIcon = userCurriculum ? getFieldIcon(userCurriculum.field) : BookOpen
  const iconColor = userCurriculum ? getFieldColor(userCurriculum.field) : 'text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                <CourseIcon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">
                  {userCurriculum?.name || 'No Curriculum Available'}
                </h1>
                <p className="text-gray-600">
                  {userCurriculum?.description || 'Please contact admin to set up curriculum for your field'}
                </p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/curriculum">
                    <Edit className="w-4 h-4 mr-2" />
                    Manage Curriculum
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/admin/curriculum/add">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{userCurriculum?.modules?.length || 0} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Self-paced learning</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Earn certificates</span>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {userCurriculum?.modules?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {userCurriculum.modules.map((module: Module) => (
              <div key={module.id} className="relative group">
                <Link href={`/module/${userCurriculum.field.toLowerCase()}/${module.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                            {module.name}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {module._count?.topics || 0} topics • {module.description || 'No description'}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={module.isActive ? "default" : "secondary"}
                          className={module.isActive ? "bg-[#213874]" : ""}
                        >
                          {module.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {module._count?.topics || 0} topics available
                          </span>
                          {module.isActive && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                      <Link href={`/admin/curriculum/${userCurriculum.id}/modules/${module.id}/edit`}>
                        <Edit className="w-3 h-3" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Available</h3>
            <p className="text-gray-600 mb-4">
              {isAdmin 
                ? "Start by adding modules to this curriculum." 
                : "Contact your administrator to add learning modules."
              }
            </p>
            {isAdmin && (
              <Button asChild>
                <Link href="/admin/curriculum/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Module
                </Link>
              </Button>
            )}
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
                  {user?.streak > 5 ? "On Fire! 🔥" : "Keep Going! 💪"}
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