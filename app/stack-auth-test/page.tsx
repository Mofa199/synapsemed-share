"use client"

import { useAuth } from "@/components/auth-provider-nextauth"
import { useState } from "react"

export default function StackAuthTest() {
  const [email, setEmail] = useState("")
  const { user, login, logout } = useAuth()
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        console.log('Login successful!')
      } else {
        console.log('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Stack Auth Test</h1>

      {user ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <a
            href="/admin"
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            Go to Admin
          </a>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login with Stack Auth'}
          </button>
        </form>
      )}

      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold">Test Credentials:</h3>
        <p>Use any email/password to test Stack Auth integration</p>
        <p>Stack Auth will handle user registration automatically</p>
      </div>
    </div>
  )
}