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
  Pill, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  Users,
  Target,
  Beaker,
  Heart
} from "lucide-react"
import Link from "next/link"

interface DrugClass {
  id: string
  name: string
  category: string
  description: string
  mechanism: string
  therapeuticUses: string[]
  commonSideEffects: string[]
  contraindications: string[]
  drugs: string[]
  createdAt?: string
  updatedAt?: string
}

export default function AdminDrugClassesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [drugClasses, setDrugClasses] = useState<DrugClass[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    if (user && adminRoles.includes(user.role)) {
      fetchDrugClasses()
    }
  }, [user])

  const fetchDrugClasses = async () => {
    try {
      const response = await fetch('/api/admin/drug-classes')
      const data = await response.json()
      
      if (data.success) {
        setDrugClasses(data.data)
      }
    } catch (error) {
      console.error('Error fetching drug classes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch drug classes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDrugClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this drug class?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/drug-classes?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        setDrugClasses(prev => prev.filter(drugClass => drugClass.id !== id))
        toast({
          title: "Success",
          description: "Drug class deleted successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting drug class:', error)
      toast({
        title: "Error",
        description: "Failed to delete drug class",
        variant: "destructive",
      })
    }
  }

  const seedDatabase = async () => {
    try {
      const response = await fetch('/api/admin/seed-drugs', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Drug database seeded successfully",
        })
        fetchDrugClasses() // Refresh the data
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error seeding database:', error)
      toast({
        title: "Error",
        description: "Failed to seed drug database",
        variant: "destructive",
      })
    }
  }

  const filteredDrugClasses = drugClasses.filter(drugClass => {
    const matchesSearch = drugClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drugClass.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || drugClass.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(drugClasses.map(dc => dc.category))]

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
            <span className="text-[#213874] font-medium">Drug Classes</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Drug Classes Management</h1>
              <p className="text-gray-600">Manage comprehensive drug classifications and therapeutic categories</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={seedDatabase}
                variant="outline"
                size="lg"
              >
                <Beaker className="w-5 h-5 mr-2" />
                Seed Database
              </Button>
              <Link href="/admin/content/drug-classes/add">
                <Button size="lg" className="bg-[#213874] hover:bg-[#1a6ac3]">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Drug Class
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drug Classes</CardTitle>
              <Pill className="h-4 w-4 text-[#213874]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{drugClasses.length}</div>
              <p className="text-xs text-green-600">Comprehensive coverage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <p className="text-xs text-gray-600">Therapeutic areas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {drugClasses.reduce((sum, dc) => sum + dc.drugs.length, 0)}
              </div>
              <p className="text-xs text-gray-600">Individual medications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <p className="text-xs text-gray-600">Medical curriculum</p>
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
                  placeholder="Search drug classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Drug Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrugClasses.map((drugClass) => (
            <Card key={drugClass.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                        {drugClass.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {drugClass.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm mt-3">
                  {drugClass.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Mechanism:</span>
                    <p className="text-sm text-gray-600 mt-1">{drugClass.mechanism}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Drugs ({drugClass.drugs.length}):</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {drugClass.drugs.slice(0, 3).map((drug, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {drug}
                        </Badge>
                      ))}
                      {drugClass.drugs.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{drugClass.drugs.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Therapeutic Uses:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {drugClass.therapeuticUses.slice(0, 2).map((use, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                      {drugClass.therapeuticUses.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{drugClass.therapeuticUses.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteDrugClass(drugClass.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredDrugClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Pill className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No drug classes found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                }}
              >
                Clear Filters
              </Button>
              <Button 
                onClick={seedDatabase}
                className="bg-[#213874] hover:bg-[#1a6ac3]"
              >
                <Beaker className="w-4 h-4 mr-2" />
                Seed Drug Database
              </Button>
            </div>
          </div>
        )}
      </div>

      <AIHelper />
    </div>
  )
}