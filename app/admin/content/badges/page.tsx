"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  Award, 
  Search, 
  Plus,
  Edit,
  Trash,
  ArrowLeft,
  ChevronRight,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Badge {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  category?: string
  criteria?: string
  points?: number
  rarity?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminBadgesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      fetchBadges()
    }
  }, [user])

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/admin/badges')
      const data = await response.json()
      
      if (data.success) {
        setBadges(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch badges",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
      toast({
        title: "Error",
        description: "Failed to fetch badges",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBadge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this badge? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/badges/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Badge deleted successfully",
        })
        fetchBadges() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete badge",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting badge:', error)
      toast({
        title: "Error",
        description: "Failed to delete badge",
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

  const filteredBadges = badges.filter(badge => 
    badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (badge.category && badge.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getRarityBadge = (rarity: string) => {
    const rarityColors = {
      COMMON: "bg-gray-100 text-gray-800",
      RARE: "bg-blue-100 text-blue-800",
      EPIC: "bg-purple-100 text-purple-800",
      LEGENDARY: "bg-yellow-100 text-yellow-800",
    }
    return rarityColors[rarity as keyof typeof rarityColors] || "bg-gray-100 text-gray-800"
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
            <span className="text-[#213874] font-medium">Badges</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Badges Management</h1>
                <p className="text-gray-600">Manage achievements and rewards for students</p>
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
                <Link href="/admin/content/badges/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Badge
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{badges.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {badges.filter(b => b.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rare Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {badges.filter(b => b.rarity === 'RARE').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Legendary Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {badges.filter(b => b.rarity === 'LEGENDARY').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Badges List */}
        <div className="space-y-4">
          {filteredBadges.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No badges found</p>
                  <p className="text-sm">Get started by creating your first badge</p>
                  <Button className="mt-4 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                    <Link href="/admin/content/badges/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Badge
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredBadges.map((badge) => (
              <Card key={badge.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: badge.color || '#213874' }}
                        >
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#213874]">{badge.name}</h3>
                        <Badge className={getRarityBadge(badge.rarity || 'COMMON')}>
                          {badge.rarity || 'COMMON'}
                        </Badge>
                        {badge.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{badge.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {badge.category && (
                          <Badge variant="outline">{badge.category}</Badge>
                        )}
                        {badge.points && (
                          <Badge variant="outline">{badge.points} points</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/content/badges/edit/${badge.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBadge(badge.id)}
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
    </div>
  )
}