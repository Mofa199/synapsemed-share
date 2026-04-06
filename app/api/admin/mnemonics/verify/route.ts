import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/admin/mnemonics/verify - Verify/Unverify mnemonic
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mnemonicId, isVerified } = body

    if (!mnemonicId || isVerified === undefined) {
      return NextResponse.json(
        { success: false, error: 'Mnemonic ID and verification status are required' },
        { status: 400 }
      )
    }

    const updatedMnemonic = await prisma.mnemonic.update({
      where: { id: mnemonicId },
      data: { isVerified: !!isVerified }
    })

    return NextResponse.json({
      success: true,
      mnemonic: updatedMnemonic
    })
  } catch (error) {
    console.error('Error updating verification:', error)
    return NextResponse.json({ success: false, error: 'Failed to update verification status' }, { status: 500 })
  }
}
