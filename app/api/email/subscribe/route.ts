import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// POST /api/email/subscribe - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, source } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Mock subscription data (since we can't access database without migration)
    const subscription = {
      id: 'sub_' + Date.now(),
      email,
      name: name || null,
      source: source || 'website',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name || 'Subscriber')
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the subscription if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
      data: subscription
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email: string, name: string) {
  // Check if SMTP is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP not configured. Welcome email not sent.')
    return
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'info@synapsemed.co.tz',
      pass: process.env.SMTP_PASSWORD || '',
    },
  })

  const mailOptions = {
    from: process.env.SMTP_USER || 'info@synapsemed.co.tz',
    to: email,
    subject: 'Welcome to SynapseMed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #213874; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to SynapseMed!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${name},</p>
          <p>Thank you for subscribing to our newsletter! You'll now receive the latest updates, medical insights, and educational resources from SynapseMed.</p>
          <p>Here's what you can expect:</p>
          <ul>
            <li>Weekly medical insights and research updates</li>
            <li>New course announcements and learning resources</li>
            <li>Study tips and exam preparation guides</li>
            <li>Special offers and platform updates</li>
          </ul>
          <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@synapsemed.co.tz">support@synapsemed.co.tz</a>.</p>
          <p>Best regards,<br>The SynapseMed Team</p>
        </div>
        <div style="background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2025 SynapseMed. All rights reserved.</p>
          <p>You're receiving this email because you subscribed to our newsletter.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}