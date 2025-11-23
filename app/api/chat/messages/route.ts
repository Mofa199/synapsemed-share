import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { validateUser } from "@/lib/db-utils"

// Helper function to verify JWT token from cookie
async function verifyToken(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded
  } catch {
    return null
  }
}

// GET /api/chat/messages?channelId=...
export async function GET(req: NextRequest) {
  try {
    const tokenData = await verifyToken(req)
    
    if (!tokenData) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get("channelId")

    if (!channelId) {
      return new NextResponse("Channel ID is required", { status: 400 })
    }

    // Fetch messages for the channel
    const messages = await prisma.chatMessage.findMany({
      where: {
        channelId: channelId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 50, // Limit to last 50 messages
    })

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// POST /api/chat/messages
export async function POST(req: NextRequest) {
  try {
    const tokenData = await verifyToken(req)
    
    if (!tokenData) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { message, channelId } = await req.json()

    if (!message || !channelId) {
      return new NextResponse("Message and channel ID are required", { status: 400 })
    }

    // Save the message to the database
    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId: tokenData.userId,
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