import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const topicId = (await params).id
    
    // Fetch topic from database
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        curriculum: {
          select: {
            name: true,
            field: true,
          }
        },
        module: {
          select: {
            name: true,
          }
        }
      }
    })

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json({ topic })
  } catch (error) {
    console.error("Topics API Error:", error)
    return NextResponse.json({ error: "Failed to get topic" }, { status: 500 })
  }
}
