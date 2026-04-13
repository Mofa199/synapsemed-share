import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/user/recommendations - Get personalized content recommendations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Default recommendations for Guest if no session
    const userField = session?.user?.field || 'MEDICAL'

    // Fetch recommendations concurrently using Promise.all
    // Mix of newest and popular items
    const [
      newArticles,
      popularBooks,
      recommendedVideos,
      featuredTopics
    ] = await Promise.all([
      // 1. Newest Articles
      prisma.article.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        include: { authorUser: { select: { name: true } } }
      }),
      // 2. Popular Books in User's Field
      prisma.book.findMany({
        where: { 
          isPublished: true,
          OR: [
            { curriculum: { field: userField as any } },
            { tags: { contains: userField.toLowerCase() } }
          ]
        },
        orderBy: { views: 'desc' },
        take: 2
      }),
      // 3. Recommended Videos
      prisma.video.findMany({
        where: { 
          isPublished: true,
          OR: [
            { curriculum: { field: userField as any } },
            { tags: { contains: userField.toLowerCase() } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 2
      }),
      // 4. Featured Topics
      prisma.topic.findMany({
        where: { 
          isPublished: true,
          OR: [
            { curriculum: { field: userField as any } },
            { tags: { contains: userField.toLowerCase() } }
          ]
        },
        orderBy: { views: 'desc' },
        take: 3
      })
    ])

    // Mix and label the results
    const recommendations = [
      ...newArticles.map(a => ({ ...a, type: 'ARTICLE', recommendationReason: 'Newest Content' })),
      ...popularBooks.map(b => ({ ...b, type: 'BOOK', recommendationReason: `Popular in ${userField}` })),
      ...recommendedVideos.map(v => ({ ...v, type: 'VIDEO', recommendationReason: 'Recommended Video' })),
      ...featuredTopics.map(t => ({ ...t, type: 'TOPIC', recommendationReason: 'Top Topic' }))
    ]

    // Sort by a simple heuristic (e.g. newest first)
    recommendations.sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime())

    return NextResponse.json({
      success: true,
      data: recommendations.slice(0, 8), // Return top 8 recommendations
      userField
    })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch recommendations'
    }, { status: 500 })
  }
}
