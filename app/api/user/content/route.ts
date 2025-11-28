import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// GET /api/user/content - Get user's saved and in-progress content
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    // Fetch user's progress
    const progressRecords = await prisma.progress.findMany({
      where: { userId: user.id },
      orderBy: { lastAccessedAt: 'desc' }
    })

    // Create a simple response with the data we have
    const responseData = [
      ...bookmarks.map(b => ({
        id: b.id,
        userId: user.id,
        title: `Bookmarked Content ${b.id.slice(0, 8)}`,
        type: 'Content',
        resourceType: b.resourceType,
        resourceId: b.topicId || b.articleId || b.bookId || b.videoId || b.questionBankId || b.studyGuideId || b.drugId || '',
        duration: 'N/A',
        progress: 0,
        lastAccessed: b.createdAt,
        tags: ['bookmark'],
        bookmarked: true,
        url: getResourceUrl(b.resourceType, b.topicId || b.articleId || b.bookId || b.videoId || b.questionBankId || b.studyGuideId || b.drugId || '')
      })),
      ...progressRecords.map(p => ({
        id: p.id,
        userId: user.id,
        title: `In Progress Content ${p.id.slice(0, 8)}`,
        type: 'Content',
        resourceType: p.resourceType,
        resourceId: p.topicId || p.questionBankId || p.studyGuideId || p.flashcardSetId || p.simulationId || '',
        duration: 'N/A',
        progress: p.completionPercentage,
        lastAccessed: p.lastAccessedAt,
        tags: ['in-progress'],
        bookmarked: false,
        url: getResourceUrl(p.resourceType, p.topicId || p.questionBankId || p.studyGuideId || p.flashcardSetId || p.simulationId || '')
      }))
    ]

    return NextResponse.json({
      success: true,
      data: responseData
    })
  } catch (error) {
    console.error('Error fetching user content:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content'
    }, { status: 500 })
  }
}

// Helper function to generate resource URLs
function getResourceUrl(resourceType: string, resourceId: string): string {
  switch (resourceType) {
    case 'VIDEO':
      return `/student/videos/${resourceId}`
    case 'TOPIC':
      return `/topic/${resourceId}`
    case 'QUESTION_BANK':
      return `/question-bank/${resourceId}`
    case 'STUDY_GUIDE':
      return `/study-guide/${resourceId}`
    case 'BOOK':
      return `/book/${resourceId}`
    case 'ARTICLE':
      return `/article/${resourceId}`
    case 'DRUG':
      return `/drug/${resourceId}`
    default:
      return `/student/dashboard`
  }
}
