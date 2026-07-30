"use client";

import { useState, useEffect } from "react";
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
  Settings,
  LogOut,
  Target,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  Zap,
  Bell,
  Cpu,
  Activity,
  Layers,
  LayoutDashboard,
  Calculator,
  Brain,
  Microscope,
  Stethoscope,
  ArrowRight,
  Flame
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { NotesPanel } from "@/components/student/notes-panel"
import { SpacedRepetitionPanel } from "@/components/student/spaced-repetition-panel"
import { QuestionOfTheDayPanel } from "@/components/student/question-of-the-day-panel"
import { ClinicalLeaderboard } from "@/components/student/clinical-leaderboard"
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    level: 1,
    points: 120,
    streak: 5,
    completionRate: 45,
    completedItems: 18,
    totalItems: 50,
    loading: true
  });

  const [videos, setVideos] = useState<any[]>([]);
  const [bookmarksList, setBookmarksList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, videosRes, bookmarksRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/videos?limit=4'),
          fetch('/api/user/bookmarks?limit=5')
        ]);
        
        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data.success && data.user?.gamification) {
            setStats({
              ...data.user.gamification,
              loading: false
            });
          }
        }
        
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setVideos(videosData.videos || []);
        }
        
        if (bookmarksRes.ok) {
          const bookmarksData = await bookmarksRes.json();
          setBookmarksList(bookmarksData.bookmarks || []);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  const navigationItems = [
    { name: "Command Center", icon: Home, href: "/student/dashboard" },
    { name: "Clinical Courses", icon: BookOpen, href: "/courses" },
    { name: "Master Library", icon: BookMarked, href: "/library" },
    { name: "Medical Calculators", icon: Calculator, href: "/calculators" },
    { name: "Pharmacology", icon: Layers, href: "/pharmacology" },
    { name: "Question Bank", icon: Target, href: "/student/questions" },
    { name: "AI Neural Tutor", icon: Bot, href: "/student/ai-tutor" },
  ];

  const isAdmin = user && ['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role);

  return (
    <div className="flex min-h-screen bg-mesh text-[#213874] selection:bg-primary/20">
      {/* Floating Glass Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen m-4 rounded-3xl shadow-sm">
        <div className="p-8 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-[#213874]/10 rounded-xl">
             <Logo size="md" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-[#213874]">SynapseMed</span>
        </div>
        
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 px-4">Navigation Matrix</div>
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className="flex items-center px-4 py-3 text-sm font-semibold text-gray-500 rounded-2xl hover:bg-gray-50 hover:text-[#213874] transition-all group"
                >
                  <item.icon className="h-5 w-5 mr-3 group-hover:text-[#1a6ac3] transition-colors" />
                  {item.name}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li className="mt-8 border-t border-gray-100 pt-8">
                <Link 
                  href="/admin/dashboard"
                  className="flex items-center px-4 py-3 text-sm font-bold text-[#f3ab1b] rounded-2xl bg-[#f3ab1b]/5 hover:bg-[#f3ab1b]/10 transition-all group"
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-100 space-y-6">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-3">
             <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#213874]">
                <span>Memory Sync</span>
                <span>{stats.completionRate}%</span>
             </div>
             <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#1a6ac3]" style={{ width: `${stats.completionRate}%` }} />
             </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 rounded-2xl font-semibold" onClick={logout}>
            <LogOut className="h-4 w-4 mr-3" /> Terminate Session
          </Button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white m-4 mb-0 rounded-2xl px-8 py-4 border border-gray-100 relative z-20 shadow-sm">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 max-w-xl relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a6ac3] transition-colors h-4 w-4" />
              <Input
                type="text"
                placeholder="Query clinical databases, calculators, or topics..."
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-2xl text-[#213874] focus:ring-primary/20 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-6">
              {/* Daily Streak Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
                <span className="text-xs font-bold text-orange-700">{stats.streak} Day Streak</span>
              </div>
              
              <div className="flex items-center gap-3">
                 <Button variant="ghost" size="icon" className="bg-gray-50 h-11 w-11 rounded-2xl text-gray-400 hover:text-[#213874] border border-gray-100">
                    <Bell className="h-5 w-5" />
                 </Button>
                 <Avatar className="h-11 w-11 rounded-2xl border border-gray-100 p-0.5 bg-white shadow-sm">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} className="rounded-xl" />
                    <AvatarFallback className="bg-[#213874] text-white rounded-xl font-bold">
                      {user?.name?.[0] || "S"}
                    </AvatarFallback>
                 </Avatar>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
          {/* Status Header */}
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-2 text-[#f3ab1b] font-bold text-xs uppercase tracking-widest">
               <Activity className="h-4 w-4" /> Clinical Command Center Active
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-[#213874]">
              Welcome back, <span className="text-[#1a6ac3]">{user?.name || "Doctor"}</span>.
            </h1>
            <p className="text-gray-500 font-medium max-w-2xl leading-relaxed">
              Master Curriculum Level {stats.level} • {stats.points} Clinical XP earned. You're on track for your rotation goals.
            </p>
          </div>

          {/* Quick Action Clinical Launchpad */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <Link href="/calculators" className="group">
               <Card className="glass-card p-6 h-full flex flex-col justify-between group-hover:-translate-y-1 transition-all border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-[#1a6ac3]" />
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Point of Care</Badge>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-[#213874] mb-1">Medical Calculators</h3>
                     <p className="text-xs text-gray-500 leading-relaxed">CURB-65, CHA₂DS₂-VASc, Wells PE, GCS, MELD, SOFA.</p>
                  </div>
               </Card>
             </Link>

             <Link href="/student/exam-simulation" className="group">
               <Card className="glass-card p-6 h-full flex flex-col justify-between group-hover:-translate-y-1 transition-all border-red-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                      <Target className="w-6 h-6 text-red-500" />
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">USMLE / Board</Badge>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-[#213874] mb-1">Exam Simulations</h3>
                     <p className="text-xs text-gray-500 leading-relaxed">Timed active recall & board-style question sessions.</p>
                  </div>
               </Card>
             </Link>

             <Link href="/library" className="group">
               <Card className="glass-card p-6 h-full flex flex-col justify-between group-hover:-translate-y-1 transition-all border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">32 Subjects</Badge>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-[#213874] mb-1">Master Curriculum</h3>
                     <p className="text-xs text-gray-500 leading-relaxed">Browse disease pages with interactive clinical templates.</p>
                  </div>
               </Card>
             </Link>

             <Link href="/student/ai-tutor" className="group">
               <Card className="glass-card p-6 h-full flex flex-col justify-between group-hover:-translate-y-1 transition-all border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-amber-600" />
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">NVIDIA AI</Badge>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-[#213874] mb-1">AI Clinical Tutor</h3>
                     <p className="text-xs text-gray-500 leading-relaxed">Ask differential diagnosis & reasoning questions.</p>
                  </div>
               </Card>
             </Link>
          </div>

          {/* Question of the Day & Spaced Repetition Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <QuestionOfTheDayPanel />
             <SpacedRepetitionPanel />
          </div>

          {/* Gamified Clinical Leaderboard */}
          <ClinicalLeaderboard />

          {/* Notes Panel */}
          <NotesPanel />
        </main>
      </div>
    </div>
  );
}