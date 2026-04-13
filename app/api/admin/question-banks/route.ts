import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/question-banks - Get all question banks
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const questionBanks = await prisma.questionBank.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: questionBanks,
      total: questionBanks.length
    });
  } catch (error) {
    console.error('Error fetching question banks:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch question banks' }, { status: 500 })
  }
}

// POST /api/admin/question-banks - Create new question bank
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { 
      title, description, difficulty, 
      category, estimatedTime, tags, isPublished 
    } = data
    
    // Validate required fields
    if (!title || !category || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Title, category, and difficulty are required' },
        { status: 400 }
      )
    }

    const questionBank = await prisma.questionBank.create({
      data: {
        title,
        description: description || null,
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        category,
        estimatedTime: estimatedTime ? estimatedTime.toString() : null,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        isPublished: !!isPublished,
      }
    });

    return NextResponse.json({
      success: true,
      data: questionBank,
      message: 'Question bank created successfully'
    });
  } catch (error) {
    console.error('Error creating question bank:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question bank' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/question-banks - Update question bank
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Question bank ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (Array.isArray(processedData.tags)) processedData.tags = processedData.tags.join(', ')
    if (processedData.estimatedTime) processedData.estimatedTime = processedData.estimatedTime.toString()

    const questionBank = await prisma.questionBank.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: questionBank })
  } catch (error) {
    console.error('Error updating question bank:', error)
    return NextResponse.json({ success: false, error: 'Failed to update question bank' }, { status: 500 })
  }
}

// DELETE /api/admin/question-banks - Delete question bank
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Question bank ID is required' }, { status: 400 })
    }

    await prisma.questionBank.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Question bank deleted successfully' })
  } catch (error) {
    console.error('Error deleting question bank:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete question bank' }, { status: 500 })
  }
}