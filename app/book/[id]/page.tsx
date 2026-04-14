"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Star, Download, Share, Bookmark, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import React from "react"

interface Book {
  id: string
  title: string
  description: string
  content: string
  authorId: string
  authorUser?: {
    name: string
  }
  isPublished: boolean
  publishedAt?: string
  isbn?: string
  pages?: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  views: number
  createdAt: string
  updatedAt: string
}

interface Bookmark {
  id: string
  userId: string
  resourceId: string
  resourceType: string
  createdAt: string
}

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = (React.use(params) as any)
  const { user } = useAuth()
  
  const [book, setBook] = useState<Book | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (bookId) {
      fetchBookData()
    }
  }, [bookId])

  const fetchBookData = async () => {
    try {
      setLoading(true)
      
      // Fetch book data from API
      const bookResponse = await fetch(`/api/books/${bookId}`)
      const bookResult = await bookResponse.json()
      
      if (bookResult.book) {
        setBook(bookResult.book)
      } else {
        setError('Book not found')
        return
      }
      
      // Check if book is bookmarked
      if (user) {
        const bookmarkResponse = await fetch(`/api/bookmarks?userId=${user.id}&resourceId=${bookId}`)
        const bookmarkResult = await bookmarkResponse.json()
        if (bookmarkResult.success && bookmarkResult.data.length > 0) {
          setIsBookmarked(true)
        }
      }
    } catch (err) {
      setError('Failed to load book data')
      console.error('Error fetching book data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!user || !book) return
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            resourceId: book.id,
            resourceType: 'BOOK',
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
            resourceId: book.id,
            resourceType: 'BOOK',
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
    if (typeof window === 'undefined') return

    if (typeof navigator !== 'undefined' && navigator.share && book) {
      try {
        await navigator.share({
          title: book.title,
          text: book.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      if (typeof navigator !== 'undefined') {
        navigator.clipboard.writeText(window.location.href)
        if (typeof window !== 'undefined') window.alert("Link copied to clipboard!")
      }
    }
  }

  const handleDownload = () => {
    // In a real implementation, this would download the book as PDF
    if (typeof window !== 'undefined') window.alert("Download functionality would be implemented here")
  }

  const handleStartReading = () => {
    // In a real implementation, this would open the book reader
    if (typeof window !== 'undefined') window.alert("Book reader would be implemented here")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
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

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error || 'Book not found'}</p>
            <Button onClick={fetchBookData} className="mt-4">
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <div className="w-32 h-40 bg-gradient-to-br from-[#213874] to-[#1a6ac3] rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-2xl text-[#213874] mb-2">{book.title}</CardTitle>
                        <p className="text-lg text-gray-600 mb-2">by {book.authorUser?.name || 'Unknown Author'}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {book.category && <Badge variant="outline">{book.category}</Badge>}
                          <Badge variant="outline">Book</Badge>
                          <span>{book.pages || 'N/A'} pages</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleBookmark}>
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <CardDescription className="text-base mb-4">{book.description}</CardDescription>
                    <div className="flex gap-2">
                      <Button className="bg-[#213874] hover:bg-[#1a6ac3]" onClick={handleStartReading}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Reading
                      </Button>
                      <Button variant="outline" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" onClick={handleShare}>
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Book Details */}
            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">ISBN</p>
                    <p className="text-sm text-gray-600">{book.isbn || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pages</p>
                    <p className="text-sm text-gray-600">{book.pages || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Publication Date</p>
                    <p className="text-sm text-gray-600">
                      {book.publishedAt 
                        ? new Date(book.publishedAt).toLocaleDateString() 
                        : new Date(book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Views</p>
                    <p className="text-sm text-gray-600">{book.views.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Content Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Content Preview</CardTitle>
                <CardDescription>First few paragraphs of the book</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none" 
                  dangerouslySetInnerHTML={{ __html: book.content.substring(0, 500) + '...' }} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reading Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Reading Progress</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    0 of 0 chapters completed
                  </div>
                  <div className="text-sm text-gray-600">
                    Estimated time remaining: 0 minutes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Interactive content, High-resolution illustrations, Clinical correlations, Online resources
                </div>
              </CardContent>
            </Card>

            {/* Reading Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Reading Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pages read today</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reading streak</span>
                    <span className="font-semibold">0 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average session</span>
                    <span className="font-semibold">0 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total time spent</span>
                    <span className="font-semibold">0 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Books */}
            <Card>
              <CardHeader>
                <CardTitle>Related Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  No related books available
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