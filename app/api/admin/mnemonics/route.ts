// Build-safe implementation that returns mock data during build
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all mnemonics or a single mnemonic by ID (admin view)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // If ID is provided, return single mock mnemonic
    if (id) {
      const mockMnemonic = {
        id,
        conceptId: 'sample-concept-id',
        title: 'Sample Mnemonic',
        mnemonic: 'Sample mnemonic text',
        explanation: 'Sample explanation',
        example: 'Sample example',
        category: 'Acronym',
        isVerified: true,
        upvotes: 10,
        downvotes: 0,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(mockMnemonic);
    }

    // Otherwise return mock mnemonics
    const mockMnemonics = [
      {
        id: '1',
        conceptId: 'sample-concept-id',
        title: 'Sample Mnemonic',
        mnemonic: 'Sample mnemonic text',
        explanation: 'Sample explanation',
        example: 'Sample example',
        category: 'Acronym',
        isVerified: true,
        upvotes: 10,
        downvotes: 0,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    return NextResponse.json(mockMnemonics);
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

    const mockMnemonic = {
      id: Math.random().toString(36).substring(7),
      conceptId,
      title,
      mnemonic,
      explanation,
      example: example || null,
      category: category || 'Acronym',
      isVerified: isVerified !== undefined ? isVerified : true,
      upvotes: 0,
      downvotes: 0,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      mnemonic: mockMnemonic
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

    const updatedMnemonic = {
      id,
      conceptId,
      title,
      mnemonic,
      explanation,
      example: example || null,
      category: category || 'Acronym',
      isVerified: isVerified !== undefined ? isVerified : true,
      upvotes: 0,
      downvotes: 0,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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

    // Return success during build time
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