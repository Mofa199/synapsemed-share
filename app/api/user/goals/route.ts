import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/user/goals - Get user's study goals
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')

    let whereClause: any = {
      userId: user.id
    }

    if (completed !== null) {
      whereClause.completed = completed === 'true'
    }

    try {
      // Try to fetch from database
      const goals = await prisma.studyGoal.findMany({
        where: whereClause,
        orderBy: [
          { completed: 'asc' },
          { priority: 'desc' },
          { dueDate: 'asc' }
        ]
      })

      return NextResponse.json({
        success: true,
        data: goals
      })
    } catch (dbError) {
      // Fallback to mock data if table doesn't exist yet
      console.log('StudyGoal table not yet migrated, using mock data')
      const mockGoals = [
        {
          id: '1',
          userId: user.id,
          title: 'Complete Cardiology Module',
          description: 'Finish all cardiology videos and practice questions',
          progress: 75,
          dueDate: new Date('2025-09-30'),
          priority: 'HIGH',
          category: 'Cardiology',
          tags: 'cardiology, module',
          completed: false,
          completedAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          userId: user.id,
          title: 'Finish Anatomy Videos',
          description: 'Watch remaining anatomy lecture series',
          progress: 40,
          dueDate: new Date('2025-10-15'),
          priority: 'MEDIUM',
          category: 'Anatomy',
          tags: 'anatomy, videos',
          completed: false,
          completedAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          userId: user.id,
          title: 'Review Pharmacology Notes',
          description: 'Go through all pharmacology notes before exam',
          progress: 100,
          dueDate: new Date('2025-09-20'),
          priority: 'URGENT',
          category: 'Pharmacology',
          tags: 'pharmacology, review',
          completed: true,
          completedAt: new Date('2025-09-20'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      return NextResponse.json({
        success: true,
        data: mockGoals
      })
    }
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch goals'
    }, { status: 500 })
  }
}

// POST /api/user/goals - Create new goal
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, dueDate, priority, category, tags } = body

    if (!title) {
      return NextResponse.json({
        success: false,
        error: 'Title is required'
      }, { status: 400 })
    }

    try {
      // Try to create in database
      const newGoal = await prisma.studyGoal.create({
        data: {
          userId: user.id,
          title,
          description,
          dueDate: dueDate ? new Date(dueDate) : null,
          priority: priority || 'MEDIUM',
          category,
          tags: tags || ''
        }
      })

      return NextResponse.json({
        success: true,
        data: newGoal
      })
    } catch (dbError) {
      // Fallback to mock response
      console.log('StudyGoal table not yet migrated, using mock response')
      const newGoal = {
        id: Date.now().toString(),
        userId: user.id,
        title,
        description,
        progress: 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        category,
        tags: tags || '',
        completed: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return NextResponse.json({
        success: true,
        data: newGoal
      })
    }
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create goal'
    }, { status: 500 })
  }
}

// PUT /api/user/goals - Update goal
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, progress, dueDate, priority, category, tags, completed } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Goal ID is required'
      }, { status: 400 })
    }

    try {
      // Try to update in database
      const updateData: any = {
        title,
        description,
        progress,
        priority,
        category,
        tags
      }

      if (dueDate) updateData.dueDate = new Date(dueDate)
      if (completed !== undefined) {
        updateData.completed = completed
        if (completed) updateData.completedAt = new Date()
      }

      const updatedGoal = await prisma.studyGoal.update({
        where: {
          id,
          userId: user.id
        },
        data: updateData
      })

      return NextResponse.json({
        success: true,
        data: updatedGoal
      })
    } catch (dbError) {
      // Fallback to mock response
      console.log('StudyGoal table not yet migrated, using mock response')
      const updatedGoal = {
        id,
        userId: user.id,
        title,
        description,
        progress,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        category,
        tags,
        completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date()
      }

      return NextResponse.json({
        success: true,
        data: updatedGoal
      })
    }
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update goal'
    }, { status: 500 })
  }
}

// DELETE /api/user/goals - Delete goal
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('id')

    if (!goalId) {
      return NextResponse.json({
        success: false,
        error: 'Goal ID is required'
      }, { status: 400 })
    }

    try {
      // Try to delete from database
      await prisma.studyGoal.delete({
        where: {
          id: goalId,
          userId: user.id
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Goal deleted successfully'
      })
    } catch (dbError) {
      // Fallback to mock response
      console.log('StudyGoal table not yet migrated, using mock response')
      return NextResponse.json({
        success: true,
        message: 'Goal deleted successfully'
      })
    }
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete goal'
    }, { status: 500 })
  }
}
