import { NextRequest, NextResponse } from 'next/server'
import { getTopicById, updateTopic, deleteTopic } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await getTopicById(params.id)
    
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: topic })
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topic' },
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
      description, 
      content, 
      type,
      difficulty, 
      duration, 
      category,
      moduleId, 
      curriculumId, 
      tags, 
      isPublished 
    } = body

    if (!title || !description || !content || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const topic = await updateTopic(params.id, {
      title,
      description,
      content,
      type,
      difficulty,
      duration,
      category,
      moduleId,
      curriculumId,
      tags,
      isPublished,
    })

    return NextResponse.json({ success: true, data: topic })
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update topic' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTopic(params.id)
    return NextResponse.json({ success: true, message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete topic' },
      { status: 500 }
    )
  }
}