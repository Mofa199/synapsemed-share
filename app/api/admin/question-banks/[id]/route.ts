import { NextRequest, NextResponse } from 'next/server'
import { getQuestionBankById, updateQuestionBank, deleteQuestionBank } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionBank = await getQuestionBankById(params.id)
    
    if (!questionBank) {
      return NextResponse.json(
        { success: false, error: 'Question bank not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: questionBank })
  } catch (error) {
    console.error('Error fetching question bank:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question bank' },
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
      name, 
      description, 
      difficulty,
      examType,
      category,
      timeLimit,
      passingScore,
      curriculumId,
      moduleId,
      tags,
      isPublished
    } = body

    if (!name || !description || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and difficulty are required' },
        { status: 400 }
      )
    }

    const questionBank = await updateQuestionBank(params.id, {
      name,
      description,
      difficulty,
      examType,
      category,
      timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
      passingScore: passingScore ? parseInt(passingScore) : undefined,
      curriculumId,
      moduleId,
      tags,
      isPublished,
    })

    return NextResponse.json({ success: true, data: questionBank })
  } catch (error) {
    console.error('Error updating question bank:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update question bank' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteQuestionBank(params.id)
    return NextResponse.json({ success: true, message: 'Question bank deleted successfully' })
  } catch (error) {
    console.error('Error deleting question bank:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete question bank' },
      { status: 500 }
    )
  }
}