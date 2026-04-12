"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import React from "react"
import { 
  BookOpen, 
  Save, 
  X,
  ChevronRight,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function EditModulePage({ params }: { params: Promise<{ id: string; moduleId: string }> }) {
  const { id: curriculumId, moduleId } = React.use(params)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "BEGINNER",
    prerequisites: "",
    isActive: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load existing module data
    const loadModule = async () => {
      try {
        const response = await fetch(`/api/admin/curriculum/${curriculumId}/modules/${moduleId}`)
        const data = await response.json()
        
        if (data.success) {
          const module = data.data
          setFormData({
            name: module.name || "",
            description: module.description || "",
            duration: module.duration || "",
            difficulty: module.difficulty || "BEGINNER",
            prerequisites: module.prerequisites || "",
            isActive: module.isActive !== undefined ? module.isActive : true,
          })
        } else {
          throw new Error(data.error || "Failed to load module data")
        }
      } catch (error) {
        console.error('Error loading module:', error)
        toast({
          title: "Error",
          description: "Failed to load module data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "SUPER_ADMIN" && moduleId) {
      loadModule()
    }
  }, [moduleId, toast, user, curriculumId])

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Module name is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }

      const response = await fetch(`/api/admin/curriculum/${curriculumId}/modules/${moduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Module updated successfully",
        })
        router.push(`/admin/curriculum/${curriculumId}`)
      } else {
        throw new Error(data.error || "Failed to update module")
      }
    } catch (error) {
      console.error('Error updating module:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update module",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const curriculumNames = {
    medical: "Medical Student Curriculum",
    nursing: "Nursing Student Curriculum", 
    pharmacy: "Pharmacy Student Curriculum"
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
            <span>Curriculum Management</span>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/admin/curriculum/${curriculumId}`} className="hover:text-[#213874]">
              {curriculumNames[curriculumId as keyof typeof curriculumNames] || "Curriculum"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Edit Module</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Edit Module</h1>
                <p className="text-gray-600">Modify the learning module details</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/admin/curriculum/${curriculumId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Curriculum
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Module Information</CardTitle>
                  <CardDescription>Update the learning module details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Module Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Introduction to Anatomy"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this module covers..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 6 weeks, 40 hours"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                        <SelectTrigger>
                          <SelectValue />
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
                    <Label htmlFor="prerequisites">Prerequisites</Label>
                    <Textarea
                      id="prerequisites"
                      placeholder="List any required knowledge or modules..."
                      value={formData.prerequisites}
                      onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-[#213874] border-gray-300 rounded focus:ring-[#213874]"
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How the module will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#213874]">{formData.name || "Module Name"}</h4>
                      <p className="text-sm text-gray-600 mt-1">{formData.description || "Description will appear here..."}</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>Duration: {formData.duration || "Not set"}</div>
                      <div>Difficulty: {formData.difficulty}</div>
                      <div>Status: {formData.isActive ? "Active" : "Inactive"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="bg-[#213874] hover:bg-[#1a6ac3]"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <AIHelper />
    </div>
  )
}