import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const moduleId = (await params).id

    // Query real topics for this module from Prisma
    let topics = await prisma.topic.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'desc' }
    })

    // If no specific topics bound to this moduleId, fetch all topics so newly created ones are visible
    if (topics.length === 0) {
      topics = await prisma.topic.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    }

    return NextResponse.json({ success: true, data: topics })
  } catch (error) {
    console.error("Error fetching module topics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch topics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const moduleId = (await params).id
    const body = await request.json().catch(() => null) || {}

    const title = body.title
    const description = body.description
    const content = body.content
    const difficulty = body.difficulty || 'BEGINNER'

    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        content,
        type: body.type || 'ARTICLE',
        difficulty,
        duration: body.duration || null,
        category: body.category || '',
        moduleId,
        isPublished: true
      }
    })

    return NextResponse.json({ success: true, data: topic }, { status: 201 })
  } catch (error) {
    console.error("Error creating topic:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create topic" },
      { status: 500 }
    )
  }
}