"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { 
  Brain, 
  BookOpen, 
  Search, 
  Filter,
  Clock,
  Target,
  Users,
  FileText,
  ChevronRight,
  Star
} from "lucide-react"
import Link from "next/link"

interface QuestionBank {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  totalQuestions: number
  subjects: string[]
  timeLimit: number
  passingScore: number
  userProgress?: {
    questionsAnswered: number
    correctAnswers: number
    averageScore: number
  }
}

interface StudyGuide {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  estimatedHours: number
  chapters: any[]
  userProgress?: {
    chaptersCompleted: number
    totalTimeSpent: number
    averageScore: number
  }
}

export default function LearningResourcesPage() {
  const { user } = useAuth()
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      // Mock data - in real app, fetch from APIs
      const mockQuestionBanks: QuestionBank[] = [
        {
          id: '1',
          title: 'USMLE Step 1 Practice',
          description: 'Comprehensive question bank for USMLE Step 1 preparation covering all major medical subjects',
          category: 'medical',
          difficulty: 'intermediate',
          totalQuestions: 2500,
          subjects: ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology', 'Microbiology'],
          timeLimit: 90,
          passingScore: 70,
          userProgress: {
            questionsAnswered: 247,
            correctAnswers: 182,
            averageScore: 73.7
          }
        },
        {
          id: '2',
          title: 'NCLEX-RN Preparation',
          description: 'Practice questions for NCLEX-RN nursing licensure examination',
          category: 'nursing',
          difficulty: 'intermediate',
          totalQuestions: 1800,
          subjects: ['Medical-Surgical', 'Pediatrics', 'Mental Health', 'Community Health'],
          timeLimit: 75,
          passingScore: 75,
          userProgress: {
            questionsAnswered: 89,
            correctAnswers: 71,
            averageScore: 79.8
          }
        },
        {
          id: '3',
          title: 'NAPLEX Practice Exam',
          description: 'Pharmacy licensure examination practice questions',
          category: 'pharmacy',
          difficulty: 'advanced',
          totalQuestions: 1200,
          subjects: ['Pharmacology', 'Clinical Pharmacy', 'Pharmaceutical Sciences'],
          timeLimit: 105,
          passingScore: 75,
          userProgress: {
            questionsAnswered: 156,
            correctAnswers: 124,
            averageScore: 79.5
          }
        }
      ]

      const mockStudyGuides: StudyGuide[] = [
        {
          id: '1',
          title: 'Cardiovascular System Mastery',
          description: 'Comprehensive study guide covering anatomy, physiology, and pathology of the cardiovascular system',
          category: 'medical',
          difficulty: 'intermediate',
          estimatedHours: 25,
          chapters: Array.from({length: 6}, (_, i) => ({id: i+1, title: `Chapter ${i+1}`})),
          userProgress: {
            chaptersCompleted: 4,
            totalTimeSpent: 1680,
            averageScore: 87.5
          }
        },
        {
          id: '2',
          title: 'Pharmacokinetics Fundamentals',
          description: 'Essential guide to drug absorption, distribution, metabolism, and excretion',
          category: 'pharmacy',
          difficulty: 'advanced',
          estimatedHours: 30,
          chapters: Array.from({length: 6}, (_, i) => ({id: i+1, title: `Chapter ${i+1}`})),
          userProgress: {
            chaptersCompleted: 2,
            totalTimeSpent: 720,
            averageScore: 82.3
          }
        },
        {
          id: '3',
          title: 'Nursing Care Plans',
          description: 'Complete guide to developing and implementing patient care plans',
          category: 'nursing',
          difficulty: 'intermediate',
          estimatedHours: 20,
          chapters: Array.from({length: 5}, (_, i) => ({id: i+1, title: `Chapter ${i+1}`})),
          userProgress: {
            chaptersCompleted: 3,
            totalTimeSpent: 900,
            averageScore: 90.1
          }
        }
      ]

      setQuestionBanks(mockQuestionBanks)
      setStudyGuides(mockStudyGuides)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestionBanks = questionBanks.filter(bank => {
    const matchesSearch = bank.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || bank.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || bank.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const filteredStudyGuides = studyGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || guide.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || guide.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
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
            <span>Courses</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Learning Resources</span>
          </div>
          
          <h1 className="text-3xl font-bold text-[#213874] mb-2">Learning Resources</h1>
          <p className="text-gray-600">Comprehensive question banks and study guides to enhance your learning</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="nursing">Nursing</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="question-banks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="question-banks">
              <Brain className="w-4 h-4 mr-2" />
              Question Banks ({filteredQuestionBanks.length})
            </TabsTrigger>
            <TabsTrigger value="study-guides">
              <BookOpen className="w-4 h-4 mr-2" />
              Study Guides ({filteredStudyGuides.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="question-banks" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuestionBanks.map((bank) => {
                const progress = bank.userProgress 
                  ? Math.round((bank.userProgress.questionsAnswered / bank.totalQuestions) * 100)
                  : 0
                const accuracy = bank.userProgress && bank.userProgress.questionsAnswered > 0
                  ? Math.round((bank.userProgress.correctAnswers / bank.userProgress.questionsAnswered) * 100)
                  : 0

                return (
                  <Link key={bank.id} href={`/question-bank/${bank.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                              {bank.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize text-xs">
                                {bank.category}
                              </Badge>
                              <Badge variant="outline" className="capitalize text-xs">
                                {bank.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {bank.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Questions</span>
                          <span className="font-medium">{bank.totalQuestions.toLocaleString()}</span>
                        </div>
                        
                        {bank.userProgress && (
                          <>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Your Progress</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                {accuracy}% Accuracy
                              </Badge>
                              <span className="text-xs text-gray-600">
                                {bank.userProgress.questionsAnswered} answered
                              </span>
                            </div>
                          </>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {bank.subjects.slice(0, 3).map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {bank.subjects.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{bank.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="study-guides" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudyGuides.map((guide) => {
                const progress = guide.userProgress 
                  ? Math.round((guide.userProgress.chaptersCompleted / guide.chapters.length) * 100)
                  : 0

                return (
                  <Link key={guide.id} href={`/study-guide/${guide.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                              {guide.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize text-xs">
                                {guide.category}
                              </Badge>
                              <Badge variant="outline" className="capitalize text-xs">
                                {guide.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {guide.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">{guide.estimatedHours}h</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Chapters</span>
                            <span className="font-medium">{guide.chapters.length}</span>
                          </div>
                        </div>
                        
                        {guide.userProgress && (
                          <>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Your Progress</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                                {guide.userProgress.averageScore}% Avg Score
                              </Badge>
                              <span className="text-xs text-gray-600">
                                {Math.round(guide.userProgress.totalTimeSpent / 60)}h studied
                              </span>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* No results */}
        {filteredQuestionBanks.length === 0 && filteredStudyGuides.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setDifficultyFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <AIHelper />
    </div>
  )
}