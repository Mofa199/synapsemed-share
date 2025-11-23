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
import { ArrowLeft, Save, Loader2, Brain } from "lucide-react"
import Link from "next/link"

interface QuestionBank {
  id: string
  name: string
  description: string
  difficulty: string
  examType?: string
  category?: string
  timeLimit?: number
  passingScore?: number
  curriculumId?: string
  moduleId?: string
  tags: string[]
  isPublished: boolean
}

export default function EditQuestionBankPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "",
    examType: "",
    category: "",
    timeLimit: "",
    passingScore: "",
    curriculumId: "",
    moduleId: "",
    tags: "",
    isPublished: false,
  })

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchQuestionBank()
    }
  }, [user, params.id])

  const fetchQuestionBank = async () => {
    try {
      const response = await fetch(`/api/admin/question-banks/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const bank = data.data
        setQuestionBank(bank)
        setFormData({
          name: bank.name || "",
          description: bank.description || "",
          difficulty: bank.difficulty || "",
          examType: bank.examType || "",
          category: bank.category || "",
          timeLimit: bank.timeLimit?.toString() || "",
          passingScore: bank.passingScore?.toString() || "",
          curriculumId: bank.curriculumId || "",
          moduleId: bank.moduleId || "",
          tags: bank.tags.join(', ') || "",
          isPublished: bank.isPublished || false,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch question bank details",
          variant: "destructive",
        })
        router.push("/admin/content/question-banks")
      }
    } catch (error) {
      console.error('Error fetching question bank:', error)
      toast({
        title: "Error",
        description: "Failed to fetch question bank details",
        variant: "destructive",
      })
      router.push("/admin/content/question-banks")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/question-banks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : undefined,
          passingScore: formData.passingScore ? parseInt(formData.passingScore) : undefined,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Question bank updated successfully!",
        })
        router.push("/admin/content/question-banks")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update question bank",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question bank. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/content/question-banks" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Question Banks
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Question Bank</h1>
          <p className="text-gray-600 mt-2">Update question bank information and settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Question Bank Information
              </CardTitle>
              <CardDescription>Update the basic details for this question bank</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter question bank name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter question bank description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <Input
                    id="examType"
                    value={formData.examType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, examType: e.target.value }))}
                    placeholder="e.g., USMLE Step 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timeLimit: e.target.value }))}
                    placeholder="90"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData((prev) => ({ ...prev, passingScore: e.target.value }))}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curriculumId">Curriculum ID (optional)</Label>
                  <Input
                    id="curriculumId"
                    value={formData.curriculumId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, curriculumId: e.target.value }))}
                    placeholder="Enter curriculum ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moduleId">Module ID (optional)</Label>
                  <Input
                    id="moduleId"
                    value={formData.moduleId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, moduleId: e.target.value }))}
                    placeholder="Enter module ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="anatomy, physiology, pathology"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/content/question-banks")}>
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
                  Update Question Bank
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}