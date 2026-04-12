"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Loader2, BookOpen, Video, FileText, Layout, Trash2, Star } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function LibraryBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/user/bookmarks")
      if (res.ok) {
        const result = await res.json()
        if (result.success) setBookmarks(result.data)
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const removeBookmark = async (e: React.MouseEvent, type: string, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await fetch("/api/user/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceType: type, resourceId: id })
      })
      if (res.ok) {
        setBookmarks(bookmarks.filter(b => !(b.type === type && b.resourceId === id)))
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-5 w-5 text-red-500" />
      case 'ARTICLE': return <FileText className="h-5 w-5 text-blue-500" />
      case 'BOOK': return <BookOpen className="h-5 w-5 text-green-500" />
      default: return <Layout className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#213874] mb-8 flex items-center gap-2">
          <Star className="h-8 w-8 text-yellow-500" />
          My Bookmarks
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-8 w-8 text-[#213874] animate-spin mb-4" />
            <p className="text-gray-500">Loading your bookmarks...</p>
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((item) => (
              <Link key={item.id} href={item.url} className="group">
                <Card className="hover:shadow-md transition-all border-slate-200 h-full relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      {getIcon(item.type)}
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                          {item.type}
                        </Badge>
                        <button 
                          onClick={(e) => removeBookmark(e, item.type, item.resourceId)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight text-[#213874] line-clamp-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600 font-medium">
                        Added on {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      {item.category && (
                        <p className="text-xs text-slate-500 italic">{item.category}</p>
                      )}
                      <div className="pt-2">
                        <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                          View details →
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-400 border-dashed">
            <Bookmark className="h-12 w-12 mb-4 opacity-20" />
            <CardTitle className="text-xl mb-2">Your library is empty</CardTitle>
            <p className="mb-6 max-w-xs mx-auto text-slate-500 italic tracking-tight">Bookmarks help you keep track of resources you want to return to later.</p>
            <Button className="bg-[#213874]" asChild>
              <Link href="/library">Find something to save</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
