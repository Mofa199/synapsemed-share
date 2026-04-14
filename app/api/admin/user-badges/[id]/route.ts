import { NextRequest, NextResponse } from 'next/server'
import { deleteUserBadge } from '@/lib/db-utils'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await deleteUserBadge(params.id)
    return NextResponse.json({ 
      success: true, 
      message: 'User badge removed successfully' 
    })
  } catch (error) {
    console.error('Error removing user badge:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove user badge' },
      { status: 500 }
    )
  }
}