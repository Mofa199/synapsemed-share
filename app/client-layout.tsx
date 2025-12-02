"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider-nextauth"
import { useAuth } from "@/components/auth-provider-nextauth"
import { Footer } from "@/components/footer"
import { FloatingAIAssistant } from "@/components/floating-ai-assistant"
import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Hide footer on auth pages or when user is not logged in on main page
  const isAuthPage = pathname === "/auth" || pathname === "/login" || pathname === "/signup"
  const isMainPageWithoutUser = pathname === "/" && !user
  const shouldHideFooter = isAuthPage || isMainPageWithoutUser

  // Determine AI context based on current page
  const getAIContext = () => {
    if (pathname.includes('/student/exam') || pathname.includes('/student/questions') || pathname.includes('/question-bank')) {
      return 'exam'
    }
    if (pathname.includes('/topic') || pathname.includes('/module') || pathname.includes('/article') || pathname.includes('/book')) {
      return 'study'
    }
    return 'general'
  }

  // Only show AI for logged-in users and not on auth pages
  const shouldShowAI = user && !isAuthPage

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      {!shouldHideFooter && <Footer />}
      {shouldShowAI && (
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