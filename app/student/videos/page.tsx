"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Play, 
  Clock, 
  Bookmark, 
  Filter, 
  BookOpen, 
  Heart,
  Share2,
  MoreHorizontal,
  Sparkles,
  Flag
} from "lucide-react";

const videoCategories = [
  { id: 1, name: "Anatomy", count: 42 },
  { id: 2, name: "Anesthesiology", count: 18 },
  { id: 3, name: "Biochemistry", count: 35 },
  { id: 4, name: "Cardiology", count: 28 },
  { id: 5, name: "Dermatology", count: 15 },
  { id: 6, name: "Endocrinology", count: 22 },
  { id: 7, name: "Gastroenterology", count: 25 },
  { id: 8, name: "Hematology", count: 19 },
];

const videos = [
  { 
    id: 1, 
    title: "Cardiac Anatomy Overview", 
    duration: "12:45", 
    views: "1.2K", 
    category: "Anatomy",
    thumbnail: "https://placehold.co/300x200/213874/white?text=Cardiac+Anatomy",
    description: "Comprehensive overview of cardiac anatomy including chambers, valves, and blood flow."
  },
  { 
    id: 2, 
    title: "ECG Interpretation Basics", 
    duration: "18:30", 
    views: "2.1K", 
    category: "Cardiology",
    thumbnail: "https://placehold.co/300x200/213874/white?text=ECG+Basics",
    description: "Learn to interpret basic ECG patterns and identify common abnormalities."
  },
  { 
    id: 3, 
    title: "Pharmacokinetics Principles", 
    duration: "15:20", 
    views: "890", 
    category: "Pharmacology",
    thumbnail: "https://placehold.co/300x200/213874/white?text=Pharmacokinetics",
    description: "Understanding drug absorption, distribution, metabolism, and excretion."
  },
  { 
    id: 4, 
    title: "Neuroanatomy: Brain Structures", 
    duration: "22:15", 
    views: "3.4K", 
    category: "Anatomy",
    thumbnail: "https://placehold.co/300x200/213874/white?text=Brain+Structures",
    description: "Detailed exploration of major brain structures and their functions."
  },
  { 
    id: 5, 
    title: "Acid-Base Balance", 
    duration: "14:40", 
    views: "1.5K", 
    category: "Biochemistry",
    thumbnail: "https://placehold.co/300x200/213874/white?text=Acid-Base",
    description: "Understanding acid-base disorders and their clinical implications."
  },
  { 
    id: 6, 
    title: "Dermatological Lesions", 
    duration: "19:55", 
    views: "980", 
    category: "Dermatology",
    thumbnail: "https://placehold.co/300x200/213874/white?text=Derm+Lesions",
    description: "Identifying common skin lesions and their clinical significance."
  },
];

export default function VideosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookmarkedVideos, setBookmarkedVideos] = useState<string[]>([]);
  const userId = "student-001"; // In real app, get from auth

  // Fetch favorites and bookmarks on mount
  useEffect(() => {
    fetchFavorites();
    fetchBookmarks();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/user/favorites?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map((f: any) => f.videoId));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/user/bookmarks?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const videoBookmarks = data.filter((b: any) => b.resourceType === 'VIDEO');
        setBookmarkedVideos(videoBookmarks.map((b: any) => b.videoId));
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleWatch = (videoId: number) => {
    router.push(`/student/videos/${videoId}`);
  };

  const handleToggleFavorite = async (videoId: number) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          videoId: videoId.toString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.favorited) {
          setFavorites([...favorites, videoId.toString()]);
          toast({
            title: "Added to favorites",
            description: "Video has been added to your favorites",
          });
        } else {
          setFavorites(favorites.filter(id => id !== videoId.toString()));
          toast({
            title: "Removed from favorites",
            description: "Video has been removed from your favorites",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  const handleToggleBookmark = async (videoId: number) => {
    try {
      const isBookmarked = bookmarkedVideos.includes(videoId.toString());
      const url = '/api/user/bookmarks';
      const method = isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          resourceType: 'VIDEO',
          videoId: videoId.toString()
        })
      });

      if (response.ok) {
        if (isBookmarked) {
          setBookmarkedVideos(bookmarkedVideos.filter(id => id !== videoId.toString()));
          toast({
            title: "Bookmark removed",
            description: "Video has been removed from bookmarks",
          });
        } else {
          setBookmarkedVideos([...bookmarkedVideos, videoId.toString()]);
          toast({
            title: "Bookmarked",
            description: "Video has been added to your bookmarks",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (video: any) => {
    const shareData = {
      title: video.title,
      text: video.description,
      url: typeof window !== 'undefined' ? `${window.location.origin}/student/videos/${video.id}` : ""
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Video has been shared",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Video link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAIExplain = (video: any) => {
    toast({
      title: "AI Explanation",
      description: "Generating AI explanation for this video...",
    });
    // In real implementation, navigate to AI tutor with video context
    setTimeout(() => {
      router.push(`/student/ai-tutor?context=video&videoId=${video.id}`);
    }, 1000);
  };

  const handleReport = (video: any) => {
    toast({
      title: "Report Video",
      description: "Thank you for your feedback. We'll review this video.",
    });
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Library</h1>
        <p className="text-gray-600">Explore our comprehensive collection of medical education videos</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search videos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
          >
            All Videos
          </Button>
          {videoCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative cursor-pointer" onClick={() => handleWatch(video.id)}>
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                <Clock className="h-3 w-3 inline mr-1" />
                {video.duration}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`absolute top-2 right-2 ${
                  bookmarkedVideos.includes(video.id.toString())
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-black bg-opacity-50 hover:bg-opacity-70 text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleBookmark(video.id);
                }}
              >
                <Bookmark className={`h-4 w-4 ${
                  bookmarkedVideos.includes(video.id.toString()) ? 'fill-current' : ''
                }`} />
              </Button>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all">
                <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{video.title}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                <span>{video.views} views</span>
                <span className="px-2 py-1 bg-gray-100 rounded">{video.category}</span>
              </div>
              <div className="flex justify-between">
                <Button onClick={() => handleWatch(video.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  Watch
                </Button>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleToggleFavorite(video.id)}
                    className={favorites.includes(video.id.toString()) ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${
                      favorites.includes(video.id.toString()) ? 'fill-current' : ''
                    }`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleShare(video)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAIExplain(video)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Explain
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReport(video)}>
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No videos found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}