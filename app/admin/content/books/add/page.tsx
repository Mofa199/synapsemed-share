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
import { RichTextEditor } from "@/components/rich-text-editor"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Save, 
  X,
  ChevronRight,
  ArrowLeft,
  Upload,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CurriculumModuleSelect } from "@/components/curriculum-module-select"

export default function AddBookPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    isbn: "",
    publisher: "",
    publishYear: "",
    pages: "",
    category: "",
    edition: "",
    language: "english",
    format: "pdf",
    tags: "",
    curriculumId: "",
    moduleId: "",
    isPublished: false,
    coverUrl: "",
    fileUrl: ""
  })

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingBook, setUploadingBook] = useState(false)

  const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
  if (!user || !adminRoles.includes(user.role)) {
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

  const handleFileUpload = async (file: File, folder: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!data.success) throw new Error(data.error || 'Upload failed')
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.title.trim()) throw new Error("Book title is required")
      if (!formData.author.trim()) throw new Error("Author is required")

      let currentCoverUrl = formData.coverUrl
      let currentFileUrl = formData.fileUrl

      if (coverFile) {
        setUploadingCover(true)
        try {
          currentCoverUrl = await handleFileUpload(coverFile, 'covers')
        } finally {
          setUploadingCover(false)
        }
      }

      if (bookFile) {
        setUploadingBook(true)
        try {
          currentFileUrl = await handleFileUpload(bookFile, 'books')
        } finally {
          setUploadingBook(false)
        }
      }

      const bookData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || undefined,
        publisher: formData.publisher || undefined,
        publicationYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
        edition: formData.edition || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        language: formData.language,
        format: formData.format.toUpperCase(),
        description: formData.description || undefined,
        category: formData.category || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        curriculumId: formData.curriculumId || undefined,
        moduleId: formData.moduleId || undefined,
        isPublished: formData.isPublished,
        coverUrl: currentCoverUrl,
        fileUrl: currentFileUrl
      }

      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Book added successfully!",
        })
        router.push("/admin/content/books")
      } else {
        throw new Error(data.error || 'Failed to add book')
      }
    } catch (error) {
      console.error('Error adding book:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add book",
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
            <span className="text-[#213874] font-medium">Add Book</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Add New Book</h1>
                <p className="text-gray-600">Add a book to the library</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/content/books">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Books
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Book Information</CardTitle>
                  <CardDescription>Basic details about the book</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Gray's Anatomy"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        placeholder="e.g., Henry Gray"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => handleInputChange('description', value)}
                      placeholder="Brief description of the book..."
                      className="min-h-[200px]"
                    />
                  </div>

                  <CurriculumModuleSelect
                    curriculumId={formData.curriculumId}
                    moduleId={formData.moduleId}
                    onCurriculumChange={(val) => handleInputChange('curriculumId', val)}
                    onModuleChange={(val) => handleInputChange('moduleId', val)}
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                        id="isbn"
                        placeholder="978-0-123456-78-9"
                        value={formData.isbn}
                        onChange={(e) => handleInputChange('isbn', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publisher">Publisher</Label>
                      <Input
                        id="publisher"
                        placeholder="e.g., Churchill Livingstone"
                        value={formData.publisher}
                        onChange={(e) => handleInputChange('publisher', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publishYear">Publish Year</Label>
                      <Input
                        id="publishYear"
                        placeholder="2023"
                        value={formData.publishYear}
                        onChange={(e) => handleInputChange('publishYear', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages</Label>
                      <Input
                        id="pages"
                        placeholder="1500"
                        value={formData.pages}
                        onChange={(e) => handleInputChange('pages', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edition">Edition</Label>
                      <Input
                        id="edition"
                        placeholder="42nd"
                        value={formData.edition}
                        onChange={(e) => handleInputChange('edition', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="format">Format</Label>
                      <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="epub">EPUB</SelectItem>
                          <SelectItem value="physical">Physical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Anatomy, Physiology"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="anatomy, reference (comma separated)"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                      />
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cover Image</CardTitle>
                      <CardDescription>Upload a cover image for the book</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formData.coverUrl && (
                          <div className="relative w-32 h-48 rounded-lg overflow-hidden border">
                            <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => handleInputChange('coverUrl', '')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                            className="flex-1"
                            disabled={uploadingCover}
                          />
                          {uploadingCover && <Loader2 className="h-4 w-4 animate-spin" />}
                          {coverFile && !uploadingCover && <Badge variant="outline">{coverFile.name}</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Book File</CardTitle>
                      <CardDescription>Upload the book file (PDF, EPUB)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formData.fileUrl && (
                          <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded border border-blue-100">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-sm font-medium">File uploaded</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 ml-auto"
                              onClick={() => handleInputChange('fileUrl', '')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept=".pdf,.epub"
                            onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                            className="flex-1"
                            disabled={uploadingBook}
                          />
                          {uploadingBook && <Loader2 className="h-4 w-4 animate-spin" />}
                          {bookFile && !uploadingBook && <Badge variant="outline">{bookFile.name}</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Control book availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publish" className="cursor-pointer">
                      <span className="font-medium">Published</span>
                      <p className="text-sm text-gray-600">Make this book available</p>
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
                  disabled={isSubmitting || uploadingCover || uploadingBook}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Adding..." : "Add Book"}
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