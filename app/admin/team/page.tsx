"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  Star
} from "lucide-react"
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string | null
  position: string
  department: string
  bio: string | null
  linkedin: string | null
  expertise: string | null
  rating: number | null
  status: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminTeamPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [teamMembersData, setTeamMembersData] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      fetchTeamMembers()
    }
  }, [user])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team')
      const data = await response.json()
      
      if (data.success) {
        setTeamMembersData(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch team members",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  const filteredTeam = teamMembersData.filter(member => 
    (member.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.position || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.department || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDepartmentBadge = (department: string) => {
    const departmentColors = {
      "MEDICAL_EDUCATION": "bg-red-100 text-red-800",
      "CONTENT_DEVELOPMENT": "bg-blue-100 text-blue-800",
      "NURSING": "bg-green-100 text-green-800",
      "PHARMACY": "bg-purple-100 text-purple-800",
      "ENGINEERING": "bg-orange-100 text-orange-800",
      "DESIGN": "bg-pink-100 text-pink-800",
      "ADMINISTRATION": "bg-gray-100 text-gray-800"
    }
    return departmentColors[department as keyof typeof departmentColors] || "bg-gray-100 text-gray-800"
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "ACTIVE": "bg-green-100 text-green-800",
      "ON_LEAVE": "bg-yellow-100 text-yellow-800",
      "INACTIVE": "bg-red-100 text-red-800"
    }
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Team member deleted successfully",
        })
        fetchTeamMembers() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete team member",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#213874]"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span>Partners & Team</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Team Members</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Team Management</h1>
                <p className="text-gray-600">Manage team members and staff</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                <Link href="/admin/team/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{teamMembersData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {teamMembersData.filter(m => m.status === 'ACTIVE').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {new Set(teamMembersData.map(m => m.department)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {teamMembersData.length > 0 
                  ? (teamMembersData.reduce((acc, m) => acc + (m.rating || 0), 0) / teamMembersData.length).toFixed(1)
                  : "0.0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, role, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No team members found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or add a new team member.</p>
                <Button className="mt-4 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                  <Link href="/admin/team/add">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTeam.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar || undefined} alt={member.name} />
                      <AvatarFallback className="bg-[#213874] text-white">
                        {getUserInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#213874]">{member.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {member.position}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDepartmentBadge(member.department || '')}>
                          {(member.department || 'Unknown').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                        <Badge className={getStatusBadge(member.status || '')}>
                          {(member.status || 'Unknown').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Joined {new Date(member.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Specialties */}
                    {member.expertise && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.split(',').map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {member.rating && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{member.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-600">rating</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/admin/team/edit/${member.id}`}>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDeleteTeamMember(member.id)}
                      >
                        <Trash className="w-3 h-3" />
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