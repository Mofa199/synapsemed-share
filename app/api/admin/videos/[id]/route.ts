import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// GET /api/admin/videos/[id] - Get specific video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        curriculum: { select: { name: true } },
        module: { select: { name: true } },
        topic: { select: { title: true } }
      }
    })

    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/videos/[id] - Update video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, url, thumbnail, duration, category, difficulty, tags, curriculumId, moduleId, topicId, isPublished } = body

    const video = await prisma.video.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(url && { url }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(duration !== undefined && { duration }),
        ...(category !== undefined && { category }),
        ...(difficulty !== undefined && { difficulty }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(curriculumId !== undefined && { curriculumId }),
        ...(moduleId !== undefined && { moduleId }),
        ...(topicId !== undefined && { topicId }),
        ...(isPublished !== undefined && { isPublished }),
      }
    })

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/videos/[id] - Delete video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.video.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
