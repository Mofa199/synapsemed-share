import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get all mnemonics or a single mnemonic by ID (admin view)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // If ID is provided, fetch single mnemonic
    if (id) {
      const mnemonic = await prisma.mnemonic.findUnique({
        where: { id }
      });

      if (!mnemonic) {
        return NextResponse.json(
          { error: 'Mnemonic not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(mnemonic);
    }

    // Otherwise fetch all mnemonics
    const mnemonics = await prisma.mnemonic.findMany({
      orderBy: [
        { isVerified: 'desc' },
        { upvotes: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(mnemonics);
  } catch (error) {
    console.error('Error fetching mnemonics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mnemonics' },
      { status: 500 }
    );
  }
}

// POST - Create new mnemonic (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      conceptId,
      title,
      mnemonic,
      explanation,
      example,
      category,
      isVerified
    } = body;

    if (!conceptId || !title || !mnemonic || !explanation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMnemonic = await prisma.mnemonic.create({
      data: {
        conceptId,
        title,
        mnemonic,
        explanation,
        example: example || null,
        category: category || 'Acronym',
        isVerified: isVerified !== undefined ? isVerified : true,
        createdBy: 'admin' // In real app, get from auth
      }
    });

    return NextResponse.json({
      success: true,
      mnemonic: newMnemonic
    });
  } catch (error) {
    console.error('Error creating mnemonic:', error);
    return NextResponse.json(
      { error: 'Failed to create mnemonic' },
      { status: 500 }
    );
  }
}

// PUT - Update mnemonic (admin)
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Mnemonic ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      conceptId,
      title,
      mnemonic,
      explanation,
      example,
      category,
      isVerified
    } = body;

    if (!conceptId || !title || !mnemonic || !explanation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedMnemonic = await prisma.mnemonic.update({
      where: { id },
      data: {
        conceptId,
        title,
        mnemonic,
        explanation,
        example: example || null,
        category: category || 'Acronym',
        isVerified: isVerified !== undefined ? isVerified : true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      mnemonic: updatedMnemonic
    });
  } catch (error) {
    console.error('Error updating mnemonic:', error);
    return NextResponse.json(
      { error: 'Failed to update mnemonic' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mnemonic
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Mnemonic ID is required' },
        { status: 400 }
      );
    }

    await prisma.mnemonic.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Mnemonic deleted'
    });
  } catch (error) {
    console.error('Error deleting mnemonic:', error);
    return NextResponse.json(
      { error: 'Failed to delete mnemonic' },
      { status: 500 }
    );
  }
}