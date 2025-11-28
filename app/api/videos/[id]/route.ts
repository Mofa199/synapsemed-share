import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const videoId = params.id
    
    // Fetch video from database
    const video = await prisma.video.findUnique({
      where: { id: videoId },
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

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error("Videos API Error:", error)
    return NextResponse.json({ error: "Failed to get video" }, { status: 500 })
  }
}
