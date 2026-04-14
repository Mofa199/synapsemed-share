import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const questionBank = await prisma.questionBank.findUnique({
      where: { id: params.id },
      include: {
        questions: true,
        _count: {
          select: { questions: true }
        }
      }
    })
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, // Mapping 'name' from frontend to 'title' in schema
      description, 
      difficulty,
      category,
      estimatedTime,
      tags,
      isPublished
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.title = name
    if (description !== undefined) updateData.description = description
    if (difficulty !== undefined) updateData.difficulty = difficulty as Difficulty
    if (category !== undefined) updateData.category = category
    if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime.toString()
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.join(', ') : tags
    if (isPublished !== undefined) updateData.isPublished = !!isPublished

    const questionBank = await prisma.questionBank.update({
      where: { id: params.id },
      data: updateData
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.questionBank.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true, message: 'Question bank deleted successfully' })
  } catch (error) {
    console.error('Error deleting question bank:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete question bank' },
      { status: 500 }
    )
  }
}