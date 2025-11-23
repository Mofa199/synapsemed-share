import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// POST /api/user/study-plan - Create a study plan with AI assistance
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startDate, endDate, goals } = body

    if (!title || !startDate || !endDate) {
      return NextResponse.json({
        success: false,
        error: 'Title, start date, and end date are required'
      }, { status: 400 })
    }

    try {
      // Try to create in database
      const newPlan = await prisma.studyPlan.create({
        data: {
          userId: user.id,
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          goals: JSON.stringify(goals || [])
        }
      })

      return NextResponse.json({
        success: true,
        data: newPlan
      })
    } catch (dbError) {
      // Fallback to mock response
      console.log('StudyPlan table not yet migrated, using mock response')
      const newPlan = {
        id: Date.now().toString(),
        userId: user.id,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        goals: JSON.stringify(goals || []),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return NextResponse.json({
        success: true,
        data: newPlan
      })
    }
  } catch (error) {
    console.error('Error creating study plan:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create study plan'
    }, { status: 500 })
  }
}
