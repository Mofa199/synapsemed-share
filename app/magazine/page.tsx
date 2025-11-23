"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { Search, Clock, User, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"

export default function MagazinePage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      window.location.href = "/auth"
      return
    }

    // Fetch articles from API
    fetchArticles()
  }, [user])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/admin/articles")
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Will redirect to auth
  }

  const filteredArticles = articles.filter(
    (article: any) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#213874] mb-2">Medical Magazine</h1>
          <p className="text-gray-600">Latest research articles and medical insights</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#213874] mb-4">Featured Articles</h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article: any) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#213874]">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {article.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {article.abstract || "No abstract available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {article.readTime || "5 min"}
                        </div>
                      </div>
                      <Button className="w-full bg-[#213874] hover:bg-[#1a6ac3]">Read Article</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#213874] mb-4">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              "Cardiology",
              "Pulmonology",
              "Neurology",
              "Oncology",
              "Pediatrics",
              "Surgery",
              "Pharmacology",
              "Nursing",
            ].map((category) => (
              <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 text-[#213874] mx-auto mb-2" />
                  <h3 className="font-semibold text-[#213874]">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {articles.filter((a: any) => a.category === category).length} articles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}
