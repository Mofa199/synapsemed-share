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
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { NotesPanel } from "@/components/student/notes-panel"
import { SpacedRepetitionPanel } from "@/components/student/spaced-repetition-panel"
import { QuestionOfTheDayPanel } from "@/components/student/question-of-the-day-panel"
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    level: 1,
    points: 0,
    streak: 0,
    completionRate: 0,
    completedItems: 0,
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
    { name: "Intelligence Hub", icon: BookMarked, href: "/library" },
    { name: "Pharmacology", icon: Layers, href: "/pharmacology" },
    { name: "Question Bank", icon: Target, href: "/student/questions" },
    { name: "Simulations", icon: Users, href: "/student/simulations" },
    { name: "AI Neural Tutor", icon: Bot, href: "/student/ai-tutor" },
  ];

  const isAdmin = user && ['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role);

  return (
    <div className="flex min-h-screen bg-mesh text-[#213874] selection:bg-primary/20">
      {/* Floating Glass Sidebar */}
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
                placeholder="Query clinical databases..."
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-2xl text-[#213874] focus:ring-primary/20 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Live Node Active</span>
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

        <main className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
          {/* Status Header */}
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-2 text-[#f3ab1b] font-bold text-xs uppercase tracking-widest">
               <Activity className="h-4 w-4" /> System Online
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-[#213874]">
              Welcome to the Command Center, <span className="text-[#1a6ac3]">{user?.name || "Student"}</span>.
            </h1>
            <p className="text-gray-500 font-medium max-w-2xl leading-relaxed">Neural pathways synchronized. 12 New mission-critical medical updates available in your library.</p>
          </div>

          {/* Core Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: "Exam Simulation", desc: "USMLE-Style active recall session.", icon: Target, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", href: "/student/exam-simulation" },
               { title: "Neural Tutor", desc: "AI-powered adaptive synthesis.", icon: Bot, color: "text-[#1a6ac3]", bg: "bg-blue-50", border: "border-blue-100", href: "/student/ai-tutor" },
               { title: "Collaboration Hub", desc: "Peer-to-peer clinical exchange.", icon: Users, color: "text-green-600", bg: "bg-green-50", border: "border-green-100", href: "/student/chat" },
             ].map((task, i) => (
               <Link key={i} href={task.href} className="group">
                 <Card className="glass-card p-10 h-full flex flex-col justify-between group-hover:-translate-y-2 transition-all">
                    <div className="space-y-6 text-left">
                       <div className={`w-14 h-14 ${task.bg} rounded-2xl flex items-center justify-center border ${task.border} transition-all`}>
                          <task.icon className={`w-7 h-7 ${task.color}`} />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-[#213874]">{task.title}</h3>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed">{task.desc}</p>
                       </div>
                    </div>
                    <div className="pt-8 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#1a6ac3] opacity-0 group-hover:opacity-100 transition-all">
                       Initialize Portal &rarr;
                    </div>
                 </Card>
               </Link>
             ))}
          </div>

          {/* Data Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-8 space-y-12">
                <Card className="glass-card p-1 overflow-hidden">
                   <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <Play className="text-[#1a6ac3] w-6 h-6" />
                         <h3 className="font-bold text-2xl tracking-tight text-[#213874]">Neural Video Streams</h3>
                      </div>
                      <Link href="/student/videos" className="text-[10px] font-bold text-gray-400 hover:text-[#1a6ac3] tracking-widest uppercase transition-colors">Explore All</Link>
                   </div>
                   <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                      {videos.slice(0, 4).map((video: any) => (
                        <div key={video.id} className="p-5 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group cursor-pointer">
                           <div className="aspect-video bg-gray-200 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                              <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-all z-10 drop-shadow-lg" />
                              <div className="absolute inset-0 bg-[#213874]/20 opacity-0 group-hover:opacity-100 transition-all" />
                           </div>
                           <h4 className="font-bold text-sm text-[#213874] truncate">{video.title}</h4>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Clinical Module {video.moduleId || "01"}</p>
                        </div>
                      ))}
                   </div>
                </Card>

                <NotesPanel className="glass-card p-1" />
             </div>

             <div className="lg:col-span-4 space-y-12 text-left">
                <Card className="glass-card p-1">
                   <div className="p-8 border-b border-gray-100">
                      <h3 className="font-bold tracking-tight flex items-center gap-4 uppercase text-xs text-[#213874]">
                         <Bookmark className="text-[#f3ab1b] w-4 h-4" />
                         Memory Nodes
                      </h3>
                   </div>
                   <div className="p-6 space-y-4">
                      {bookmarksList.length > 0 ? bookmarksList.map((bookmark) => (
                        <div key={bookmark.id} className="flex items-center gap-5 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-gray-100">
                           <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-[#f3ab1b] group-hover:bg-[#f3ab1b]/10 transition-all shadow-sm">
                              {bookmark.resourceType?.[0] || "N"}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold truncate text-[#213874] group-hover:text-[#1a6ac3] transition-colors">{bookmark.title}</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{bookmark.resourceType}</p>
                           </div>
                        </div>
                      )) : (
                        <div className="py-12 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                           Archives Empty
                        </div>
                      )}
                   </div>
                </Card>

                <SpacedRepetitionPanel />
                <QuestionOfTheDayPanel />
             </div>
          </div>
        </main>
      </div>

      {/* Mobile Control Matrix */}
      <div className="lg:hidden fixed bottom-8 left-8 right-8 bg-white border border-gray-200 rounded-3xl p-6 flex items-center justify-around z-50 shadow-2xl">
        <Link href="/student/dashboard" className="text-[#213874] hover:scale-125 transition-all">
          <Home className="h-6 w-6" />
        </Link>
        <Link href="/courses" className="text-gray-400">
          <BookOpen className="h-6 w-6" />
        </Link>
        <Link href="/student/questions" className="text-gray-400">
          <HelpCircle className="h-6 w-6" />
        </Link>
        <Link href="/student/ai-tutor" className="text-gray-400">
          <Bot className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}