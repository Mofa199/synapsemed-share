import { NextRequest, NextResponse } from 'next/server'
import { getModulesByCurriculum, createModule } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const modules = await getModulesByCurriculum(params.id)

    return NextResponse.json({
      success: true,
      data: modules,
      total: modules.length
    })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Create new module
    const module = await createModule({
      name: data.name,
      description: data.description,
      curriculumId: params.id,
      duration: data.duration,
      difficulty: data.difficulty,
      isActive: data.isActive || true,
    })

    return NextResponse.json({
      success: true,
      data: module,
      message: 'Module created successfully'
    })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create module' },
      { status: 500 }
    )
  }
}
