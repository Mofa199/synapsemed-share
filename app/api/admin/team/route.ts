import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const position = formData.get('position') as string
    const department = formData.get('department') as any
    const bio = formData.get('bio') as string
    const linkedin = formData.get('linkedin') as string
    const expertise = formData.get('expertise') as string
    const specialties = formData.get('specialties') as string || ''
    const avatar = formData.get('avatar') as string

    if (!name || !email || !position || !department) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        email,
        phone,
        position,
        department,
        bio,
        linkedin,
        expertise,
        specialties,
        avatar,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ success: true, data: teamMember });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
