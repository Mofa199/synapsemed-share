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
import { BookOpen, FileText, Newspaper, Filter, TrendingUp, Clock, Star, Video, Brain, Plus, Edit, Trash2, Search, ArrowRight, Database, Layers, Target, Activity } from "lucide-react"
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
  createdAt: string
  updatedAt: string
  isPublished: boolean
  views?: number
  resourceType?: string
}

export default function LibraryPage() {
  const { user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [articles, setArticles] = useState<ContentItem[]>([])
  const [books, setBooks] = useState<ContentItem[]>([])
  const [videos, setVideos] = useState<ContentItem[]>([])

  useEffect(() => {
    if (user) {
      setIsAdmin(['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role))
    }
    fetchLibraryContent()
  }, [user])

  const fetchLibraryContent = async () => {
    try {
      setLoading(true)
      const [articlesRes, booksRes, videosRes] = await Promise.all([
        fetch('/api/articles'), fetch('/api/books'), fetch('/api/videos')
      ])

      const articlesData = articlesRes.ok ? await articlesRes.json() : { articles: [] }
      const booksData = booksRes.ok ? await booksRes.json() : { books: [] }
      const videosData = videosRes.ok ? await videosRes.json() : { videos: [] }

      setArticles(articlesData.articles || [])
      setBooks(booksData.books || [])
      setVideos(videosData.videos || [])
    } catch (error) {
      console.error('Error fetching library content:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Anatomy", "Physiology", "Pathology", "Pharmacology", "Internal Medicine", "Surgery", "Pediatrics"
  ]

  if (loading) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">Synchronizing Archive...</p>
       </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh text-white selection:bg-primary/30">
      <Navigation />

      <div className="container mx-auto px-6 pt-40 pb-20">
        {/* Intelligence Archive Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 animate-in fade-in slide-in-from-top-8 duration-1000">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1">
                 <Database className="h-3 w-3 text-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Intelligence Archive v4.2</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                 Medical <span className="text-glow text-primary">Knowledge Grid.</span>
              </h1>
              <p className="text-gray-500 max-w-xl text-lg leading-relaxed font-semibold">
                 Access thousands of verified clinical assets indexed for rapid neural retrieval and professional mastery.
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              {isAdmin && (
                <Button size="lg" className="bg-primary text-white font-bold rounded-2xl px-8 shadow-2xl shadow-primary/20 hover:scale-105 transition-all border border-white/10" asChild>
                   <Link href="/admin/content/add"><Plus className="mr-2 h-5 w-5" /> Sync Data</Link>
                </Button>
              )}
           </div>
        </div>

        {/* Search & Filter Matrix */}
        <div className="mb-16 glass p-2 rounded-3xl flex flex-col md:flex-row gap-2 animate-in fade-in duration-1000 delay-200">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors h-5 w-5" />
              <Input
                placeholder="Search the grid by clinical keyword, author, or category..."
                className="bg-transparent border-none h-16 pl-14 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full md:w-56 glass h-16 rounded-2xl border-none font-bold text-gray-500">
                  <SelectValue placeholder="Neural Layer" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-foreground">
                  <SelectItem value="all">All Layers</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
           {/* Grid Content Matrix */}
           <div className="lg:col-span-9 space-y-12">
              <Tabs defaultValue="all" className="space-y-12">
                 <TabsList className="bg-gray-100 p-1.5 rounded-2xl w-full max-w-2xl border border-gray-200">
                    {['all', 'books', 'articles', 'videos'].map(tab => (
                      <TabsTrigger key={tab} value={tab} className="rounded-xl font-bold uppercase tracking-widest text-[10px] py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-gray-500 transition-all flex-1">
                         {tab}
                      </TabsTrigger>
                    ))}
                 </TabsList>

                 <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[...articles, ...books].slice(0, 8).map((item) => (
                         <IntelligenceCard key={item.id} item={item} isAdmin={isAdmin} />
                       ))}
                    </div>
                 </TabsContent>
                 
                 {['books', 'articles', 'videos'].map(tab => (
                    <TabsContent key={tab} value={tab} className="mt-0">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {(tab === 'articles' ? articles : tab === 'books' ? books : videos).map(item => (
                            <IntelligenceCard key={item.id} item={item} isAdmin={isAdmin} />
                          ))}
                       </div>
                    </TabsContent>
                 ))}
              </Tabs>
           </div>

           {/* Metrics & Meta Column */}
           <div className="lg:col-span-3 space-y-12">
              <Card className="glass-card p-1">
                 <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold tracking-tight flex items-center gap-4 uppercase text-xs text-secondary">
                       <Activity className="w-4 h-4" /> Trending Grid
                    </h3>
                 </div>
                 <div className="p-8 space-y-8">
                    {[...articles, ...books].slice(0, 5).map((item, i) => (
                      <Link key={i} href={`/library/${item.id}`} className="flex items-start gap-5 group">
                         <span className="text-2xl font-black text-white/5 group-hover:text-primary transition-colors">0{i+1}</span>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{item.title}</h4>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{item.views || 0} SYNCED</p>
                         </div>
                      </Link>
                    ))}
                 </div>
              </Card>

              <Card className="glass-card p-10 space-y-6 bg-primary/10 border-primary/20 group hover:scale-[1.02] transition-all">
                 <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
                    <Brain className="text-primary w-7 h-7 group-hover:text-white transition-all shadow-[0_0_15px_currentColor]" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="font-bold text-2xl">AI Neural Search</h3>
                    <p className="text-sm text-white/40 leading-relaxed">Let our AI synthesize a personalized learning pathway from the knowledge grid for you.</p>
                 </div>
                 <Button className="w-full h-14 bg-primary text-white font-bold rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-xl shadow-primary/10">
                    Initiate Synthesis
                 </Button>
              </Card>
           </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}

function IntelligenceCard({ item, isAdmin }: { item: any, isAdmin: boolean }) {
  const isVideo = item.url || item.resourceType === 'VIDEO'
  const isBook = item.resourceType === 'BOOK' || item.isbn
  const Icon = isVideo ? Video : isBook ? BookOpen : FileText
  
  return (
    <Card className="glass-card p-1 group border-white/5 overflow-hidden hover:-translate-y-2 transition-all duration-500">
       <div className="p-8 space-y-6 relative h-full flex flex-col">
          <div className="flex items-center justify-between">
             <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
                <Icon className="w-6 h-6 text-primary group-hover:text-white transition-all" />
             </div>
             <Badge className="bg-white/5 text-white/40 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {isVideo ? "Stream" : isBook ? "Archive" : "Data"}
             </Badge>
          </div>
          <div className="space-y-3 flex-1">
             <h3 className="text-2xl font-bold tracking-tight group-hover:text-glow transition-all line-clamp-1">{item.title}</h3>
             <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{item.description || "Secure clinical intelligence record."}</p>
          </div>
          <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
             <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full glass flex items-center justify-center text-[10px] font-bold">
                   {item.author?.[0] || "S"}
                </div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.author || "System"}</span>
             </div>
             <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.views || 0} SYNCED</span>
                <Link href={`/library/${item.id}`} className="p-2 glass rounded-xl hover:bg-secondary hover:text-white transition-all">
                   <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </div>
       </div>
    </Card>
  )
}