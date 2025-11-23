import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/question-of-the-day - Get all questions
export async function GET() {
  try {
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
      
      return {
        ...question,
        options: JSON.parse(question.options),
        tags: JSON.parse(question.tags),
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
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch questions'
    }, { status: 500 })
  }
}

// POST /api/admin/question-of-the-day - Create new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, options, correctAnswer, explanation, difficulty, category, tags, dateScheduled } = body

    // Validate required fields
    if (!question || !options || correctAnswer === undefined || !explanation || !dateScheduled) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Validate options array
    if (!Array.isArray(options) || options.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Options must be a non-empty array'
      }, { status: 400 })
    }

    // Validate correctAnswer index
    if (correctAnswer < 0 || correctAnswer >= options.length) {
      return NextResponse.json({
        success: false,
        error: 'Invalid correct answer index'
      }, { status: 400 })
    }

    // Validate date
    const scheduledDate = new Date(dateScheduled)
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid date format'
      }, { status: 400 })
    }

    // Check if a question already exists for this date
    const existingQuestion = await prisma.questionOfTheDay.findFirst({
      where: {
        dateScheduled: {
          gte: new Date(scheduledDate.setHours(0, 0, 0, 0)),
          lt: new Date(scheduledDate.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    if (existingQuestion) {
      return NextResponse.json({
        success: false,
        error: 'A question already exists for this date'
      }, { status: 400 })
    }

    // Create the question
    const newQuestion = await prisma.questionOfTheDay.create({
      data: {
        question,
        options: JSON.stringify(options),
        correctAnswer,
        explanation,
        difficulty: difficulty || 'INTERMEDIATE',
        category: category || null,
        tags: JSON.stringify(tags || []),
        dateScheduled: scheduledDate
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...newQuestion,
        options: JSON.parse(newQuestion.options),
        tags: JSON.parse(newQuestion.tags)
      }
    })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create question'
    }, { status: 500 })
  }
}