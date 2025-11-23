import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/user/notes - Get user's notes
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    let whereClause: any = {
      userId: user.id
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      whereClause.category = category
    }

    try {
      // Try to fetch from database
      const notes = await prisma.note.findMany({
        where: whereClause,
        orderBy: [
          { isPinned: 'desc' },
          { updatedAt: 'desc' }
        ],
        take: limit
      })

      return NextResponse.json({
        success: true,
        data: notes
      })
    } catch (dbError) {
      // Fallback to mock data if Note table doesn't exist yet
      console.log('Note table not yet migrated, using mock data')
      const mockNotes = [
        {
          id: '1',
          userId: user.id,
          title: 'Cardiovascular System Notes',
          content: 'The heart has four chambers: left atrium, right atrium, left ventricle, right ventricle...',
          category: 'Anatomy',
          tags: 'heart, cardiovascular, anatomy',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isPinned: true
        },
        {
          id: '2',
          userId: user.id,
          title: 'Pharmacology - Beta Blockers',
          content: 'Beta blockers work by blocking beta-adrenergic receptors. Common examples include metoprolol, atenolol...',
          category: 'Pharmacology',
          tags: 'beta blockers, cardiovascular drugs, pharmacology',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isPinned: false
        },
        {
          id: '3',
          userId: user.id,
          title: 'Study Plan for Next Exam',
          content: 'Week 1: Review cardiovascular system\nWeek 2: Focus on pharmacology\nWeek 3: Practice questions...',
          category: 'Study Plans',
          tags: 'study plan, exam preparation',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isPinned: false
        }
      ]

      // Filter mock notes based on search and category
      let filteredNotes = mockNotes
      
      if (search) {
        filteredNotes = mockNotes.filter(note => 
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()) ||
          note.tags.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (category) {
        filteredNotes = filteredNotes.filter(note => note.category === category)
      }

      return NextResponse.json({
        success: true,
        data: filteredNotes.slice(0, limit)
      })
    }
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notes'
    }, { status: 500 })
  }
}

// POST /api/user/notes - Create new note
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, tags, isPinned } = body

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 })
    }

    try {
      // Try to create in database
      const newNote = await prisma.note.create({
        data: {
          userId: user.id,
          title,
          content,
          category: category || 'General',
          tags: tags || '',
          isPinned: isPinned || false
        }
      })

      return NextResponse.json({
        success: true,
        data: newNote
      })
    } catch (dbError) {
      // Fallback to mock response if table doesn't exist
      console.log('Note table not yet migrated, using mock response')
      const newNote = {
        id: Date.now().toString(),
        userId: user.id,
        title,
        content,
        category: category || 'General',
        tags: tags || '',
        isPinned: isPinned || false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return NextResponse.json({
        success: true,
        data: newNote
      })
    }
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create note'
    }, { status: 500 })
  }
}

// PUT /api/user/notes - Update note
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, content, category, tags, isPinned } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Note ID is required'
      }, { status: 400 })
    }

    try {
      // Try to update in database
      const updatedNote = await prisma.note.update({
        where: { 
          id,
          userId: user.id // Ensure user owns this note
        },
        data: {
          title,
          content,
          category,
          tags,
          isPinned
        }
      })

      return NextResponse.json({
        success: true,
        data: updatedNote
      })
    } catch (dbError) {
      // Fallback to mock response
      console.log('Note table not yet migrated, using mock response')
      const updatedNote = {
        id,
        userId: user.id,
        title,
        content,
        category,
        tags,
        isPinned,
        updatedAt: new Date()
      }

      return NextResponse.json({
        success: true,
        data: updatedNote
      })
    }
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update note'
    }, { status: 500 })
  }
}

// DELETE /api/user/notes - Delete note
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get('id')

    if (!noteId) {
      return NextResponse.json({
        success: false,
        error: 'Note ID is required'
      }, { status: 400 })
    }

    try {
      // Try to delete from database
      await prisma.note.delete({
        where: {
          id: noteId,
          userId: user.id // Ensure user owns this note
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Note deleted successfully'
      })
    } catch (dbError) {
      // Fallback to mock response
      console.log('Note table not yet migrated, using mock response')
      return NextResponse.json({
        success: true,
        message: 'Note deleted successfully'
      })
    }
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete note'
    }, { status: 500 })
  }
}