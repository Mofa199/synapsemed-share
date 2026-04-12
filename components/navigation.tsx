"use client"

import type React from "react"

import { useState } from "react"
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
import { Search, Menu, X, User, Settings, LogOut, BookOpen, GraduationCap, ChevronDown } from "lucide-react"
import { Logo } from "@/components/logo"

import dynamic from 'next/dynamic'

// Dynamically import heavy components for better performance
const DynamicSearchComponent = dynamic(() => import('@/components/search-component').then(mod => mod.SearchComponent), {
  loading: () => <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>,
  ssr: false
})


export function Navigation() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log("Searching for:", searchQuery)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getUserAvatar = () => {
    if (user?.avatar) {
      return user.avatar
    }
    return undefined
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="lg" />
              <div>
                <span className="text-2xl font-bold text-[#213874]">Synapse Med</span>
                <div className="text-xs text-gray-500">Medical Education Platform</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium">
              Home
            </Link>
            <Link href="/courses" className="px-4 py-2 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium">
              Courses
            </Link>
            <Link href="/library" className="px-4 py-2 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium">
              Library
            </Link>
            <Link href="/pharmacology" className="px-4 py-2 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium">
              Pharmacology
            </Link>
            <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium">
              About
            </Link>
            {user && (
              <Link href="/student/dashboard" className="px-4 py-2 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium">
                Dashboard
              </Link>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search courses, topics, drugs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-full border-gray-300 focus:border-[#213874] focus:ring-2 focus:ring-[#213874]/20"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* User Menu and Mobile Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-gray-200 hover:bg-gray-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserAvatar() || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-[#213874] text-white text-sm">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-gray-900">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {user.field}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer py-2">
                      <User className="mr-3 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/student/dashboard" className="cursor-pointer py-2">
                      <GraduationCap className="mr-3 h-4 w-4" />
                      Student Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer py-2">
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "SUPER_ADMIN" || user.role === "LECTURER" || user.role === "EDITOR") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer py-2">
                          <Settings className="mr-3 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer py-2 text-red-600">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" asChild className="text-gray-700 hover:text-[#213874]">
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-[#213874] hover:bg-[#1a6ac3] px-6">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-10 w-10 rounded-lg border border-gray-200 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200 bg-white animate-in slide-in-from-top duration-300">
            <div className="space-y-6">
              {/* Mobile Search */}
              <div className="px-4">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 rounded-full"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <div className="px-4 space-y-2">
                <Link
                  href="/"
                  className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/courses"
                  className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  href="/library"
                  className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Library
                </Link>
                <Link
                  href="/pharmacology"
                  className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pharmacology
                </Link>
                <Link
                  href="/about"
                  className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                
                {user && (
                  <Link
                    href="/student/dashboard"
                    className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                
                {user && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</div>
                      <Link
                        href="/profile"
                        className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      {(user.role === "SUPER_ADMIN" || user.role === "LECTURER" || user.role === "EDITOR") && (
                        <Link
                          href="/admin"
                          className="block py-3 px-4 text-gray-700 hover:text-[#213874] hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left block py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
                
                {!user && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex flex-col space-y-3">
                      <Button 
                        variant="ghost" 
                        asChild 
                        className="w-full justify-center text-gray-700 hover:text-[#213874] py-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/auth">Sign In</Link>
                      </Button>
                      <Button 
                        asChild 
                        className="w-full bg-[#213874] hover:bg-[#1a6ac3] py-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/auth">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
