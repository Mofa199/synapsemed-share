"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Star } from "lucide-react"

export default function LibraryBookmarksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#213874] mb-8 flex items-center gap-2">
          <Star className="h-8 w-8 text-yellow-500" />
          My Bookmarks
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <Bookmark className="h-12 w-12 mb-4 opacity-20" />
            <CardTitle className="text-xl mb-2">No bookmarks yet</CardTitle>
            <p>Save articles, books, or videos to see them here.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
