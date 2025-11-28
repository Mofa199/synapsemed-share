import { type NextRequest, NextResponse } from "next/server"
import { getAllBooks, createBook } from '@/lib/db-utils'

export async function GET() {
  try {
    const books = await getAllBooks()
    return NextResponse.json({ success: true, data: books })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const isbn = formData.get("isbn") as string || undefined
    const publisher = formData.get("publisher") as string || undefined
    const publicationYear = formData.get("publicationYear") ? parseInt(formData.get("publicationYear") as string) : undefined
    const edition = formData.get("edition") as string || undefined
    const pages = formData.get("pages") ? parseInt(formData.get("pages") as string) : undefined
    const language = formData.get("language") as string || 'English'
    const format = formData.get("format") as string || 'PDF'
    const description = formData.get("description") as string || undefined
    const category = formData.get("category") as string || undefined
    const curriculumId = formData.get("curriculumId") as string || undefined
    const moduleId = formData.get("moduleId") as string || undefined
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags") as string) : []
    const isPublished = formData.get("isPublished") === "true"

    if (!title || !author) {
      return NextResponse.json(
        { success: false, error: 'Title and author are required' },
        { status: 400 }
      )
    }

    const book = await createBook({
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      edition,
      pages,
      language,
      format: format as 'PDF' | 'EPUB' | 'PHYSICAL',
      description,
      category,
      curriculumId,
      moduleId,
      tags,
      isPublished,
    })

    return NextResponse.json({ success: true, data: book }, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    )
  }
}
