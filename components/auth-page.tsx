"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { signIn } from "next-auth/react"
import {
  User,
  Lock,
  Mail,
  Phone,
  Building,
  Eye,
  EyeOff
} from "lucide-react"
import { useAuth } from "./auth-provider-nextauth"

interface FormData {
  name: string
  email: string
  phone: string
  password: string
  field: string
}

export function AuthPage() {

  const { login } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    field: "MEDICAL",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleFlip = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
      setIsFlipping(false)
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // Login logic
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            rememberMe, // Include remember me in the request
          }),
        })

        const result = await response.json()

        if (result.success) {

          const { user } = result
          login(user.email, formData.password)

          localStorage.setItem("synapse-user", JSON.stringify(user))

          if (['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)) {
            if (typeof window !== 'undefined') window.location.href = '/admin'
          } else {
            if (typeof window !== 'undefined') window.location.href = '/dashboard'
          }

          toast({ title: "Success", description: "Welcome back!" })

        } else {
          toast({
            title: "Error",
            description: result.error || "Invalid credentials",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        })
      }
    } else {
      // Registration logic
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            field: formData.field,
          }),
        })

        const result = await response.json()

        if (result.success) {
          // Auto-login after successful registration
          try {
            const loginRes = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email, password: formData.password, rememberMe: true })
            });
            const loginResult = await loginRes.json();
            if (loginResult.success) {
              const { user } = loginResult;
              login(user.email, formData.password);
              localStorage.setItem("synapse-user", JSON.stringify(user));
            }
          } catch (e) {
            console.error("Auto-login failed", e);
          }

          toast({
            title: "Success",
            description: "Account created successfully!",
          })

          // Redirect to profile page to complete profile if indicated
          setTimeout(() => {
            if (result.redirectToProfile) {
              if (typeof window !== 'undefined') window.location.href = '/profile'
            } else {
              if (typeof window !== 'undefined') window.location.href = '/dashboard'
            }
          }, 500)
        } else {
          toast({
            title: "Error",
            description: result.error || "Registration failed",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        })
      }
    }
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

        <div className="perspective-1000 animate-in slide-in-from-bottom duration-1000">
          <Card className={`transition-transform duration-300 ${isFlipping ? "rotate-y-180" : ""}`}>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#213874]">{isLogin ? "Welcome Back" : "Join Synapse Med"}</h2>
                <p className="text-gray-600 mt-2">
                  {isLogin ? "Sign in to continue your learning journey" : "Start your medical education journey"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required={!isLogin}
                        className="pl-10"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required={!isLogin}
                        className="pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="pl-10 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="field">Primary Field</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Select
                        value={formData.field}
                        onValueChange={(value) => setFormData({ ...formData, field: value })}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select your field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEDICAL">Medical Student</SelectItem>
                          <SelectItem value="NURSING">Nursing Student</SelectItem>
                          <SelectItem value="PHARMACY">Pharmacy Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-[#213874] focus:ring-[#1a6ac3] border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link href="/auth/forgot-password" className="font-medium text-[#213874] hover:text-[#1a6ac3]">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#213874] hover:bg-[#1a6ac3] transform hover:scale-105 transition-all duration-300"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>


              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="ml-2 text-[#213874] hover:text-[#1a6ac3] font-medium transition-colors"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}