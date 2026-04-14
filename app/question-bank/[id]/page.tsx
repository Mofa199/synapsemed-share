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
  Brain, 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle, 
  Play, 
  BarChart3, 
  Trophy,
  Users,
  Calendar,
  ChevronRight
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"

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
  isActive: boolean
  createdAt: string
  updatedAt: string
  questions: any[]
}

interface UserProgress {
  questionsAnswered: number
  correctAnswers: number
  averageScore: number
  timeSpent: number
  lastSession: string
  streak: number
  rank: number
  completedSessions: number
}

import React from "react";

export default function QuestionBankPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: questionBankId } = (React.use(params) as any);
  const { user } = useAuth()
  const router = useRouter()

  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    questionsAnswered: 247,
    correctAnswers: 182,
    averageScore: 73.7,
    timeSpent: 1440, // minutes
    lastSession: "2024-01-20",
    streak: 5,
    rank: 127,
    completedSessions: 8
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionBank()
  }, [questionBankId])

  const fetchQuestionBank = async () => {
    try {
      const response = await fetch(`/api/question-banks/${questionBankId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch question bank')
      }
      
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Transform the data to match our interface
      const transformedData = {
        ...data.questionBank,
        totalQuestions: data.questionBank.questions?.length || 0,
        subjects: [], // We would need to extract subjects from questions or have them in the DB
        timeLimit: data.questionBank.timeLimit || 90,
        passingScore: data.questionBank.passingScore || 70,
        questions: data.questionBank.questions || []
      }
      
      setQuestionBank(transformedData)
    } catch (error) {
      console.error('Error fetching question bank:', error)
    } finally {
      setLoading(false)
    }
  }

  const accuracyRate = userProgress.questionsAnswered > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
    : 0

  const progressPercentage = questionBank 
    ? Math.round((userProgress.questionsAnswered / questionBank.totalQuestions) * 100)
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

  if (!questionBank) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Question Bank Not Found</h1>
            <p className="text-gray-600">The requested question bank could not be found.</p>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
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
            <span>Question Banks</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">{questionBank.title}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-[#213874] flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#213874]">{questionBank.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {questionBank.difficulty}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {questionBank.category}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {questionBank.totalQuestions} Questions
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 max-w-3xl">{questionBank.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Play className="w-5 h-5 mr-2" />
                Start Practice Session
              </Button>
              <Button size="lg" variant="outline">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
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
              <div className="text-2xl font-bold text-[#213874]">{progressPercentage}%</div>
              <Progress value={progressPercentage} className="mt-2" />
              <p className="text-xs text-gray-600 mt-2">
                {userProgress.questionsAnswered} of {questionBank.totalQuestions} questions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{accuracyRate}%</div>
              <p className="text-xs text-gray-600 mt-2">
                {userProgress.correctAnswers} correct out of {userProgress.questionsAnswered}
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
              <CardTitle className="text-sm font-medium">Rank</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">#{userProgress.rank}</div>
              <p className="text-xs text-gray-600 mt-2">Among all users</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Start</CardTitle>
                    <CardDescription>Choose your practice mode</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full h-16 bg-[#213874] hover:bg-[#1a6ac3] text-left justify-start">
                      <div className="flex items-center gap-4">
                        <Brain className="w-8 h-8" />
                        <div>
                          <div className="font-semibold">Timed Practice</div>
                          <div className="text-sm opacity-90">Full {questionBank.timeLimit}-minute session</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="w-full h-16 text-left justify-start">
                      <div className="flex items-center gap-4">
                        <BookOpen className="w-8 h-8 text-[#213874]" />
                        <div>
                          <div className="font-semibold">Study Mode</div>
                          <div className="text-sm text-gray-600">Untimed with detailed explanations</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="w-full h-16 text-left justify-start">
                      <div className="flex items-center gap-4">
                        <Target className="w-8 h-8 text-[#213874]" />
                        <div>
                          <div className="font-semibold">Weak Areas Review</div>
                          <div className="text-sm text-gray-600">Focus on missed questions</div>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#213874]" />
                          <div>
                            <div className="font-medium">Pharmacology Session</div>
                            <div className="text-sm text-gray-600">January 20, 2024</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">85% Score</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#213874]" />
                          <div>
                            <div className="font-medium">Pathology Session</div>
                            <div className="text-sm text-gray-600">January 19, 2024</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-600">78% Score</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#213874]" />
                          <div>
                            <div className="font-medium">Anatomy Session</div>
                            <div className="text-sm text-gray-600">January 18, 2024</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-red-600 border-red-600">62% Score</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Question Bank Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Questions</span>
                      <span className="font-medium">{questionBank.totalQuestions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Limit</span>
                      <span className="font-medium">{questionBank.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Passing Score</span>
                      <span className="font-medium">{questionBank.passingScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Difficulty</span>
                      <Badge variant="outline" className="capitalize">{questionBank.difficulty}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <span className="font-medium">{userProgress.averageScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Spent</span>
                      <span className="font-medium">{Math.round(userProgress.timeSpent / 60)} hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sessions Completed</span>
                      <span className="font-medium">{userProgress.completedSessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Session</span>
                      <span className="font-medium">{userProgress.lastSession}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionBank.subjects.map((subject, index) => {
                const subjectProgress = Math.floor(Math.random() * 100) // Mock progress
                const subjectAccuracy = Math.floor(Math.random() * 40) + 60 // Mock accuracy
                
                return (
                  <Card key={subject} className="cursor-pointer hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">{subject}</CardTitle>
                      <CardDescription>
                        {Math.floor(questionBank.totalQuestions / questionBank.subjects.length)} questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{subjectProgress}%</span>
                        </div>
                        <Progress value={subjectProgress} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span className="font-medium">{subjectAccuracy}%</span>
                      </div>
                      <Button size="sm" className="w-full">
                        Practice {subject}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score Trend</CardTitle>
                  <CardDescription>Your performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Performance Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Breakdown</CardTitle>
                  <CardDescription>Performance by subject area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Subject Analysis Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice Sessions History</CardTitle>
                <CardDescription>Track your practice session performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#213874] rounded-full flex items-center justify-center text-white font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-medium">Session {i + 1}</div>
                          <div className="text-sm text-gray-600">
                            January {20 - i}, 2024 • {Math.floor(Math.random() * 60) + 30} questions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{Math.floor(Math.random() * 30) + 70}%</div>
                        <div className="text-sm text-gray-600">{Math.floor(Math.random() * 30) + 60} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AIHelper />
    </div>
  )
}