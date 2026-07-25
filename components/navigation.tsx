"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Menu, X, User, Settings, LogOut, ChevronDown, Bell, Globe } from "lucide-react"
import { Logo } from "@/components/logo"

export function Navigation() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getUserInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "S"
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4" : "py-6"}`}>
      <div className="container mx-auto px-4">
        <div className={`glass rounded-full px-6 py-2 flex items-center justify-between transition-all duration-500 ${isScrolled ? "shadow-lg border-gray-200 bg-white/90" : "bg-white/60"}`}>
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                <Logo size="md" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tighter text-[#213874] group-hover:text-primary transition-all">SynapseMed</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { name: "Courses", href: "/courses" },
                { name: "Library", href: "/library" },
                { name: "Pharmacology", href: "/pharmacology" },
                { name: "About", href: "/about" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-semibold text-[#213874]/70 hover:text-[#213874] hover:bg-[#213874]/5 rounded-full transition-all"
                >
                  {item.name}
                </Link>
              ))}
              {user && ['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role) && (
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 text-sm font-bold text-[#f3ab1b] hover:bg-[#f3ab1b]/10 rounded-full transition-all"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative group">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 bg-gray-100 border-gray-200 rounded-full pl-10 h-10 text-foreground focus:ring-primary/20 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/student/dashboard" className="hidden sm:block px-5 py-2 bg-[#213874] text-white text-sm font-bold rounded-full hover:scale-105 hover:bg-[#1a6ac3] transition-all shadow-md shadow-blue-900/10">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-500 hover:text-primary hover:bg-gray-100">
                      <Bell className="h-5 w-5" />
                   </Button>
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="h-10 w-10 rounded-full p-0 border border-gray-200 hover:bg-gray-100">
                         <Avatar className="h-8 w-8">
                           <AvatarImage src={user.avatar || "/placeholder.svg"} />
                           <AvatarFallback className="bg-primary text-white">
                             {getUserInitials(user.name)}
                           </AvatarFallback>
                         </Avatar>
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="bg-white border-gray-200 text-foreground mt-4 w-56 p-2 rounded-2xl shadow-xl" align="end">
                       <DropdownMenuLabel className="px-4 py-2">
                          <p className="text-sm font-bold text-[#213874]">{user.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user.role}</p>
                       </DropdownMenuLabel>
                       <DropdownMenuSeparator className="bg-gray-100 mx-2" />
                       <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer rounded-xl px-4 py-3">
                         <User className="mr-3 h-4 w-4 text-primary" /> Profile
                       </DropdownMenuItem>
                       <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer rounded-xl px-4 py-3">
                         <Settings className="mr-3 h-4 w-4 text-primary" /> Settings
                       </DropdownMenuItem>
                       <DropdownMenuSeparator className="bg-gray-100 mx-2" />
                       <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-50 cursor-pointer rounded-xl px-4 py-3">
                         <LogOut className="mr-3 h-4 w-4" /> Sign Out
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="text-[#213874]/70 hover:text-[#213874] hover:bg-[#213874]/5 rounded-full font-semibold">
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-[#213874] text-white font-bold rounded-full hover:bg-[#1a6ac3] hover:scale-105 transition-all px-6">
                  <Link href="/auth">Join Now</Link>
                </Button>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Expansion */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 mx-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            {[
              { name: "Home", href: "/" },
              { name: "Courses", href: "/courses" },
              { name: "Library", href: "/library" },
              { name: "Pharmacology", href: "/pharmacology" },
              { name: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-xl font-bold text-[#213874]/70 hover:text-[#213874] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && ['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role) && (
              <Link
                href="/admin/dashboard"
                className="block text-xl font-bold text-[#f3ab1b] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
