"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, FileText, Newspaper, Filter, TrendingUp, Clock, Star, Video, Brain, Plus, Edit, Trash2, Download, Upload } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ContentItem {
  id: string
  title: string
  description?: string
  author?: string
  category?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  curriculum?: string
  module?: string
  topic?: string
  createdAt: string
  updatedAt: string
  isPublished: boolean
  views?: number
  rating?: number
  tags?: string[]
}

interface LibraryStats {
  totalBooks: number
  totalArticles: number
  totalMagazines: number
  totalVideos: number
  totalStudyGuides: number
  totalQuestionBanks: number
  totalFlashcardSets: number
  updatedToday: number
}

interface Article {
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
  keywords: string[]
  references: string[]
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  views: number
  createdAt: string
  updatedAt: string
}

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

interface Video {
  id: string
  title: string
  description: string
  url: string
  authorId: string
  authorUser?: {
    name: string
  }
  isPublished: boolean
  publishedAt?: string
  duration?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  views: number
  createdAt: string
  updatedAt: string
}

interface StudyGuide {
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
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  views: number
  createdAt: string
  updatedAt: string
}

interface QuestionBank {
  id: string
  title: string
  description: string
  authorId: string
  authorUser?: {
    name: string
  }
  isPublished: boolean
  publishedAt?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  views: number
  createdAt: string
  updatedAt: string
  _count?: {
    questions: number
  }
}

interface FlashcardSet {
  id: string
  title: string
  description: string
  authorId: string
  authorUser?: {
    name: string
  }
  isPublished: boolean
  publishedAt?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  views: number
  createdAt: string
  updatedAt: string
  _count?: {
    flashcards: number
  }
}

export default function LibraryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedCurriculum, setSelectedCurriculum] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Content state
  const [articles, setArticles] = useState<Article[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [magazines, setMagazines] = useState<any[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([])
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [transformedArticles, setTransformedArticles] = useState<ContentItem[]>([])
  const [transformedBooks, setTransformedBooks] = useState<ContentItem[]>([])
  const [stats, setStats] = useState<LibraryStats | null>(null)

  useEffect(() => {
    if (user) {
      // Check if user has admin privileges
      setIsAdmin(['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role))
    }
    // Fetch library content
    fetchLibraryContent()
  }, [user, setIsAdmin])

  const fetchLibraryContent = async () => {
    try {
      setLoading(true)

      // Fetch all content types from API
      const [
        articlesRes,
        booksRes,
        videosRes,
        studyGuidesRes,
        questionBanksRes,
        flashcardsRes
      ] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/books'),
        fetch('/api/videos'),
        fetch('/api/study-guides'),
        fetch('/api/question-banks'),
        fetch('/api/flashcards')
      ])

      const articlesData = await articlesRes.json()
      const booksData = await booksRes.json()
      const videosData = await videosRes.json()
      const studyGuidesData = await studyGuidesRes.json()
      const questionBanksData = await questionBanksRes.json()
      const flashcardsData = await flashcardsRes.json()

      // Transform data to match ContentItem interface
      const transformedArticles = articlesData.articles?.map((article: Article) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        author: article.authorUser?.name,
        category: article.category,
        difficulty: article.difficulty,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        isPublished: article.isPublished,
        views: article.views,
        tags: article.keywords
      })) || []

      const transformedBooks = booksData.books?.map((book: Book) => ({
        id: book.id,
        title: book.title,
        description: book.description,
        author: book.authorUser?.name,
        category: book.category,
        difficulty: book.difficulty,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        isPublished: book.isPublished,
        views: book.views
      })) || []

      const transformedVideos = videosData.videos?.map((video: Video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        author: video.authorUser?.name,
        category: video.category,
        difficulty: video.difficulty,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        isPublished: video.isPublished,
        views: video.views
      })) || []

      const transformedStudyGuides = studyGuidesData.studyGuides?.map((guide: StudyGuide) => ({
        id: guide.id,
        title: guide.title,
        description: guide.description,
        author: guide.authorUser?.name,
        category: guide.category,
        difficulty: guide.difficulty,
        createdAt: guide.createdAt,
        updatedAt: guide.updatedAt,
        isPublished: guide.isPublished,
        views: guide.views
      })) || []

      const transformedQuestionBanks = questionBanksData.questionBanks?.map((qbank: QuestionBank) => ({
        id: qbank.id,
        title: qbank.title,
        description: qbank.description,
        author: qbank.authorUser?.name,
        category: qbank.category,
        difficulty: qbank.difficulty,
        createdAt: qbank.createdAt,
        updatedAt: qbank.updatedAt,
        isPublished: qbank.isPublished,
        views: qbank.views
      })) || []

      const transformedFlashcardSets = flashcardsData.flashcardSets?.map((set: FlashcardSet) => ({
        id: set.id,
        title: set.title,
        description: set.description,
        author: set.authorUser?.name,
        category: set.category,
        difficulty: set.difficulty,
        createdAt: set.createdAt,
        updatedAt: set.updatedAt,
        isPublished: set.isPublished,
        views: set.views
      })) || []

      setArticles(transformedArticles)
      setBooks(transformedBooks)
      setVideos(transformedVideos)
      setStudyGuides(transformedStudyGuides)
      setQuestionBanks(transformedQuestionBanks)
      setFlashcardSets(transformedFlashcardSets)

      // Set transformed data for popular items section
      setTransformedArticles(transformedArticles)
      setTransformedBooks(transformedBooks)

      // Calculate stats
      const libraryStats: LibraryStats = {
        totalBooks: transformedBooks.length,
        totalArticles: transformedArticles.length,
        totalMagazines: 0,
        totalVideos: transformedVideos.length,
        totalStudyGuides: transformedStudyGuides.length,
        totalQuestionBanks: transformedQuestionBanks.length,
        totalFlashcardSets: transformedFlashcardSets.length,
        updatedToday: [...transformedArticles, ...transformedBooks, ...transformedVideos]
          .filter(item => {
            const today = new Date().toDateString()
            const itemDate = new Date(item.updatedAt).toDateString()
            return itemDate === today
          }).length
      }

      setStats(libraryStats)
    } catch (error) {
      console.error('Error fetching library content:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Anatomy", "Physiology", "Pathology", "Pharmacology",
    "Cardiology", "Respiratory", "Neurology", "Orthopedics",
    "Pediatrics", "Surgery", "Emergency Medicine", "Nursing",
    "Critical Care", "Mental Health", "Community Health"
  ]

  const curricula = [
    { value: "MEDICAL", label: "Medical" },
    { value: "NURSING", label: "Nursing" },
    { value: "PHARMACY", label: "Pharmacy" }
  ]

  const filterContent = (content: ContentItem[]) => {
    return content.filter(item => {
      const matchesCategory = selectedFilter === "all" || item.category?.toLowerCase() === selectedFilter
      const matchesCurriculum = selectedCurriculum === "all" || item.curriculum === selectedCurriculum
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesCurriculum && matchesSearch && item.isPublished
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Medical Library</h1>
              <p className="text-gray-600">Access comprehensive medical resources organized by curriculum</p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/content">
                    <Edit className="w-4 h-4 mr-2" />
                    Manage Content
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/admin/content/add">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search books, articles, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by curriculum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Curricula</SelectItem>
                {curricula.map((curriculum) => (
                  <SelectItem key={curriculum.value} value={curriculum.value}>
                    {curriculum.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="all" className="flex items-center gap-1 text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="articles" className="flex items-center gap-1 text-xs">
                  <FileText className="h-3 w-3" />
                  Articles
                </TabsTrigger>
                <TabsTrigger value="books" className="flex items-center gap-1 text-xs">
                  <BookOpen className="h-3 w-3" />
                  Books
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-1 text-xs">
                  <Video className="h-3 w-3" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex items-center gap-1 text-xs">
                  <FileText className="h-3 w-3" />
                  Guides
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-1 text-xs">
                  <Brain className="h-3 w-3" />
                  Q-Banks
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="flex items-center gap-1 text-xs">
                  <FileText className="h-3 w-3" />
                  Cards
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="space-y-6">
                  {/* Featured Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#213874] mb-4">Featured Content</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[...articles, ...books].slice(0, 4).map((item) => (
                        <ContentCard
                          key={item.id}
                          item={item}
                          type={books.some(b => b.id === item.id) ? 'book' : 'article'}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="articles" className="space-y-6">
                <div className="space-y-4">
                  {articles.filter(item => item.isPublished).map((article) => (
                    <ContentCard key={article.id} item={article} type="article" isAdmin={isAdmin} />
                  ))}
                  {articles.filter(item => item.isPublished).length === 0 && (
                    <EmptyState icon={FileText} title="No articles found" />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="books" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {books.filter(item => item.isPublished).map((book) => (
                    <ContentCard key={book.id} item={book} type="book" isAdmin={isAdmin} />
                  ))}
                </div>
                {books.filter(item => item.isPublished).length === 0 && (
                  <EmptyState icon={BookOpen} title="No books found" />
                )}
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.filter(item => item.isPublished).map((video) => (
                    <ContentCard key={video.id} item={video} type="video" isAdmin={isAdmin} />
                  ))}
                </div>
                {videos.filter(item => item.isPublished).length === 0 && (
                  <EmptyState icon={Video} title="No videos found" />
                )}
              </TabsContent>

              <TabsContent value="guides" className="space-y-6">
                <div className="space-y-4">
                  {studyGuides.filter(item => item.isPublished).map((guide) => (
                    <ContentCard key={guide.id} item={guide} type="study-guide" isAdmin={isAdmin} />
                  ))}
                </div>
                {studyGuides.filter(item => item.isPublished).length === 0 && (
                  <EmptyState icon={FileText} title="No study guides found" />
                )}
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {questionBanks.filter(item => item.isPublished).map((qbank) => (
                    <ContentCard key={qbank.id} item={qbank} type="question-bank" isAdmin={isAdmin} />
                  ))}
                </div>
                {questionBanks.filter(item => item.isPublished).length === 0 && (
                  <EmptyState icon={Brain} title="No question banks found" />
                )}
              </TabsContent>

              <TabsContent value="flashcards" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flashcardSets.filter(item => item.isPublished).map((flashcard) => (
                    <ContentCard key={flashcard.id} item={flashcard} type="flashcard" isAdmin={isAdmin} />
                  ))}
                </div>
                {flashcardSets.filter(item => item.isPublished).length === 0 && (
                  <EmptyState icon={FileText} title="No flashcard sets found" />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Library Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Articles</span>
                      <span className="font-semibold">{stats.totalArticles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Books</span>
                      <span className="font-semibold">{stats.totalBooks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Videos</span>
                      <span className="font-semibold">{stats.totalVideos.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Question Banks</span>
                      <span className="font-semibold">{stats.totalQuestionBanks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Study Guides</span>
                      <span className="font-semibold">{stats.totalStudyGuides}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Flashcard Sets</span>
                      <span className="font-semibold">{stats.totalFlashcardSets}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Updated Today</span>
                      <span className="font-semibold text-green-600">{stats.updatedToday}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions for Students */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/library/bookmarks">
                      <Star className="w-4 h-4 mr-2" />
                      My Bookmarks
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/library/recent">
                      <Clock className="w-4 h-4 mr-2" />
                      Recently Viewed
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/library/downloads">
                      <Download className="w-4 h-4 mr-2" />
                      Downloads
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link href="/admin/content/bulk-upload">
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Popular This Week */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#f3ab1b]" />
                  Popular This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...transformedArticles, ...transformedBooks].slice(0, 5).map((item, index) => (
                    <div key={`popular-${item.id}-${index}`} className="flex items-start gap-3">
                      <span className="text-xs font-bold text-gray-400 mt-1">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        {item.author && (
                          <p className="text-xs text-gray-600">{item.author}</p>
                        )}
                      </div>
                    </div>
                  ))}
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

// Content Card Component
function ContentCard({
  item,
  type,
  isAdmin
}: {
  item: ContentItem
  type: 'article' | 'book' | 'video' | 'study-guide' | 'question-bank' | 'flashcard'
  isAdmin: boolean
}) {
  const getIcon = () => {
    switch (type) {
      case 'article': return FileText
      case 'book': return BookOpen
      case 'video': return Video
      case 'study-guide': return FileText
      case 'question-bank': return Brain
      case 'flashcard': return FileText
      default: return FileText
    }
  }

  const getLink = () => {
    switch (type) {
      case 'article': return `/article/${item.id}`
      case 'book': return `/book/${item.id}`
      case 'video': return `/video/${item.id}`
      case 'study-guide': return `/study-guide/${item.id}`
      case 'question-bank': return `/question-bank/${item.id}`
      case 'flashcard': return `/flashcard/${item.id}`
      default: return '#'
    }
  }

  const Icon = getIcon()

  return (
    <div className="relative group">
      <Link href={getLink()}>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#213874]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#213874]" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors truncate">
                    {item.title}
                  </CardTitle>
                  {item.author && (
                    <CardDescription className="mt-1">by {item.author}</CardDescription>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                {item.difficulty && (
                  <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </Badge>
                )}
                {item.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {item.category && (
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                )}
                {item.curriculum && (
                  <Badge variant="outline" className="text-xs">{item.curriculum}</Badge>
                )}
                {item.module && (
                  <Badge variant="outline" className="text-xs">{item.module}</Badge>
                )}
              </div>
              {item.views && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.views.toLocaleString()} views</span>
                  <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
            <Link href={`/admin/content/${type}/${item.id}/edit`}>
              <Edit className="w-3 h-3" />
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Empty State Component
function EmptyState({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500">Try adjusting your filters or search terms</p>
    </div>
  )
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'BEGINNER': return 'bg-green-100 text-green-800'
    case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
    case 'ADVANCED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}