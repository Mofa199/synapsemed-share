"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Plus,
  CheckCircle2,
  Brain,
  Sparkles,
  Heart
} from "lucide-react";

interface Concept {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  readTime: string;
  tags: string;
  summary: string;
  keyPoints: string;
  views: number;
  mnemonics: Mnemonic[];
}

interface Mnemonic {
  id: string;
  title: string;
  mnemonic: string;
  explanation: string;
  example?: string;
  category?: string;
  upvotes: number;
  downvotes: number;
  isVerified: boolean;
  createdAt: Date;
}

import React from "react";

export default function ConceptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: conceptId } = React.use(params);
  const router = useRouter();
  const userId = "student-001"; // In real app, get from auth
  
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [votedMnemonics, setVotedMnemonics] = useState<{ [key: string]: 'up' | 'down' }>({});
  
  // Add mnemonic dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMnemonic, setNewMnemonic] = useState({
    title: "",
    mnemonic: "",
    explanation: "",
    example: "",
    category: "Acronym"
  });

  useEffect(() => {
    fetchConcept();
    checkBookmarkStatus();
    checkFavoriteStatus();
  }, [conceptId]);

  const fetchConcept = async () => {
    try {
      const response = await fetch(`/api/concepts/${conceptId}`);
      if (response.ok) {
        const data = await response.json();
        setConcept(data);
      }
    } catch (error) {
      console.error('Error fetching concept:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/user/bookmarks?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const bookmarked = data.some((b: any) => 
          b.resourceType === 'CONCEPT' && (b.conceptId === conceptId || b.id === conceptId)
        );
        setIsBookmarked(bookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const checkFavoriteStatus = () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('conceptFavorites');
    if (stored) {
      const favorites = JSON.parse(stored);
      setIsFavorited(favorites.includes(conceptId));
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const url = '/api/user/bookmarks';
      const method = isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          resourceType: 'CONCEPT',
          conceptId
        })
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
        toast({
          title: isBookmarked ? "Bookmark removed" : "Bookmarked",
          description: isBookmarked 
            ? "Concept removed from bookmarks" 
            : "Concept added to bookmarks",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await fetch('/api/user/concept-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conceptId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.favorited);
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('conceptFavorites');
          let favorites = stored ? JSON.parse(stored) : [];
          if (data.favorited) {
            favorites.push(conceptId);
          } else {
            favorites = favorites.filter((id: string) => id !== conceptId);
          }
          localStorage.setItem('conceptFavorites', JSON.stringify(favorites));
        }
        
        toast({
          title: data.favorited ? "Added to favorites" : "Removed from favorites",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const shareData = {
      title: concept?.title || "Concept",
      text: concept?.description || "",
      url: window.location.href
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Concept link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleVoteMnemonic = async (mnemonicId: string, voteType: 'up' | 'down') => {
    // Prevent voting twice
    if (votedMnemonics[mnemonicId]) {
      toast({
        title: "Already voted",
        description: "You've already voted on this mnemonic",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/concepts/${conceptId}/mnemonics`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mnemonicId,
          voteType
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        setConcept(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            mnemonics: prev.mnemonics.map(m => 
              m.id === mnemonicId ? data.mnemonic : m
            )
          };
        });
        
        // Mark as voted
        setVotedMnemonics(prev => ({
          ...prev,
          [mnemonicId]: voteType
        }));
        
        toast({
          title: "Vote recorded",
          description: `You ${voteType}voted this mnemonic`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive"
      });
    }
  };

  const handleAddMnemonic = async () => {
    if (!newMnemonic.title || !newMnemonic.mnemonic || !newMnemonic.explanation) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/concepts/${conceptId}/mnemonics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMnemonic,
          userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add to local state
        setConcept(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            mnemonics: [...prev.mnemonics, data.mnemonic]
          };
        });
        
        // Reset form
        setNewMnemonic({
          title: "",
          mnemonic: "",
          explanation: "",
          example: "",
          category: "Acronym"
        });
        
        setIsAddDialogOpen(false);
        
        toast({
          title: "Mnemonic added",
          description: "Your mnemonic has been added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add mnemonic",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Concept not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const tags = typeof concept.tags === 'string' ? JSON.parse(concept.tags) : concept.tags;
  const keyPoints = typeof concept.keyPoints === 'string' ? JSON.parse(concept.keyPoints) : concept.keyPoints;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Concepts
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-8 w-8 text-yellow-500" />
              <h1 className="text-3xl font-bold">{concept.title}</h1>
            </div>
            
            <p className="text-gray-600 text-lg mb-4">{concept.description}</p>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {concept.category}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {concept.difficulty}
              </span>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {concept.readTime}
              </div>
              <span className="text-gray-600 text-sm">{concept.views} views</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                variant={isBookmarked ? "default" : "outline"}
                onClick={handleToggleBookmark}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button 
                variant={isFavorited ? "default" : "outline"}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags && tags.map((tag: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">
                <Brain className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="mnemonics">
                <Sparkles className="h-4 w-4 mr-2" />
                Mnemonics ({concept.mnemonics.length})
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="mt-6">
              {/* Summary */}
              {concept.summary && (
                <Card className="mb-6 border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{concept.summary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Key Points */}
              {keyPoints && keyPoints.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                      Key Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {keyPoints.map((point: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Main Content */}
              <Card>
                <CardContent className="pt-6">
                  <div 
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: concept.content }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mnemonics Tab */}
            <TabsContent value="mnemonics" className="mt-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Memory Aids & Mnemonics</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Mnemonic
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Mnemonic</DialogTitle>
                      <DialogDescription>
                        Share a mnemonic to help others remember this concept
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                          placeholder="e.g., Phases of Cardiac Cycle"
                          value={newMnemonic.title}
                          onChange={(e) => setNewMnemonic({...newMnemonic, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Mnemonic</label>
                        <Input
                          placeholder="e.g., A Is Very Important Forever"
                          value={newMnemonic.mnemonic}
                          onChange={(e) => setNewMnemonic({...newMnemonic, mnemonic: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Explanation</label>
                        <Textarea
                          placeholder="Explain what each letter/word stands for..."
                          rows={4}
                          value={newMnemonic.explanation}
                          onChange={(e) => setNewMnemonic({...newMnemonic, explanation: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Example (Optional)</label>
                        <Textarea
                          placeholder="How to use this mnemonic..."
                          rows={2}
                          value={newMnemonic.example}
                          onChange={(e) => setNewMnemonic({...newMnemonic, example: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          className="w-full border border-gray-300 rounded-md p-2"
                          value={newMnemonic.category}
                          onChange={(e) => setNewMnemonic({...newMnemonic, category: e.target.value})}
                        >
                          <option value="Acronym">Acronym</option>
                          <option value="Rhyme">Rhyme</option>
                          <option value="Visual">Visual</option>
                          <option value="Sound-based">Sound-based</option>
                          <option value="Story">Story</option>
                        </select>
                      </div>
                      <Button onClick={handleAddMnemonic} className="w-full">
                        Submit Mnemonic
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {concept.mnemonics.map((mnemonic) => (
                  <Card key={mnemonic.id} className={`${
                    mnemonic.isVerified ? 'border-l-4 border-l-green-500' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{mnemonic.title}</CardTitle>
                            {mnemonic.isVerified && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                            {mnemonic.category && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {mnemonic.category}
                              </span>
                            )}
                          </div>
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
                            <p className="font-semibold text-blue-900 text-lg">
                              {mnemonic.mnemonic}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Explanation:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{mnemonic.explanation}</p>
                      </div>
                      
                      {mnemonic.example && (
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                          <h4 className="font-semibold mb-2">Example:</h4>
                          <p className="text-gray-700 italic">{mnemonic.example}</p>
                        </div>
                      )}
                      
                      {/* Voting */}
                      <div className="flex items-center gap-4 pt-3 border-t">
                        <span className="text-sm text-gray-600">Was this helpful?</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={votedMnemonics[mnemonic.id] === 'up' ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleVoteMnemonic(mnemonic.id, 'up')}
                            disabled={!!votedMnemonics[mnemonic.id]}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {mnemonic.upvotes}
                          </Button>
                          <Button
                            variant={votedMnemonics[mnemonic.id] === 'down' ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleVoteMnemonic(mnemonic.id, 'down')}
                            disabled={!!votedMnemonics[mnemonic.id]}
                          >
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            {mnemonic.downvotes}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {concept.mnemonics.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="mb-4">No mnemonics yet. Be the first to add one!</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Mnemonic
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Related Concepts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock related concepts */}
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => router.push(`/student/concepts/${i}`)}
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm">Related Concept {i}</h4>
                        <p className="text-xs text-gray-600">Brief description...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
