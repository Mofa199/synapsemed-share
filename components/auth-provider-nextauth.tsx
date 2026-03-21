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

  // useEffect(() => {
  //   // Sync NextAuth session with our user state
  //   const syncSession = async () => {
  //     if (status === "authenticated" && session?.user) {
  //       // Fetch full user data from database
  //       try {
  //         const response = await fetch('/api/users')
  //         if (response.ok) {
  //           const result = await response.json()
  //           const dbUser = result.users.find((u: any) => u.email === session.user?.email)

  //           if (dbUser) {
  //             const userData: User = {
  //               id: dbUser.id,
  //               name: dbUser.name,
  //               email: dbUser.email,
  //               role: dbUser.role,
  //               field: dbUser.field,
  //               level: dbUser.level || 1,
  //               points: dbUser.points || 0,
  //               streak: dbUser.streak || 0,
  //               badges: dbUser.badges || [],
  //             }

  //             setUser(userData)
  //             localStorage.setItem("synapse-user", JSON.stringify(userData))

  //             // Set cookies for middleware
  //             const userJson = JSON.stringify(userData)
  //             const encodedUser = encodeURIComponent(userJson)

  //             // Clear any existing auth cookies first
  //             document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  //             document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

  //             // Set new cookies
  //             document.cookie = `synapse-user=${encodedUser}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  //             document.cookie = `auth-token=nextauth-token-${userData.id}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user data:', error)
  //       }
  //     } else if (status === "unauthenticated") {
  //       setUser(null)
  //       localStorage.removeItem("synapse-user")

  //       // Clear cookies
  //       document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  //       document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  //     }
  //   }

  //   syncSession()
  // }, [session, status])

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
    document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/"
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