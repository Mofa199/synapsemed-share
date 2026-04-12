"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Trophy, Target, BookOpen, Clock, TrendingUp, Award, Star, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [recommendedContent, setRecommendedContent] = useState<any[]>([])
  const [upcomingGoals, setUpcomingGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [activityRes, recommendationsRes, goalsRes] = await Promise.all([
          fetch("/api/user/activity"),
          fetch("/api/user/recommendations"),
          fetch("/api/user/goals"),
        ])

        if (activityRes.ok) {
          const result = await activityRes.json()
          if (result.success) setRecentActivity(result.data)
        }

        if (recommendationsRes.ok) {
          const result = await recommendationsRes.json()
          if (result.success) setRecommendedContent(result.data)
        }

        if (goalsRes.ok) {
          const result = await goalsRes.json()
          if (result.success) setUpcomingGoals(result.data)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${diffInDays} days ago`
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#213874] animate-spin mb-4" />
        <p className="text-gray-600 font-medium tracking-tight">Loading your learning dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#213874] mb-2">Welcome back, {user?.name || "Student"}! 👋</h1>
          <p className="text-gray-600">Here's your learning progress and personalized recommendations.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 text-slate-800">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-[#f3ab1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{user?.points || 0}</div>
              <p className="text-xs text-muted-foreground font-medium">Earn more XP by completing topics</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Star className="h-4 w-4 text-[#213874]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{user?.level || 1}</div>
              <p className="text-xs text-muted-foreground font-medium">Rank: {user?.level && user.level > 10 ? "Advanced " : "Junior "} Learned</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{user?.streak || 0} days</div>
              <p className="text-xs text-muted-foreground font-medium">Don't break your streak!</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Award className="h-4 w-4 text-[#f3ab1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{user?.badges?.length || 0}</div>
              <p className="text-xs text-muted-foreground font-medium">Visit milestones to earn more</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 text-slate-800">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Tracker */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#213874]" />
                  Learning Goals
                </CardTitle>
                <CardDescription>Track your progress across different modules</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingGoals.length > 0 ? (
                  <div className="space-y-6">
                    {upcomingGoals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-[#213874]">
                            {goal.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{goal.progress}%</span>
                            {goal.dueDate && (
                              <Badge variant="outline" className="text-xs">
                                {new Date(goal.dueDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't set any study goals yet.</p>
                    <Button variant="outline" className="text-[#213874]" asChild>
                      <Link href="/library">Add Your First Goal</Link>
                    </Button>
                  </div>
                )}
                <Button className="w-full mt-6 bg-[#213874] hover:bg-[#1a6ac3] text-white" asChild>
                  <Link href="/library">Continue Learning</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#213874]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <Link key={activity.id} href={activity.url}>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.status === "COMPLETED"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                                }`}
                            />
                            <div>
                              <p className="font-medium text-sm">{activity.title}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span className="uppercase">{activity.type}</span>
                                <span>•</span>
                                <span>{formatTime(activity.lastAccessedAt)}</span>
                              </div>
                            </div>
                          </div>
                          {activity.progress > 0 && activity.status !== "COMPLETED" && (
                            <Badge className="bg-blue-100 text-[#213874]">{activity.progress}%</Badge>
                          )}
                          {activity.status === "COMPLETED" && (
                            <Badge className="bg-green-100 text-green-700">Completed</Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No recent activity yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Badges */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#f3ab1b]" />
                  Your Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.badges && user.badges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {user.badges.slice(0, 4).map((badgeId, index) => (
                      <div
                        key={index}
                        className="text-center p-3 bg-gradient-to-br from-[#f3ab1b]/10 to-[#213874]/10 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-[#f3ab1b] rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Award className="h-4 w-4 text-[#213874]" />
                        </div>
                        <p className="text-xs font-medium text-[#213874] truncate">{badgeId}</p>
                      </div>
                    ))}
                    {user.badges.length > 4 && (
                      <Link href="/profile" className="col-span-2 text-center text-xs text-blue-600 font-medium mt-2">
                        View +{user.badges.length - 4} more badges
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Award className="h-6 w-6 text-gray-300" />
                    </div>
                    <p className="text-xs text-gray-500">Collect more points to earn your first badge!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommended Content */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#213874]" />
                  Recommended for You
                </CardTitle>
                <CardDescription>Based on your field: {user?.field}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedContent.length > 0 ? (
                    recommendedContent.map((content) => (
                      <Link key={content.id} href={`/${content.type.toLowerCase()}/${content.id}`}>
                        <div className="p-3 border rounded-lg hover:border-[#213874] hover:bg-gray-50 cursor-pointer transition-all">
                          <h4 className="font-medium text-sm text-[#213874] mb-1 line-clamp-2">{content.title}</h4>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span className="uppercase font-semibold tracking-tighter">{content.type}</span>
                            <span className="text-sky-600 font-medium">{content.recommendationReason}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500 uppercase font-medium">Explore the library for suggestions</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent text-[#213874] border-[#213874]" asChild>
                  <Link href="/library">Explore Library</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card className="bg-[#213874] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm opacity-90">
                    <span>Target items per week</span>
                    <span className="font-bold">5 items</span>
                  </div>
                  <Progress value={Math.min(100, (recentActivity.length / 5) * 100)} className="h-2 bg-white/20" />
                  <p className="text-xs opacity-75 font-medium italic">You've completed {recentActivity.filter(a => a.status === 'COMPLETED').length} items this week.</p>
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
