import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, verificationCode } = await request.json()

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // In a real implementation, we would:
    // 1. Check if the verification code matches what was sent to the email
    // 2. Update the user's status to verified
    // 3. Activate the account
    
    // For now, we'll simulate this process
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Simulate verification success
    // In a real app, you would check the verification code here
    
    // Update user to be verified and active
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        isActive: true,
        // In a real app, you might also store when the email was verified
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        field: updatedUser.field,
        level: updatedUser.level,
        points: updatedUser.points,
        streak: updatedUser.streak,
      }
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}