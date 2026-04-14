import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// GET /api/admin/books/[id] - Get specific book
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        curriculum: { select: { name: true, field: true } },
        module: { select: { name: true } }
      }
    })

    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/books/[id] - Update book
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, author, isbn, publisher, publicationYear, 
      edition, pages, language, format, description, 
      category, tags, curriculumId, moduleId, isPublished,
      coverUrl, fileUrl
    } = body

    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(isbn !== undefined && { isbn }),
        ...(publisher !== undefined && { publisher }),
        ...(publicationYear !== undefined && { publicationYear }),
        ...(edition !== undefined && { edition }),
        ...(pages !== undefined && { pages }),
        ...(language !== undefined && { language }),
        ...(format !== undefined && { format }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(curriculumId !== undefined && { curriculumId }),
        ...(moduleId !== undefined && { moduleId }),
        ...(isPublished !== undefined && { isPublished }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(fileUrl !== undefined && { fileUrl }),
      }
    })

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/books/[id] - Delete book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.book.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}