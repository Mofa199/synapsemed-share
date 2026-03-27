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
  FileText, 
  Search, 
  Plus,
  Edit,
  Trash,
  ArrowLeft,
  ChevronRight,
  Eye,
  User,
  Calendar,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Article {
  id: string
  title: string
  author: string
  authorId?: string
  authorBio?: string
  journal?: string
  category?: string
  abstract?: string
  content: string
  keywords: string[]
  references: string[]
  readTime?: string
  difficulty: string
  views: number
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  authorUser?: {
    name: string
  }
}

export default function AdminArticlesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      fetchArticles()
    }
  }, [user])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles')
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch articles",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })
        fetchArticles() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete article",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      toast({
        title: "Error",
        description: "Failed to delete article",
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

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.keywords || []).some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyColors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    }
    return difficultyColors[difficulty as keyof typeof difficultyColors] || "bg-gray-100 text-gray-800"
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
            <span className="text-[#213874] font-medium">Articles</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Articles Management</h1>
                <p className="text-gray-600">Manage research articles and publications</p>
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
                <Link href="/admin/content/articles/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">{articles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {articles.filter(a => a.isPublished).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {articles.reduce((acc, a) => acc + a.views, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#213874]">
                {articles.filter(a => !a.isPublished).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, author, category, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No articles found</p>
                  <p className="text-sm">Get started by creating your first research article</p>
                  <Button className="mt-4 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                    <Link href="/admin/content/articles/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Article
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#213874]">{article.title}</h3>
                        <Badge className={getDifficultyBadge(article.difficulty)}>
                          {article.difficulty}
                        </Badge>
                        {article.isPublished ? (
                          <Badge className="bg-green-100 text-green-800">Published</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{article.abstract || 'No abstract provided'}</p>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{article.author}</span>
                        </div>
                        {article.category && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{article.category}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{article.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {(article.keywords || []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.keywords.slice(0, 5).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {(article.keywords || []).length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.keywords.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/content/articles/edit/${article.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteArticle(article.id)}
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