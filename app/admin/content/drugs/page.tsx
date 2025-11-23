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
  Target,
  Beaker,
  Heart
} from "lucide-react"
import Link from "next/link"

interface Drug {
  name: string
  genericName: string
  brandNames: string[]
  class: string
  category: string
  description: string
  mechanism: string
  indications: string[]
  dosage: {
    adult: string
    pediatric: string
    elderly: string
  }
}

export default function AdminDrugsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    if (user && adminRoles.includes(user.role)) {
      fetchDrugs()
    }
  }, [user])

  const fetchDrugs = async () => {
    try {
      const response = await fetch('/api/admin/drugs')
      const data = await response.json()
      
      if (data.drugs) {
        setDrugs(data.drugs)
      }
    } catch (error) {
      console.error('Error fetching drugs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch drugs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
        fetchDrugs() // Refresh the data
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

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || drug.category === categoryFilter
    const matchesClass = classFilter === 'all' || drug.class === classFilter
    return matchesSearch && matchesCategory && matchesClass
  })

  const categories = [...new Set(drugs.map(d => d.category))]
  const drugClasses = [...new Set(drugs.map(d => d.class))]

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
            <span className="text-[#213874] font-medium">Drugs</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Drugs Management</h1>
              <p className="text-gray-600">Manage comprehensive drug database with detailed information</p>
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
              <Link href="/admin/content/drugs/add">
                <Button size="lg" className="bg-[#213874] hover:bg-[#1a6ac3]">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Drug
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
              <Pill className="h-4 w-4 text-[#213874]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{drugs.length}</div>
              <p className="text-xs text-green-600">Comprehensive database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <p className="text-xs text-gray-600">Medical specialties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drug Classes</CardTitle>
              <Pill className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{drugClasses.length}</div>
              <p className="text-xs text-gray-600">Therapeutic classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">95%</div>
              <p className="text-xs text-gray-600">Essential medicines</p>
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
                  placeholder="Search drugs..."
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
              
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Drug Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {drugClasses.map(drugClass => (
                    <SelectItem key={drugClass} value={drugClass}>{drugClass}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Drugs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrugs.map((drug, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                        {drug.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{drug.genericName}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {drug.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {drug.class}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm mt-3">
                  {drug.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Mechanism:</span>
                    <p className="text-sm text-gray-600 mt-1">{drug.mechanism}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Brand Names:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {drug.brandNames.slice(0, 2).map((brand, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                      {drug.brandNames.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{drug.brandNames.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Indications:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {drug.indications.slice(0, 2).map((indication, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {indication}
                        </Badge>
                      ))}
                      {drug.indications.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{drug.indications.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Adult Dosage:</span>
                    <p className="text-sm text-gray-600 mt-1">{drug.dosage.adult}</p>
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
        {filteredDrugs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Pill className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No drugs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setClassFilter("all")
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