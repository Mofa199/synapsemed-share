import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/user/bookmarks - Get all user's bookmarks
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all user bookmarks including relevant resource relations
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        user: { email: session.user.email as string }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        article: { select: { id: true, title: true, author: true, category: true } },
        book: { select: { id: true, title: true, author: true, category: true, coverUrl: true } },
        video: { select: { id: true, title: true, category: true, thumbnail: true } },
        drug: { select: { id: true, name: true, brandNames: true } },
        flashcardSet: { select: { id: true, title: true, category: true } },
        questionBank: { select: { id: true, title: true, category: true, difficulty: true } },
        simulation: { select: { id: true, title: true, category: true, difficulty: true } },
        studyGuide: { select: { id: true, title: true, category: true, difficulty: true } },
        topic: { select: { id: true, title: true, category: true, difficulty: true } },
        magazine: { select: { id: true, title: true, category: true, coverUrl: true } },
      }
    })

    // Flatten and format bookmark items for the frontend
    const formattedBookmarks = bookmarks.map((item: any) => {
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
      }

      return {
        id: item.id, // Bookmark ID
        type: item.resourceType,
        createdAt: item.createdAt,
        title: resourceData?.title || resourceData?.name || 'Unknown Content',
        author: resourceData?.author || null,
        category: resourceData?.category || null,
        difficulty: resourceData?.difficulty || null,
        coverUrl: resourceData?.coverUrl || resourceData?.thumbnail || null,
        resourceId: item.articleId || item.bookId || item.videoId || item.drugId || 
                    item.flashcardSetId || item.questionBankId || item.simulationId || 
                    item.studyGuideId || item.topicId || item.magazineId,
        url: `/${type}/${item.articleId || item.bookId || item.videoId || item.drugId || 
                item.flashcardSetId || item.questionBankId || item.simulationId || 
                item.studyGuideId || item.topicId || item.magazineId}`
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedBookmarks
    })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch bookmarks'
    }, { status: 500 })
  }
}

// POST /api/user/bookmarks - Toggle bookmark for a specific resource
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { resourceType, resourceId } = await request.json()
    if (!resourceType || !resourceId) {
      return NextResponse.json({ success: false, error: 'Resource type and ID are required' }, { status: 400 })
    }

    const userId = (await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true }
    }))?.id

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Build the resource unique check based on Prisma schema
    const resourceKey = `${resourceType.toLowerCase()}Id`
    const whereClause: any = {
      userId,
      resourceType,
      [resourceKey]: resourceId
    }

    // Check if bookmark already exists
    const existing = await prisma.bookmark.findFirst({
      where: whereClause
    })

    if (existing) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existing.id }
      })
      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: 'Removed from bookmarks'
      })
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          resourceType,
          [resourceKey]: resourceId
        }
      })
      return NextResponse.json({
        success: true,
        bookmarked: true,
        message: 'Added to bookmarks'
      })
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to toggle bookmark'
    }, { status: 500 })
  }
}
