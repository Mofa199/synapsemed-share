import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id }
    });
    
    if (!teamMember) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData();
    
    const updateData: any = {};
    if (formData.has('name')) updateData.name = formData.get('name') as string;
    if (formData.has('email')) updateData.email = formData.get('email') as string;
    if (formData.has('phone')) updateData.phone = formData.get('phone') as string;
    if (formData.has('position')) updateData.position = formData.get('position') as string;
    if (formData.has('department')) updateData.department = formData.get('department') as any;
    if (formData.has('bio')) updateData.bio = formData.get('bio') as string;
    if (formData.has('linkedin')) updateData.linkedin = formData.get('linkedin') as string;
    if (formData.has('expertise')) updateData.expertise = formData.get('expertise') as string;
    if (formData.has('specialties')) updateData.specialties = formData.get('specialties') as string;
    if (formData.has('avatar')) updateData.avatar = formData.get('avatar') as string;
    if (formData.has('status')) updateData.status = formData.get('status') as any;

    const updatedTeamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updatedTeamMember });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.teamMember.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
  }
}