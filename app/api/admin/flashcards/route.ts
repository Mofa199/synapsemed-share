import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch all flashcards from database
    const flashcards = await prisma.flashcard.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ 
      success: true, 
      data: flashcards 
    })
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { front, back, category, hint, flashcardSetId } = body

    if (!front || !back || !flashcardSetId) {
      return NextResponse.json(
        { success: false, error: 'Front, back content, and flashcard set ID are required' },
        { status: 400 }
      )
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        front,
        back,
        hint: hint || null,
        flashcardSetId
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: flashcard,
      message: 'Flashcard created successfully'
    })
  } catch (error) {
    console.error('Error creating flashcard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create flashcard' },
      { status: 500 }
    )
  }
}