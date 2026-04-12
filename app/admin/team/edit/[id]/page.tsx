"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Users, Mail, Phone, Building, User } from "lucide-react"
import Link from "next/link"

interface TeamMemberData {
  id: string
  name: string
  email: string
  phone: string | null
  position: string
  department: string
  bio: string | null
  linkedin: string | null
  expertise: string | null
  createdAt: string
  updatedAt: string
}

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [teamMemberData, setTeamMemberData] = useState<TeamMemberData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    bio: "",
    linkedin: "",
    expertise: "",
  })

  useEffect(() => {
    if ((user?.role === "SUPER_ADMIN" || user?.role === "LECTURER" || user?.role === "EDITOR") && params.id) {
      fetchTeamMember()
    }
  }, [user, params.id])

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/admin/team/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const member = data.data
        setTeamMemberData(member)
        setFormData({
          name: member.name || "",
          email: member.email || "",
          phone: member.phone || "",
          position: member.position || "",
          department: member.department || "",
          bio: member.bio || "",
          linkedin: member.linkedin || "",
          expertise: member.expertise || "",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch team member details",
          variant: "destructive",
        })
        router.push("/admin/team")
      }
    } catch (error) {
      console.error('Error fetching team member:', error)
      toast({
        title: "Error",
        description: "Failed to fetch team member details",
        variant: "destructive",
      })
      router.push("/admin/team")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const memberData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        memberData.append(key, value)
      })

      const response = await fetch(`/api/admin/team/${params.id}`, {
        method: "PUT",
        body: memberData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Team member updated successfully!",
        })
        router.push("/admin/team")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update team member",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== "SUPER_ADMIN" && user?.role !== "LECTURER" && user?.role !== "EDITOR") {
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

  const departmentOptions = [
    { value: "MEDICAL_EDUCATION", label: "Medical Education" },
    { value: "CONTENT_DEVELOPMENT", label: "Content Development" },
    { value: "NURSING", label: "Nursing" },
    { value: "PHARMACY", label: "Pharmacy" },
    { value: "ENGINEERING", label: "Engineering" },
    { value: "DESIGN", label: "Design" },
    { value: "ADMINISTRATION", label: "Administration" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/team" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Team Member</h1>
          <p className="text-gray-600 mt-2">Update team member information and details</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update basic personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>Update role and department details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position/Title *</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                        placeholder="e.g., Medical Director"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Expertise & Specialties</Label>
                    <Input
                      id="expertise"
                      value={formData.expertise}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expertise: e.target.value }))}
                      placeholder="e.g., Cardiology, Medical Education, Curriculum Design"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Professional biography and background..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/team")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#213874] hover:bg-[#1a6ac3]" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Team Member
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Team Member Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#213874]" />
                  Member Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMemberData && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">
                          {new Date(teamMemberData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">
                          {new Date(teamMemberData.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">
                          {departmentOptions.find(d => d.value === teamMemberData.department)?.label || teamMemberData.department}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/team">
                    <Users className="w-4 h-4 mr-2" />
                    View All Team Members
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/team/add">
                    <Users className="w-4 h-4 mr-2" />
                    Add New Member
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}