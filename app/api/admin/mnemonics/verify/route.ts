// Build-safe implementation that returns mock data during build
import { NextRequest, NextResponse } from 'next/server';

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

    // Return mock updated mnemonic during build time
    const updatedMnemonic = {
      id: mnemonicId,
      isVerified,
      updatedAt: new Date().toISOString(),
    };

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
