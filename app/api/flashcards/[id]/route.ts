import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const flashcardSetId = (await params).id
    
    // Fetch flashcard set from database
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id: flashcardSetId },
      include: {
        flashcards: {
          orderBy: { order: 'asc' },
        },
      }
    })

    if (!flashcardSet) {
      return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 })
    }

    return NextResponse.json({ flashcardSet })
  } catch (error) {
    console.error("Flashcards API Error:", error)
    return NextResponse.json({ error: "Failed to get flashcard set" }, { status: 500 })
  }
}