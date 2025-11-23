import { type NextRequest, NextResponse } from "next/server"

// Mock database - in real app, this would be a proper database
const highlights: Record<string, any> = {}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, itemId, highlights: userHighlights } = await request.json()

    const key = `${userId}:${type}:${itemId}`
    highlights[key] = {
      highlights: userHighlights,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Highlights API Error:", error)
    return NextResponse.json({ error: "Failed to save highlights" }, { status: 500 })
  }
}
