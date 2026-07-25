"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Play, 
  HelpCircle, 
  Lightbulb, 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Clock,
  CheckCircle,
  Star,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck
} from "lucide-react";


export default function MyContentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(false);
  const [contentItems, setContentItems] = useState<any[]>([]);

  useEffect(() => {
    fetchUserContent()
  }, [])

  const fetchUserContent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/content')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setContentItems(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setContentItems([])
    } finally {
      setLoading(false)
    }
  }

  const contentTypes = [
    { name: "All", count: contentItems.length },
    { name: "Videos", count: contentItems.filter(i => i.type === "Video" || i.resourceType === "VIDEO").length },
    { name: "Concepts", count: contentItems.filter(i => i.type === "Concept" || i.resourceType === "TOPIC").length },
    { name: "Question Banks", count: contentItems.filter(i => i.type === "Question Bank" || i.resourceType === "QUESTION_BANK").length },
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = selectedType === "All" || 
                       (selectedType === "Videos" && (item.type === "Video" || item.resourceType === "VIDEO")) ||
                       (selectedType === "Concepts" && (item.type === "Concept" || item.resourceType === "TOPIC")) ||
                       (selectedType === "Question Banks" && (item.type === "Question Bank" || item.resourceType === "QUESTION_BANK"));
    return matchesSearch && matchesType;
  });

  // Sort content based on selected option
  const sortedContent = [...filteredContent].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    if (sortBy === "progress") return b.progress - a.progress;
    if (sortBy === "duration") {
      // Simple duration sorting (would need more complex logic in real app)
      return a.duration.localeCompare(b.duration);
    }
    return 0;
  });

  const handleContinue = (item: any) => {
    // Navigate to the appropriate page based on content type
    if (item.resourceId) {
      // If we have a specific resource ID, navigate to that resource
      switch (item.resourceType) {
        case 'VIDEO':
          router.push(`/student/videos/${item.resourceId}`)
          break
        case 'TOPIC':
          router.push(`/topic/${item.resourceId}`)
          break
        case 'QUESTION_BANK':
          router.push(`/question-bank/${item.resourceId}`)
          break
        default:
          router.push(item.url || '/student/dashboard')
      }
    } else {
      // Fallback to general page
      router.push(item.url || '/student/dashboard')
    }
  }

  const handleToggleBookmark = async (item: any) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: item.resourceType,
          resourceId: item.resourceId,
          bookmarked: !item.bookmarked
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: item.bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        })
        // Update local state
        setContentItems(prev => prev.map(c => 
          c.id === item.id ? { ...c, bookmarked: !c.bookmarked } : c
        ))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video": return <Play className="h-4 w-4 text-red-500" />;
      case "Concept": return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "Question Bank": return <HelpCircle className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
        <p className="text-gray-600">Your saved and in-progress learning materials</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search your content..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <select 
              className="border border-gray-300 rounded-md p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Recently Accessed</option>
              <option value="progress">By Progress</option>
              <option value="duration">By Duration</option>
            </select>
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("All")}
          >
            All Content
          </Button>
          {contentTypes.slice(1).map((type) => (
            <Button
              key={type.name}
              variant={selectedType === type.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.name)}
            >
              {type.name} ({type.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedContent.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100 mr-4">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.bookmarked && <Bookmark className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {item.type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.duration}
                      </span>
                      {item.progress > 0 && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {item.progress}% complete
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags && item.tags.map((tag: string, index: number) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-600">
                        Last accessed: {item.lastAccessed ? new Date(item.lastAccessed).toLocaleDateString() : 'N/A'}
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContinue(item)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {item.progress > 0 ? "Continue" : "Start"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleBookmark(item)}
                        >
                          {item.bookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-yellow-500 fill-current" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && sortedContent.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No content found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Learning Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{contentItems.length}</p>
              <p className="text-sm text-gray-600">Items Saved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Play className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{contentItems.filter(i => i.type === "Video").length}</p>
              <p className="text-sm text-gray-600">Videos Watched</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{contentItems.filter(i => i.type === "Concept").length}</p>
              <p className="text-sm text-gray-600">Concepts Read</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <HelpCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{contentItems.filter(i => i.type === "Question Bank").reduce((acc, item) => acc + (item.progress || 0), 0)}</p>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
