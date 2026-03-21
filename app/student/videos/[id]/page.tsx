"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  Bookmark,
  Share2,
  Calendar,
  MessageCircle,
  CheckCircle2,
  ThumbsUp,
  Send,
  ArrowLeft,
  BookOpen,
  Clock
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  category: string;
  difficulty: string;
  views: number;
  isFavorited?: boolean;
  isBookmarked?: boolean;
}

interface Comment {
  id: string;
  userName: string;
  userAvatar: string | null;
  comment: string;
  likes: number;
  createdAt: Date;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const videoId = params.id as string;
  const userId = "student-001"; // In real app, get from auth
  
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoData();
    fetchComments();
    fetchQuiz();
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setVideo(data);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/quiz`);
      if (response.ok) {
        const data = await response.json();
        // Parse JSON strings in questions
        if (data.questions) {
          data.questions = data.questions.map((q: any) => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
          }));
        }
        setQuiz(data);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!video) return;
    
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          videoId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setVideo({ ...video, isFavorited: data.favorited });
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

  const handleToggleBookmark = async () => {
    if (!video) return;
    
    try {
      const url = '/api/user/bookmarks';
      const method = video.isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          resourceType: 'VIDEO',
          videoId
        })
      });

      if (response.ok) {
        setVideo({ ...video, isBookmarked: !video.isBookmarked });
        toast({
          title: video.isBookmarked ? "Bookmark removed" : "Bookmarked",
          description: video.isBookmarked 
            ? "Video removed from bookmarks" 
            : "Video added to bookmarks",
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

  const handleShare = async () => {
    if (!video) return;

    const shareData = {
      title: video.title,
      text: video.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Video link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToPlanner = () => {
    toast({
      title: "Added to planner",
      description: "Video has been added to your study plan",
    });
    // In real implementation, open dialog to schedule study session
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: "Current User", // Get from auth
          userAvatar: null,
          comment: newComment
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setNewComment("");
        toast({
          title: "Comment posted",
          description: "Your comment has been added",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    // Check if all questions answered
    const allAnswered = quiz.questions.every((_, index) => 
      selectedAnswers.hasOwnProperty(index)
    );

    if (!allAnswered) {
      toast({
        title: "Incomplete quiz",
        description: "Please answer all questions before submitting",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/videos/${videoId}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          quizId: quiz.id,
          answers: Object.values(selectedAnswers)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuizScore(data.score);
        setQuizSubmitted(true);
        
        toast({
          title: data.passed ? "Quiz passed! 🎉" : "Quiz completed",
          description: `You scored ${data.score}% (${data.correctCount}/${data.totalQuestions})`,
          variant: data.passed ? "default" : "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Video not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Videos
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <iframe
              src={video.url}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{video.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span>{video.views} views</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">{video.category}</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                {video.difficulty}
              </span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {video.duration}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                variant={video.isFavorited ? "default" : "outline"}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 mr-2 ${video.isFavorited ? 'fill-current' : ''}`} />
                {video.isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
              <Button 
                variant={video.isBookmarked ? "default" : "outline"}
                onClick={handleToggleBookmark}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${video.isBookmarked ? 'fill-current' : ''}`} />
                {video.isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleAddToPlanner}>
                <Calendar className="h-4 w-4 mr-2" />
                Add to Planner
              </Button>
            </div>

            <p className="text-gray-700">{video.description}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="discussion" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="discussion">
                <MessageCircle className="h-4 w-4 mr-2" />
                Discussion ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="quiz">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Quiz
              </TabsTrigger>
            </TabsList>

            {/* Discussion Tab */}
            <TabsContent value="discussion" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion</CardTitle>
                  <CardDescription>Share your thoughts and questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Comment Input */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handlePostComment} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {comment.userName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{comment.userName}</span>
                              <span className="text-sm text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{comment.comment}</p>
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.likes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {comments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No comments yet. Be the first to comment!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{quiz?.title || 'Video Quiz'}</CardTitle>
                  <CardDescription>
                    {quiz?.description || 'Test your understanding of this video'}
                    {quiz && ` • Passing Score: ${quiz.passingScore}%`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quiz ? (
                    <div className="space-y-6">
                      {quiz.questions.map((question, index) => (
                        <div key={question.id} className="border-b pb-6 last:border-b-0">
                          <h3 className="font-semibold mb-3">
                            {index + 1}. {question.question}
                          </h3>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => {
                              const isSelected = selectedAnswers[index] === optionIndex;
                              const isCorrect = optionIndex === question.correctAnswer;
                              const showResult = quizSubmitted;

                              return (
                                <button
                                  key={optionIndex}
                                  onClick={() => !quizSubmitted && setSelectedAnswers({
                                    ...selectedAnswers,
                                    [index]: optionIndex
                                  })}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                    showResult && isCorrect
                                      ? 'border-green-500 bg-green-50'
                                      : showResult && isSelected && !isCorrect
                                      ? 'border-red-500 bg-red-50'
                                      : isSelected
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  } ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {showResult && isCorrect && (
                                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-900">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}

                      {!quizSubmitted ? (
                        <Button 
                          onClick={handleSubmitQuiz}
                          className="w-full"
                          size="lg"
                        >
                          Submit Quiz
                        </Button>
                      ) : (
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                          <h3 className="text-2xl font-bold mb-2">
                            Score: {quizScore}%
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {quizScore >= (quiz.passingScore || 70) 
                              ? "Congratulations! You passed! 🎉"
                              : "Keep practicing! You can do better next time."}
                          </p>
                          <Button 
                            onClick={() => {
                              setQuizSubmitted(false);
                              setSelectedAnswers({});
                            }}
                          >
                            Retake Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No quiz available for this video yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Related Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock related videos */}
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => router.push(`/student/videos/${i}`)}
                  >
                    <img 
                      src={`https://placehold.co/120x80/213874/white?text=Video+${i}`}
                      alt={`Related video ${i}`}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                        Advanced Cardiac Topics {i}
                      </h4>
                      <p className="text-xs text-gray-600">12:45 • 1.2K views</p>
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
