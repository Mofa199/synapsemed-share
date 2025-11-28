import { type NextRequest, NextResponse } from "next/server"
import { getAllProgress, getUserProgress, trackProgress } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const { userId, resourceType, resourceId, completionPercentage, timeSpent } = await request.json()

    if (!userId || !resourceType || !resourceId || completionPercentage === undefined || timeSpent === undefined) {
      return NextResponse.json(
        { error: "User ID, resource type, resource ID, completion percentage, and time spent are required" },
        { status: 400 }
      )
    }

    // Valid resource types: TOPIC, QUESTION_BANK, STUDY_GUIDE
    if (!['TOPIC', 'QUESTION_BANK', 'STUDY_GUIDE'].includes(resourceType)) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      )
    }

    const progress = await trackProgress(
      userId,
      resourceType,
      resourceId,
      completionPercentage,
      timeSpent
    )

    return NextResponse.json({
      success: true,
      data: progress,
    })
  } catch (error) {
    console.error("Progress API Error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      // Get progress for specific user
      const progress = await getUserProgress(userId)
      return NextResponse.json({ success: true, data: progress })
    } else {
      // Get all progress (admin view)
      const allProgress = await getAllProgress()
      return NextResponse.json({ success: true, data: allProgress })
    }
  } catch (error) {
    console.error("Progress API Error:", error)
    return NextResponse.json({ error: "Failed to get progress" }, { status: 500 })
  }
}
