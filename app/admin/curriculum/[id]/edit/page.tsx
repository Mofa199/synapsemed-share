"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { BookOpen, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import React from "react"

export default function EditCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    field: "",
    level: "",
    duration: "",
    isActive: true,
  })

  useEffect(() => {
    if (user?.role !== "SUPER_ADMIN") {
      router.push("/admin")
      return
    }
    
    if (id) {
      fetchCurriculum()
    }
  }, [user, id])

  const fetchCurriculum = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/admin/curriculums/${id}`)
      const data = await response.json()
      
      if (data.success) {
        const curriculum = data.data
        setFormData({
          name: curriculum.name || "",
          description: curriculum.description || "",
          field: curriculum.field || "",
          level: curriculum.level || "",
          duration: curriculum.duration || "",
          isActive: curriculum.isActive !== undefined ? curriculum.isActive : true,
        })
      } else {
        setError("Failed to fetch curriculum")
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error)
      setError("Failed to fetch curriculum")
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/curriculums/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          if (typeof window !== 'undefined') window.alert("Curriculum updated successfully!")
          router.push("/admin/curriculum")
        } else {
          throw new Error(data.error || "Failed to update curriculum")
        }
      } else {
        throw new Error("Failed to update curriculum")
      }
    } catch (error) {
      console.error("Error updating curriculum:", error)
      if (typeof window !== 'undefined') window.alert("Failed to update curriculum. Please try again.")
    } finally {
      setIsLoading(false)
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

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading curriculum data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => router.push("/admin/curriculum")}>
            Back to Curriculums
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/curriculum" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curriculums
          </Link>
          <h1 className="text-3xl font-bold text-[#213874] mb-2">Edit Curriculum</h1>
          <p className="text-gray-600">Update curriculum information</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#213874]" />
              Curriculum Information
            </CardTitle>
            <CardDescription>Update the curriculum details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Curriculum Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter curriculum name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="field">Field *</Label>
                  <Select value={formData.field} onValueChange={(value) => handleInputChange("field", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEDICAL">Medical</SelectItem>
                      <SelectItem value="NURSING">Nursing</SelectItem>
                      <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="e.g., 8 weeks, 40 hours"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter curriculum description"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="h-4 w-4 text-[#213874] border-gray-300 rounded focus:ring-[#213874]"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="bg-[#213874] hover:bg-[#1a6ac3]">
                  {isLoading ? (
                    <>
                      <BookOpen className="w-4 h-4 mr-2 animate-spin" />
                      Updating Curriculum...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Curriculum
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}