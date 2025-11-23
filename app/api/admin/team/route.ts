import { NextRequest, NextResponse } from 'next/server'
import { getAllTeamMembers, createTeamMember } from '@/lib/db-utils'

export async function GET() {
  try {
    const teamMembers = await getAllTeamMembers()
    return NextResponse.json({ success: true, data: teamMembers })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const teamMember = await createTeamMember({
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
    console.error('Error creating team member:', error)
    
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { success: false, error: 'A team member with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
