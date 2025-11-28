"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider-nextauth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireSuperAdmin?: boolean
  allowedRoles?: string[]
}

export function AuthGuard({ 
  children, 
  requireAdmin = false, 
  requireSuperAdmin = false, 
  allowedRoles 
}: AuthGuardProps) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    // Check for super admin requirement
    if (requireSuperAdmin && user.role !== "SUPER_ADMIN") {
      router.push("/")
      return
    }

    // Check for admin requirement (Super Admin, Lecturer, Editor)
    if (requireAdmin) {
      const adminRoles = ["SUPER_ADMIN", "LECTURER", "EDITOR"]
      if (!adminRoles.includes(user.role)) {
        router.push("/")
        return
      }
    }

    // Check for specific allowed roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/")
      return
    }
  }, [user, requireAdmin, requireSuperAdmin, allowedRoles, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213874] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireSuperAdmin && user.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Super Admin Access Required</h1>
          <p className="text-gray-600">This page requires Super Admin privileges.</p>
        </div>
      </div>
    )
  }

  if (requireAdmin) {
    const adminRoles = ["SUPER_ADMIN", "LECTURER", "EDITOR"]
    if (!adminRoles.includes(user.role)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Access Required</h1>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      )
    }
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have the required role to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
