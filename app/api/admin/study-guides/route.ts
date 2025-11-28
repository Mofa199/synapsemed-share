import { NextRequest, NextResponse } from 'next/server'
import { getAllStudyGuides, createStudyGuide } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let studyGuides = await getAllStudyGuides()

    if (search) {
      studyGuides = studyGuides.filter(guide => 
        guide.title.toLowerCase().includes(search.toLowerCase()) ||
        (guide.description && guide.description.toLowerCase().includes(search.toLowerCase())) ||
        guide.category?.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: studyGuides,
      total: studyGuides.length
    })
  } catch (error) {
    console.error('Error fetching study guides:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch study guides' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.description || !data.difficulty) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and difficulty are required' },
        { status: 400 }
      )
    }

    // Create new study guide
    const studyGuide = await createStudyGuide({
      title: data.title,
      description: data.description,
      content: data.content,
      difficulty: data.difficulty,
      category: data.category,
      estimatedTime: data.estimatedTime ? data.estimatedTime.toString() : undefined,
      curriculumId: data.curriculumId,
      moduleId: data.moduleId,
      tags: data.tags || [],
      isPublished: data.isPublished || false,
    })

    return NextResponse.json({
      success: true,
      data: studyGuide,
      message: 'Study guide created successfully'
    })
  } catch (error) {
    console.error('Error creating study guide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create study guide' },
      { status: 500 }
    )
  }
}