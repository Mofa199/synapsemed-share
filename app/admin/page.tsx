"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider-nextauth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  BookOpen,
  Activity,
  Award,
  Settings,
  Database,
  TrendingUp,
  Shield,
  FileText,
  Video,
  Pill,
  Calendar,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Stethoscope,
  Users as UsersIcon,
  Target,
  BarChart3,
  Mail,
  Send,
  Newspaper,
  Brain
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalContent: number
  completionRate: number
  newUsersThisWeek: number
  contentViewsThisWeek: number
  contentBreakdown?: {
    books: number
    articles: number
    topics: number
    videos: number
    simulations: number
    questionBanks: number
    flashcardSets: number
    magazines: number
    drugs: number
  }
  gamification?: {
    badges: number
    levels: number
    challenges: number
  }
  simulations?: {
    activeCases: number
    avgCompletion: number
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  field: string
  level: number
  points: number
  isActive: boolean
  lastLoginAt: string
  createdAt: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const [settings, setSettings] = useState({
    userRegistration: true,
    emailNotifications: true,
    maintenanceMode: false,
    twoFactorAuth: true,
    sessionTimeout: '24 hours',
    passwordPolicy: 'Strong'
  })

  useEffect(() => {
    if (user) {
      const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
      if (!adminRoles.includes(user.role)) {
        console.log('User does not have admin role:', user.role)
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      console.log('Admin access granted for user:', user.email, 'Role:', user.role)
   }
    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsResult = await statsResponse.json()
        if (statsResult.success) {
          setStats(statsResult.data)
        }
      }

      // Fetch users list
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const usersResult = await usersResponse.json()
        if (usersResult.success) {
          setUsers(usersResult.data)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${!isActive ? 'activated' : 'deactivated'} successfully`,
        })
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-700'
      case 'LECTURER':
        return 'bg-blue-100 text-blue-700'
      case 'EDITOR':
        return 'bg-green-100 text-green-700'
      case 'STUDENT':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getFieldColor = (field: string) => {
    switch (field) {
      case 'MEDICAL':
        return 'bg-red-50 text-red-600'
      case 'NURSING':
        return 'bg-blue-50 text-blue-600'
      case 'PHARMACY':
        return 'bg-green-50 text-green-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  // Mock stats if not loaded
  const dashboardStats = stats || {
    totalUsers: 156,
    activeUsers: 89,
    totalContent: 324,
    completionRate: 67,
    newUsersThisWeek: 12,
    contentViewsThisWeek: 1847,
    contentBreakdown: { books: 0, articles: 0, topics: 0, videos: 0, simulations: 0, questionBanks: 0, flashcardSets: 0, magazines: 0, drugs: 0 },
    gamification: { badges: 0, levels: 1, challenges: 0 },
    simulations: { activeCases: 0, avgCompletion: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, content, and system settings</p>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-[#213874] text-white px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                {user.role}
              </Badge>
              <Button className="bg-[#f3ab1b] text-[#213874] hover:bg-[#e69b0a]">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-[#213874]">{dashboardStats.totalUsers}</div>
                <div className="text-xs text-gray-600">Total Users</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-[#213874]">{dashboardStats.activeUsers}</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-[#213874]">{dashboardStats.totalContent}</div>
                <div className="text-xs text-gray-600">Content Items</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-[#213874]">{dashboardStats.completionRate}%</div>
                <div className="text-xs text-gray-600">Completion Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-cyan-500" />
                </div>
                <div className="text-2xl font-bold text-[#213874]">{dashboardStats.newUsersThisWeek}</div>
                <div className="text-xs text-gray-600">New This Week</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="h-5 w-5 text-pink-500" />
                </div>
                <div className="text-2xl font-bold text-[#213874]">{dashboardStats.contentViewsThisWeek}</div>
                <div className="text-xs text-gray-600">Views This Week</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="gamification" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Gamification
            </TabsTrigger>
            <TabsTrigger value="simulations" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Patient Simulations
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-gray-600">john.doe@example.com - 2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New article published</p>
                        <p className="text-xs text-gray-600">Cardiovascular Physiology - 4 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Badge system updated</p>
                        <p className="text-xs text-gray-600">Added new achievement badges - 6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database Status</span>
                      <Badge className="bg-green-100 text-green-700">Healthy</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Response Time</span>
                      <Badge variant="outline">~240ms</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Sessions</span>
                      <Badge variant="outline">{dashboardStats.activeUsers}</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Usage</span>
                      <Badge variant="outline">67%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#213874]">User Management</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="bg-gray-50">
                        <th className="text-left p-4 font-medium">User</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Field</th>
                        <th className="text-left p-4 font-medium">Level</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Last Login</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.slice(0, 10).map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className={getFieldColor(user.field)}>
                                {user.field}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-sm font-medium">Level {user.level}</span>
                              <div className="text-xs text-gray-600">{user.points} XP</div>
                            </td>
                            <td className="p-4">
                              <Badge className={user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-sm">
                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                                >
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#213874]">Content Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/admin/content">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Content
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Articles */}
              <Link href="/admin/content/articles">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.articles || 0}</div>
                    <p className="text-sm text-gray-600">Published articles</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Books */}
              <Link href="/admin/content/books">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-orange-500" />
                      Books
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.books || 0}</div>
                    <p className="text-sm text-gray-600">Medical textbooks</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Magazines */}
              <Link href="/admin/content/magazines">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Newspaper className="h-5 w-5 text-purple-500" />
                      Magazines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.magazines || 0}</div>
                    <p className="text-sm text-gray-600">Medical journals</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Videos */}
              <Link href="/admin/content/videos">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Video className="h-5 w-5 text-red-500" />
                      Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.videos || 0}</div>
                    <p className="text-sm text-gray-600">Video lectures</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Drugs */}
              <Link href="/admin/content/drugs">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Pill className="h-5 w-5 text-green-500" />
                      Drugs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.drugs || 0}</div>
                    <p className="text-sm text-gray-600">Drug database</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Drug Classes */}
              <Link href="/admin/content/drug-classes">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Pill className="h-5 w-5 text-teal-500" />
                      Drug Classes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">0</div>
                    <p className="text-sm text-gray-600">Classification system</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Study Guides */}
              <Link href="/admin/content/study-guides">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      Study Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">0</div>
                    <p className="text-sm text-gray-600">Study materials</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Question Banks */}
              <Link href="/admin/content/question-banks">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-pink-500" />
                      Question Banks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.questionBanks || 0}</div>
                    <p className="text-sm text-gray-600">Practice questions</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Simulations */}
              <Link href="/admin/content/simulations">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Stethoscope className="h-5 w-5 text-cyan-500" />
                      Simulations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.simulations || 0}</div>
                    <p className="text-sm text-gray-600">Patient cases</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Topics */}
              <Link href="/admin/content/topics">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-amber-500" />
                      Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.topics || 0}</div>
                    <p className="text-sm text-gray-600">Medical topics</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Badges */}
              <Link href="/admin/content/badges/add">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">0</div>
                    <p className="text-sm text-gray-600">Achievement badges</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Mnemonics */}
              <Link href="/admin/content/mnemonics">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-purple-500" />
                      Mnemonics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">0</div>
                    <p className="text-sm text-gray-600">Memory aids</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Flashcards */}
              <Link href="/admin/content/flashcards">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Flashcards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.contentBreakdown?.flashcardSets || 0}</div>
                    <p className="text-sm text-gray-600">Study flashcards</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Question of the Day */}
              <Link href="/admin/content/question-of-the-day">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      Question of the Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">156</div>
                    <p className="text-sm text-gray-600">Daily questions</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Exam Simulations */}
              <Link href="/admin/content/exam-simulations">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-indigo-500" />
                      Exam Simulations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#213874] mb-2">15</div>
                    <p className="text-sm text-gray-600">Practice exams</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/curriculum">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Manage Curriculum
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/partners">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Partners
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/team">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/users">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/email">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Management
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/messages">
                      <Mail className="h-4 w-4 mr-2" />
                      Chat Messages
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gamification" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#213874]">Gamification System</h2>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Plus className="h-4 w-4 mr-2" />
                Add Badge
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.gamification?.badges || 0}</div>
                  <p className="text-sm text-gray-600 mb-4">Total badges available</p>
                  <Button className="w-full" variant="outline">
                    Manage Badges
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.gamification?.levels || 1}</div>
                  <p className="text-sm text-gray-600 mb-4">Maximum level</p>
                  <Button className="w-full" variant="outline">
                    Level Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#213874] mb-2">{dashboardStats.gamification?.challenges || 0}</div>
                  <p className="text-sm text-gray-600 mb-4">Active challenges</p>
                  <Button className="w-full" variant="outline">
                    Manage Challenges
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#213874]">Analytics & Reports</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#213874] mb-2">
                    {Math.round((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Active user rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#213874] mb-2">{dashboardStats.completionRate}%</div>
                  <p className="text-sm text-gray-600">Average completion rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#213874] mb-2">
                    +{Math.round((dashboardStats.newUsersThisWeek / dashboardStats.totalUsers) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Weekly growth</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#213874]">Patient Simulation Management</h2>
              <div className="flex gap-3">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Case
                </Button>
              </div>
            </div>

            {/* Case Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Simulation Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Heart Failure Emergency</h3>
                        <p className="text-sm text-gray-600">Cardiology • Intermediate</p>
                        <Badge className="mt-1 bg-green-50 text-green-600">Active</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <a href="/student/simulations/learner">
                          <Target className="h-4 w-4 mr-2" />
                          Launch Learner View
                        </a>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <a href="/student/simulations/educator">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Educator Dashboard
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-800">Cases Active</h3>
                      <p className="text-2xl font-bold text-blue-800">{dashboardStats.simulations?.activeCases || 0}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-800">Avg Completion</h3>
                      <p className="text-2xl font-bold text-green-800">{dashboardStats.simulations?.avgCompletion || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#213874]">Email Management</h2>
              <Button asChild>
                <Link href="/admin/email">
                  <Mail className="h-4 w-4 mr-2" />
                  Full Email Management
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    Quick Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Recipients</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>All Students</option>
                      <option>All Lecturers</option>
                      <option>Year 3 Students</option>
                      <option>Year 4 Students</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Template</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Welcome Email</option>
                      <option>Course Announcement</option>
                      <option>System Maintenance</option>
                      <option>Custom Message</option>
                    </select>
                  </div>
                  <Button className="w-full" onClick={() => toast({ title: "Email Queued", description: "Your message has been added to the mail spool."})}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Email Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Emails sent today</span>
                      <span className="font-bold text-[#213874]">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This week</span>
                      <span className="font-bold text-[#213874]">234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total sent</span>
                      <span className="font-bold text-[#213874]">1,567</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Delivery rate</span>
                      <span className="font-bold text-green-600">98.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#213874]">System Settings</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>User Registration</span>
                    <Badge 
                      className={`cursor-pointer ${settings.userRegistration ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => setSettings({...settings, userRegistration: !settings.userRegistration})}
                    >
                      {settings.userRegistration ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email Notifications</span>
                    <Badge 
                      className={`cursor-pointer ${settings.emailNotifications ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                    >
                      {settings.emailNotifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Maintenance Mode</span>
                    <Badge 
                      className={`cursor-pointer ${settings.maintenanceMode ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                    >
                      {settings.maintenanceMode ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <Button className="w-full mt-4" onClick={() => toast({ title: "Success", description: "General settings updated successfully."})}>
                    Update Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Two-Factor Auth</span>
                    <Badge 
                      className={`cursor-pointer ${settings.twoFactorAuth ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})}
                    >
                      {settings.twoFactorAuth ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Session Timeout</span>
                    <select
                      className="border rounded p-1 text-sm bg-transparent outline-none cursor-pointer"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                    >
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>12 hours</option>
                      <option>24 hours</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Password Policy</span>
                    <select
                      className="border rounded p-1 text-sm bg-transparent outline-none cursor-pointer"
                      value={settings.passwordPolicy}
                      onChange={(e) => setSettings({...settings, passwordPolicy: e.target.value})}
                    >
                      <option>Basic</option>
                      <option>Strong</option>
                      <option>Strict</option>
                    </select>
                  </div>
                  <Button className="w-full mt-4" onClick={() => toast({ title: "Success", description: "Security configurations securely applied."})}>
                    Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}