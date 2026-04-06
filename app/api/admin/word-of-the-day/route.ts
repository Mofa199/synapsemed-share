import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/word-of-the-day - Get today's word or find one
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const word = await prisma.wordOfTheDay.findFirst({
      where: {
        dateScheduled: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    if (!word) {
      // Return most recent word as fallback
      const recentWord = await prisma.wordOfTheDay.findFirst({
        orderBy: { dateScheduled: 'desc' }
      })
      if (!recentWord) return NextResponse.json({ success: false, error: 'No words found' }, { status: 404 })
      return NextResponse.json({ success: true, data: recentWord })
    }

    return NextResponse.json({ success: true, data: word })
  } catch (error) {
    console.error('Error fetching word of the day:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch word of the day' }, { status: 500 })
  }
}

// POST /api/admin/word-of-the-day - Schedule new word
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { word, definition, pronunciation, etymology, category, difficulty, example, dateScheduled } = body

    if (!word || !definition || !dateScheduled) {
      return NextResponse.json({ success: false, error: 'Word, definition, and date are required' }, { status: 400 })
    }

    const scheduledDate = new Date(dateScheduled)
    scheduledDate.setHours(12, 0, 0, 0) // Normalize to noon

    const newWord = await prisma.wordOfTheDay.create({
      data: {
        word,
        definition,
        pronunciation: pronunciation || null,
        etymology: etymology || null,
        category: category || null,
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        example: example || null,
        dateScheduled: scheduledDate
      }
    })

    return NextResponse.json({ success: true, data: newWord })
  } catch (error) {
    console.error('Error creating word of the day:', error)
    return NextResponse.json({ success: false, error: 'Failed to create word of the day' }, { status: 500 })
  }
}

// PUT /api/admin/word-of-the-day - Update word
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Word ID is required' }, { status: 400 })
    }

    const updatedWord = await prisma.wordOfTheDay.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: updatedWord })
  } catch (error) {
    console.error('Error updating word of the day:', error)
    return NextResponse.json({ success: false, error: 'Failed to update word of the day' }, { status: 500 })
  }
}

// DELETE /api/admin/word-of-the-day - Delete word
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Word ID is required' }, { status: 400 })
    }

    await prisma.wordOfTheDay.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Word deleted successfully' })
  } catch (error) {
    console.error('Error deleting word of the day:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete word of the day' }, { status: 500 })
  }
}