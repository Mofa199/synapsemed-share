import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const moduleId = (await params).id
    
    // Fetch module from database
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        curriculum: {
          select: {
            name: true,
            field: true,
          }
        },
        topics: {
          where: { isPublished: true },
          orderBy: { createdAt: 'asc' },
        },
      }
    })

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    return NextResponse.json({ module })
  } catch (error) {
    console.error("Modules API Error:", error)
    return NextResponse.json({ error: "Failed to get module" }, { status: 500 })
  }
}