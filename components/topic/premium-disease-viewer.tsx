"use client"

import { useState, useEffect } from "react"
import { ClinicalSnapshot } from "./clinical-snapshot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ChevronRight, Bookmark, Share2, Download, CloudOff, Clock, 
  Activity, ArrowRight, PlayCircle, FileText, CheckCircle2 
} from "lucide-react"

interface PremiumDiseaseViewerProps {
  topic: any
  userProgress?: any
  isBookmarked?: boolean
  onBookmark?: () => void
  onComplete?: () => void
}

// Utility to parse the raw HTML into logical sections based on h3 tags
function parseContentToSections(htmlContent: string) {
  const sections: { id: string; title: string; content: string }[] = []
  
  // Create a temporary DOM element to parse the HTML
  if (typeof window !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = htmlContent
    
    // Find all h3 tags
    const h3s = div.querySelectorAll('h3')
    
    if (h3s.length === 0) {
      // Fallback if no h3 tags
      sections.push({ id: 'overview', title: 'Overview', content: htmlContent })
      return sections
    }
    
    h3s.forEach((h3, index) => {
      const title = h3.textContent || 'Section'
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      // Get all content until the next h3
      let contentHtml = ''
      let currentNode = h3.nextSibling
      while (currentNode && currentNode.nodeName.toLowerCase() !== 'h3') {
        if (currentNode.nodeType === 1) { // Element node
          contentHtml += (currentNode as Element).outerHTML
        } else if (currentNode.nodeType === 3) { // Text node
          contentHtml += currentNode.textContent
        }
        currentNode = currentNode.nextSibling
      }
      
      sections.push({
        id,
        title,
        content: contentHtml.trim() || '<p className="text-gray-400 italic">Content pending...</p>'
      })
    })
  } else {
    // SSR fallback (crude regex parse)
    sections.push({ id: 'loading', title: 'Loading...', content: '<p>Loading content...</p>' })
  }
  
  return sections
}

export function PremiumDiseaseViewer({ 
  topic, 
  userProgress, 
  isBookmarked, 
  onBookmark,
  onComplete
}: PremiumDiseaseViewerProps) {
  const [sections, setSections] = useState<{ id: string; title: string; content: string }[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  
  useEffect(() => {
    if (topic?.content) {
      const parsed = parseContentToSections(topic.content)
      setSections(parsed)
      if (parsed.length > 0) setActiveSection(parsed[0].id)
    }
  }, [topic])
  
  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(`section-${id}`)
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100 // offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const completionPercentage = userProgress?.completionPercentage || 0
  const isCompleted = userProgress?.status === 'COMPLETED'

  // Extract specific sections for the snapshot
  const definitionSection = sections.find(s => s.title.toLowerCase().includes('definition'))?.content
  const epidemiologySection = sections.find(s => s.title.toLowerCase().includes('epidemiology'))?.content

  return (
    <div className="relative">
      {/* Sticky Premium Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-[#213874] m-0">{topic.title}</h1>
            <Badge variant="outline" className="hidden md:inline-flex bg-gray-50">{topic.type}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center text-sm text-gray-500 mr-4">
              <Clock className="w-4 h-4 mr-1" /> {topic.duration || '15 min read'}
            </div>
            <Button variant="ghost" size="icon" onClick={onBookmark} className={isBookmarked ? "text-red-500" : "text-gray-500"}>
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hidden sm:flex">
              <CloudOff className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex border-blue-200 text-[#213874]">
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
        </div>
        {/* Reading Progress Bar */}
        <div className="h-1 bg-gray-100 w-full">
          <div className="h-1 bg-blue-500" style={{ width: `${completionPercentage}%` }} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Navigation (Progressive Disclosure) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <Card className="border-none shadow-sm bg-gray-50/50">
              <CardContent className="p-4">
                <h3 className="font-bold text-[#213874] mb-4 text-sm uppercase tracking-wider">Clinical Flow</h3>
                <nav className="space-y-1">
                  {sections.map((section, idx) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-between ${
                        activeSection === section.id 
                          ? "bg-blue-100 text-blue-700 font-semibold" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">{section.title}</span>
                      {activeSection === section.id && <ChevronRight className="w-3 h-3" />}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <ClinicalSnapshot 
            definition={definitionSection} 
            epidemiology={epidemiologySection}
            difficulty={topic.difficulty}
            topicType={topic.type}
          />

          <div className="space-y-10">
            {sections.map((section) => {
              // We render standard sections differently based on title for the "Premium UI" feel
              const titleLower = section.title.toLowerCase()
              
              if (titleLower.includes('management') || titleLower.includes('treatment')) {
                return (
                  <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-[#213874] mb-4 border-b pb-2">{section.title}</h2>
                    <Tabs defaultValue="medical" className="w-full mt-4">
                      <TabsList className="bg-gray-100 p-1 w-full justify-start overflow-x-auto rounded-lg">
                        <TabsTrigger value="emergency" className="rounded-md">Emergency</TabsTrigger>
                        <TabsTrigger value="medical" className="rounded-md">Medical</TabsTrigger>
                        <TabsTrigger value="surgical" className="rounded-md">Surgical</TabsTrigger>
                        <TabsTrigger value="supportive" className="rounded-md">Supportive</TabsTrigger>
                      </TabsList>
                      <TabsContent value="medical" className="mt-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="prose prose-blue max-w-none prose-h4:text-blue-800" dangerouslySetInnerHTML={{ __html: section.content }} />
                      </TabsContent>
                      <TabsContent value="emergency" className="mt-4 p-6 bg-red-50 rounded-xl border border-red-100">
                         <p className="text-red-700 italic">Emergency protocols loading...</p>
                      </TabsContent>
                      <TabsContent value="surgical" className="mt-4 p-6 bg-orange-50 rounded-xl border border-orange-100">
                         <p className="text-orange-700 italic">Surgical indications loading...</p>
                      </TabsContent>
                      <TabsContent value="supportive" className="mt-4 p-6 bg-green-50 rounded-xl border border-green-100">
                         <p className="text-green-700 italic">Supportive care guidelines loading...</p>
                      </TabsContent>
                    </Tabs>
                  </section>
                )
              }

              if (titleLower.includes('pathophysiology')) {
                return (
                  <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-[#213874] mb-4 border-b pb-2">{section.title}</h2>
                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-white overflow-hidden shadow-sm">
                      <CardContent className="p-6">
                        <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                        <Button variant="outline" className="mt-4 border-blue-200 text-blue-700 bg-white">
                          <PlayCircle className="w-4 h-4 mr-2" /> View Interactive Animation
                        </Button>
                      </CardContent>
                    </Card>
                  </section>
                )
              }

              // Default rendering for other sections
              return (
                <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24 group">
                  <h2 className="text-2xl font-bold text-[#213874] mb-4 border-b border-gray-100 pb-2 group-hover:border-blue-300 transition-colors">
                    {section.title}
                  </h2>
                  <div className="prose prose-lg text-gray-700 max-w-none prose-headings:text-[#213874] prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-li:marker:text-blue-400" dangerouslySetInnerHTML={{ __html: section.content }} />
                </section>
              )
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">
             {!isCompleted && (
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#213874] hover:bg-[#1a6ac3] text-lg rounded-xl shadow-lg" 
                  onClick={onComplete}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Mark as Complete (+{topic.difficulty === 'BEGINNER' ? 20 : topic.difficulty === 'INTERMEDIATE' ? 30 : 40} points)
                </Button>
              )}
          </div>
        </main>
        
        {/* Right Sidebar (Smart Features) */}
        <aside className="hidden xl:block w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            <Card className="border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-blue-800">Smart Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="secondary" className="w-full justify-start bg-white hover:bg-blue-100 text-blue-900 border border-blue-200">
                  <FileText className="w-4 h-4 mr-2" /> Generate Flashcards
                </Button>
                <Button variant="secondary" className="w-full justify-start bg-white hover:bg-blue-100 text-blue-900 border border-blue-200">
                  <Activity className="w-4 h-4 mr-2" /> Take Topic Quiz
                </Button>
                <Button variant="secondary" className="w-full justify-start bg-white hover:bg-blue-100 text-blue-900 border border-blue-200">
                  <ArrowRight className="w-4 h-4 mr-2" /> Clinical Reasoning Coach
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-gray-500">Related Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Apply your knowledge with interactive patient cases.</p>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 cursor-pointer transition-colors">
                    <p className="text-sm font-semibold text-[#213874]">Case 14: A 45yo male with...</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 cursor-pointer transition-colors">
                    <p className="text-sm font-semibold text-[#213874]">OSCE Station 7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

      </div>
    </div>
  )
}
