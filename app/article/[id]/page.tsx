"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Download, Share, Bookmark, Eye, User } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

interface Article {
  id: string
  title: string
  description: string
  content: string
  authorId: string
  authorUser?: {
    name: string
    bio?: string
  }
  isPublished: boolean
  publishedAt?: string
  keywords: string[]
  references: string[]
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  views: number
  createdAt: string
  updatedAt: string
}

interface Rating {
  id: string
  userId: string
  resourceId: string
  rating: number
  createdAt: string
}

interface Bookmark {
  id: string
  userId: string
  resourceId: string
  resourceType: string
  createdAt: string
}

export default function ArticlePage() {
  const { user } = useAuth()
  const params = useParams()
  const articleId = params.id as string
  
  const [article, setArticle] = useState<Article | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (articleId) {
      fetchArticleData()
    }
  }, [articleId])

  const fetchArticleData = async () => {
    try {
      setLoading(true)
      
      // Fetch article data from API
      const articleResponse = await fetch(`/api/articles/${articleId}`)
      const articleResult = await articleResponse.json()
      
      if (articleResult.article) {
        setArticle(articleResult.article)
      } else {
        setError('Article not found')
        return
      }
      
      // Fetch user rating for this article
      if (user) {
        const ratingResponse = await fetch(`/api/ratings?userId=${user.id}&resourceId=${articleId}`)
        const ratingResult = await ratingResponse.json()
        if (ratingResult.success && ratingResult.data.length > 0) {
          setUserRating(ratingResult.data[0].rating)
        }
      }
      
      // Check if article is bookmarked
      if (user) {
        const bookmarkResponse = await fetch(`/api/bookmarks?userId=${user.id}&resourceId=${articleId}`)
        const bookmarkResult = await bookmarkResponse.json()
        if (bookmarkResult.success && bookmarkResult.data.length > 0) {
          setIsBookmarked(true)
        }
      }
    } catch (err) {
      setError('Failed to load article data')
      console.error('Error fetching article data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRating = async (rating: number) => {
    if (!user || !article) return
    
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          resourceId: article.id,
          resourceType: 'ARTICLE',
          rating,
        }),
      })
      
      const result = await response.json()
      if (result.success) {
        setUserRating(rating)
      }
    } catch (error) {
      console.error("Failed to submit rating:", error)
    }
  }

  const handleBookmark = async () => {
    if (!user || !article) return
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            resourceId: article.id,
            resourceType: 'ARTICLE',
          }),
        })
        
        const result = await response.json()
        if (result.success) {
          setIsBookmarked(false)
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            resourceId: article.id,
            resourceType: 'ARTICLE',
          }),
        })
        
        const result = await response.json()
        if (result.success) {
          setIsBookmarked(true)
        }
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleDownload = () => {
    // In a real implementation, this would download the article as PDF
    alert("Download functionality would be implemented here")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error || 'Article not found'}</p>
            <Button onClick={fetchArticleData} className="mt-4">
              Try Again
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Article Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {article.category && <Badge variant="outline">{article.category}</Badge>}
                      <Badge variant="outline">Article</Badge>
                    </div>
                    <CardTitle className="text-3xl text-[#213874] mb-4">{article.title}</CardTitle>
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.authorUser?.name || 'Unknown Author'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.ceil(article.content.length / 1500)} min read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {userRating || 0} ({userRating ? 1 : 0} review{userRating !== 1 ? "s" : ""})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <CardDescription className="text-base">{article.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleBookmark}>
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="bg-[#213874] hover:bg-[#1a6ac3]">Read Full Article</Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Article Content */}
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none" 
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              </CardContent>
            </Card>

            {/* References */}
            {article.references && article.references.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {article.references.map((reference, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {index + 1}. {reference}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Rating Section */}
            <Card>
              <CardHeader>
                <CardTitle>Rate this Article</CardTitle>
                <CardDescription>Help other readers by rating this content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => handleRating(star)} className="transition-colors">
                      <Star
                        className={`w-6 h-6 ${
                          star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      You rated this {userRating} star{userRating !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-[#213874] rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-[#213874]">{article.authorUser?.name || 'Unknown Author'}</p>
                    <p className="text-sm text-gray-600 mt-2">{article.authorUser?.bio || 'No bio available'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keywords */}
            {article.keywords && article.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Article Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Article Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Publication Date</span>
                    <span className="text-sm font-medium">
                      {article.publishedAt 
                        ? new Date(article.publishedAt).toLocaleDateString() 
                        : new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <span className="text-sm font-medium">{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reading Time</span>
                    <span className="text-sm font-medium">{Math.ceil(article.content.length / 1500)} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  No related articles available
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}