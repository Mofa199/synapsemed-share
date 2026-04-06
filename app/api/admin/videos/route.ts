import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/videos - Get all videos
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const videos = await prisma.video.findMany({
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
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 })
  }
}

// POST /api/admin/videos - Create new video
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, description, url, thumbnail, duration, 
      category, difficulty, tags, curriculumId, 
      moduleId, topicId, isPublished 
    } = body

    if (!title || !url) {
      return NextResponse.json({ success: false, error: 'Title and URL are required' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        url,
        thumbnail: thumbnail || null,
        duration: duration || null,
        category: category || null,
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        curriculumId: curriculumId || null,
        moduleId: moduleId || null,
        topicId: topicId || null,
        isPublished: !!isPublished,
      }
    })

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ success: false, error: 'Failed to create video' }, { status: 500 })
  }
}

// PUT /api/admin/videos - Update video
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (Array.isArray(processedData.tags)) processedData.tags = processedData.tags.join(', ')

    const video = await prisma.video.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 })
  }
}

// DELETE /api/admin/videos - Delete video
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
    }

    await prisma.video.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 })
  }
}
