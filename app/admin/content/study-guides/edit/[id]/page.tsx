"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  BookOpen, 
  Save, 
  X,
  ChevronRight,
  Plus,
  Trash2,
  ArrowLeft
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Chapter {
  title: string
  duration: string
  topics: string
}

export default function EditStudyGuidePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    estimatedHours: "10",
    isActive: true,
    prerequisites: [""],
    learningObjectives: [""],
    resources: [""]
  })

  const [chapters, setChapters] = useState<Chapter[]>([
    { title: "", duration: "", topics: "" }
  ])

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchStudyGuide()
    }
  }, [user, params.id])

  const fetchStudyGuide = async () => {
    try {
      const response = await fetch(`/api/admin/study-guides/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const guide = data.data
        setFormData({
          title: guide.title || "",
          description: guide.description || "",
          category: guide.category || "",
          difficulty: guide.difficulty || "",
          estimatedHours: guide.estimatedTime?.toString() || "10",
          isActive: guide.isPublished || false,
          prerequisites: guide.prerequisites || [""],
          learningObjectives: guide.learningObjectives || [""],
          resources: guide.resources || [""]
        })
        setChapters(guide.chapters || [{ title: "", duration: "", topics: "" }])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch study guide details",
          variant: "destructive",
        })
        router.push("/admin/content/study-guides")
      }
    } catch (error) {
      console.error('Error fetching study guide:', error)
      toast({
        title: "Error",
        description: "Failed to fetch study guide details",
        variant: "destructive",
      })
      router.push("/admin/content/study-guides")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'prerequisites' | 'learningObjectives' | 'resources', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: 'prerequisites' | 'learningObjectives' | 'resources') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: 'prerequisites' | 'learningObjectives' | 'resources', index: number) => {
    const array = formData[field]
    if (array.length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: array.filter((_, i) => i !== index)
      }))
    }
  }

  const handleChapterChange = (index: number, field: keyof Chapter, value: string) => {
    setChapters(prev => prev.map((chapter, i) => 
      i === index ? { ...chapter, [field]: value } : chapter
    ))
  }

  const addChapter = () => {
    setChapters(prev => [...prev, { title: "", duration: "", topics: "" }])
  }

  const removeChapter = (index: number) => {
    if (chapters.length > 1) {
      setChapters(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.category) {
        throw new Error("Category is required")
      }
      if (!formData.difficulty) {
        throw new Error("Difficulty is required")
      }

      const validChapters = chapters.filter(chapter => 
        chapter.title.trim() !== "" && chapter.duration.trim() !== "" && chapter.topics.trim() !== ""
      )
      if (validChapters.length === 0) {
        throw new Error("At least one complete chapter is required")
      }

      const submitData = {
        name: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        estimatedTime: parseInt(formData.estimatedHours),
        prerequisites: formData.prerequisites.filter(item => item.trim() !== ""),
        learningObjectives: formData.learningObjectives.filter(item => item.trim() !== ""),
        resources: formData.resources.filter(item => item.trim() !== ""),
        chapters: validChapters.map(chapter => ({
          ...chapter,
          duration: parseInt(chapter.duration),
          topics: parseInt(chapter.topics)
        })),
        isPublished: formData.isActive
      }

      const response = await fetch(`/api/admin/study-guides/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Study guide updated successfully",
        })
        router.push('/admin/content/study-guides')
      } else {
        throw new Error(data.error || 'Failed to update study guide')
      }
    } catch (error) {
      console.error('Error updating study guide:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update study guide",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
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
            <span>Study Guides</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Edit</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Edit Study Guide</h1>
                <p className="text-gray-600">Update study guide information and content</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/content/study-guides">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Study Guides
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
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>General details about the study guide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Comprehensive Cardiology Study Guide"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of what this study guide covers..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Cardiology, Pharmacology..."
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimatedHours">Estimated Hours</Label>
                      <Input
                        id="estimatedHours"
                        type="number"
                        min="1"
                        placeholder="e.g., 10"
                        value={formData.estimatedHours}
                        onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange('difficulty', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Chapters */}
              <Card>
                <CardHeader>
                  <CardTitle>Chapters</CardTitle>
                  <CardDescription>Define the chapters in this study guide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {chapters.map((chapter, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Chapter {index + 1}</h3>
                        {chapters.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeChapter(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            placeholder="Chapter title"
                            value={chapter.title}
                            onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 45"
                            value={chapter.duration}
                            onChange={(e) => handleChapterChange(index, 'duration', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Topics Count</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 12"
                            value={chapter.topics}
                            onChange={(e) => handleChapterChange(index, 'topics', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addChapter}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </Button>
                </CardContent>
              </Card>

              {/* Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                  <CardDescription>What students should know before starting this guide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Prerequisite ${index + 1}`}
                        value={prereq}
                        onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                      />
                      {formData.prerequisites.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem('prerequisites', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('prerequisites')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prerequisite
                  </Button>
                </CardContent>
              </Card>

              {/* Learning Objectives */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>What students will achieve by completing this guide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Learning objective ${index + 1}`}
                        value={objective}
                        onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)}
                      />
                      {formData.learningObjectives.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem('learningObjectives', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('learningObjectives')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Learning Objective
                  </Button>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                  <CardDescription>Supplementary materials for this study guide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.resources.map((resource, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Resource ${index + 1}`}
                        value={resource}
                        onChange={(e) => handleArrayChange('resources', index, e.target.value)}
                      />
                      {formData.resources.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem('resources', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('resources')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>Control the visibility of this study guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Active</h3>
                      <p className="text-sm text-gray-500">Visible to students</p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-[#213874] hover:bg-[#1a6ac3]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <X className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Study Guide
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/admin/content/study-guides')}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}