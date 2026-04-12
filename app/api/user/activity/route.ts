import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/user/activity - Get recent activity for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the most recent progress entries for the user
    // including the relevant resource relations
    const activity = await prisma.progress.findMany({
      where: {
        user: { email: session.user.email as string }
      },
      orderBy: {
        lastAccessedAt: 'desc'
      },
      take: 10,
      include: {
        article: { select: { id: true, title: true, author: true, category: true } },
        book: { select: { id: true, title: true, author: true, category: true } },
        video: { select: { id: true, title: true, category: true } },
        drug: { select: { id: true, name: true, brandNames: true } },
        flashcardSet: { select: { id: true, title: true, category: true } },
        questionBank: { select: { id: true, title: true, category: true, difficulty: true } },
        simulation: { select: { id: true, title: true, category: true, difficulty: true } },
        studyGuide: { select: { id: true, title: true, category: true, difficulty: true } },
        topic: { select: { id: true, title: true, category: true, difficulty: true } },
        magazine: { select: { id: true, title: true, category: true } },
        concept: { select: { id: true, title: true, category: true } },
      }
    })

    // Flatten and format activity items for the frontend
    const formattedActivity = activity.map((item: any) => {
      let resourceData: any = null
      let type = item.resourceType.toLowerCase()

      switch (item.resourceType) {
        case 'ARTICLE': resourceData = item.article; break
        case 'BOOK': resourceData = item.book; break
        case 'VIDEO': resourceData = item.video; break
        case 'DRUG': resourceData = item.drug; break
        case 'FLASHCARD_SET': resourceData = item.flashcardSet; break
        case 'QUESTION_BANK': resourceData = item.questionBank; break
        case 'SIMULATION': resourceData = item.simulation; break
        case 'STUDY_GUIDE': resourceData = item.studyGuide; break
        case 'TOPIC': resourceData = item.topic; break
        case 'MAGAZINE': resourceData = item.magazine; break
        case 'CONCEPT': resourceData = item.concept; break
      }

      return {
        id: item.id,
        type: item.resourceType,
        status: item.status,
        progress: item.completionPercentage,
        timeSpent: item.timeSpent,
        lastAccessedAt: item.lastAccessedAt,
        title: resourceData?.title || resourceData?.name || 'Unknown Content',
        author: resourceData?.author || null,
        category: resourceData?.category || null,
        difficulty: resourceData?.difficulty || null,
        resourceId: item.articleId || item.bookId || item.videoId || item.drugId || 
                    item.flashcardSetId || item.questionBankId || item.simulationId || 
                    item.studyGuideId || item.topicId || item.magazineId || item.conceptId,
        url: `/${type}/${item.articleId || item.bookId || item.videoId || item.drugId || 
                item.flashcardSetId || item.questionBankId || item.simulationId || 
                item.studyGuideId || item.topicId || item.magazineId || item.conceptId}`
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedActivity
    })
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user activity'
    }, { status: 500 })
  }
}
