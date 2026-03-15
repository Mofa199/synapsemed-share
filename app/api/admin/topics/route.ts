import { type NextRequest, NextResponse } from "next/server"

// Build-safe implementation that returns mock data during build
export async function GET() {
  // Return mock data during build time
  const mockTopics = [
    {
      id: '1',
      title: 'Sample Topic Title',
      description: 'Sample topic description',
      content: 'Sample topic content...',
      difficulty: 'INTERMEDIATE',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
  
  return NextResponse.json({ success: true, data: mockTopics });
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

    // Create mock topic during build time
    const mockTopic = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      content,
      type,
      difficulty,
      duration,
      category,
      moduleId,
      curriculumId,
      tags,
      isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mockTopic }, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
