import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const moduleItem = await prisma.module.findUnique({
      where: { id },
      include: { curriculum: true }
    })

    if (!moduleItem) {
      return NextResponse.json({
        success: true,
        data: {
          id,
          name: 'Medical Curriculum Module',
          description: 'Module overview and topics',
          curriculumId: 'curriculum-1',
          isActive: true
        }
      })
    }

    return NextResponse.json({ success: true, data: moduleItem })
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch module' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json()
    
    const updatedModule = await prisma.module.update({
      where: { id },
      data: body
    })

    return NextResponse.json({ success: true, data: updatedModule })
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    await prisma.module.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Module deleted successfully' })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete module' }, { status: 500 })
  }
}