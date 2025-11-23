import { NextRequest, NextResponse } from 'next/server'
import { getQuestionById, updateQuestion, deleteQuestion } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await getQuestionById(params.id)
    
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: question })
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      questionBankId,
      text,
      type,
      options,
      correctAnswer,
      explanation,
      difficulty,
      points,
      tags
    } = body

    if (!text || !type || !correctAnswer || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Text, type, correct answer, and difficulty are required' },
        { status: 400 }
      )
    }

    const question = await updateQuestion(params.id, {
      questionBankId,
      text,
      type,
      options,
      correctAnswer,
      explanation,
      difficulty,
      points: points ? parseInt(points) : undefined,
      tags,
    })

    return NextResponse.json({ success: true, data: question })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteQuestion(params.id)
    return NextResponse.json({ success: true, message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}