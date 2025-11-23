import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch all flashcards from database
    const flashcards = await prisma.flashcard.findMany({
      take: 10, // Limit to 10 flashcards
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ 
      success: true, 
      flashcards 
    })
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}