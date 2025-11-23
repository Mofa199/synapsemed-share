import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: params.id }
    })

    if (!flashcard) {
      return NextResponse.json(
        { success: false, error: 'Flashcard not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: flashcard 
    })
  } catch (error) {
    console.error('Error fetching flashcard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flashcard' },
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
    const { front, back, category, hint, flashcardSetId } = body

    const flashcard = await prisma.flashcard.update({
      where: { id: params.id },
      data: {
        front: front || undefined,
        back: back || undefined,
        hint: hint || undefined,
        flashcardSetId: flashcardSetId || undefined,
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: flashcard,
      message: 'Flashcard updated successfully'
    })
  } catch (error) {
    console.error('Error updating flashcard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update flashcard' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.flashcard.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Flashcard deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting flashcard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete flashcard' },
      { status: 500 }
    )
  }
}