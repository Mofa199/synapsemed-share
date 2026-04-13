import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/question-of-the-day - Get all questions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const questions = await prisma.questionOfTheDay.findMany({
      orderBy: { dateScheduled: 'desc' },
      include: {
        userAnswers: {
          select: {
            isCorrect: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                email: true,
                field: true
              }
            }
          }
        }
      }
    })

    // Calculate statistics for each question
    const questionsWithStats = questions.map(question => {
      const totalAnswers = question.userAnswers.length
      const correctAnswers = question.userAnswers.filter(a => a.isCorrect).length
      const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
      
      let parsedOptions = [];
      try {
        parsedOptions = typeof question.options === 'string' ? JSON.parse(question.options) : question.options;
      } catch (e) {
        console.error('Error parsing options:', e);
      }

      let parsedTags = [];
      try {
        parsedTags = typeof question.tags === 'string' ? JSON.parse(question.tags) : question.tags;
      } catch (e) {
        // Fallback for comma-separated string
        parsedTags = typeof question.tags === 'string' ? question.tags.split(',').map(t => t.trim()) : [];
      }
      
      return {
        ...question,
        options: parsedOptions,
        tags: parsedTags,
        totalAnswers,
        correctAnswers,
        accuracy
      }
    })

    return NextResponse.json({
      success: true,
      data: questionsWithStats
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST /api/admin/question-of-the-day - Create new question
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { question, options, correctAnswer, explanation, difficulty, category, tags, dateScheduled } = body

    if (!question || !options || correctAnswer === undefined || !explanation || !dateScheduled) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Validate options
    if (!Array.isArray(options) || options.length === 0) {
      return NextResponse.json({ success: false, error: 'Options must be a non-empty array' }, { status: 400 })
    }

    const scheduledDate = new Date(dateScheduled)
    
    // Check for existing question on this date
    const startOfDay = new Date(scheduledDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(scheduledDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingQuestion = await prisma.questionOfTheDay.findFirst({
      where: {
        dateScheduled: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    if (existingQuestion) {
      return NextResponse.json({ success: false, error: 'A question already exists for this date' }, { status: 400 })
    }

    const newQuestion = await prisma.questionOfTheDay.create({
      data: {
        question,
        options: JSON.stringify(options),
        correctAnswer: parseInt(correctAnswer),
        explanation,
        difficulty: (difficulty as Difficulty) || Difficulty.INTERMEDIATE,
        category: category || null,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : (tags || "[]"),
        dateScheduled: scheduledDate
      }
    })

    return NextResponse.json({ success: true, data: newQuestion })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ success: false, error: 'Failed to create question' }, { status: 500 })
  }
}

// DELETE /api/admin/question-of-the-day - Delete question
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Question ID is required' }, { status: 400 })
    }

    await prisma.questionOfTheDay.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete question' }, { status: 500 })
  }
}