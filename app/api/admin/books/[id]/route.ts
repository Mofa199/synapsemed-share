import { NextRequest, NextResponse } from 'next/server'
import { getBookById, updateBook, deleteBook } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await getBookById(params.id)
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
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
    const { 
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      edition,
      pages,
      language,
      format,
      description,
      category,
      curriculumId,
      moduleId,
      tags,
      isPublished
    } = body

    if (!title || !author) {
      return NextResponse.json(
        { success: false, error: 'Title and author are required' },
        { status: 400 }
      )
    }

    const book = await updateBook(params.id, {
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      edition,
      pages,
      language,
      format,
      description,
      category,
      curriculumId,
      moduleId,
      tags,
      isPublished,
    })

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteBook(params.id)
    return NextResponse.json({ success: true, message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}