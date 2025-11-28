"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddExamSimulationPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    field: "MEDICAL",
    duration: 1800,
    totalQuestions: 5,
    passingScore: 70,
    difficulty: "INTERMEDIATE",
    category: "",
    isPublic: true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean | number) => {
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
      if (!formData.title.trim()) {
        throw new Error("Exam title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.category.trim()) {
        throw new Error("Category is required")
      }

      const response = await fetch('/api/exam-simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Exam simulation created successfully"
        })
        router.push('/admin/content/exam-simulations')
      } else {
        throw new Error("Failed to create exam simulation")
      }
    } catch (error) {
      console.error('Error creating exam simulation:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create exam simulation",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <Link href="/admin/content/exam-simulations" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exam Simulations
        </Link>
        <h1 className="text-3xl font-bold text-[#213874]">Add New Exam Simulation</h1>
        <p className="text-gray-600 mt-2">Create a new exam simulation for students</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>General details about the exam simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., USMLE Step 1 Practice Exam"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the exam simulation..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="field">Field *</Label>
                    <Select value={formData.field} onValueChange={(value) => handleInputChange('field', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEDICAL">Medical</SelectItem>
                        <SelectItem value="NURSING">Nursing</SelectItem>
                        <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
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
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Cardiology, Pharmacology"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
                <CardDescription>Configure exam parameters and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration / 60}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) * 60)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questions">Number of Questions *</Label>
                    <Input
                      id="questions"
                      type="number"
                      min="1"
                      value={formData.totalQuestions}
                      onChange={(e) => handleInputChange('totalQuestions', parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passing">Passing Score (%) *</Label>
                  <Input
                    id="passing"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#213874] focus:ring-[#213874]"
                  />
                  <Label htmlFor="isPublic" className="cursor-pointer">
                    Make this exam public (all students can access)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How the exam will appear to students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#213874]">{formData.title || "Exam Title"}</h4>
                    <p className="text-sm text-gray-600 mt-1">{formData.description || "Description will appear here..."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {formData.field}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {formData.difficulty}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      {formData.category || "Category"}
                    </div>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{Math.floor(formData.duration / 60)} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span>{formData.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passing Score:</span>
                      <span>{formData.passingScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accessibility:</span>
                      <span>{formData.isPublic ? "Public" : "Private"}</span>
                    </div>
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
                {isSubmitting ? "Creating..." : "Create Exam"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push("/admin/content/exam-simulations")}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}