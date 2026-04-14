import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const magazineId = (await params).id
    
    // Fetch magazine from database
    const magazine = await prisma.magazine.findUnique({
      where: { id: magazineId },
      include: {
        articles: {
          orderBy: { order: 'asc' },
        },
      }
    })

    if (!magazine) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    return NextResponse.json({ magazine })
  } catch (error) {
    console.error("Magazines API Error:", error)
    return NextResponse.json({ error: "Failed to get magazine" }, { status: 500 })
  }
}