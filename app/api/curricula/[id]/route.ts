import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const curriculumId = (await params).id
    
    // Fetch curriculum from database
    const curriculum = await prisma.curriculum.findUnique({
      where: { id: curriculumId },
      include: {
        modules: {
          orderBy: { createdAt: 'asc' },
          include: {
            _count: {
              select: {
                topics: true,
              },
            },
          },
        },
      }
    })

    if (!curriculum) {
      return NextResponse.json({ error: "Curriculum not found" }, { status: 404 })
    }

    return NextResponse.json({ curriculum })
  } catch (error) {
    console.error("Curricula API Error:", error)
    return NextResponse.json({ error: "Failed to get curriculum" }, { status: 500 })
  }
}