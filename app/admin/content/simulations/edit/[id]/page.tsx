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
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Users } from "lucide-react"
import Link from "next/link"

interface Simulation {
  id: string
  title: string
  description: string
  content: string
  type: string
  difficulty: string
  duration?: string
  category?: string
  tags: string[]
  isPublished: boolean
}

export default function EditSimulationPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [simulation, setSimulation] = useState<Simulation | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "triage",
    difficulty: "",
    duration: "",
    category: "",
    tags: "",
    isPublished: false,
  })

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchSimulation()
    }
  }, [user, params.id])

  const fetchSimulation = async () => {
    try {
      const response = await fetch(`/api/admin/simulations/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const simulation = data.data
        setSimulation(simulation)
        setFormData({
          title: simulation.title || "",
          description: simulation.description || "",
          content: simulation.content || "",
          type: simulation.type || "triage",
          difficulty: simulation.difficulty || "",
          duration: simulation.duration || "",
          category: simulation.category || "",
          tags: JSON.stringify(simulation.tags || []),
          isPublished: simulation.isPublished || false,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch simulation details",
          variant: "destructive",
        })
        router.push("/admin/content/simulations")
      }
    } catch (error) {
      console.error('Error fetching simulation:', error)
      toast({
        title: "Error",
        description: "Failed to fetch simulation details",
        variant: "destructive",
      })
      router.push("/admin/content/simulations")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/simulations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: JSON.parse(formData.tags || "[]"),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Simulation updated successfully!",
        })
        router.push("/admin/content/simulations")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update simulation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update simulation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/content/simulations" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Simulations
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Simulation</h1>
          <p className="text-gray-600 mt-2">Update simulation information and content</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Simulation Information
              </CardTitle>
              <CardDescription>Update the basic details for this simulation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter simulation title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleInputChange('difficulty', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter simulation description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Enter simulation content and scenario details"
                  rows={8}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Simulation Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select simulation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="triage">Triage</SelectItem>
                      <SelectItem value="history">History Taking</SelectItem>
                      <SelectItem value="physical-exam">Physical Exam</SelectItem>
                      <SelectItem value="diagnostics">Diagnostics</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 30 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Cardiology"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (JSON array)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder='["cardiology", "emergency"]'
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/content/simulations")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#213874] hover:bg-[#1a6ac3]" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Update Simulation
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}