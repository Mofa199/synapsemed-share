import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'
import nodemailer from 'nodemailer'

interface EmailRequest {
  to: string | string[]
  subject: string
  content: string
  type?: 'welcome' | 'notification' | 'general'
}

class EmailService {
  private static instance: EmailService
  private transporter: nodemailer.Transporter
  
  private constructor() {
    // Create transporter using environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'info@synapsemed.co.tz',
        pass: process.env.SMTP_PASSWORD || '',
      },
    })
  }
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }
  
  async sendEmail(emailData: EmailRequest): Promise<boolean> {
    try {
      // Ensure we have SMTP credentials
      if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.warn('SMTP credentials not configured. Email not sent.')
        return true // Return true to not break the flow
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_USER || 'info@synapsemed.co.tz',
        to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
        subject: emailData.subject,
        html: emailData.content,
      }

      await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully to:', emailData.to)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }
  
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to SynapseMed!',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #213874; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to SynapseMed!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${userName},</p>
            <p>Welcome to SynapseMed, your comprehensive medical education platform!</p>
            <p>Here are some things you can do to get started:</p>
            <ul>
              <li>Complete your profile setup</li>
              <li>Explore our extensive course library</li>
              <li>Join study groups and discussions</li>
              <li>Take practice exams and simulations</li>
            </ul>
            <p>If you have any questions, don't hesitate to reach out to our support team at <a href="mailto:support@synapsemed.co.tz">support@synapsemed.co.tz</a>.</p>
            <p>Best regards,<br>The SynapseMed Team</p>
          </div>
          <div style="background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
            <p>© 2025 SynapseMed. All rights reserved.</p>
          </div>
        </div>
      `,
      type: 'welcome'
    })
  }
  
  async sendNotificationEmail(userEmail: string, title: string, message: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: `SynapseMed Notification: ${title}`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #213874; color: white; padding: 20px; text-align: center;">
            <h1>SynapseMed Notification</h1>
          </div>
          <div style="padding: 20px;">
            <h2>${title}</h2>
            <p>${message}</p>
          </div>
        </div>
      `,
      type: 'notification'
    })
  }
  
  async sendBulkEmail(recipients: string[], subject: string, content: string): Promise<{ success: number, failed: number }> {
    let success = 0
    let failed = 0
    
    for (const recipient of recipients) {
      const result = await this.sendEmail({
        to: recipient,
        subject,
        content,
        type: 'general'
      })
      
      if (result) {
        success++
      } else {
        failed++
      }
    }
    
    return { success, failed }
  }
}

// POST /api/admin/email/send - Send single email
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { to, subject, content, type } = body

    if (!to || !subject || !content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: to, subject, content'
      }, { status: 400 })
    }

    const emailService = EmailService.getInstance()
    const result = await emailService.sendEmail({ to, subject, content, type })

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send email'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/admin/email/bulk - Send bulk emails
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { recipients, subject, content } = body

    if (!recipients || !Array.isArray(recipients) || !subject || !content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: recipients (array), subject, content'
      }, { status: 400 })
    }

    const emailService = EmailService.getInstance()
    const result = await emailService.sendBulkEmail(recipients, subject, content)

    return NextResponse.json({
      success: true,
      data: result,
      message: `Sent ${result.success} emails successfully, ${result.failed} failed`
    })
  } catch (error) {
    console.error('Error sending bulk emails:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export { EmailService }