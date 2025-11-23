"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Get token from URL query parameters
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      toast({
        title: "Error",
        description: "Invalid or missing reset token.",
        variant: "destructive",
      })
      router.push("/auth/forgot-password")
    }
  }, [searchParams, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsSuccess(true)
        toast({
          title: "Success",
          description: "Your password has been reset successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reset password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#213874] via-[#1a6ac3] to-[#213874] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4">
              <Logo size="lg" className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Synapse Med</h1>
            <p className="text-blue-100">Connect. Learn. Master Medicine.</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#213874]">Password Reset Successful</CardTitle>
              <CardDescription>
                Your password has been updated successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You can now log in with your new password.
              </p>
              <Button 
                onClick={() => router.push("/login")} 
                className="w-full bg-[#213874] hover:bg-[#1a6ac3]"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#213874] via-[#1a6ac3] to-[#213874] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <Logo size="lg" className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Synapse Med</h1>
          <p className="text-blue-100">Connect. Learn. Master Medicine.</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#213874]">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#213874] hover:bg-[#1a6ac3]"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/login" className="text-[#213874] hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}