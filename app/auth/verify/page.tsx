"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import { CheckCircle, Mail, RotateCw } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Get email from search params or localStorage
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      const storedEmail = localStorage.getItem('pendingVerificationEmail')
      if (storedEmail) {
        setEmail(storedEmail)
      }
    }
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      })

      const result = await response.json()

      if (result.success) {
        setIsVerified(true)
        toast({
          title: "Success",
          description: "Email verified successfully! You can now log in.",
        })
        
        // Clear pending verification data
        localStorage.removeItem('pendingVerificationEmail')
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        throw new Error(result.error || 'Verification failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Verification failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // In a real implementation, this would send a new verification code
      // For now, we'll just simulate it
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#213874] via-[#1a6ac3] to-[#213874] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-in fade-in duration-1000">
            <div className="mx-auto mb-4 animate-bounce">
              <Logo size="lg" className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Synapse Med</h1>
            <p className="text-blue-100">Connect. Learn. Master Medicine.</p>
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-center flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <span className="text-2xl">Email Verified!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You will be redirected to the login page shortly.
              </p>
              <Button 
                onClick={() => router.push('/login')}
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
        <div className="text-center mb-8 animate-in fade-in duration-1000">
          <div className="mx-auto mb-4 animate-bounce">
            <Logo size="lg" className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Synapse Med</h1>
          <p className="text-blue-100">Connect. Learn. Master Medicine.</p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-center flex flex-col items-center">
              <Mail className="h-12 w-12 text-[#213874] mb-4" />
              <span className="text-2xl">Verify Your Email</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 text-center">
              Please enter the verification code sent to your email address.
            </p>
            
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={!!searchParams.get('email')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#213874] hover:bg-[#1a6ac3] flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Code"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}