"use client"

import { useAuth } from "@/components/auth-provider-nextauth"
import { HomePage } from "@/components/home-page"
import { AuthPage } from "@/components/auth-page"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Show loading state while checking auth
  if (user === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // If user is authenticated, show home page
  if (user) {
    return <HomePage />
  }

  // Default fallback
  return <AuthPage />
}
