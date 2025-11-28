"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Search, Star, Download, ExternalLink, Filter, Sparkles } from "lucide-react"

interface BookMatch {
  id: string
  title: string
  author: string
  relevance: number
  reason: string
  category: string
  difficulty: string
  pages?: number
  rating?: number
}

interface BookmatcherProps {
  className?: string
}

export function Bookmatcher({ className = "" }: BookmatcherProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedField, setSelectedField] = useState("all")
  const [matches, setMatches] = useState<BookMatch[]>([])

  const levels = ["all", "Beginner", "Intermediate", "Advanced"]
  const fields = ["all", "Anatomy", "Physiology", "Pharmacology", "Pathology", "Clinical"]

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Tell us what topic or subject you're interested in",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/bookmatcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          level: selectedLevel === 'all' ? null : selectedLevel,
          field: selectedField === 'all' ? null : selectedField
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMatches(result.data)
          if (result.data.length === 0) {
            toast({
              title: "No matches found",
              description: "Try adjusting your search criteria",
            })
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find book matches",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <BookOpen className="h-4 w-4 mr-2" />
          Bookmatcher
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Book Matcher
          </DialogTitle>
          <DialogDescription>
            Find the perfect medical textbooks and resources tailored to your learning needs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Section */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search-query" className="text-sm font-medium">
                  What do you want to learn?
                </Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search-query"
                    placeholder="e.g., Cardiovascular physiology, USMLE Step 1..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Searching..." : "Find Books"}
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Difficulty Level
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        selectedLevel === level
                          ? 'bg-[#213874] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Subject Area
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fields.map(field => (
                    <button
                      key={field}
                      onClick={() => setSelectedField(field)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        selectedField === field
                          ? 'bg-[#213874] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : matches.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">
                    Found {matches.length} recommended books
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Powered by AI
                  </Badge>
                </div>
                {matches.map((book) => (
                  <Card key={book.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{book.title}</h3>
                              <p className="text-sm text-gray-600">by {book.author}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  book.relevance >= 90 ? 'bg-green-100 text-green-700' :
                                  book.relevance >= 70 ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {book.relevance}% Match
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Why this book:</span> {book.reason}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                            <Badge variant="outline">{book.category}</Badge>
                            <Badge variant="outline">{book.difficulty}</Badge>
                            {book.pages && <span>• {book.pages} pages</span>}
                            {book.rating && (
                              <div className="flex items-center gap-1">
                                • {getRatingStars(book.rating)}
                                <span className="ml-1">{book.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Get
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  Enter a topic or subject to find personalized book recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
