import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/simulations - Get all simulations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const simulations = await prisma.simulation.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: simulations })
  } catch (error) {
    console.error('Error fetching simulations:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch simulations' }, { status: 500 })
  }
}

// POST /api/admin/simulations - Create new simulation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, description, content, type, 
      difficulty, estimatedTime, tags, isPublished,
      curriculumId, moduleId
    } = body

    if (!title || !content || !type) {
      return NextResponse.json({ success: false, error: 'Title, content, and type are required' }, { status: 400 })
    }

    const simulation = await prisma.simulation.create({
      data: {
        title,
        description: description || null,
        scenario: content,
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        chiefComplaint: body.chiefComplaint || "", // Chief complaint is required but missing in incoming body?
        estimatedTime: estimatedTime ? estimatedTime.toString() : null,
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || ""),
        isPublished: !!isPublished,
        curriculumId: curriculumId || null,
        moduleId: moduleId || null,
      }
    })

    return NextResponse.json({ success: true, data: simulation })
  } catch (error) {
    console.error('Error creating simulation:', error)
    return NextResponse.json({ success: false, error: 'Failed to create simulation' }, { status: 500 })
  }
}

// PUT /api/admin/simulations - Update simulation
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Simulation ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (processedData.content) {
      processedData.scenario = processedData.content
      delete processedData.content
    }
    if (processedData.type) delete processedData.type
    
    if (Array.isArray(processedData.tags)) processedData.tags = processedData.tags.join(', ')
    if (processedData.estimatedTime) processedData.estimatedTime = processedData.estimatedTime.toString()

    const simulation = await prisma.simulation.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: simulation })
  } catch (error) {
    console.error('Error updating simulation:', error)
    return NextResponse.json({ success: false, error: 'Failed to update simulation' }, { status: 500 })
  }
}

// DELETE /api/admin/simulations - Delete simulation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Simulation ID is required' }, { status: 400 })
    }

    await prisma.simulation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Simulation deleted successfully' })
  } catch (error) {
    console.error('Error deleting simulation:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete simulation' }, { status: 500 })
  }
}