import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const studyGuideId = (await params).id
    
    // Fetch study guide from database
    const studyGuide = await prisma.studyGuide.findUnique({
      where: { id: studyGuideId }
    })

    if (!studyGuide) {
      return NextResponse.json({ error: "Study guide not found" }, { status: 404 })
    }

    return NextResponse.json({ studyGuide })
  } catch (error) {
    console.error("Study Guides API Error:", error)
    return NextResponse.json({ error: "Failed to get study guide" }, { status: 500 })
  }
}