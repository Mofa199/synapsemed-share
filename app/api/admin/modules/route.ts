import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// TODO: Enable after Prisma migration is complete

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const curriculumId = searchParams.get('curriculumId')

    if (!curriculumId) {
      return NextResponse.json(
        { error: 'Curriculum ID is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database call
    // const modules = await prisma.module.findMany({
    //   where: { 
    //     curriculumId,
    //     isActive: true 
    //   },
    //   include: {
    //     curriculum: {
    //       select: { name: true, field: true }
    //     },
    //     topics: {
    //       where: { isPublished: true },
    //       select: {
    //         id: true,
    //         title: true,
    //         description: true,
    //         difficulty: true,
    //         duration: true,
    //         views: true,
    //       }
    //     },
    //     _count: { select: { topics: true } }
    //   },
    //   orderBy: { order: 'asc' }
    // })

    // Mock data for now
    const mockModules = [
      {
        id: 'mod-1',
        name: 'Sample Module',
        description: 'A sample module for testing',
        curriculumId,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        curriculum: {
          name: 'Sample Curriculum',
          field: 'MEDICAL'
        },
        topics: [],
        _count: { topics: 0 }
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockModules,
    })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      curriculumId,
      order = 0,
      isActive = true,
    } = await request.json()

    if (!name || !curriculumId) {
      return NextResponse.json(
        { error: 'Name and curriculum ID are required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database call
    // const module = await prisma.module.create({
    //   data: {
    //     name,
    //     description,
    //     curriculumId,
    //     order,
    //     isActive,
    //   },
    //   include: {
    //     curriculum: {
    //       select: { name: true, field: true }
    //     },
    //     _count: { select: { topics: true } }
    //   }
    // })

    // Mock response for now
    const mockModule = {
      id: `mock-module-${Date.now()}`,
      name,
      description,
      curriculumId,
      order,
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      curriculum: {
        name: 'Sample Curriculum',
        field: 'MEDICAL'
      },
      _count: { topics: 0 }
    }

    return NextResponse.json({
      success: true,
      data: mockModule,
      message: 'Module created successfully',
    })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database call
    // const module = await prisma.module.update({
    //   where: { id },
    //   data: updateData,
    //   include: {
    //     curriculum: {
    //       select: { name: true, field: true }
    //     },
    //     _count: { select: { topics: true } }
    //   }
    // })

    // Mock response for now
    const mockModule = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString(),
      curriculum: {
        name: 'Sample Curriculum',
        field: 'MEDICAL'
      },
      _count: { topics: 0 }
    }

    return NextResponse.json({
      success: true,
      data: mockModule,
      message: 'Module updated successfully',
    })
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database call
    // await prisma.module.delete({
    //   where: { id }
    // })

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}