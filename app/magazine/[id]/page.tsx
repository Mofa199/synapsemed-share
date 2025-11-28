"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Clock, User, Share2, Bookmark, ThumbsUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function MagazineArticlePage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!user) {
      window.location.href = "/auth"
      return
    }

    fetchArticle()
  }, [user, params.id])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/articles/${params.id}`)
      const data = await response.json()
      setArticle(data.article)
    } catch (error) {
      console.error("Error fetching article:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
            <Button onClick={() => router.push("/magazine")} className="bg-[#213874] hover:bg-[#1a6ac3]">
              Back to Magazine
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/magazine")}
            className="mb-6 text-[#213874] hover:bg-[#213874]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Magazine
          </Button>

          {/* Article Header */}
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-[#213874] border-[#213874]">
                  {article.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  {article.readTime || "5 min read"}
                </div>
              </div>

              <CardTitle className="text-3xl font-bold text-[#213874] mb-4">{article.title}</CardTitle>

              <CardDescription className="text-lg text-gray-600 mb-4">{article.abstract}</CardDescription>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{article.author}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(article.publishedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-500" : "text-gray-500"}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "text-blue-500" : "text-gray-500"}
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {article.content || "Article content will be displayed here..."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#213874] mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#213874]">Related Article {i}</CardTitle>
                    <CardDescription>Brief description of the related article...</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />3 min read
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}
