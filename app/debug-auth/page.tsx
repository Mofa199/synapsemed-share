"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import dynamic from 'next/dynamic'

function DebugAuthComponent() {
  const { user, login } = useAuth()
  const [loginResult, setLoginResult] = useState<string>("")
  const [cookies, setCookies] = useState<string>("")
  const [localStorageData, setLocalStorageData] = useState<string>("")

  useEffect(() => {
    // Check cookies and localStorage only on client side
    setCookies(document.cookie)
    setLocalStorageData(localStorage.getItem("synapse-user") || "No localStorage data")
  }, [])

  const testLogin = async () => {
    const result = await login("superadmin@synapsemed.co.tz", "superadmin123")
    setLoginResult(result ? "Login successful!" : "Login failed!")
    
    // Update cookies display
    setTimeout(() => {
      setCookies(document.cookie)
      setLocalStorageData(localStorage.getItem("synapse-user") || "No localStorage data")
    }, 100)
  }

  const clearAuth = () => {
    localStorage.removeItem("synapse-user")
    document.cookie = "synapse-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.reload()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Current User:</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {user ? JSON.stringify(user, null, 2) : "No user logged in"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Cookies:</h2>
          <pre className="bg-gray-100 p-2 rounded break-all">
            {cookies || "No cookies"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">localStorage:</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {localStorageData}
          </pre>
        </div>

        <div className="space-x-4">
          <button 
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Test Login
          </button>
          
          <button 
            onClick={clearAuth}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Auth
          </button>

          <button 
            onClick={() => window.location.href = '/admin'}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Go to Admin
          </button>
        </div>

        {loginResult && (
          <div className="mt-4 p-2 bg-yellow-100 rounded">
            {loginResult}
          </div>
        )}
      </div>
    </div>
  )
}

// Export with dynamic import to disable SSR
const DebugAuth = dynamic(() => Promise.resolve(DebugAuthComponent), {
  ssr: false
})

export default DebugAuth