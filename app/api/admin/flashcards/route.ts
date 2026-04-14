import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/flashcards - Get all flashcards
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const flashcards = await prisma.flashcard.findMany({
      include: {
        flashcardSet: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: flashcards })
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch flashcards' }, { status: 500 })
  }
}

// POST /api/admin/flashcards - Create new flashcard
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    let { front, back, category, hint, flashcardSetId } = body

    if (!front || !back) {
      return NextResponse.json({ success: false, error: 'Front and back content are required' }, { status: 400 })
    }

    // Auto-create or find a default set if not provided (to avoid breaking the UI)
    if (!flashcardSetId) {
      let defaultSet = await prisma.flashcardSet.findFirst({
        where: { title: category || 'General' }
      })
      
      if (!defaultSet) {
        defaultSet = await prisma.flashcardSet.create({
          data: {
            title: category || 'General',
            category: category || 'General',
            tags: category || 'General'
          }
        })
      }
      flashcardSetId = defaultSet.id
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        front,
        back,
        category: category || null,
        hint: hint || null,
        flashcardSetId,
      }
    })

    return NextResponse.json({ success: true, data: flashcard })
  } catch (error) {
    console.error('Error creating flashcard:', error)
    return NextResponse.json({ success: false, error: 'Failed to create flashcard' }, { status: 500 })
  }
}

// PUT /api/admin/flashcards - Update flashcard
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { id, ...updateData } = data
    
    // Support both ID as param or in body for flexibility
    const targetId = params?.id || id;

    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Flashcard ID is required' }, { status: 400 })
    }

    const flashcard = await prisma.flashcard.update({
      where: { id: targetId },
      data: updateData
    })

    return NextResponse.json({ success: true, data: flashcard })
  } catch (error) {
    console.error('Error updating flashcard:', error)
    return NextResponse.json({ success: false, error: 'Failed to update flashcard' }, { status: 500 })
  }
}

// DELETE /api/admin/flashcards - Delete flashcard
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = params?.id || searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Flashcard ID is required' }, { status: 400 })
    }

    await prisma.flashcard.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Flashcard deleted successfully' })
  } catch (error) {
    console.error('Error deleting flashcard:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete flashcard' }, { status: 500 })
  }
}