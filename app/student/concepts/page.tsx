"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Lightbulb, 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Share2, 
  MoreHorizontal,
  Clock,
  BarChart3,
  Heart,
  Flag,
  Sparkles
} from "lucide-react";

const concepts = [
  { 
    id: 1, 
    title: "Cardiac Cycle", 
    category: "Cardiology", 
    difficulty: "Intermediate",
    readTime: "8 min",
    description: "Detailed explanation of the cardiac cycle including systole and diastole phases.",
    tags: ["Heart", "Physiology", "Blood Flow"]
  },
  { 
    id: 2, 
    title: "Glycolysis Pathway", 
    category: "Biochemistry", 
    difficulty: "Advanced",
    readTime: "12 min",
    description: "Comprehensive overview of glycolysis, including enzymes, regulation, and clinical significance.",
    tags: ["Metabolism", "Enzymes", "ATP"]
  },
  { 
    id: 3, 
    title: "Antibiotic Mechanisms", 
    category: "Pharmacology", 
    difficulty: "Intermediate",
    readTime: "10 min",
    description: "Classification of antibiotics by mechanism of action and spectrum of activity.",
    tags: ["Drugs", "Infection", "Bacteria"]
  },
  { 
    id: 4, 
    title: "Neuron Action Potential", 
    category: "Neurology", 
    difficulty: "Advanced",
    readTime: "15 min",
    description: "Detailed explanation of action potential generation and propagation in neurons.",
    tags: ["Nervous System", "Electrophysiology", "Ion Channels"]
  },
  { 
    id: 5, 
    title: "Acid-Base Disorders", 
    category: "Physiology", 
    difficulty: "Intermediate",
    readTime: "11 min",
    description: "Understanding metabolic and respiratory acid-base disturbances and compensation.",
    tags: ["pH", "Bicarbonate", "Clinical"]
  },
  { 
    id: 6, 
    title: "Immune Response", 
    category: "Immunology", 
    difficulty: "Beginner",
    readTime: "9 min",
    description: "Overview of innate and adaptive immune responses including cell types and functions.",
    tags: ["Lymphocytes", "Antibodies", "Inflammation"]
  },
];

const categories = [
  { name: "All", count: 45 },
  { name: "Anatomy", count: 8 },
  { name: "Biochemistry", count: 12 },
  { name: "Cardiology", count: 7 },
  { name: "Pharmacology", count: 9 },
  { name: "Physiology", count: 11 },
  { name: "Immunology", count: 6 },
  { name: "Neurology", count: 5 },
];

export default function ConceptsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [bookmarkedConcepts, setBookmarkedConcepts] = useState<string[]>([]);
  const [favoritedConcepts, setFavoritedConcepts] = useState<string[]>([]);
  const userId = "student-001"; // In real app, get from auth

  useEffect(() => {
    fetchBookmarks();
    fetchFavorites();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/user/bookmarks?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const conceptBookmarks = data.filter((b: any) => b.resourceType === 'CONCEPT');
        setBookmarkedConcepts(conceptBookmarks.map((b: any) => b.conceptId || b.id));
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const fetchFavorites = async () => {
    if (typeof window === 'undefined') return;
    // In a real implementation, create GET endpoint for concept favorites
    // For now, we'll use localStorage as fallback
    const stored = localStorage.getItem('conceptFavorites');
    if (stored) {
      setFavoritedConcepts(JSON.parse(stored));
    }
  };

  const handleReadConcept = (conceptId: number) => {
    router.push(`/student/concepts/${conceptId}`);
  };

  const handleToggleBookmark = async (conceptId: number) => {
    try {
      const isBookmarked = bookmarkedConcepts.includes(conceptId.toString());
      const url = '/api/user/bookmarks';
      const method = isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          resourceType: 'CONCEPT',
          conceptId: conceptId.toString()
        })
      });

      if (response.ok) {
        if (isBookmarked) {
          setBookmarkedConcepts(bookmarkedConcepts.filter(id => id !== conceptId.toString()));
          toast({
            title: "Bookmark removed",
            description: "Concept has been removed from bookmarks",
          });
        } else {
          setBookmarkedConcepts([...bookmarkedConcepts, conceptId.toString()]);
          toast({
            title: "Bookmarked",
            description: "Concept has been added to your bookmarks",
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

  const handleToggleFavorite = async (conceptId: number) => {
    try {
      const response = await fetch('/api/user/concept-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conceptId: conceptId.toString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.favorited) {
          const updated = [...favoritedConcepts, conceptId.toString()];
          setFavoritedConcepts(updated);
          if (typeof window !== 'undefined') {
            localStorage.setItem('conceptFavorites', JSON.stringify(updated));
          }
          toast({
            title: "Added to favorites",
            description: "Concept has been added to your favorites",
          });
        } else {
          const updated = favoritedConcepts.filter(id => id !== conceptId.toString());
          setFavoritedConcepts(updated);
          if (typeof window !== 'undefined') {
            localStorage.setItem('conceptFavorites', JSON.stringify(updated));
          }
          toast({
            title: "Removed from favorites",
            description: "Concept has been removed from your favorites",
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

  const handleShare = async (concept: any) => {
    const shareData = {
      title: concept.title,
      text: concept.description,
      url: typeof window !== 'undefined' ? `${window.location.origin}/student/concepts/${concept.id}` : ""
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Concept has been shared",
        });
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Concept link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAIExplain = (concept: any) => {
    toast({
      title: "AI Explanation",
      description: "Generating AI explanation for this concept...",
    });
    setTimeout(() => {
      router.push(`/student/ai-tutor?context=concept&conceptId=${concept.id}`);
    }, 1000);
  };

  const handleReport = (concept: any) => {
    toast({
      title: "Report Concept",
      description: "Thank you for your feedback. We'll review this concept.",
    });
  };

  const filteredConcepts = concepts.filter(concept => {
    const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          concept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          concept.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || concept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort concepts based on selected option
  const sortedConcepts = [...filteredConcepts].sort((a, b) => {
    if (sortBy === "recent") return b.id - a.id;
    if (sortBy === "popular") return b.id - a.id; // Placeholder logic
    if (sortBy === "difficulty") {
      const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
      return difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - 
             difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
    }
    return 0;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Concept Pages</h1>
        <p className="text-gray-600">Deep dive into key medical concepts with detailed explanations</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search concepts..."
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
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="difficulty">By Difficulty</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
          >
            All Concepts
          </Button>
          {categories.slice(1).map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedConcepts.map((concept) => (
          <Card key={concept.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleReadConcept(concept.id)}>
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    {concept.title}
                  </CardTitle>
                  <CardDescription>{concept.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleFavorite(concept.id)}>
                      <Heart className={`h-4 w-4 mr-2 ${
                        favoritedConcepts.includes(concept.id.toString()) ? 'fill-current text-red-500' : ''
                      }`} />
                      {favoritedConcepts.includes(concept.id.toString()) ? 'Unfavorite' : 'Favorite'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAIExplain(concept)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Explain
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleReport(concept)}>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {concept.category}
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                  {concept.difficulty}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {concept.readTime}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {concept.tags.map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleReadConcept(concept.id)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read
                </Button>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleToggleBookmark(concept.id)}
                    className={bookmarkedConcepts.includes(concept.id.toString()) ? 'text-blue-600' : ''}
                  >
                    <Bookmark className={`h-4 w-4 ${
                      bookmarkedConcepts.includes(concept.id.toString()) ? 'fill-current' : ''
                    }`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleShare(concept)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedConcepts.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No concepts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Learning Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-gray-600">Concepts Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-sm text-gray-600">Retention Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Lightbulb className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-gray-600">Bookmarks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}