import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get mnemonics for a concept
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conceptId = params.id;

    const mnemonics = await prisma.mnemonic.findMany({
      where: { conceptId },
      orderBy: [
        { isVerified: 'desc' },
        { upvotes: 'desc' }
      ]
    });

    return NextResponse.json(mnemonics);
  } catch (error) {
    console.error('Error fetching mnemonics:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array if error
  }
}

// POST - Add new mnemonic
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conceptId = params.id;
    const body = await request.json();
    const { title, mnemonic, explanation, example, category, userId } = body;

    if (!title || !mnemonic || !explanation) {
      return NextResponse.json(
        { error: 'Title, mnemonic, and explanation are required' },
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
        createdBy: userId || null
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

// PATCH - Vote on mnemonic
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { mnemonicId, voteType } = body;

    if (!mnemonicId || !voteType) {
      return NextResponse.json(
        { error: 'Mnemonic ID and vote type are required' },
        { status: 400 }
      );
    }

    const updateData = voteType === 'up' 
      ? { upvotes: { increment: 1 } }
      : { downvotes: { increment: 1 } };

    const updatedMnemonic = await prisma.mnemonic.update({
      where: { id: mnemonicId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      mnemonic: updatedMnemonic
    });
  } catch (error) {
    console.error('Error voting on mnemonic:', error);
    return NextResponse.json(
      { error: 'Failed to vote on mnemonic' },
      { status: 500 }
    );
  }
}
