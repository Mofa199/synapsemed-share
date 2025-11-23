import { type NextRequest, NextResponse } from "next/server"
import { getAllTopics, createTopic } from '@/lib/db-utils'

export async function GET() {
  try {
    const topics = await getAllTopics()
    return NextResponse.json({ success: true, data: topics })
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const type = formData.get("type") as string || 'ARTICLE'
    const difficulty = formData.get("difficulty") as string
    const duration = formData.get("duration") as string || undefined
    const category = formData.get("category") as string || undefined
    const moduleId = formData.get("moduleId") as string || undefined
    const curriculumId = formData.get("curriculumId") as string || undefined
    const tags = JSON.parse((formData.get("tags") as string) || "[]")
    const isPublished = formData.get("isPublished") === "true"

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
      curriculumId,
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
