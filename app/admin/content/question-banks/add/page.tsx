"use client"

import { useState } from "react"
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
  Brain, 
  Save, 
  X,
  ChevronRight,
  Plus,
  Trash2
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddQuestionBankPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "",
    examType: "",
    timeLimit: "90",
    passingScore: "70",
    curriculumId: "",
    moduleId: "",
    isPublished: false,
    tags: [""]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }))
  }

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, ""]
    }))
  }

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        tags: newTags
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Name is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.difficulty) {
        throw new Error("Difficulty is required")
      }

      const filteredTags = formData.tags.filter(tag => tag.trim() !== "")

      const submitData = {
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        examType: formData.examType || undefined,
        category: formData.category || undefined,
        timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : undefined,
        passingScore: formData.passingScore ? parseInt(formData.passingScore) : undefined,
        curriculumId: formData.curriculumId || undefined,
        moduleId: formData.moduleId || undefined,
        tags: filteredTags,
        isPublished: formData.isPublished
      }

      const response = await fetch('/api/admin/question-banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Question bank created successfully",
        })
        router.push('/admin/content/question-banks')
      } else {
        throw new Error(data.error || 'Failed to create question bank')
      }
    } catch (error) {
      console.error('Error creating question bank:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create question bank",
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
            <span>Question Banks</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Add New</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">Create Question Bank</h1>
              <p className="text-gray-600">Add a new question bank for students to practice</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>General details about the question bank</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., USMLE Step 1 Practice"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Comprehensive description of the question bank..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="nursing">Nursing</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty *</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Question Bank Settings</CardTitle>
                  <CardDescription>Configure the question bank parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="examType">Exam Type</Label>
                      <Input
                        id="examType"
                        placeholder="e.g., USMLE Step 1"
                        value={formData.examType}
                        onChange={(e) => handleInputChange('examType', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        placeholder="e.g., 90"
                        value={formData.timeLimit}
                        onChange={(e) => handleInputChange('timeLimit', e.target.value)}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passingScore">Passing Score (%)</Label>
                      <Input
                        id="passingScore"
                        type="number"
                        placeholder="e.g., 70"
                        value={formData.passingScore}
                        onChange={(e) => handleInputChange('passingScore', e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="curriculumId">Curriculum ID (optional)</Label>
                      <Input
                        id="curriculumId"
                        placeholder="Enter curriculum ID"
                        value={formData.curriculumId}
                        onChange={(e) => handleInputChange('curriculumId', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="moduleId">Module ID (optional)</Label>
                      <Input
                        id="moduleId"
                        placeholder="Enter module ID"
                        value={formData.moduleId}
                        onChange={(e) => handleInputChange('moduleId', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="space-y-3">
                      {(formData.tags || []).map((tag: string, index: number) => (
                        <div key={index} className="flex gap-3">
                          <Input
                            placeholder={`Tag ${index + 1}`}
                            value={tag}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                          />
                          {formData.tags.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTag(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTag}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tag
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>Control the question bank availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPublished">Published</Label>
                      <p className="text-sm text-gray-600">Make question bank available to students</p>
                    </div>
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How the question bank will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#213874]">{formData.name || "Question Bank Name"}</h4>
                      <p className="text-sm text-gray-600 mt-1">{formData.description || "Description will appear here..."}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.category && (
                        <Badge variant="outline" className="capitalize">{formData.category}</Badge>
                      )}
                      {formData.difficulty && (
                        <Badge variant="outline" className="capitalize">{formData.difficulty}</Badge>
                      )}
                      <Badge variant={formData.isPublished ? "default" : "secondary"}>
                        {formData.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      {formData.examType && <div>Exam Type: {formData.examType}</div>}
                      {formData.timeLimit && <div>Time Limit: {formData.timeLimit} minutes</div>}
                      {formData.passingScore && <div>Passing Score: {formData.passingScore}%</div>}
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
                  {isSubmitting ? "Creating..." : "Create Question Bank"}
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