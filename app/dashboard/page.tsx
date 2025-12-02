"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Trophy, Target, BookOpen, Clock, TrendingUp, Award, Star, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  
  const { user } = useAuth()

  const recentActivity = [
    {
      id: 1,
      type: "completed",
      title: "Cardiovascular System",
      time: "2 hours ago",
      points: 25,
      url: "/topic/cardiovascular-system",
    },
    {
      id: 2,
      type: "started",
      title: "Respiratory Pathology",
      time: "1 day ago",
      points: 0,
      url: "/topic/respiratory-pathology",
    },
    { id: 3, type: "badge", title: "Earned 'Quiz Master' badge", time: "2 days ago", points: 50, url: "/badges" },
    {
      id: 4,
      type: "completed",
      title: "Drug Interactions Quiz",
      time: "3 days ago",
      points: 15,
      url: "/topic/drug-interactions",
    },
  ]

  const recommendedContent = [
    {
      id: 1,
      title: "Advanced Cardiac Arrhythmias",
      type: "Article",
      duration: "15 min read",
      difficulty: "Advanced",
      url: "/article/cardiac-arrhythmias",
    },
    {
      id: 2,
      title: "Pharmacokinetics Fundamentals",
      type: "Video",
      duration: "22 min",
      difficulty: "Intermediate",
      url: "/topic/pharmacokinetics",
    },
    {
      id: 3,
      title: "Clinical Case: Acute MI",
      type: "Case Study",
      duration: "30 min",
      difficulty: "Advanced",
      url: "/case-study/acute-mi",
    },
  ]

  const upcomingGoals = [
    { id: 1, title: "Complete Pathology Module", progress: 45, deadline: "Next week", url: "/module/medical/2" },
    { id: 2, title: "Earn 'Anatomy Expert' Badge", progress: 75, deadline: "2 weeks", url: "/badges/anatomy-expert" },
    { id: 3, title: "Finish 10 Practice Quizzes", progress: 60, deadline: "This month", url: "/quizzes" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#213874] mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-600">Here's your learning progress and personalized recommendations.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-[#f3ab1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{user?.points}</div>
              <p className="text-xs text-muted-foreground">+25 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Star className="h-4 w-4 text-[#213874]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{user?.level}</div>
              <p className="text-xs text-muted-foreground">50 points to Expert</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">7 days</div>
              <p className="text-xs text-muted-foreground">Personal best!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Award className="h-4 w-4 text-[#f3ab1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{user?.badges?.length || 0}</div>
              <p className="text-xs text-muted-foreground">2 more this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#213874]" />
                  Learning Progress
                </CardTitle>
                <CardDescription>Track your progress across different modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingGoals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Link href={goal.url}>
                          <h4 className="font-medium text-[#213874] hover:text-[#1a6ac3] cursor-pointer">
                            {goal.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{goal.progress}%</span>
                          <Badge variant="outline" className="text-xs">
                            {goal.deadline}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                  <Link href="/courses">Continue Learning</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#213874]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <Link key={activity.id} href={activity.url}>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.type === "completed"
                                ? "bg-green-500"
                                : activity.type === "badge"
                                  ? "bg-[#f3ab1b]"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                        {activity.points > 0 && (
                          <Badge className="bg-[#f3ab1b] text-[#213874]">+{activity.points} pts</Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#f3ab1b]" />
                  Your Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {user?.badges?.map((badge, index) => (
                    <div
                      key={index}
                      className="text-center p-3 bg-gradient-to-br from-[#f3ab1b]/10 to-[#213874]/10 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-[#f3ab1b] rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Award className="h-4 w-4 text-[#213874]" />
                      </div>
                      <p className="text-xs font-medium text-[#213874]">{badge}</p>
                    </div>
                  ))}
                  <div className="text-center p-3 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Award className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">Next Badge</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#213874]" />
                  Recommended for You
                </CardTitle>
                <CardDescription>Based on your learning history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedContent.map((content) => (
                    <Link key={content.id} href={content.url}>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <h4 className="font-medium text-sm text-[#213874] mb-1">{content.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{content.type}</span>
                          <span>{content.duration}</span>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {content.difficulty}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                  <Link href="/library">Explore Library</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Study Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#213874]" />
                  This Week's Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Complete 3 topics</span>
                    <Badge variant="outline" className="text-xs">
                      2/3
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Take 2 quizzes</span>
                    <Badge variant="outline" className="text-xs">
                      1/2
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Read 1 article</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">✓</Badge>
                  </div>
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
