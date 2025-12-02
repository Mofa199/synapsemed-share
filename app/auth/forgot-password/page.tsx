"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsSubmitted(true)
        toast({
          title: "Success",
          description: "Password reset instructions have been sent to your email.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send password reset email.",
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

  if (isSubmitted) {
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
              <CardTitle className="text-[#213874]">Check Your Email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Please check your email and follow the instructions to reset your password.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-[#213874] hover:bg-[#1a6ac3]"
              >
                Back to Login
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
            <CardTitle className="text-[#213874]">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#213874] hover:bg-[#1a6ac3]"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
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