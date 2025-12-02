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
  Heart,
  Search,
  Plus,
  Edit,
  Trash,
  Mail,
  Globe,
  Building,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Partner {
  id: string
  name: string
  description: string
  type: string
  status: string
  website?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  studentsCount: number
  partnershipType?: string
  joinDate: string
  createdAt: string
  updatedAt: string
}

export default function AdminPartnersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [partnersData, setPartnersData] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      fetchPartners()
    }
  }, [user])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      const data = await response.json()

      if (data.success) {
        setPartnersData(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch partners",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      toast({
        title: "Error",
        description: "Failed to fetch partners",
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

  const filteredPartners = partnersData.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeBadge = (type: string) => {
    const typeColors = {
      UNIVERSITY: "bg-blue-100 text-blue-800",
      HOSPITAL: "bg-green-100 text-green-800",
      PHARMACEUTICAL: "bg-purple-100 text-purple-800",
      ORGANIZATION: "bg-orange-100 text-orange-800",
      university: "bg-blue-100 text-blue-800",
      hospital: "bg-green-100 text-green-800",
      pharmaceutical: "bg-purple-100 text-purple-800",
      organization: "bg-orange-100 text-orange-800"
    }
    return typeColors[type as keyof typeof typeColors] || "bg-gray-100 text-gray-800"
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      ACTIVE: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      INACTIVE: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    }
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
  }

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Partner deleted successfully",
        })
        fetchPartners() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete partner",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting partner:', error)
      toast({
        title: "Error",
        description: "Failed to delete partner",
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
            <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
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
            <span className="text-[#213874] font-medium">Partners</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Partner Management</h1>
                <p className="text-gray-600">Manage institutional partnerships and collaborations</p>
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
                <Link href="/admin/partners/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Partner
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{partnersData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {partnersData.filter(p => p.status === 'ACTIVE' || p.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {partnersData.reduce((acc, p) => acc + (p.studentsCount || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {partnersData.filter(p => p.status === 'PENDING' || p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by institution name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Partners List */}
        <div className="space-y-4">
          {filteredPartners.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No partners found</p>
                  <p className="text-sm">Get started by adding your first institutional partner</p>
                  <Button className="mt-4 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                    <Link href="/admin/partners/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Partner
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#213874]">{partner.name}</h3>
                        <Badge className={getTypeBadge(partner.type)}>
                          {partner.type.charAt(0) + partner.type.slice(1).toLowerCase()}
                        </Badge>
                        <Badge className={getStatusBadge(partner.status)}>
                          {partner.status.charAt(0) + partner.status.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{partner.description}</p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{partner.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{partner.contactEmail}</span>
                        </div>
                        {partner.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              Visit Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {partner.studentsCount || 0} students
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/partners/edit/${partner.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePartner(partner.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Remove
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