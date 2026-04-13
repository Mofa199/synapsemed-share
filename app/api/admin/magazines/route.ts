import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/magazines - Get all magazines
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const magazines = await prisma.magazine.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { articles: true } }
      }
    })

    return NextResponse.json({ success: true, data: magazines })
  } catch (error) {
    console.error('Error fetching magazines:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch magazines' }, { status: 500 })
  }
}

// POST /api/admin/magazines - Create new magazine
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, issue, volume, description, coverUrl, 
      category, tags, isPublished, publishedAt
    } = body

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }

    const magazine = await prisma.magazine.create({
      data: {
        title,
        issue: issue || null,
        volume: volume || null,
        description: description || null,
        coverUrl: coverUrl || null,
        category: category || null,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        isPublished: !!isPublished,
        publishedAt: publishedAt ? new Date(publishedAt) : (isPublished ? new Date() : null),
      }
    })

    return NextResponse.json({ success: true, data: magazine })
  } catch (error) {
    console.error('Error creating magazine:', error)
    return NextResponse.json({ success: false, error: 'Failed to create magazine' }, { status: 500 })
  }
}

// PUT /api/admin/magazines - Update magazine
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Magazine ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (Array.isArray(processedData.tags)) processedData.tags = processedData.tags.join(', ')
    if (processedData.publishedAt) processedData.publishedAt = new Date(processedData.publishedAt)

    const magazine = await prisma.magazine.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: magazine })
  } catch (error) {
    console.error('Error updating magazine:', error)
    return NextResponse.json({ success: false, error: 'Failed to update magazine' }, { status: 500 })
  }
}

// DELETE /api/admin/magazines - Delete magazine
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Magazine ID is required' }, { status: 400 })
    }

    await prisma.magazine.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Magazine deleted successfully' })
  } catch (error) {
    console.error('Error deleting magazine:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete magazine' }, { status: 500 })
  }
}
