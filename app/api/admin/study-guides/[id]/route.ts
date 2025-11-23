import { NextRequest, NextResponse } from 'next/server'
import { getStudyGuideById, updateStudyGuide, deleteStudyGuide } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studyGuide = await getStudyGuideById(params.id)
    
    if (!studyGuide) {
      return NextResponse.json(
        { success: false, error: 'Study guide not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: studyGuide })
  } catch (error) {
    console.error('Error fetching study guide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch study guide' },
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
      name, 
      description, 
      content,
      difficulty,
      category,
      estimatedTime,
      curriculumId,
      moduleId,
      tags,
      isPublished
    } = body

    if (!name || !description || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and difficulty are required' },
        { status: 400 }
      )
    }

    const studyGuide = await updateStudyGuide(params.id, {
      title: name,
      description,
      content,
      difficulty,
      category,
      estimatedTime: estimatedTime ? estimatedTime.toString() : undefined,
      tags,
      isPublished,
    })

    return NextResponse.json({ success: true, data: studyGuide })
  } catch (error) {
    console.error('Error updating study guide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update study guide' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteStudyGuide(params.id)
    return NextResponse.json({ success: true, message: 'Study guide deleted successfully' })
  } catch (error) {
    console.error('Error deleting study guide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete study guide' },
      { status: 500 }
    )
  }
}