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
  BookOpen, 
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

interface StudyGuide {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  estimatedHours: number
  chapters: any[]
  prerequisites: string[]
  learningObjectives: string[]
  resources: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  stats?: {
    totalUsers: number
    averageScore: number
    completionRate: number
  }
}

export default function AdminStudyGuidesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    if (user && adminRoles.includes(user.role)) {
      fetchStudyGuides()
    }
  }, [user])

  const fetchStudyGuides = async () => {
    try {
      const response = await fetch('/api/admin/study-guides')
      const data = await response.json()
      
      if (data.success) {
        // Add mock stats for demonstration
        const guidesWithStats = data.data.map((guide: StudyGuide) => ({
          ...guide,
          stats: {
            totalUsers: Math.floor(Math.random() * 800) + 150,
            averageScore: Math.floor(Math.random() * 25) + 75,
            completionRate: Math.floor(Math.random() * 35) + 65
          }
        }))
        setStudyGuides(guidesWithStats)
      }
    } catch (error) {
      console.error('Error fetching study guides:', error)
      toast({
        title: "Error",
        description: "Failed to fetch study guides",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudyGuide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study guide?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/study-guides?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        setStudyGuides(prev => prev.filter(guide => guide.id !== id))
        toast({
          title: "Success",
          description: "Study guide deleted successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting study guide:', error)
      toast({
        title: "Error",
        description: "Failed to delete study guide",
        variant: "destructive",
      })
    }
  }

  const toggleStudyGuideStatus = async (id: string, isActive: boolean) => {
    // In a real app, this would be an API call
    setStudyGuides(prev => 
      prev.map(guide => 
        guide.id === id ? { ...guide, isActive: !isActive } : guide
      )
    )
    
    toast({
      title: "Success",
      description: `Study guide ${!isActive ? 'activated' : 'deactivated'} successfully`,
    })
  }

  const filteredStudyGuides = studyGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || guide.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || guide.difficulty === difficultyFilter
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
            <span className="text-[#213874] font-medium">Study Guides</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Study Guides Management</h1>
              <p className="text-gray-600">Create, edit, and manage comprehensive study guides for different curricula</p>
            </div>
            
            <Link href="/admin/content/study-guides/add">
              <Button size="lg" className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Plus className="w-5 h-5 mr-2" />
                Add Study Guide
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Study Guides</CardTitle>
              <BookOpen className="h-4 w-4 text-[#213874]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{studyGuides.length}</div>
              <p className="text-xs text-green-600">+3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Guides</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {studyGuides.filter(guide => guide.isActive).length}
              </div>
              <p className="text-xs text-gray-600">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {studyGuides.reduce((sum, guide) => sum + guide.chapters.length, 0)}
              </div>
              <p className="text-xs text-gray-600">Across all guides</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {studyGuides.reduce((sum, guide) => sum + (guide.stats?.totalUsers || 0), 0).toLocaleString()}
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
                  placeholder="Search study guides..."
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

        {/* Study Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudyGuides.map((guide) => (
            <Card key={guide.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
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
                        <Badge 
                          variant={guide.isActive ? "default" : "secondary"}
                          className={guide.isActive ? "bg-green-600" : ""}
                        >
                          {guide.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm mt-3">
                  {guide.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration</span>
                    <div className="font-medium">{guide.estimatedHours} hours</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Chapters</span>
                    <div className="font-medium">{guide.chapters.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Users</span>
                    <div className="font-medium">{guide.stats?.totalUsers || 0}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Completion</span>
                    <div className="font-medium">{guide.stats?.completionRate || 0}%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Prerequisites:</div>
                  <div className="flex flex-wrap gap-1">
                    {guide.prerequisites.slice(0, 2).map((prereq, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                    {guide.prerequisites.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{guide.prerequisites.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Resources:</div>
                  <div className="flex flex-wrap gap-1">
                    {guide.resources.slice(0, 2).map((resource, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                    {guide.resources.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{guide.resources.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Link href={`/study-guide/${guide.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStudyGuideStatus(guide.id, guide.isActive)}
                    >
                      {guide.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteStudyGuide(guide.id)}
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
        {filteredStudyGuides.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No study guides found</h3>
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
              <Link href="/admin/content/study-guides/add">
                <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Study Guide
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