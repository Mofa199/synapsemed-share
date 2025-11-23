import { NextRequest, NextResponse } from 'next/server'
import { getAllQuestionBanks, createQuestionBank } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let questionBanks = await getAllQuestionBanks()

    if (search) {
      questionBanks = questionBanks.filter(bank => 
        bank.title.toLowerCase().includes(search.toLowerCase()) ||
        (bank.description && bank.description.toLowerCase().includes(search.toLowerCase())) ||
        bank.category?.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: questionBanks,
      total: questionBanks.length
    })
  } catch (error) {
    console.error('Error fetching question banks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question banks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.description || !data.difficulty) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and difficulty are required' },
        { status: 400 }
      )
    }

    // Create new question bank
    const questionBank = await createQuestionBank({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      examType: data.examType,
      category: data.category,
      timeLimit: data.timeLimit ? parseInt(data.timeLimit) : undefined,
      passingScore: data.passingScore ? parseInt(data.passingScore) : undefined,
      curriculumId: data.curriculumId,
      moduleId: data.moduleId,
      tags: data.tags || [],
      isPublished: data.isPublished || false,
    })

    return NextResponse.json({
      success: true,
      data: questionBank,
      message: 'Question bank created successfully'
    })
  } catch (error) {
    console.error('Error creating question bank:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create question bank' },
      { status: 500 }
    )
  }
}