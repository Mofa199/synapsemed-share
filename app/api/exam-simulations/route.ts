import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty, UserField } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/exam-simulations - Fetch exams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const field = searchParams.get('field') as UserField | null
    const difficulty = searchParams.get('difficulty') as Difficulty | null
    const category = searchParams.get('category')

    const where: any = { isActive: true }
    if (field && field !== 'all' as any) where.field = field
    if (difficulty) where.difficulty = difficulty
    if (category) where.category = category

    const exams = await prisma.examSimulation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error('Error fetching exam simulations:', error)
    return NextResponse.json({ error: 'Failed to fetch exam simulations' }, { status: 500 })
  }
}

// POST /api/exam-simulations - Create new exam (Admin/Lecturer only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.SUPER_ADMIN && session.user.role !== UserRole.LECTURER)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, description, field, duration, 
      totalQuestions, passingScore, difficulty, category, isPublic 
    } = body

    if (!title || !description || !field) {
      return NextResponse.json({ success: false, error: 'Title, description, and field are required' }, { status: 400 })
    }

    const exam = await prisma.examSimulation.create({
      data: {
        title,
        description,
        field: field as UserField,
        duration: parseInt(duration),
        totalQuestions: parseInt(totalQuestions),
        passingScore: parseInt(passingScore) || 70,
        difficulty: (difficulty as Difficulty) || Difficulty.INTERMEDIATE,
        category: category || null,
        isPublic: isPublic !== undefined ? !!isPublic : true,
        isActive: true,
        createdById: session.user.id
      }
    })

    return NextResponse.json({ success: true, exam }, { status: 201 })
  } catch (error) {
    console.error('Error creating exam simulation:', error)
    return NextResponse.json({ error: 'Failed to create exam simulation' }, { status: 500 })
  }
}

// PUT /api/exam-simulations - Update exam (Admin/Lecturer only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.SUPER_ADMIN && session.user.role !== UserRole.LECTURER)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Exam ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (processedData.duration) processedData.duration = parseInt(processedData.duration)
    if (processedData.totalQuestions) processedData.totalQuestions = parseInt(processedData.totalQuestions)
    if (processedData.passingScore) processedData.passingScore = parseInt(processedData.passingScore)

    const updatedExam = await prisma.examSimulation.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, exam: updatedExam })
  } catch (error) {
    console.error('Error updating exam simulation:', error)
    return NextResponse.json({ error: 'Failed to update exam simulation' }, { status: 500 })
  }
}

// DELETE /api/exam-simulations - Delete exam (Admin/Lecturer only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.SUPER_ADMIN && session.user.role !== UserRole.LECTURER)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Exam ID is required' }, { status: 400 })
    }

    await prisma.examSimulation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Exam deleted successfully' })
  } catch (error) {
    console.error('Error deleting exam simulation:', error)
    return NextResponse.json({ error: 'Failed to delete exam simulation' }, { status: 500 })
  }
}
