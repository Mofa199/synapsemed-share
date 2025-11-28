import { NextRequest, NextResponse } from 'next/server'
import { createUser, prisma } from '@/lib/db-utils'
import { prisma as prismaClient } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, field } = await request.json()

    if (!name || !email || !password || !field) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate field
    if (!['MEDICAL', 'NURSING', 'PHARMACY'].includes(field)) {
      return NextResponse.json(
        { error: 'Invalid field selection' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser({
      name,
      email,
      password,
      field,
      role: 'STUDENT', // Default role for new registrations
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email already exists or registration failed' },
        { status: 409 }
      )
    }

    // Add user to email subscription list
    try {
      // @ts-ignore
      await prismaClient.emailSubscription.upsert({
        where: { email: user.email },
        update: { 
          isActive: true,
          name: user.name,
          source: 'signup'
        },
        create: {
          email: user.email,
          name: user.name,
          source: 'signup',
          isActive: true
        }
      })
    } catch (subscriptionError) {
      console.error('Failed to add user to email subscription:', subscriptionError)
      // Continue even if subscription fails
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Continue even if email fails
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        field: user.field,
        level: user.level,
        points: user.points,
        streak: user.streak,
      },
      success: true,
      message: 'Registration successful. Please complete your profile.',
      redirectToProfile: true // Flag to indicate redirection to profile
    })

    // Set httpOnly cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Also set a non-httpOnly cookie for client-side user data
    response.cookies.set('synapse-user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      field: user.field,
      level: user.level,
      points: user.points,
      streak: user.streak,
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email: string, name: string) {
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
      subject: 'Welcome to SynapseMed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #213874; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to SynapseMed!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${name},</p>
            <p>Welcome to SynapseMed, your comprehensive medical education platform!</p>
            <p>Here are some things you can do to get started:</p>
            <ul>
              <li>Complete your profile setup</li>
              <li>Explore our extensive course library</li>
              <li>Join study groups and discussions</li>
              <li>Take practice exams and simulations</li>
            </ul>
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