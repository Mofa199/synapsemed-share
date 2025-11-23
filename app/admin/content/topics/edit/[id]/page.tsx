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
import { ArrowLeft, Save, Loader2, Settings } from "lucide-react"
import Link from "next/link"

interface Topic {
  id: string
  title: string
  description: string
  content: string
  type: string
  difficulty: string
  duration?: string
  category?: string
  moduleId?: string
  curriculumId?: string
  tags: string[]
  isPublished: boolean
}

export default function EditTopicPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "",
    difficulty: "",
    duration: "",
    category: "",
    moduleId: "",
    curriculumId: "",
    tags: "",
    isPublished: false,
  })

  useEffect(() => {
    if (user?.role === "admin" && params.id) {
      fetchTopic()
    }
  }, [user, params.id])

  const fetchTopic = async () => {
    try {
      const response = await fetch(`/api/admin/topics/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const topic = data.data
        setTopic(topic)
        setFormData({
          title: topic.title || "",
          description: topic.description || "",
          content: topic.content || "",
          type: topic.type || "",
          difficulty: topic.difficulty || "",
          duration: topic.duration || "",
          category: topic.category || "",
          moduleId: topic.moduleId || "",
          curriculumId: topic.curriculumId || "",
          tags: JSON.stringify(topic.tags || []),
          isPublished: topic.isPublished || false,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch topic details",
          variant: "destructive",
        })
        router.push("/admin/content/topics")
      }
    } catch (error) {
      console.error('Error fetching topic:', error)
      toast({
        title: "Error",
        description: "Failed to fetch topic details",
        variant: "destructive",
      })
      router.push("/admin/content/topics")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/topics/${params.id}`, {
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
          description: "Topic updated successfully!",
        })
        router.push("/admin/content/topics")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update topic",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update topic. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== "admin") {
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
          <Link href="/admin/content/topics" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Topics
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Topic</h1>
          <p className="text-gray-600 mt-2">Update topic information and content</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Topic Information
              </CardTitle>
              <CardDescription>Update the basic details for this topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter topic title"
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
                  placeholder="Enter topic description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter topic content"
                  rows={8}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Content Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARTICLE">Article</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="INTERACTIVE">Interactive</SelectItem>
                      <SelectItem value="QUIZ">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 30 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Cardiology"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="moduleId">Module ID (optional)</Label>
                  <Input
                    id="moduleId"
                    value={formData.moduleId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, moduleId: e.target.value }))}
                    placeholder="Enter module ID"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (JSON array)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder='["anatomy", "basics"]'
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
            <Button type="button" variant="outline" onClick={() => router.push("/admin/content/topics")}>
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
                  Update Topic
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}