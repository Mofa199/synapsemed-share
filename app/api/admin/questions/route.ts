import { NextRequest, NextResponse } from 'next/server'
import { getAllQuestions, createQuestion } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionBankId = searchParams.get('questionBankId')
    const search = searchParams.get('search')

    let questions = await getAllQuestions()

    if (questionBankId) {
      questions = questions.filter(q => q.questionBankId === questionBankId)
    }

    if (search) {
      questions = questions.filter(q => 
        q.question.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: questions,
      total: questions.length
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.questionBankId || !data.text || !data.type || !data.correctAnswer || !data.difficulty) {
      return NextResponse.json(
        { success: false, error: 'Question bank ID, text, type, correct answer, and difficulty are required' },
        { status: 400 }
      )
    }

    const question = await createQuestion({
      questionBankId: data.questionBankId,
      text: data.text,
      type: data.type,
      options: data.options || [],
      correctAnswer: data.correctAnswer,
      explanation: data.explanation,
      difficulty: data.difficulty,
      points: data.points ? parseInt(data.points) : undefined,
      tags: data.tags || [],
    })

    return NextResponse.json({
      success: true,
      data: question,
      message: 'Question created successfully'
    })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    )
  }
}