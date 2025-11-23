import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTopicsByCurriculum, getTopicsByModule } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const curriculumId = searchParams.get('curriculumId')
    const moduleId = searchParams.get('moduleId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    let topics

    if (moduleId) {
      // Get topics by module
      topics = await getTopicsByModule(moduleId)
    } else if (curriculumId) {
      // Get topics by curriculum
      topics = await getTopicsByCurriculum(curriculumId)
    } else {
      // Get all published topics
      topics = await prisma.topic.findMany({
        where: { isPublished: true },
        include: {
          curriculum: {
            select: {
              name: true,
              field: true,
            },
          },
          module: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    }

    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Create the topic
    const topic = await prisma.topic.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content || '',
        type: data.type || 'ARTICLE',
        difficulty: data.difficulty || 'BEGINNER',
        duration: data.duration,
        category: data.category,
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
        curriculumId: data.curriculum || undefined,
        moduleId: data.module || undefined,
        isPublished: data.isPublished || false,
      },
      include: {
        curriculum: {
          select: {
            name: true,
            field: true,
          },
        },
        module: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      topic,
      message: 'Topic created successfully'
    })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
}