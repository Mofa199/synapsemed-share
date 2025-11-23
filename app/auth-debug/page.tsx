'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AuthDebugPage() {
  const { user, login, logout } = useAuth()
  const [cookies, setCookies] = useState<string>('')
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie)
    
    // Get debug info
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('synapse-user='))
    
    if (authCookie) {
      try {
        const encodedUser = authCookie.split('=')[1]
        const decodedUser = JSON.parse(decodeURIComponent(encodedUser))
        setDebugInfo(decodedUser)
      } catch (error) {
        setDebugInfo({ error: 'Failed to parse user cookie', details: error })
      }
    }
  }, [user])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testLogin = async () => {
    addTestResult('Testing login...')
    try {
      const success = await login('superadmin@synapsemed.co.tz', 'superadmin123')
      addTestResult(`Login result: ${success ? 'SUCCESS' : 'FAILED'}`)
      
      // Check cookies after login
      setTimeout(() => {
        const newCookies = document.cookie
        setCookies(newCookies)
        addTestResult(`Cookies after login: ${newCookies}`)
      }, 100)
    } catch (error) {
      addTestResult(`Login error: ${error}`)
    }
  }

  const testAdminAccess = () => {
    addTestResult('Testing admin access...')
    window.location.href = '/admin'
  }

  const clearCookies = () => {
    document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setCookies('')
    addTestResult('Cookies cleared')
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Debug Page</h1>
      
      {/* Current User State */}
      <Card>
        <CardHeader>
          <CardTitle>Current User State</CardTitle>
          <CardDescription>Shows the current authentication state</CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> Yes</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          ) : (
            <p className="text-red-600">Not authenticated</p>
          )}
        </CardContent>
      </Card>

      {/* Cookie Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cookie Information</CardTitle>
          <CardDescription>Raw cookie data from browser</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono break-all">
            {cookies || 'No cookies found'}
          </div>
        </CardContent>
      </Card>

      {/* Parsed User Data */}
      <Card>
        <CardHeader>
          <CardTitle>Parsed User Data</CardTitle>
          <CardDescription>Decoded user data from synapse-user cookie</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2) || 'No user data found in cookies'}
          </pre>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
          <CardDescription>Perform authentication tests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <Button onClick={testLogin} variant="default">
              Test Login (superadmin)
            </Button>
            <Button onClick={testAdminAccess} variant="secondary">
              Test Admin Access
            </Button>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
            <Button onClick={clearCookies} variant="destructive">
              Clear All Cookies
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Live test output</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-3 rounded text-sm font-mono max-h-60 overflow-auto">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-3 flex-wrap">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link href="/login" className="text-blue-600 hover:underline">
              Login Page
            </Link>
            <Link href="/admin" className="text-blue-600 hover:underline">
              Admin Page
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Debugging Steps:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Check if you're currently authenticated above</li>
            <li>If not authenticated, click "Test Login" to login with superadmin credentials</li>
            <li>Check the cookie information to see if auth data is being stored</li>
            <li>Click "Test Admin Access" to navigate to admin page</li>
            <li>Check browser console (F12) for any middleware logs or errors</li>
            <li>If issues persist, clear cookies and try again</li>
          </ol>
        </div>
      </div>
    </div>
  )
}