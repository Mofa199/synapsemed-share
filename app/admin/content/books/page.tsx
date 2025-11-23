"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  BookOpen, 
  Search, 
  Plus,
  Edit,
  Trash,
  ArrowLeft,
  ChevronRight,
  Eye,
  Calendar,
  FileText,
  Loader2
} from "lucide-react"
import Link from "next/link"

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
  views: number
  createdAt: string
  updatedAt: string
  curriculum?: {
    name: string
    field: string
  }
  module?: {
    name: string
  }
}

export default function AdminBooksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      fetchBooks()
    }
  }, [user])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/admin/books')
      const data = await response.json()
      
      if (data.success) {
        setBooks(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch books",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Book deleted successfully",
        })
        fetchBooks() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete book",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      })
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

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getFormatBadge = (format: string) => {
    const formatColors = {
      PDF: "bg-red-100 text-red-800",
      EPUB: "bg-blue-100 text-blue-800",
      PHYSICAL: "bg-green-100 text-green-800",
    }
    return formatColors[format as keyof typeof formatColors] || "bg-gray-100 text-gray-800"
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
            <span className="text-[#213874] font-medium">Books</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Books Management</h1>
                <p className="text-gray-600">Manage textbooks and reference materials</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin/content">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Content
                </Link>
              </Button>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                <Link href="/admin/content/books/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{books.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Published Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {books.filter(b => b.isPublished).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {books.reduce((acc, b) => acc + b.views, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">PDF Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {books.filter(b => b.format === 'PDF').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, author, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No books found</p>
                  <p className="text-sm">Get started by adding your first textbook or reference material</p>
                  <Button className="mt-4 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                    <Link href="/admin/content/books/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Book
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#213874]">{book.title}</h3>
                        <Badge className={getFormatBadge(book.format)}>
                          {book.format}
                        </Badge>
                        {book.isPublished ? (
                          <Badge className="bg-green-100 text-green-800">Published</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{book.description || 'No description provided'}</p>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">by {book.author}</span>
                        </div>
                        {book.category && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{book.category}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{book.views} views</span>
                        </div>
                        {book.pages && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{book.pages} pages</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        {book.publisher && <span>Publisher: {book.publisher}</span>}
                        {book.edition && <span>Edition: {book.edition}</span>}
                        {book.publicationYear && <span>Year: {book.publicationYear}</span>}
                        {book.isbn && <span>ISBN: {book.isbn}</span>}
                      </div>
                      {book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {book.tags.slice(0, 5).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {book.tags.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{book.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/content/books/edit/${book.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <AIHelper />
    </div>
  )
}