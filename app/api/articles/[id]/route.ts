import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const articleId = params.id
    
    // Fetch article from database
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        authorUser: {
          select: {
            name: true,
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Articles API Error:", error)
    return NextResponse.json({ error: "Failed to get article" }, { status: 500 })
  }
}