import { type NextRequest, NextResponse } from "next/server"
import { getTopicsByModule, createTopic } from '@/lib/db-utils'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const topics = await getTopicsByModule(params.id)
    return NextResponse.json({ success: true, data: topics })
  } catch (error) {
    console.error("Error fetching topics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch topics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const type = formData.get("type") as string || 'ARTICLE'
    const difficulty = formData.get("difficulty") as string
    const duration = formData.get("duration") as string || undefined
    const category = formData.get("category") as string || undefined
    const tags = JSON.parse((formData.get("tags") as string) || "[]")
    const isPublished = formData.get("isPublished") === "true"
    const moduleId = params.id

    if (!title || !description || !content || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const topic = await createTopic({
      title,
      description,
      content,
      type: type as 'ARTICLE' | 'VIDEO' | 'INTERACTIVE' | 'QUIZ',
      difficulty: difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
      duration,
      category,
      moduleId,
      tags,
      isPublished,
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