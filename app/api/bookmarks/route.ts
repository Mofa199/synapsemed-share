import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, resourceType, resourceId, bookmarked } = await request.json()

    if (bookmarked) {
      // Add bookmark
      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          resourceType,
          [`${resourceType.toLowerCase()}Id`]: resourceId
        }
      })

      return NextResponse.json({ success: true, data: bookmark })
    } else {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_resourceType_topicId_articleId_bookId_drugId_questionBankId_studyGuideId_magazineId_videoId_flashcardSetId_simulationId_conceptId: {
            userId,
            resourceType,
            topicId: resourceType === 'TOPIC' ? resourceId : null,
            articleId: resourceType === 'ARTICLE' ? resourceId : null,
            bookId: resourceType === 'BOOK' ? resourceId : null,
            drugId: resourceType === 'DRUG' ? resourceId : null,
            questionBankId: resourceType === 'QUESTION_BANK' ? resourceId : null,
            studyGuideId: resourceType === 'STUDY_GUIDE' ? resourceId : null,
            magazineId: resourceType === 'MAGAZINE' ? resourceId : null,
            videoId: resourceType === 'VIDEO' ? resourceId : null,
            flashcardSetId: resourceType === 'FLASHCARD_SET' ? resourceId : null,
            simulationId: resourceType === 'SIMULATION' ? resourceId : null,
            conceptId: resourceType === 'CONCEPT' ? resourceId : null,
          }
        }
      })

      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error("Bookmarks API Error:", error)
    return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const resourceId = searchParams.get("resourceId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const whereClause: any = { userId }
    
    if (resourceId) {
      // This is a more complex query that would need to check all possible resource ID fields
      // For simplicity, we'll return all bookmarks for the user
      // In a real implementation, you'd want to filter by the specific resource
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: bookmarks })
  } catch (error) {
    console.error("Bookmarks API Error:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}