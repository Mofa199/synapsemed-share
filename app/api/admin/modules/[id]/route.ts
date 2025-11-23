import { NextRequest, NextResponse } from 'next/server'
import { getModuleById, updateModule, deleteModule } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const module = await getModuleById(params.id)
    
    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: module })
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module' },
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
      curriculumId,
      duration,
      difficulty,
      isActive
    } = body

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      )
    }

    const module = await updateModule(params.id, {
      name,
      description,
      curriculumId,
      duration,
      difficulty,
      isActive,
    })

    return NextResponse.json({ success: true, data: module })
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update module' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteModule(params.id)
    return NextResponse.json({ success: true, message: 'Module deleted successfully' })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}