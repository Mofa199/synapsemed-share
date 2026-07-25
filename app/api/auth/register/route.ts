import { NextRequest, NextResponse } from 'next/server'
import { createUser, prisma } from '@/lib/db-utils'
import { prisma as prismaClient } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, field } = await request.json()

    if (!name || !email || !password || !field) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!['MEDICAL', 'NURSING', 'PHARMACY'].includes(field)) {
      return NextResponse.json({ error: 'Invalid field selection' }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user (temporarily unverified - stored in resetToken for OTP)
    const user = await createUser({
      name,
      email,
      password,
      field,
      role: 'STUDENT', 
    })

    if (!user) {
      return NextResponse.json({ error: 'Email already exists or registration failed' }, { status: 409 })
    }

    // Save OTP to the user's otpCode fields
    // @ts-ignore
    await prismaClient.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry: otpExpiry, isVerified: false }
    })

    // Send OTP via Email
    try {
      await sendWelcomeEmail(user.email, user.name, otp)
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError)
    }

    // Send OTP via WhatsApp Custom Server
    try {
      const whatsappServer = process.env.WHATSAPP_SERVER_URL || 'http://localhost:8000';
      // Assume a custom endpoint for sending messages
      fetch(`${whatsappServer}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: "user_phone_number_placeholder", // The user model would need a phone number
          message: `Your SynapseMed verification code is: ${otp}`
        })
      }).catch(() => console.log("WhatsApp server not connected yet."));
    } catch (waError) {
      console.error('Failed to send WhatsApp OTP:', waError)
    }

    // Return response demanding OTP verification, without setting the login cookies yet
    return NextResponse.json({
      success: true,
      requireOtp: true,
      message: 'Registration successful. Please verify your OTP to continue.',
      userId: user.id
    })
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email: string, name: string, otp: string) {
  // Check if email configuration exists
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('Email configuration not found. Skipping welcome email.')
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your SynapseMed Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #213874; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to SynapseMed!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${name},</p>
            <p>Welcome to SynapseMed, your comprehensive medical education platform!</p>
            <p>To verify your account, please use the following One-Time Password (OTP):</p>
            <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 2px;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you have any questions, don't hesitate to reach out to our support team at support@synapsemed.co.tz.</p>
            <p>Best regards,<br>The SynapseMed Team</p>
          </div>
          <div style="background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
            <p>© 2025 SynapseMed. All rights reserved.</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Welcome email sent successfully to ${email}`)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error // Re-throw to be caught by the calling function
  }
}