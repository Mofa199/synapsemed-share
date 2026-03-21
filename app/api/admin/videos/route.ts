import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// GET /api/admin/videos - Get all videos
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    const videos = await prisma.video.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        curriculum: { select: { name: true } },
        module: { select: { name: true } },
        topic: { select: { title: true } }
      }
    })

    return NextResponse.json({ success: true, data: videos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/videos - Create new video
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, url, thumbnail, duration, category, difficulty, tags, curriculumId, moduleId, topicId, isPublished } = body

    if (!title || !url) {
      return NextResponse.json({ success: false, error: 'Title and URL are required' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        thumbnail,
        duration,
        category,
        difficulty: difficulty || 'BEGINNER',
        tags: JSON.stringify(tags || []),
        curriculumId,
        moduleId,
        topicId,
        isPublished: isPublished || false,
      }
    })

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
