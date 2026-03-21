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
  Newspaper, 
  Search, 
  Plus,
  Edit,
  Trash,
  ArrowLeft,
  ChevronRight,
  Eye,
  Calendar,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Magazine {
  id: string
  title: string
  issue?: string
  volume?: string
  description?: string
  coverUrl?: string
  publishedAt?: string
  category?: string
  tags: string // JSON
  isPublished: boolean
  views: number
  createdAt: string
  updatedAt: string
}

export default function AdminMagazinesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    if (user && adminRoles.includes(user.role)) {
      fetchMagazines()
    }
  }, [user])

  const fetchMagazines = async () => {
    try {
      const response = await fetch('/api/admin/magazines')
      const data = await response.json()
      
      if (data.success) {
        setMagazines(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch magazines",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching magazines:', error)
      toast({
        title: "Error",
        description: "Failed to fetch magazines",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMagazine = async (id: string) => {
    if (!confirm('Are you sure you want to delete this magazine?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/magazines/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Magazine deleted successfully",
        })
        fetchMagazines()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete magazine",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting magazine:', error)
      toast({
        title: "Error",
        description: "Failed to delete magazine",
        variant: "destructive",
      })
    }
  }

  const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
  if (!user || !adminRoles.includes(user.role)) {
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

  const filteredMagazines = magazines.filter(mag => 
    (mag.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mag.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mag.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <span className="text-[#213874] font-medium">Magazines</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Magazines Management</h1>
                <p className="text-gray-600">Manage medical journals and publications</p>
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
                <Link href="/admin/content/magazines/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Magazine
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Magazines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Magazines List */}
        <div className="space-y-4">
          {filteredMagazines.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Newspaper className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No magazines found</p>
                  <Button className="mt-4 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                    <Link href="/admin/content/magazines/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Magazine
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredMagazines.map((mag) => (
              <Card key={mag.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#213874]">{mag.title}</h3>
                        {mag.issue && <Badge variant="outline">Issue: {mag.issue}</Badge>}
                        {mag.isPublished ? (
                          <Badge className="bg-green-100 text-green-800">Published</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{mag.description || 'No description'}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{mag.publishedAt ? new Date(mag.publishedAt).toLocaleDateString() : 'Unscheduled'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{mag.views} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/content/magazines/edit/${mag.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteMagazine(mag.id)}
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
