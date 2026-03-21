import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTokenFromRequest } from "@/lib/db-utils"

// GET /api/chat/messages?channelId=...
export async function GET(req: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(req)
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get("channelId")

    if (!channelId) {
      return new NextResponse("Channel ID is required", { status: 400 })
    }

    // Fetch messages for the channel with user information
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
    console.error("Error fetching chat messages:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// POST /api/chat/messages
export async function POST(req: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(req)
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { message, channelId } = await req.json()

    if (!message || !channelId) {
      return new NextResponse("Message and channel ID are required", { status: 400 })
    }

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
    console.error("Error saving chat message:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}