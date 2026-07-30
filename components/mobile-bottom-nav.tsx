"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Calculator, LayoutDashboard, Sparkles } from "lucide-react"

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Library", href: "/library", icon: BookOpen },
    { name: "Calculators", href: "/calculators", icon: Calculator },
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-2xl px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive ? "text-[#1a6ac3] font-bold scale-105" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#1a6ac3]" : "text-gray-400"}`} />
              <span className="text-[10px] font-medium tracking-tight">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
