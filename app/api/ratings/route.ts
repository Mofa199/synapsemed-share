import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, resourceType, resourceId, rating, review } = await request.json()

    // Create or update rating
    const userRating = await prisma.rating.upsert({
      where: {
        userId_resourceType_topicId_articleId_bookId_drugId_questionBankId_studyGuideId_magazineId_videoId_flashcardSetId_simulationId: {
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
        }
      },
      update: {
        rating,
        review,
        updatedAt: new Date(),
      },
      create: {
        userId,
        resourceType,
        [`${resourceType.toLowerCase()}Id`]: resourceId,
        rating,
        review,
      },
    })

    // Calculate average rating for this resource
    const allRatings = await prisma.rating.findMany({
      where: {
        resourceType,
        [`${resourceType.toLowerCase()}Id`]: resourceId,
      },
    })

    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length

    return NextResponse.json({
      success: true,
      data: userRating,
      averageRating: avgRating,
      totalRatings: allRatings.length,
    })
  } catch (error) {
    console.error("Ratings API Error:", error)
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const resourceId = searchParams.get("resourceId")

    const whereClause: any = {}
    
    if (userId) {
      whereClause.userId = userId
    }
    
    if (resourceId) {
      // This would need to be more specific in a real implementation
      // For now, we'll just filter by one of the resource ID fields
      // In practice, you'd want to know the resourceType as well
    }

    const ratings = await prisma.rating.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: ratings })
  } catch (error) {
    console.error("Ratings API Error:", error)
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
  }
}