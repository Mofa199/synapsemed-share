"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider-nextauth"
import { useAuth } from "@/components/auth-provider-nextauth"
import { Footer } from "@/components/footer"
import { FloatingAIAssistant } from "@/components/floating-ai-assistant"
import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from "react"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide footer on auth pages or when user is not logged in on main page
  const isAuthPage = pathname === "/auth" || pathname === "/login" || pathname === "/signup"
  
  // Prevent hydration mismatch by considering user state only after mounting
  const isMainPageWithoutUser = mounted && pathname === "/" && !user
  const shouldHideFooter = isAuthPage || isMainPageWithoutUser

  // Determine AI context based on current page
  const getAIContext = () => {
    if (pathname.includes('/student/exam') || pathname.includes('/student/questions') || pathname.includes('/question-bank')) {
      return 'exam'
    }
    if (pathname.includes('/topic')) {
      return 'topic'
    }
    if (pathname.includes('/module') || pathname.includes('/article') || pathname.includes('/book')) {
      return 'study'
    }
    return 'general'
  }

  // Only show AI for logged-in users and not on auth pages, wait for mount to prevent hydration breaks
  const shouldShowAI = mounted && user && !isAuthPage

  return (
    <div className="min-h-screen flex flex-col bg-mesh text-foreground selection:bg-primary/20">
      <main className="flex-1">{children}</main>
      {mounted && !shouldHideFooter && <Footer />}
      {mounted && shouldShowAI && (
        <FloatingAIAssistant
          context={getAIContext()}
          studentLevel={user?.level?.toString()}
        />
      )}
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
        <Toaster />
      </AuthProvider>
    </SessionProvider>
  )
}