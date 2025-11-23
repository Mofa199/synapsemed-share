"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  Brain, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronRight,
  Users,
  Target,
  Clock
} from "lucide-react"
import Link from "next/link"

interface QuestionBank {
  id: string
  name: string
  description: string
  category?: string
  difficulty: string
  examType?: string
  timeLimit?: number
  passingScore?: number
  tags: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
  curriculum?: {
    name: string
    field: string
  }
  _count: {
    questions: number
  }
  stats?: {
    totalUsers: number
    averageScore: number
    completionRate: number
  }
}

export default function AdminQuestionBanksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    if (user && adminRoles.includes(user.role)) {
      fetchQuestionBanks()
    }
  }, [user])

  const fetchQuestionBanks = async () => {
    try {
      const response = await fetch('/api/admin/question-banks')
      const data = await response.json()
      
      if (data.success) {
        // Add mock stats for demonstration
        const banksWithStats = data.data.map((bank: QuestionBank) => ({
          ...bank,
          stats: {
            totalUsers: Math.floor(Math.random() * 1000) + 100,
            averageScore: Math.floor(Math.random() * 30) + 70,
            completionRate: Math.floor(Math.random() * 40) + 60
          }
        }))
        setQuestionBanks(banksWithStats)
      }
    } catch (error) {
      console.error('Error fetching question banks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch question banks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuestionBank = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question bank? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/question-banks/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        setQuestionBanks(prev => prev.filter(bank => bank.id !== id))
        toast({
          title: "Success",
          description: "Question bank deleted successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting question bank:', error)
      toast({
        title: "Error",
        description: "Failed to delete question bank",
        variant: "destructive",
      })
    }
  }

  const toggleQuestionBankStatus = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/question-banks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !isPublished,
        }),
      })
      const data = await response.json()
      
      if (data.success) {
        setQuestionBanks(prev => 
          prev.map(bank => 
            bank.id === id ? { ...bank, isPublished: !isPublished } : bank
          )
        )
        toast({
          title: "Success",
          description: `Question bank ${!isPublished ? 'published' : 'unpublished'} successfully`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error updating question bank:', error)
      toast({
        title: "Error",
        description: "Failed to update question bank status",
        variant: "destructive",
      })
    }
  }

  const filteredQuestionBanks = questionBanks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || bank.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || bank.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  if (user && !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span>Content Management</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Question Banks</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Question Banks Management</h1>
              <p className="text-gray-600">Create, edit, and manage question banks for different curricula</p>
            </div>
            
            <Link href="/admin/content/question-banks/add">
              <Button size="lg" className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Plus className="w-5 h-5 mr-2" />
                Add Question Bank
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Question Banks</CardTitle>
              <Brain className="h-4 w-4 text-[#213874]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{questionBanks.length}</div>
              <p className="text-xs text-green-600">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Banks</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {questionBanks.filter(bank => bank.isPublished).length}
              </div>
              <p className="text-xs text-gray-600">Currently published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {questionBanks.reduce((sum, bank) => sum + bank._count.questions, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">Across all banks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {questionBanks.reduce((sum, bank) => sum + (bank.stats?.totalUsers || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">Active learners</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search question banks..."
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

        {/* Question Banks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestionBanks.map((bank) => (
            <Card key={bank.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                        {bank.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize text-xs">
                          {bank.category || 'General'}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">
                          {bank.difficulty}
                        </Badge>
                        <Badge 
                          variant={bank.isPublished ? "default" : "secondary"}
                          className={bank.isPublished ? "bg-green-600" : ""}
                        >
                          {bank.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm mt-3">
                  {bank.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Questions</span>
                    <div className="font-medium">{bank._count.questions.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Time Limit</span>
                    <div className="font-medium">{bank.timeLimit || 'N/A'} min</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Users</span>
                    <div className="font-medium">{bank.stats?.totalUsers || 0}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Score</span>
                    <div className="font-medium">{bank.stats?.averageScore || 0}%</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {bank.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {bank.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{bank.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Link href={`/question-bank/${bank.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/content/question-banks/edit/${bank.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleQuestionBankStatus(bank.id, bank.isPublished)}
                    >
                      {bank.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteQuestionBank(bank.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredQuestionBanks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No question banks found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <div className="flex justify-center gap-4">
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
              <Link href="/admin/content/question-banks/add">
                <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Question Bank
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <AIHelper />
    </div>
  )
}