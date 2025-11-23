import { NextRequest, NextResponse } from 'next/server'
import { getAllChatMessages, createChatMessage, deleteChatMessage, deleteAllUserMessages } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let messages = await getAllChatMessages()

    if (userId) {
      messages = messages.filter(m => m.userId === userId)
    }

    return NextResponse.json({
      success: true,
      data: messages,
      total: messages.length
    })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat messages' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/chat?id=...&userId=...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!messageId && !userId) {
      return NextResponse.json(
        { success: false, error: 'Message ID or User ID is required' },
        { status: 400 }
      )
    }

    if (messageId) {
      // Delete a specific message
      await deleteChatMessage(messageId)
      return NextResponse.json({
        success: true,
        message: 'Chat message deleted successfully'
      })
    }

    if (userId) {
      // Delete all messages from a user
      await deleteAllUserMessages(userId)
      return NextResponse.json({
        success: true,
        message: 'All user chat messages deleted successfully'
      })
    }

  } catch (error) {
    console.error('Error deleting chat message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete chat message' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.userId || !data.message) {
      return NextResponse.json(
        { success: false, error: 'User ID and message are required' },
        { status: 400 }
      )
    }

    const chatMessage = await createChatMessage({
      userId: data.userId,
      message: data.message,
      response: data.response,
      role: 'USER',
    })

    return NextResponse.json({
      success: true,
      data: chatMessage,
      message: 'Chat message created successfully'
    })
  } catch (error) {
    console.error('Error creating chat message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create chat message' },
      { status: 500 }
    )
  }
}