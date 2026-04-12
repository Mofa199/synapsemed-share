"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Loader2, BookOpen, Video, FileText, Layout } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function LibraryRecentPage() {
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/user/activity")
        if (res.ok) {
          const result = await res.json()
          if (result.success) setActivity(result.data)
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-5 w-5 text-red-500" />
      case 'ARTICLE': return <FileText className="h-5 w-5 text-blue-500" />
      case 'BOOK': return <BookOpen className="h-5 w-5 text-green-500" />
      default: return <Layout className="h-5 w-5 text-slate-500" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#213874] mb-8 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-500" />
          Recently Viewed
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-8 w-8 text-[#213874] animate-spin mb-4" />
            <p className="text-gray-500">Loading your history...</p>
          </div>
        ) : activity.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activity.map((item) => (
              <Link key={item.id} href={item.url}>
                <Card className="hover:shadow-md transition-all border-slate-200 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      {getIcon(item.type)}
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {item.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight text-[#213874] line-clamp-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(item.lastAccessedAt)}
                        </span>
                        <span>{item.progress}% done</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#213874] transition-all" 
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      {item.category && (
                        <p className="text-xs text-slate-500 italic">{item.category}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-400 border-dashed">
            <Clock className="h-12 w-12 mb-4 opacity-20" />
            <CardTitle className="text-xl mb-2">Nothing here yet</CardTitle>
            <p className="mb-6">Your recently viewed resources will appear here as you study.</p>
            <Button className="bg-[#213874]" asChild>
              <Link href="/library">Explore Library</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
