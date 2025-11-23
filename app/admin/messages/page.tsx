'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ChatMessage {
  id: string
  userId: string
  message: string
  response?: string
  role: 'USER' | 'ASSISTANT'
  createdAt: string
  user?: {
    name: string
    email: string
    role: string
  }
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const router = useRouter()

  // Fetch all chat messages
  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/chat')
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data)
      } else {
        setError(data.error || 'Failed to fetch messages')
      }
    } catch (err) {
      setError('Failed to fetch messages')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/admin/chat?id=${messageId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        setMessages(messages.filter(msg => msg.id !== messageId))
      } else {
        alert(data.error || 'Failed to delete message')
      }
    } catch (err) {
      alert('Failed to delete message')
      console.error(err)
    }
  }

  const deleteUserMessages = async (userId: string) => {
    if (!confirm('Are you sure you want to delete ALL messages from this user? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/chat?userId=${userId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        setMessages(messages.filter(msg => msg.userId !== userId))
        alert('All user messages deleted successfully')
      } else {
        alert(data.error || 'Failed to delete user messages')
      }
    } catch (err) {
      alert('Failed to delete user messages')
      console.error(err)
    }
  }

  const filteredMessages = selectedUser 
    ? messages.filter(msg => msg.userId === selectedUser)
    : messages

  const users = Array.from(
    new Map(messages.map(msg => [msg.userId, msg.user])).values()
  ).filter(Boolean).map(user => ({
    id: (user as any).id || '',
    name: user?.name || 'Unknown User',
    email: user?.email || 'No email',
    role: user?.role || 'STUDENT'
  })) as { id: string; name: string; email: string; role: string }[]

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Chat Messages Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Chat Messages Management</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={fetchMessages}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat Messages Management</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchMessages}
        >
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by User:
        </label>
        <select
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value || null)}
          className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredMessages.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No messages found
            </li>
          ) : (
            filteredMessages.map((message) => (
              <li key={message.id} className="px-6 py-4">
                <div className="flex justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {message.user?.name || 'Unknown User'}
                      </p>
                      <p className="ml-2 text-sm text-gray-500">
                        ({message.user?.email || 'No email'})
                      </p>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {message.role}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Message:</span> {message.message}
                      </p>
                      {message.response && (
                        <p className="mt-1 text-sm text-gray-700">
                          <span className="font-medium">Response:</span> {message.response}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => deleteUserMessages(message.userId)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete All User Messages
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}