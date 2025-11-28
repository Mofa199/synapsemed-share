import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/question-of-the-day/[id] - Get specific question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.questionOfTheDay.findUnique({
      where: { id: params.id },
      include: {
        userAnswers: {
          select: {
            isCorrect: true,
            answer: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                field: true,
                level: true,
                points: true
              }
            }
          }
        }
      }
    })

    if (!question) {
      return NextResponse.json({
        success: false,
        error: 'Question not found'
      }, { status: 404 })
    }

    // Calculate statistics
    const totalAnswers = question.userAnswers.length
    const correctAnswers = question.userAnswers.filter(a => a.isCorrect).length
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

    return NextResponse.json({
      success: true,
      data: {
        ...question,
        options: JSON.parse(question.options),
        tags: JSON.parse(question.tags),
        totalAnswers,
        correctAnswers,
        accuracy
      }
    })
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch question'
    }, { status: 500 })
  }
}

// PUT /api/admin/question-of-the-day/[id] - Update question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { question, options, correctAnswer, explanation, difficulty, category, tags, dateScheduled, isActive } = body

    // Validate required fields
    if (!question || !options || correctAnswer === undefined || !explanation) {
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

    // Update the question
    const updatedQuestion = await prisma.questionOfTheDay.update({
      where: { id: params.id },
      data: {
        question,
        options: JSON.stringify(options),
        correctAnswer,
        explanation,
        difficulty: difficulty || 'INTERMEDIATE',
        category: category || null,
        tags: JSON.stringify(tags || []),
        dateScheduled: dateScheduled ? new Date(dateScheduled) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updatedQuestion,
        options: JSON.parse(updatedQuestion.options),
        tags: JSON.parse(updatedQuestion.tags)
      }
    })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update question'
    }, { status: 500 })
  }
}

// DELETE /api/admin/question-of-the-day/[id] - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete related answers first
    await prisma.questionOfTheDayAnswer.deleteMany({
      where: { questionId: params.id }
    })

    // Delete the question
    await prisma.questionOfTheDay.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete question'
    }, { status: 500 })
  }
}