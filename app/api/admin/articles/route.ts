import { type NextRequest, NextResponse } from "next/server"
import { getAllArticles, createArticle } from '@/lib/db-utils'

export async function GET() {
  try {
    const articles = await getAllArticles()
    return NextResponse.json({ success: true, data: articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      title,
      author,
      authorId,
      authorBio,
      journal,
      category,
      abstract,
      content,
      keywords,
      references,
      readTime,
      difficulty,
      isPublished,
    } = data

    if (!title || !author || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const article = await createArticle({
      title,
      author,
      authorId,
      authorBio,
      journal,
      category,
      abstract,
      content,
      keywords: typeof keywords === 'string' ? keywords.split(',').map((k: string) => k.trim()) : keywords,
      references: typeof references === 'string' ? references.split('\n').filter((r: string) => r.trim()) : references,
      readTime,
      difficulty,
      isPublished,
      publishedAt: isPublished ? new Date() : undefined,
    })

    return NextResponse.json({ success: true, data: article }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
