import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const bookId = (await params).id
    
    // Fetch book from database
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        curriculum: {
          select: {
            name: true,
            field: true,
          }
        },
        module: {
          select: {
            name: true,
          }
        }
      }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ book })
  } catch (error) {
    console.error("Books API Error:", error)
    return NextResponse.json({ error: "Failed to get book" }, { status: 500 })
  }
}