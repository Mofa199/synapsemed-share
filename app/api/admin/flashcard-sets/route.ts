import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/flashcard-sets - Get all flashcard sets
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const sets = await prisma.flashcardSet.findMany({
      include: {
        _count: {
          select: { flashcards: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: sets })
  } catch (error) {
    console.error('Error fetching flashcard sets:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch flashcard sets' }, { status: 500 })
  }
}

// POST /api/admin/flashcard-sets - Create new flashcard set
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, difficulty, tags, isPublished } = body

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }

    const set = await prisma.flashcardSet.create({
      data: {
        title,
        description: description || null,
        category: category || null,
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        isPublished: !!isPublished,
      }
    })

    return NextResponse.json({ success: true, data: set })
  } catch (error) {
    console.error('Error creating flashcard set:', error)
    return NextResponse.json({ success: false, error: 'Failed to create flashcard set' }, { status: 500 })
  }
}
