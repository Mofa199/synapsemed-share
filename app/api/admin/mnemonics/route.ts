import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/mnemonics - Get all mnemonics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const mnemonic = await prisma.mnemonic.findUnique({
        where: { id },
        include: { concept: true }
      })
      if (!mnemonic) return NextResponse.json({ success: false, error: 'Mnemonic not found' }, { status: 404 })
      return NextResponse.json({ success: true, data: mnemonic })
    }

    const mnemonics = await prisma.mnemonic.findMany({
      include: { concept: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(mnemonics) // Matching frontend expectation of returning the array directly
  } catch (error) {
    console.error('Error fetching mnemonics:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch mnemonics' }, { status: 500 })
  }
}

// POST /api/admin/mnemonics - Create new mnemonic
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    let {
      conceptId,
      title,
      mnemonic,
      explanation,
      example,
      category,
      isVerified
    } = body

    if (!title || !mnemonic || !explanation) {
      return NextResponse.json({ success: false, error: 'Title, mnemonic, and explanation are required' }, { status: 400 })
    }

    // Auto-create or find a default concept if not provided
    if (!conceptId) {
      let defaultConcept = await prisma.concept.findFirst({
        where: { title: category || 'General' }
      })
      
      if (!defaultConcept) {
        defaultConcept = await prisma.concept.create({
          data: {
            title: category || 'General',
            description: category || 'General',
            content: category || 'General',
            category: category || 'General',
            tags: category || 'General'
          }
        })
      }
      conceptId = defaultConcept.id
    }

    const newMnemonic = await prisma.mnemonic.create({
      data: {
        conceptId,
        title,
        mnemonic,
        explanation,
        example: example || null,
        category: category || 'Acronym',
        isVerified: isVerified !== undefined ? !!isVerified : false,
        createdBy: session.user.name || 'Admin',
      }
    })

    return NextResponse.json({
      success: true,
      mnemonic: newMnemonic
    })
  } catch (error) {
    console.error('Error creating mnemonic:', error)
    return NextResponse.json({ success: false, error: 'Failed to create mnemonic' }, { status: 500 })
  }
}

// PUT /api/admin/mnemonics - Update mnemonic
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const body = await request.json();
    const { id: bodyId, ...updateData } = body;
    const targetId = id === 'mnemonics' ? bodyId : id;

    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Mnemonic ID is required' }, { status: 400 })
    }

    const updatedMnemonic = await prisma.mnemonic.update({
      where: { id: targetId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      mnemonic: updatedMnemonic
    })
  } catch (error) {
    console.error('Error updating mnemonic:', error)
    return NextResponse.json({ success: false, error: 'Failed to update mnemonic' }, { status: 500 })
  }
}

// DELETE /api/admin/mnemonics - Delete mnemonic
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Mnemonic ID is required' }, { status: 400 })
    }

    await prisma.mnemonic.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Mnemonic deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting mnemonic:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete mnemonic' }, { status: 500 })
  }
}