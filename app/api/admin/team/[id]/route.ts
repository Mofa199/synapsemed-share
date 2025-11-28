import { NextRequest, NextResponse } from 'next/server'
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamMember = await getTeamMemberById(params.id)
    
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: teamMember })
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const position = formData.get('position') as string
    const department = formData.get('department') as 'MEDICAL_EDUCATION' | 'CONTENT_DEVELOPMENT' | 'NURSING' | 'PHARMACY' | 'ENGINEERING' | 'DESIGN' | 'ADMINISTRATION'
    const bio = formData.get('bio') as string
    const linkedin = formData.get('linkedin') as string
    const expertise = formData.get('expertise') as string

    if (!name || !email || !position || !department) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const teamMember = await updateTeamMember(params.id, {
      name,
      email,
      phone,
      position,
      department,
      bio,
      linkedin,
      expertise,
    })

    return NextResponse.json({ success: true, data: teamMember })
  } catch (error: any) {
    console.error('Error updating team member:', error)
    
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { success: false, error: 'A team member with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTeamMember(params.id)
    return NextResponse.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}