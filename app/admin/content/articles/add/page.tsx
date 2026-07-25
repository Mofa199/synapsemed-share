"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CurriculumModuleSelect } from "@/components/curriculum-module-select"
import { 
  FileText, 
  Save, 
  X,
  ChevronRight,
  ArrowLeft,
  Upload
} from "lucide-react"
import Link from "next/link"

export default function AddArticlePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    content: "",
    category: "",
    readTime: "",
    difficulty: "beginner",
    journal: "",
    publicationDate: "",
    doi: "",
    tags: "",
    isPublished: false,
    curriculumId: "",
    moduleId: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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
      if (!formData.title.trim()) {
        throw new Error("Article title is required")
      }
      if (!formData.author.trim()) {
        throw new Error("Author is required")
      }
      if (!formData.content.trim()) {
        throw new Error("Article content is required")
      }

      const articleData = {
        title: formData.title,
        author: formData.author,
        authorId: user?.id || undefined,
        journal: formData.journal || undefined,
        category: formData.category || undefined,
        abstract: formData.description || undefined,
        content: formData.content,
        keywords: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        references: [],
        readTime: formData.readTime || undefined,
        difficulty: formData.difficulty.toUpperCase(),
        isPublished: formData.isPublished,
        curriculumId: formData.curriculumId || undefined,
        moduleId: formData.moduleId || undefined,
      }

      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Article added successfully",
        })
        router.push("/admin/content/articles")
      } else {
        throw new Error(data.error || 'Failed to add article')
      }
    } catch (error) {
      console.error('Error adding article:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add article",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span>Content Management</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Add Article</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Add New Article</h1>
                <p className="text-gray-600">Add a research article or publication</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Information</CardTitle>
                  <CardDescription>Basic details about the article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Article Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Novel Approaches to Cardiac Surgery"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        placeholder="e.g., Dr. John Smith"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Cardiology, Surgery"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      />
                    </div>
                  </div>

                  <CurriculumModuleSelect
                    curriculumId={formData.curriculumId}
                    moduleId={formData.moduleId}
                    onCurriculumChange={(val) => handleInputChange('curriculumId', val)}
                    onModuleChange={(val) => handleInputChange('moduleId', val)}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description or abstract of the article..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Article Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Full content of the article..."
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={12}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="readTime">Read Time</Label>
                      <Input
                        id="readTime"
                        placeholder="e.g., 15 min"
                        value={formData.readTime}
                        onChange={(e) => handleInputChange('readTime', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publicationDate">Publication Date</Label>
                      <Input
                        id="publicationDate"
                        type="date"
                        value={formData.publicationDate}
                        onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="journal">Journal</Label>
                      <Input
                        id="journal"
                        placeholder="e.g., New England Journal of Medicine"
                        value={formData.journal}
                        onChange={(e) => handleInputChange('journal', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doi">DOI</Label>
                      <Input
                        id="doi"
                        placeholder="e.g., 10.1056/NEJMoa123456"
                        value={formData.doi}
                        onChange={(e) => handleInputChange('doi', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="cardiology, surgery, research (comma separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Attachments</CardTitle>
                  <CardDescription>Upload article PDF or supplementary files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#213874] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag and drop files here, or <span className="text-[#213874] font-medium cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF files up to 25MB</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Control article availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publish" className="cursor-pointer">
                      <span className="font-medium">Published</span>
                      <p className="text-sm text-gray-600">Make this article available</p>
                    </Label>
                    <Switch
                      id="publish"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                    />
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
                  {isSubmitting ? "Adding..." : "Add Article"}
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