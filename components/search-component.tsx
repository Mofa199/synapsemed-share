"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, FileText, Pill, PlayCircle } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: number
  title?: string
  name?: string
  author?: string
  category: string
  type: string
  class?: string
  difficulty?: string
}

interface SearchComponentProps {
  placeholder?: string
  className?: string
}

export function SearchComponent({ placeholder = "Search...", className = "" }: SearchComponentProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data.results || [])
          setShowResults(true)
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="w-4 h-4" />
      case "article":
        return <FileText className="w-4 h-4" />
      case "drug":
        return <Pill className="w-4 h-4" />
      case "topic":
        return <PlayCircle className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getUrl = (result: SearchResult) => {
    switch (result.type) {
      case "book":
        return `/book/${result.id}`
      case "article":
        return `/article/${result.id}`
      case "drug":
        return `/drug/${result.id}`
      case "topic":
        return `/topic/${result.id}`
      default:
        return "#"
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10"
        />
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => (
                  <Link key={`${result.type}-${result.id}`} href={getUrl(result)}>
                    <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-[#213874] mt-1">{getIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-[#213874] truncate">{result.title || result.name}</h4>
                          {result.author && <p className="text-xs text-gray-600">by {result.author}</p>}
                          {result.class && <p className="text-xs text-gray-600">{result.class}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {result.category}
                            </Badge>
                            {result.difficulty && (
                              <Badge variant="outline" className="text-xs">
                                {result.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="p-4 text-center text-gray-500">No results found</div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
