import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Only JPEG, PNG and WEBP are allowed.' }, { status: 400 })
    }

    // Limit file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size too large. Max 5MB allowed.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, buffer)

    const avatarUrl = `/uploads/${filename}`

    // Update user profile with the new avatar URL
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl }
    })

    return NextResponse.json({
      success: true,
      url: avatarUrl
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to upload photo'
    }, { status: 500 })
  }
}
