import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/study-guides - Get all study guides
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const studyGuides = await prisma.studyGuide.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: studyGuides,
      total: studyGuides.length
    });
  } catch (error) {
    console.error('Error fetching study guides:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch study guides' }, { status: 500 })
  }
}

// POST /api/admin/study-guides - Create new study guide
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { 
      title, description, content, difficulty, 
      category, estimatedTime, tags, isPublished 
    } = data
    
    // Validate required fields
    if (!title || !description || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and difficulty are required' },
        { status: 400 }
      )
    }

    const studyGuide = await prisma.studyGuide.create({
      data: {
        title,
        description: description || null,
        content: content || "",
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        category: category || "",
        estimatedTime: estimatedTime ? estimatedTime.toString() : null,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        isPublished: !!isPublished,
      }
    });

    return NextResponse.json({
      success: true,
      data: studyGuide,
      message: 'Study guide created successfully'
    });
  } catch (error) {
    console.error('Error creating study guide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create study guide' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/study-guides - Update study guide
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Study guide ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (Array.isArray(processedData.tags)) processedData.tags = processedData.tags.join(', ')
    if (processedData.estimatedTime) processedData.estimatedTime = processedData.estimatedTime.toString()

    const studyGuide = await prisma.studyGuide.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: studyGuide })
  } catch (error) {
    console.error('Error updating study guide:', error)
    return NextResponse.json({ success: false, error: 'Failed to update study guide' }, { status: 500 })
  }
}

// DELETE /api/admin/study-guides - Delete study guide
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Study guide ID is required' }, { status: 400 })
    }

    await prisma.studyGuide.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Study guide deleted successfully' })
  } catch (error) {
    console.error('Error deleting study guide:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete study guide' }, { status: 500 })
  }
}