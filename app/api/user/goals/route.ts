import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/user/goals - Get current user's study goals
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userRecord = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true }
    })

    if (!userRecord) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const goals = await prisma.studyGoal.findMany({
      where: {
        userId: userRecord.id
      },
      orderBy: [
        { completed: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' }
      ],
      take: 5
    })

    return NextResponse.json({
      success: true,
      data: goals
    })
  } catch (error) {
    console.error('Error fetching study goals:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch study goals'
    }, { status: 500 })
  }
}

// POST /api/user/goals - Create a new study goal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, dueDate, priority, category, tags } = body

    const userId = (await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true }
    }))?.id

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const goal = await prisma.studyGoal.create({
      data: {
        userId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        category,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : (tags || ''),
      }
    })

    return NextResponse.json({
      success: true,
      data: goal
    })
  } catch (error) {
    console.error('Error creating study goal:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create study goal'
    }, { status: 500 })
  }
}
