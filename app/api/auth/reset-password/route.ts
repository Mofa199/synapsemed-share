import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    // Send password reset confirmation email
    try {
      await sendPasswordResetConfirmationEmail(user.email, user.name)
    } catch (emailError) {
      console.error('Failed to send password reset confirmation email:', emailError)
      // Continue even if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}

// Helper function to send password reset confirmation email
async function sendPasswordResetConfirmationEmail(email: string, name: string) {
  // Check if email configuration exists
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('Email configuration not found. Skipping password reset confirmation email.')
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Successful',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #213874; color: white; padding: 20px; text-align: center;">
          <h1>Password Reset Successful</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${name},</p>
          <p>Your SynapseMed password has been successfully reset.</p>
          <p>If you did not request this change, please contact our support team immediately at support@synapsemed.co.tz.</p>
          <p>Best regards,<br>The SynapseMed Team</p>
        </div>
      </div>
    `,
  })
  
  console.log(`Password reset confirmation email sent successfully to ${email}`)
}