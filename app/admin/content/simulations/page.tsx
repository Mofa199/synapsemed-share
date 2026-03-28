"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  Settings, 
  Search, 
  Plus,
  Edit,
  Trash,
  ArrowLeft,
  ChevronRight,
  Clock,
  Loader2,
  Users,
  Play
} from "lucide-react"
import Link from "next/link"

interface Simulation {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  duration?: string
  category?: string
  tags: string[]
  isPublished: boolean
  views: number
  createdAt: string
  updatedAt: string
  createdBy?: {
    name: string
  }
}

export default function AdminSimulationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      fetchSimulations()
    }
  }, [user])

  const fetchSimulations = async () => {
    try {
      const response = await fetch('/api/admin/simulations')
      const data = await response.json()
      
      if (data.success) {
        setSimulations(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch simulations",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching simulations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch simulations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSimulation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this simulation? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/simulations/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Simulation deleted successfully",
        })
        fetchSimulations() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete simulation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting simulation:', error)
      toast({
        title: "Error",
        description: "Failed to delete simulation",
        variant: "destructive",
      })
    }
  }

  if (user?.role !== "SUPER_ADMIN") {
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
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
          </div>
        </div>
      </div>
    )
  }

  const filteredSimulations = simulations.filter(simulation => 
    simulation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    simulation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    simulation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyColors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    }
    return difficultyColors[difficulty as keyof typeof difficultyColors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span>Content Management</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Simulations</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Simulations Management</h1>
                <p className="text-gray-600">Manage patient simulations and interactive cases</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin/content">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Content
                </Link>
              </Button>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                <Link href="/admin/content/simulations/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Simulation
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Simulations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{simulations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Published Simulations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {simulations.filter(t => t.isPublished).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Beginner Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {simulations.filter(t => t.difficulty === 'BEGINNER').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Advanced Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {simulations.filter(t => t.difficulty === 'ADVANCED').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Simulations List */}
        <div className="space-y-4">
          {filteredSimulations.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No simulations found</p>
                  <p className="text-sm">Get started by creating your first patient simulation</p>
                  <Button className="mt-4 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                    <Link href="/admin/content/simulations/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Simulation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredSimulations.map((simulation) => (
              <Card key={simulation.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#213874]">{simulation.title}</h3>
                        <Badge className={getDifficultyBadge(simulation.difficulty)}>
                          {simulation.difficulty}
                        </Badge>
                        {simulation.isPublished ? (
                          <Badge className="bg-green-100 text-green-800">Published</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{simulation.description}</p>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{simulation.duration || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {simulation.type || 'Simulation'}
                          </span>
                        </div>
                        {simulation.createdBy && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Created by {simulation.createdBy.name}
                            </span>
                          </div>
                        )}
                      </div>
                      {simulation.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(simulation.tags || []).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/content/simulations/edit/${simulation.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteSimulation(simulation.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <AIHelper />
    </div>
  )
}