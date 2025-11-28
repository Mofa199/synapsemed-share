import { NextRequest, NextResponse } from 'next/server'
import { getCurriculumById, updateCurriculum, deleteCurriculum } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const curriculum = await getCurriculumById(params.id)
    
    if (!curriculum) {
      return NextResponse.json(
        { success: false, error: 'Curriculum not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: curriculum })
  } catch (error) {
    console.error('Error fetching curriculum:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch curriculum' },
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
      field,
      level,
      duration,
      isActive
    } = body

    if (!name || !description || !field) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and field are required' },
        { status: 400 }
      )
    }

    const curriculum = await updateCurriculum(params.id, {
      name,
      description,
      field,
      level,
      duration,
      isActive,
    })

    return NextResponse.json({ success: true, data: curriculum })
  } catch (error) {
    console.error('Error updating curriculum:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update curriculum' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCurriculum(params.id)
    return NextResponse.json({ success: true, message: 'Curriculum deleted successfully' })
  } catch (error) {
    console.error('Error deleting curriculum:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete curriculum' },
      { status: 500 }
    )
  }
}
