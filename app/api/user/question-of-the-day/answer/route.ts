import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'
import { prisma } from '@/lib/prisma'

// POST /api/user/question-of-the-day/answer - Submit answer
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { questionId, answer } = body

    if (questionId === undefined || answer === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Question ID and answer are required'
      }, { status: 400 })
    }

    // Fetch the question to get correct answer
    const question = await prisma.questionOfTheDay.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json({
        success: false,
        error: 'Question not found'
      }, { status: 404 })
    }

    // Check if answer is correct
    const isCorrect = answer === question.correctAnswer

    // Check if user has already answered this question
    const existingAnswer = await prisma.questionOfTheDayAnswer.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: questionId
        }
      }
    })

    if (existingAnswer) {
      return NextResponse.json({
        success: false,
        error: 'You have already answered this question'
      }, { status: 400 })
    }

    // Save the answer to database
    const userAnswer = await prisma.questionOfTheDayAnswer.create({
      data: {
        userId: user.id,
        questionId,
        answer,
        isCorrect,
      }
    })

    // Update user's streak and points
    let pointsEarned = 0
    let newStreak = 0

    if (isCorrect) {
      // Get current user data
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { streak: true, points: true }
      })

      if (currentUser) {
        newStreak = currentUser.streak + 1
        pointsEarned = 10

        // Update user
        await prisma.user.update({
          where: { id: user.id },
          data: {
            points: { increment: pointsEarned },
            streak: newStreak
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        pointsEarned,
        streak: newStreak,
        userAnswer
      }
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to submit answer'
    }, { status: 500 })
  }
}