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
import { ArrowLeft, Save, Loader2, BookOpen } from "lucide-react"
import Link from "next/link"
import { CurriculumModuleSelect } from "@/components/curriculum-module-select"

interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  publisher?: string
  publicationYear?: number
  edition?: string
  pages?: number
  language: string
  format: string
  description?: string
  category?: string
  tags: string[]
  isPublished: boolean
}

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [book, setBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    publicationYear: "",
    edition: "",
    pages: "",
    language: "",
    format: "",
    description: "",
    category: "",
    curriculumId: "",
    moduleId: "",
    tags: "",
    isPublished: false,
  })

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchBook()
    }
  }, [user, params.id])

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/admin/books/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const book = data.data
        setBook(book)
        setFormData({
          title: book.title || "",
          author: book.author || "",
          isbn: book.isbn || "",
          publisher: book.publisher || "",
          publicationYear: book.publicationYear?.toString() || "",
          edition: book.edition || "",
          pages: book.pages?.toString() || "",
          language: book.language || "",
          format: book.format || "",
          description: book.description || "",
          category: book.category || "",
          curriculumId: book.curriculumId || "",
          moduleId: book.moduleId || "",
          tags: book.tags.join(', ') || "",
          isPublished: book.isPublished || false,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch book details",
          variant: "destructive",
        })
        router.push("/admin/content/books")
      }
    } catch (error) {
      console.error('Error fetching book:', error)
      toast({
        title: "Error",
        description: "Failed to fetch book details",
        variant: "destructive",
      })
      router.push("/admin/content/books")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/books/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : undefined,
          pages: formData.pages ? parseInt(formData.pages) : undefined,
          tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          curriculumId: formData.curriculumId || undefined,
          moduleId: formData.moduleId || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Book updated successfully!",
        })
        router.push("/admin/content/books")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update book",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book. Please try again.",
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
          <Link href="/admin/content/books" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Book</h1>
          <p className="text-gray-600 mt-2">Update book information and details</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Book Information
              </CardTitle>
              <CardDescription>Update the basic details for this book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter book title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                    placeholder="978-0-123456-78-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => setFormData((prev) => ({ ...prev, publisher: e.target.value }))}
                    placeholder="Publisher name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edition">Edition</Label>
                  <Input
                    id="edition"
                    value={formData.edition}
                    onChange={(e) => setFormData((prev) => ({ ...prev, edition: e.target.value }))}
                    placeholder="e.g., 5th Edition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicationYear">Publication Year</Label>
                  <Input
                    id="publicationYear"
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, publicationYear: e.target.value }))}
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pages: e.target.value }))}
                    placeholder="Number of pages"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                    placeholder="English"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EPUB">EPUB</SelectItem>
                      <SelectItem value="PHYSICAL">Physical Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Anatomy, Pathology"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter book description"
                  rows={4}
                />
              </div>

              <CurriculumModuleSelect
                curriculumId={formData.curriculumId}
                moduleId={formData.moduleId}
                onCurriculumChange={(val) => setFormData(prev => ({ ...prev, curriculumId: val }))}
                onModuleChange={(val) => setFormData(prev => ({ ...prev, moduleId: val }))}
              />

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="anatomy, textbook, reference"
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
            <Button type="button" variant="outline" onClick={() => router.push("/admin/content/books")}>
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
                  Update Book
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}