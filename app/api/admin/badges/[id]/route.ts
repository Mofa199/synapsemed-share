import { NextRequest, NextResponse } from 'next/server'
import { getBadgeById, updateBadge, deleteBadge } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const badge = await getBadgeById(params.id)
    
    if (!badge) {
      return NextResponse.json(
        { success: false, error: 'Badge not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: badge })
  } catch (error) {
    console.error('Error fetching badge:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch badge' },
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
      icon,
      color,
      criteria,
      pointsRequired,
      category,
      isActive
    } = body

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      )
    }

    const badge = await updateBadge(params.id, {
      name,
      description,
      icon,
      color,
      criteria,
      pointsRequired: pointsRequired ? parseInt(pointsRequired) : undefined,
      category,
      isActive,
    })

    return NextResponse.json({ success: true, data: badge })
  } catch (error) {
    console.error('Error updating badge:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update badge' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteBadge(params.id)
    return NextResponse.json({ success: true, message: 'Badge deleted successfully' })
  } catch (error) {
    console.error('Error deleting badge:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete badge' },
      { status: 500 }
    )
  }
}