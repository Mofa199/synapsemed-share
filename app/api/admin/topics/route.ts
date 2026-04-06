import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/topics - Get all topics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: topics })
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch topics' }, { status: 500 })
  }
}

// POST /api/admin/topics - Create new topic
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, description, content, category, 
      difficulty, tags, isPublished 
    } = body

    if (!title || !description || !content || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Title, description, content, and difficulty are required' },
        { status: 400 }
      )
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        description: description || null,
        content,
        category: category || "",
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        isPublished: !!isPublished,
      }
    })

    return NextResponse.json({ success: true, data: topic })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json({ success: false, error: 'Failed to create topic' }, { status: 500 })
  }
}

// PUT /api/admin/topics - Update topic
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Topic ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (Array.isArray(processedData.tags)) processedData.tags = processedData.tags.join(', ')

    const topic = await prisma.topic.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: topic })
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json({ success: false, error: 'Failed to update topic' }, { status: 500 })
  }
}

// DELETE /api/admin/topics - Delete topic
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Topic ID is required' }, { status: 400 })
    }

    await prisma.topic.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete topic' }, { status: 500 })
  }
}
