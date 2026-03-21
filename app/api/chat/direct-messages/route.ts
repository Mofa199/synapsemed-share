import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTokenFromRequest } from "@/lib/db-utils"

// GET /api/chat/direct-messages?userId=...
export async function GET(req: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(req)
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const otherUserId = searchParams.get("userId")

    if (!otherUserId) {
      return new NextResponse("Other user ID is required", { status: 400 })
    }

    // Direct messages are stored with a special channelId format: dm:minId:maxId
    const ids = [user.id, otherUserId].sort()
    const channelId = `dm:${ids[0]}:${ids[1]}`

    // Fetch messages for the DM channel with user information
    const messages = await prisma.chatMessage.findMany({
      where: {
        channelId: channelId,
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
            field: true
          }
        }
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 50,
    })

    // Map to expected frontend format
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.message,
      sender: {
        id: msg.userId,
        name: msg.user?.name || "Member",
        role: msg.user?.role?.toLowerCase() || "user",
        specialty: msg.user?.field
      },
      timestamp: msg.createdAt,
      channelId: msg.channelId
    }))

    return NextResponse.json({ success: true, data: formattedMessages })
  } catch (error) {
    console.error("Error fetching direct messages:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// POST /api/chat/direct-messages
export async function POST(req: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(req)
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { message, receiverId } = await req.json()

    if (!message || !receiverId) {
      return new NextResponse("Message and receiver ID are required", { status: 400 })
    }

    // Use the same channelId format
    const ids = [user.id, receiverId].sort()
    const channelId = `dm:${ids[0]}:${ids[1]}`

    // Save the message to the database
    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        message: message,
        channelId: channelId,
        role: "USER",
      },
    })

    return NextResponse.json({ success: true, data: chatMessage })
  } catch (error) {
    console.error("Error saving direct message:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
