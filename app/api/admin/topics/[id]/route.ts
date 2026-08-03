import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: { module: true, curriculum: true }
    })

    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: topic })
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch topic' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json()
    
    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: body
    })

    return NextResponse.json({ success: true, data: updatedTopic })
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json({ success: false, error: 'Failed to update topic' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    await prisma.topic.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete topic' }, { status: 500 })
  }
}