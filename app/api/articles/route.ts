import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPublishedArticles } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const category = searchParams.get('category')

    let articles

    if (category) {
      articles = await prisma.article.findMany({
        where: { 
          isPublished: true,
          category: category,
        },
        include: {
          authorUser: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      })
    } else {
      articles = await getPublishedArticles(limit)
    }

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create the article
    const article = await prisma.article.create({
      data: {
        title: data.title,
        author: data.author || 'Anonymous',
        authorBio: data.authorBio,
        journal: data.journal,
        category: data.category,
        abstract: data.abstract,
        content: data.content,
        keywords: data.keywords ? data.keywords.split(',').map((keyword: string) => keyword.trim()) : [],
        references: data.references ? data.references.split('\n').filter((ref: string) => ref.trim()) : [],
        readTime: data.readTime,
        difficulty: data.difficulty || 'BEGINNER',
        isPublished: data.isPublished || false,
        publishedAt: data.isPublished ? new Date() : null,
      },
      include: {
        authorUser: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      article,
      message: 'Article created successfully'
    })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}