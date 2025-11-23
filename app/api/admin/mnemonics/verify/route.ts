import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Verify/Unverify mnemonic
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { mnemonicId, isVerified } = body;

    if (!mnemonicId || isVerified === undefined) {
      return NextResponse.json(
        { error: 'Mnemonic ID and verification status are required' },
        { status: 400 }
      );
    }

    const updatedMnemonic = await prisma.mnemonic.update({
      where: { id: mnemonicId },
      data: { isVerified }
    });

    return NextResponse.json({
      success: true,
      mnemonic: updatedMnemonic
    });
  } catch (error) {
    console.error('Error updating verification:', error);
    return NextResponse.json(
      { error: 'Failed to update verification status' },
      { status: 500 }
    );
  }
}
