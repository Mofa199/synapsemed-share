"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { StackProvider, useStackApp, useUser, StackClientApp } from "@stackframe/stack"

// Define our app user interface (extended from Stack user)
interface SynapseUser {
  id: string
  name: string
  email: string
  role: "SUPER_ADMIN" | "LECTURER" | "EDITOR" | "STUDENT"
  field: "MEDICAL" | "NURSING" | "PHARMACY"
  level: number
  points: number
  streak: number
  badges: string[]
  avatar?: string
}

interface SynapseAuthContextType {
  user: SynapseUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserProfile: (updates: Partial<SynapseUser>) => void
}

const SynapseAuthContext = createContext<SynapseAuthContextType | undefined>(undefined)

// Stack configuration - client instance
const stackApp = new StackClientApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  tokenStore: "nextjs-cookie",
})

function SynapseAuthProviderContent({ children }: { children: React.ReactNode }) {
  const stackApp = useStackApp()
  const stackUser = useUser()
  const [synapseUser, setSynapseUser] = useState<SynapseUser | null>(null)

  // Map Stack user to Synapse user format
  useEffect(() => {
    if (stackUser) {
      // Fetch additional user data from our database
      fetchUserProfile(stackUser.id)
    } else {
      setSynapseUser(null)
    }
  }, [stackUser])

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/profile/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setSynapseUser({
          id: stackUser!.id,
          name: stackUser!.displayName || stackUser!.primaryEmail || 'User',
          email: stackUser!.primaryEmail || '',
          role: userData.role || 'STUDENT',
          field: userData.field || 'MEDICAL',
          level: userData.level || 1,
          points: userData.points || 0,
          streak: userData.streak || 0,
          badges: userData.badges || [],
          avatar: stackUser!.profileImageUrl || undefined,
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Set default user data if profile fetch fails
      setSynapseUser({
        id: stackUser!.id,
        name: stackUser!.displayName || stackUser!.primaryEmail || 'User',
        email: stackUser!.primaryEmail || '',
        role: 'STUDENT',
        field: 'MEDICAL',
        level: 1,
        points: 0,
        streak: 0,
        badges: [],
        avatar: stackUser!.profileImageUrl || undefined,
      })
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await stackApp.signInWithCredential({
        email,
        password,
      })
      return result.status === "ok"
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    await stackApp.signOut()
    setSynapseUser(null)
  }

  const updateUserProfile = (updates: Partial<SynapseUser>) => {
    if (synapseUser) {
      const updatedUser = { ...synapseUser, ...updates }
      setSynapseUser(updatedUser)
      // Also update in database
      updateUserInDatabase(updatedUser)
    }
  }

  const updateUserInDatabase = async (userData: SynapseUser) => {
    try {
      await fetch(`/api/user/profile/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }

  return (
    <SynapseAuthContext.Provider value={{
      user: synapseUser,
      login,
      logout,
      updateUserProfile
    }}>
      {children}
    </SynapseAuthContext.Provider>
  )
}

export function SynapseAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackApp}>
      <SynapseAuthProviderContent>
        {children}
      </SynapseAuthProviderContent>
    </StackProvider>
  )
}

export function useSynapseAuth() {
  const context = useContext(SynapseAuthContext)
  if (context === undefined) {
    throw new Error("useSynapseAuth must be used within a SynapseAuthProvider")
  }
  return context
}

// For backward compatibility, export as useAuth
export { useSynapseAuth as useAuth }