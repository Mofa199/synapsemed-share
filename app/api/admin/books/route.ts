import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, BookFormat } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/books - Get all books
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        curriculum: { select: { name: true } },
        module: { select: { name: true } }
      }
    })

    return NextResponse.json({ success: true, data: books })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch books' }, { status: 500 })
  }
}

// POST /api/admin/books - Create new book
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, author, isbn, publisher, publicationYear, 
      edition, pages, language, format, description, 
      category, tags, curriculumId, moduleId, isPublished,
      coverUrl, fileUrl
    } = body

    if (!title || !author) {
      return NextResponse.json({ success: false, error: 'Title and author are required' }, { status: 400 })
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn: isbn || null,
        publisher: publisher || null,
        publicationYear: publicationYear ? parseInt(publicationYear) : null,
        edition: edition || null,
        pages: pages ? parseInt(pages) : null,
        language: language || 'English',
        format: (format as BookFormat) || BookFormat.PDF,
        description: description || null,
        category: category || null,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        curriculumId: curriculumId || null,
        moduleId: moduleId || null,
        isPublished: !!isPublished,
        coverUrl: coverUrl || null,
        fileUrl: fileUrl || null
      }
    })

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json({ success: false, error: 'Failed to create book' }, { status: 500 })
  }
}

// PUT /api/admin/books - Update book
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Book ID is required' }, { status: 400 })
    }

    // Process numeric and string fields
    if (updateData.publicationYear) updateData.publicationYear = parseInt(updateData.publicationYear)
    if (updateData.pages) updateData.pages = parseInt(updateData.pages)
    if (Array.isArray(updateData.tags)) updateData.tags = updateData.tags.join(', ')

    const book = await prisma.book.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json({ success: false, error: 'Failed to update book' }, { status: 500 })
  }
}

// DELETE /api/admin/books - Delete book
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Book ID is required' }, { status: 400 })
    }

    await prisma.book.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete book' }, { status: 500 })
  }
}
