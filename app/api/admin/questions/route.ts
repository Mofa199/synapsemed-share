import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/questions - Get questions for a specific question bank
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const questionBankId = searchParams.get('questionBankId')
    
    if (!questionBankId) {
      return NextResponse.json({ success: false, error: 'Question bank ID is required' }, { status: 400 })
    }

    const questions = await prisma.question.findMany({
      where: { questionBankId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: questions,
      total: questions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST /api/admin/questions - Create new question
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { 
      questionBankId, 
      text, // Mapping 'text' from frontend to 'question' in schema
      question, // Fallback if already called question
      options, 
      correctAnswer, 
      explanation, 
      difficulty, 
      tags 
    } = data
    
    if (!questionBankId || (!text && !question) || !options || correctAnswer === undefined) {
      return NextResponse.json(
        { success: false, error: 'Question bank ID, question text, options, and correct answer are required' },
        { status: 400 }
      )
    }

    const newQuestion = await prisma.question.create({
      data: {
        questionBankId,
        question: text || question,
        options: Array.isArray(options) ? JSON.stringify(options) : options,
        correctAnswer: parseInt(correctAnswer),
        explanation: explanation || null,
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
      }
    });

    return NextResponse.json({
      success: true,
      data: newQuestion,
      message: 'Question created successfully'
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/questions - Update question
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ success: false, error: 'Question ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (processedData.options && Array.isArray(processedData.options)) {
      processedData.options = JSON.stringify(processedData.options)
    }
    if (processedData.correctAnswer !== undefined) {
      processedData.correctAnswer = parseInt(processedData.correctAnswer)
    }
    if (processedData.tags && Array.isArray(processedData.tags)) {
      processedData.tags = processedData.tags.join(', ')
    }
    if (processedData.text) {
      processedData.question = processedData.text
      delete processedData.text
    }

    const question = await prisma.question.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: question })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json({ success: false, error: 'Failed to update question' }, { status: 500 })
  }
}

// DELETE /api/admin/questions - Delete question
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

    await prisma.question.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete question' }, { status: 500 })
  }
}