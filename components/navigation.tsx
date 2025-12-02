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
import { Search, Menu, X, User, Settings, LogOut, BarChart3 } from "lucide-react"
import { Logo } from "@/components/logo"

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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="md" />
            <span className="text-xl font-bold text-[#213874]">Synapse Med</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-700 hover:text-[#213874] transition-colors">
              Courses
            </Link>
            <Link href="/library" className="text-gray-700 hover:text-[#213874] transition-colors">
              Library
            </Link>
            <Link href="/pharmacology" className="text-gray-700 hover:text-[#213874] transition-colors">
              Pharmacology
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#213874] transition-colors">
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search courses, topics, drugs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserAvatar() || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-[#213874] text-white text-xs">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user.field} • {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/student/dashboard" className="cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Student Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "SUPER_ADMIN" || user.role === "LECTURER" || user.role === "EDITOR") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-300">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/courses"
                  className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  href="/library"
                  className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Library
                </Link>
                <Link
                  href="/pharmacology"
                  className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pharmacology
                </Link>
                <Link
                  href="/about"
                  className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                {
                  user && (
                  <>
                    <Link
                      href="/student/dashboard"
                      className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Student Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    {(user.role === "SUPER_ADMIN" || user.role === "LECTURER" || user.role === "EDITOR") && (
                      <Link
                        href="/admin"
                        className="block py-2 text-gray-700 hover:text-[#213874] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                  </>
                  )
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
