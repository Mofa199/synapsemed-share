import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'
import { prisma } from '@/lib/prisma'

// GET /api/user/question-of-the-day - Get today's question
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch today's question from database
    const question = await prisma.questionOfTheDay.findFirst({
      where: {
        dateScheduled: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        isActive: true
      }
    })

    if (!question) {
      return NextResponse.json({
        success: false,
        error: 'No question available for today'
      }, { status: 404 })
    }

    // Check if user has already answered
    const userAnswer = await prisma.questionOfTheDayAnswer.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: question.id
        }
      }
    })

    // Get user's current streak
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { streak: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        question: {
          id: question.id,
          question: question.question,
          options: JSON.parse(question.options),
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          category: question.category,
          tags: JSON.parse(question.tags),
          dateScheduled: question.dateScheduled
        },
        hasAnswered: !!userAnswer,
        userAnswer: userAnswer ? userAnswer.answer : null,
        streak: userData?.streak || 0
      }
    })
  } catch (error) {
    console.error('Error fetching question of the day:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch question'
    }, { status: 500 })
  }
}