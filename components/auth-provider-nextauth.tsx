"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

interface User {
  id: string
  name: string
  email: string
  role: "SUPER_ADMIN" | "LECTURER" | "EDITOR" | "STUDENT"
  field: "MEDICAL" | "NURSING" | "PHARMACY"
  avatar?: string
  level: number
  points: number
  streak: number
  badges: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, field: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  uploadAvatar: (file: File) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const { data: session, status } = useSession()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    checkAuthState()
  }, [])

  // Check for stored user on mount - first try cookies, then localStorage
  const checkAuthState = () => {
    // First, check cookies (server-side state)
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('synapse-user='))

    if (userCookie) {
      try {
        const encodedUser = userCookie.split('=')[1]
        const userData = JSON.parse(decodeURIComponent(encodedUser))
        console.log('Found user in cookies:', userData)
        setUser(userData)
        // Also sync to localStorage
        localStorage.setItem("synapse-user", JSON.stringify(userData))
        return
      } catch (error) {
        console.error('Failed to parse user cookie:', error)
        // Clear invalid cookies
        document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    }
  }

  useEffect(() => {
    // Sync NextAuth session with our user state
    const syncSession = async () => {
      // 1. If authenticated, fetch profile to ensure we have fresh data
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const result = await response.json()
            if (result.success && result.data) {
              const profileData = result.data
              const userData: User = {
                id: profileData.user.id,
                name: profileData.user.name,
                email: profileData.user.email,
                role: profileData.user.role,
                field: profileData.user.field,
                avatar: profileData.user.avatarUrl,
                level: profileData.gamification?.level || 1,
                points: profileData.gamification?.points || 0,
                streak: profileData.gamification?.streak || 0,
                badges: profileData.badges?.map((b: any) => b.id) || [],
              }

              console.log('Synced user state with database profile')
              setUser(userData)
              localStorage.setItem("synapse-user", JSON.stringify(userData))

              // Set cookies for middleware with Path=/ to be accessible everywhere
              const userJson = JSON.stringify(userData)
              const encodedUser = encodeURIComponent(userJson)

              // Set fresh cookies (Secure if on HTTPS, SameSite=Lax for compatibility)
              const cookieOptions = `; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
              document.cookie = `synapse-user=${encodedUser}${cookieOptions}`
            }
          }
        } catch (error) {
          console.error('Error syncing session with database:', error)
          // Don't log out on fetch error - keep current state
        }
      } 
      // 2. ONLY clear session if NextAuth says unauthenticated AND we have no user cookie
      // This prevents the "instant logout" if NextAuth client-side briefly loses the session
      else if (status === "unauthenticated") {
        const hasBackupCookie = document.cookie.split('; ').some(row => row.startsWith('synapse-user='))
        
        if (!hasBackupCookie) {
          console.log('Clearing local session - no cookies found')
          setUser(null)
          localStorage.removeItem("synapse-user")

          // Clear cookies
          document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        } else {
          console.log('Waiting for NextAuth - keeping local session active via cookie')
        }
      }
    }

    syncSession()
  }, [session, status])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email)

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.log('Login failed:', result.error)
        return false
      }

      console.log('Login successful!')
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string, field: string): Promise<boolean> => {
    try {
      console.log('Attempting signup for:', email)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, field }),
      })

      console.log('Signup response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Signup response data:', data)

        if (data.success && data.user) {
          setUser(data.user)
          localStorage.setItem("synapse-user", JSON.stringify(data.user))

          // Set cookies for middleware with proper encoding
          const userJson = JSON.stringify(data.user)
          const encodedUser = encodeURIComponent(userJson)

          // Clear any existing auth cookies first
          document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

          // Set new cookies
          document.cookie = `synapse-user=${encodedUser}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
          document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`

          console.log('Database signup successful!')
          return true
        }
      }

      console.log('Database signup failed')
      return false
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    setUser(null)
    localStorage.removeItem("synapse-user")

    // Clear cookies
    if (typeof window !== 'undefined') {
      document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      window.location.href = "/"
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("synapse-user", JSON.stringify(updatedUser))
    }
  }

  const uploadAvatar = async (file: File): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/user/profile/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload avatar')
    }

    const data = await response.json()
    if (data.success && user) {
      const updatedUser = { ...user, avatar: data.url }
      setUser(updatedUser)
      // Update cookie as well
      const userJson = JSON.stringify(updatedUser)
      const encodedUser = encodeURIComponent(userJson)
      document.cookie = `synapse-user=${encodedUser}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      localStorage.setItem("synapse-user", userJson)
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, updateUser, uploadAvatar }}>
    {children}
  </AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}