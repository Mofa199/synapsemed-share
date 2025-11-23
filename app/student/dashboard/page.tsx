"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  BookOpen, 
  Play, 
  FileText, 
  HelpCircle, 
  Map, 
  Users, 
  Search, 
  Bot, 
  BookMarked, 
  User, 
  CreditCard,
  Video,
  Bookmark,
  RotateCcw,
  Lightbulb,
  Calendar,
  Smartphone,
  Apple,
  Chrome,
  Target,
  MessageCircle,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { NotesPanel } from "@/components/student/notes-panel"
import { Bookmatcher } from "@/components/student/bookmatcher"
import { SpacedRepetitionPanel } from "@/components/student/spaced-repetition-panel"
import { QuestionOfTheDayPanel } from "@/components/student/question-of-the-day-panel"
import { Logo } from "@/components/logo";

// Mock data for the dashboard
const videoTopics = [
  { id: 1, title: "Anatomy", description: "Comprehensive anatomy courses" },
  { id: 2, title: "Anesthesiology", description: "Anesthesia procedures and techniques" },
  { id: 3, title: "Biochemistry", description: "Molecular biology and metabolism" },
  { id: 4, title: "Cardiology", description: "Heart diseases and treatments" },
  { id: 5, title: "Dermatology", description: "Skin conditions and treatments" },
  { id: 6, title: "Endocrinology", description: "Hormonal disorders and treatments" },
];

const bookmarks = [
  { id: 1, title: "Cardiac Anatomy", type: "Video" },
  { id: 2, title: "Pharmacology Notes", type: "Document" },
  { id: 3, title: "ECG Interpretation", type: "Concept Page" },
];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation items for the sidebar
  const navigationItems = [
    { name: "Home", icon: Home, href: "/student/dashboard" },
    { name: "Study Planner", icon: BookOpen, href: "/student/planner" },
    { name: "My Content", icon: FileText, href: "/student/content" },
    { name: "Videos", icon: Play, href: "/student/videos" },
    { name: "Concept Pages", icon: Lightbulb, href: "/student/concepts" },
    { name: "Question Bank", icon: HelpCircle, href: "/student/questions" },
    { name: "Learning Paths", icon: Map, href: "/student/paths" },
    { name: "Patient Simulations", icon: Users, href: "/student/simulations" },
    { name: "Exam Simulation", icon: Target, href: "/student/exam-simulation" },
    { name: "AI Study Tutor", icon: Bot, href: "/student/ai-tutor" },
    { name: "Medical Chat", icon: MessageCircle, href: "/student/chat" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Logo size="md" />
            <span className="text-xl font-bold text-[#213874]">SynapseMed</span>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Go back to home and logout buttons */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          <Link href="/student/dashboard" className="flex flex-col items-center gap-1 p-2 text-blue-600">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/student/planner" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Planner</span>
          </Link>
          <Link href="/student/videos" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Play className="h-5 w-5" />
            <span className="text-xs">Videos</span>
          </Link>
          <Link href="/student/questions" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <HelpCircle className="h-5 w-5" />
            <span className="text-xs">Questions</span>
          </Link>
          <Link href="/student/ai-tutor" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Bot className="h-5 w-5" />
            <span className="text-xs">AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-lg font-bold text-[#213874]">SynapseMed</span>
            </div>
            
            {/* Desktop Search */}
            <div className="hidden lg:block relative w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search topics, keywords, questions..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Desktop Buttons */}
              <div className="hidden lg:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/student/ai-tutor">
                    <Bot className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/student/chat">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Medical Chat
                  </Link>
                </Button>
                <Bookmatcher />
              </div>
              
              {/* Mobile Icons Only */}
              <div className="flex lg:hidden items-center space-x-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/student/chat">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>
                <Bookmatcher />
              </div>
              
              {/* Common Buttons */}
              <Button variant="ghost" size="icon">
                <CreditCard className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="lg:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto pb-20 lg:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || "Student"}!</h1>
            <p className="text-gray-600">Continue your medical education journey</p>
          </div>

          {/* Quickstart Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quickstart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-500" />
                    Exam Simulation Mode
                  </CardTitle>
                  <CardDescription>Practice under real exam conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Experience the actual test environment with timed questions and adaptive difficulty.
                  </p>
                  <Button asChild>
                    <Link href="/student/exam-simulation">
                      <Target className="h-4 w-4 mr-2" />
                      Try it out now!
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-blue-500" />
                    AI Study Tutor
                  </CardTitle>
                  <CardDescription>Your personal medical coach</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Get instant answers, personalized recommendations, and adaptive quizzes.
                  </p>
                  <Button asChild>
                    <Link href="/student/ai-tutor">
                      <Bot className="h-4 w-4 mr-2" />
                      Try it out now!
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                    Medical Community Chat
                  </CardTitle>
                  <CardDescription>Connect with peers and experts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Join discussions, ask questions, and collaborate with medical students and professionals.
                  </p>
                  <Button asChild>
                    <Link href="/student/chat">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Chat
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Overview Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Videos Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="h-5 w-5 mr-2 text-red-500" />
                    Videos
                  </CardTitle>
                  <CardDescription>Explore our medical topic library</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {videoTopics.slice(0, 4).map((topic) => (
                      <div key={topic.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h3 className="font-medium text-sm">{topic.title}</h3>
                        <p className="text-xs text-gray-600">{topic.description}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-3" variant="outline" size="sm" asChild>
                    <Link href="/student/videos">View All Videos</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Notes Panel */}
              <NotesPanel className="lg:col-span-2" />
            </div>
            
            {/* Additional Panels Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
              {/* Bookmarks Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-yellow-500" />
                    Bookmarks
                  </CardTitle>
                  <CardDescription>Your saved learning content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium text-sm">{bookmark.title}</h3>
                          <p className="text-xs text-gray-600">{bookmark.type}</p>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Spaced Repetition Panel */}
              <SpacedRepetitionPanel />

              {/* Question Bank Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    Question Bank
                  </CardTitle>
                  <CardDescription>Test your knowledge with practice questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700 text-sm">
                    Access thousands of USMLE-style questions with detailed explanations.
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/student/questions">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Practice Questions
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
              {/* Question of the Day Panel */}
              <QuestionOfTheDayPanel />

              {/* Study Progress Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-500" />
                    Study Progress
                  </CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Topics Completed</span>
                      <span className="text-sm font-medium">24/50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '48%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Current streak: 7 days</span>
                      <span>48% complete</span>
                    </div>
                  </div>
                  <Button className="w-full mt-3" variant="outline" size="sm" asChild>
                    <Link href="/gamification">View Details</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Mobile Apps Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-green-500" />
                    Mobile Apps
                  </CardTitle>
                  <CardDescription>Learn on the go</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700 text-sm">
                    Download our apps for iOS and Android to study anywhere.
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Apple className="h-4 w-4 mr-2" />
                      iOS
                    </Button>
                    <Button variant="outline" size="sm">
                      <Chrome className="h-4 w-4 mr-2" />
                      Android
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}